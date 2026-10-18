/**
 * Instruction rewriter: turns direction-word instructions into
 * landmark-and-relation instructions for people with DTD.
 *
 * Rules (from docs/research/research-foundation-2026-10-17.md, section 3a):
 *  1. Replace a direction word with a landmark whenever one is available for
 *     that step ("turn left at Main St" -> "turn toward the red church").
 *  2. When a side must be named and no landmark is available, bind it to a
 *     body anchor the user supplied once ("your watch hand"), never to the
 *     bare label and never to a third party or object ("the left of the
 *     church").
 *  3. Never emit cardinal directions. Replace with a landmark or an explicit
 *     "keep X on your <anchor> side" relation.
 *  4. Every output starts with an orientation anchor sentence ("You are
 *     facing the bakery") so the reader never has to infer heading.
 *
 * This module is deterministic and has no network or filesystem access. The
 * LLM-facing commands call it (through the MCP server or CLI) and then edit
 * the prose; the deterministic pass is what the security tests exercise.
 */

import { findDirectionWords, stripUnsafe, type Locale, type DirectionHit, MAX_SCAN_LENGTH } from "./direction-lexicon.js";

export interface Landmark {
  /** Human-readable name, e.g. "the red church". */
  name: string;
  /** Which step (1-based) this landmark belongs to, if known. */
  step?: number;
  /** Which side of the traveller the landmark will be on at that step. */
  side?: "left" | "right";
}

export interface BodyAnchor {
  /** Something attached to the traveller's body, supplied once by the user, e.g. "watch hand". */
  label: string;
  /** Which side that anchor is on. The user states this once; the skill never guesses it. */
  side: "left" | "right";
}

export interface RewriteOptions {
  locale: Locale;
  landmarks?: Landmark[];
  bodyAnchor?: BodyAnchor;
  /** A sentence stating what the traveller is facing at the start. */
  startFacing?: string;
  /** Stress mode: one instruction per line, no more than one landmark per line. */
  stressMode?: boolean;
}

export interface RewriteResult {
  anchorSentence: string;
  steps: string[];
  residualDirectionWords: DirectionHit[];
  notes: string[];
}

const MAX_STEPS = 200;
const MAX_LANDMARK_NAME = 120;

const PHRASES: Record<Locale, {
  facing: (what: string) => string;
  facingUnknown: string;
  towardLandmark: (lm: string) => string;
  keepOnSide: (lm: string, anchor: string) => string;
  /** Replacement for a lateral hit; `hit` is the folded matched text so the phrase can agree with its syntax. */
  sideByAnchor: (anchor: string, hit: string) => string;
  noLandmark: string;
}> = {
  en: {
    facing: (w) => "You are facing " + w + ".",
    facingUnknown: "Before you start: name one thing you can see directly in front of you and write it here.",
    towardLandmark: (lm) => "Turn toward " + lm + ".",
    keepOnSide: (lm, anchor) => "Keep " + lm + " on your " + anchor + " side.",
    sideByAnchor: (anchor, hit) => (hit.startsWith("on ") ? "on your " : "toward your ") + anchor + " side",
    noLandmark: "[no landmark available for this step; confirm with a person or a photo before relying on it]",
  },
  fr: {
    facing: (w) => "Vous faites face à " + w + ".",
    facingUnknown: "Avant de partir : nommez une chose que vous voyez juste devant vous et notez-la ici.",
    towardLandmark: (lm) => "Tournez vers " + lm + ".",
    keepOnSide: (lm, anchor) => "Gardez " + lm + " du côté de votre " + anchor + ".",
    sideByAnchor: (anchor) => "du côté de votre " + anchor,
    noLandmark: "[aucun repère disponible pour cette étape ; confirmez avec une personne ou une photo avant de vous y fier]",
  },
  es: {
    facing: (w) => "Estás mirando hacia " + w + ".",
    facingUnknown: "Antes de salir: nombra una cosa que veas justo delante de ti y anótala aquí.",
    towardLandmark: (lm) => "Gira hacia " + lm + ".",
    keepOnSide: (lm, anchor) => "Mantén " + lm + " del lado de tu " + anchor + ".",
    sideByAnchor: (anchor, hit) => (hit.startsWith("a la ") ? "hacia el lado de tu " : "el lado de tu ") + anchor,
    noLandmark: "[no hay punto de referencia para este paso; confírmalo con una persona o una foto antes de fiarte]",
  },
};

function sanitizeName(name: string): string {
  // Landmark names are echoed into output. Strip control and Unicode format
  // characters (bidi overrides, zero-width, BOM) and anything that looks like
  // markup or an instruction delimiter so a hostile landmark list cannot
  // inject prose, HTML, or a visually reversed direction word into the card.
  const cleaned = stripUnsafe(name).replace(/[<>`{}\[\]]/g, "").trim();
  return cleaned.slice(0, MAX_LANDMARK_NAME);
}

function splitSteps(instructions: string): string[] {
  // Step text is the largest untrusted input and is echoed to terminals and
  // prompts, so it gets the same control-character stripping as names.
  return stripUnsafe(instructions)
    .split(/\r?\n|(?<=[.;!?])\s{1,4}(?=[A-ZÀ-Ü])/u)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Deterministic rewrite. Returns residual direction words so the caller knows what still needs a human. */
export function rewriteInstructions(instructions: string, opts: RewriteOptions): RewriteResult {
  if (typeof instructions !== "string") throw new TypeError("instructions must be a string");
  if (instructions.length > MAX_SCAN_LENGTH) throw new RangeError("instructions exceed MAX_SCAN_LENGTH");
  const p = PHRASES[opts.locale];
  if (!p) throw new RangeError("unsupported locale: " + String(opts.locale));

  const rawSteps = splitSteps(instructions);
  if (rawSteps.length > MAX_STEPS) throw new RangeError("too many steps (max " + MAX_STEPS + ")");

  const notes: string[] = [];
  // A landmark whose name is itself a direction phrase ("the left alley")
  // would smuggle the word the rewriter exists to remove, so it is dropped
  // and noted rather than echoed.
  const landmarks = (opts.landmarks ?? [])
    .map((l) => ({ ...l, name: sanitizeName(l.name) }))
    .filter((l) => {
      if (l.name.length === 0) return false;
      if (findDirectionWords(l.name, opts.locale).some((h) => h.cls !== "relative")) {
        notes.push("landmark dropped because its name contains a direction word: " + l.name);
        return false;
      }
      return true;
    });
  const anchor = opts.bodyAnchor ? { label: sanitizeName(opts.bodyAnchor.label), side: opts.bodyAnchor.side } : undefined;
  if (anchor) {
    if (anchor.side !== "left" && anchor.side !== "right") throw new RangeError("bodyAnchor.side must be left or right");
    if (anchor.label.length === 0) throw new RangeError("bodyAnchor.label is empty after sanitising");
    // An anchor that is itself a direction word ("left hand") defeats the
    // purpose of anchoring, so it is rejected rather than silently used.
    if (findDirectionWords(anchor.label, opts.locale).length > 0) {
      throw new RangeError("bodyAnchor.label must not contain a direction word; use a body fact such as 'watch hand' or 'writing hand'");
    }
  }
  const steps: string[] = [];

  rawSteps.forEach((step, i) => {
    const stepNo = i + 1;
    const hits = findDirectionWords(step, opts.locale);
    const lm = landmarks.find((l) => l.step === stepNo) ?? (landmarks.length === rawSteps.length ? landmarks[i] : undefined);
    let out = step;

    if (hits.length === 0) {
      steps.push(out);
      return;
    }

    const hasLateral = hits.some((h) => h.cls === "lateral" || h.cls === "clock");
    const hasCardinal = hits.some((h) => h.cls === "cardinal");

    if (lm) {
      // Landmark available: the instruction becomes "turn toward <landmark>"
      // and, if we know the side, "keep <landmark> on your <anchor> side".
      out = p.towardLandmark(lm.name);
      if (lm.side && anchor) {
        const otherWord = opts.locale === "fr" ? "autre " : opts.locale === "es" ? "otro " : "other-";
        out += " " + p.keepOnSide(lm.name, lm.side === anchor.side ? anchor.label : otherWord + anchor.label);
      }
    } else if (hasLateral && anchor) {
      // No landmark but we have a body anchor: bind the side to the anchor.
      // Only the side that matches the anchor can be expressed safely; the
      // opposite side is expressed as "the side away from your <anchor>".
      // Replace every lateral/clock hit in place, working from the end so
      // earlier indexes stay valid. Hit indexes refer to the NFC form. Each
      // hit decides its own side so "left ... then right" is handled.
      const nfc = step.normalize("NFC");
      let rebuilt = nfc;
      for (const h of [...hits].reverse()) {
        if (h.cls !== "lateral" && h.cls !== "clock") continue;
        const folded = h.text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
        const hitIsLeft = /left|gauche|izquierd/.test(folded);
        const hitIsRight = /right|droit|derech/.test(folded);
        const sameAsAnchor = hitIsLeft ? anchor.side === "left" : hitIsRight ? anchor.side === "right" : false;
        const otherWord = opts.locale === "fr" ? "autre " : opts.locale === "es" ? "otro " : "other-";
        const sideLabel = h.cls === "clock" || !(hitIsLeft || hitIsRight)
          ? anchor.label + (opts.locale === "en" ? " (clock position: confirm with a person)" : " (position horaire / posicion horaria : a confirmer)")
          : sameAsAnchor ? anchor.label : otherWord + anchor.label;
        rebuilt = rebuilt.slice(0, h.index) + p.sideByAnchor(sideLabel, folded) + rebuilt.slice(h.index + h.text.length);
      }
      out = rebuilt;
      notes.push("step " + stepNo + ": side bound to body anchor, no landmark available");
    } else {
      out = step + " " + p.noLandmark;
      notes.push("step " + stepNo + ": direction word kept because no landmark or body anchor was supplied");
    }
    if (hasCardinal) {
      notes.push("step " + stepNo + ": cardinal direction present in source; cardinal terms are never emitted, replaced by landmark or anchor relation");
    }
    steps.push(out);
  });

  if (opts.stressMode) {
    // One line per step, no compound sentences, and the fallback card
    // instructions at the top.
    const header = opts.locale === "fr"
      ? "MODE STRESS : arrêtez-vous. Lisez la phrase de repère. Confirmez UN repère. Faites UNE étape. Recommencez."
      : opts.locale === "es"
        ? "MODO ESTRÉS: párate. Lee la frase de orientación. Confirma UN punto de referencia. Haz UN paso. Repite."
        : "STRESS MODE: stop. Read the anchor sentence. Confirm ONE landmark. Take ONE step. Repeat.";
    steps.unshift(header);
  }

  const anchorSentence = opts.startFacing ? p.facing(sanitizeName(opts.startFacing)) : p.facingUnknown;
  const residual = findDirectionWords(steps.join("\n"), opts.locale).filter((h) => h.cls !== "relative");

  return { anchorSentence, steps, residualDirectionWords: residual, notes };
}
