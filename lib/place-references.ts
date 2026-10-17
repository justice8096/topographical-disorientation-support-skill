/**
 * "References from text": pull candidate place references out of prose such
 * as a friend's description of their neighbourhood or an email with
 * directions, so they can be matched against an Overpass landmark list.
 *
 * This is deliberately a shallow, deterministic extractor. Toponym
 * resolution at city scale belongs to geoparser (UZH) or mordecai3; at
 * neighbourhood scale the right gazetteer is the Overpass result for the
 * area, and matching is done by normalised name similarity here.
 */

import { MAX_SCAN_LENGTH, type Locale } from "./direction-lexicon.js";
import type { OsmLandmark } from "./overpass.js";

export interface PlaceReference {
  text: string;
  index: number;
  kind: "named" | "category";
}

const CATEGORY_WORDS: Record<Locale, string[]> = {
  en: ["bakery", "church", "school", "park", "bridge", "station", "pharmacy", "bank", "cafe", "coffee shop", "restaurant", "supermarket", "gas station", "petrol station", "post office", "library", "hospital", "police station", "fire station", "cinema", "theatre", "theater", "playground", "river", "lake", "tower", "mall", "market", "bus stop", "hotel", "gym", "laundromat", "bar", "pub"],
  fr: ["boulangerie", "eglise", "ecole", "parc", "pont", "gare", "pharmacie", "banque", "cafe", "restaurant", "supermarche", "station-service", "poste", "bibliotheque", "hopital", "commissariat", "caserne", "cinema", "theatre", "aire de jeux", "riviere", "lac", "tour", "centre commercial", "marche", "arret de bus", "hotel", "tabac", "mairie", "bar"],
  es: ["panaderia", "iglesia", "escuela", "colegio", "parque", "puente", "estacion", "farmacia", "banco", "cafeteria", "restaurante", "supermercado", "gasolinera", "correos", "biblioteca", "hospital", "comisaria", "bomberos", "cine", "teatro", "parque infantil", "rio", "lago", "torre", "centro comercial", "mercado", "parada de autobus", "hotel", "ayuntamiento", "bar", "plaza"],
};

function fold(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Proper-noun runs: two or more capitalised tokens, or one capitalised token following a category word. */
const NAMED_RUN = /(?<![\p{L}])(?:\p{Lu}[\p{L}\p{N}'’-]+)(?:\s+(?:de|du|des|la|le|les|del|of|the|y|et|and)\s+)?(?:\s+\p{Lu}[\p{L}\p{N}'’-]+)+/gu;

export function extractPlaceReferences(text: string, locale: Locale): PlaceReference[] {
  if (typeof text !== "string") throw new TypeError("text must be a string");
  if (text.length > MAX_SCAN_LENGTH) throw new RangeError("text exceeds MAX_SCAN_LENGTH");
  const cats = CATEGORY_WORDS[locale];
  if (!cats) throw new RangeError("unsupported locale");
  const nfc = text.normalize("NFC");
  const folded = fold(nfc);
  const out: PlaceReference[] = [];

  const catRe = new RegExp("(?<![\\p{L}])(?:" + cats.map(escapeRegex).sort((a, b) => b.length - a.length).join("|") + ")(?![\\p{L}])", "gu");
  let m: RegExpExecArray | null;
  while ((m = catRe.exec(folded)) !== null) {
    out.push({ text: nfc.slice(m.index, m.index + m[0].length), index: m.index, kind: "category" });
  }
  NAMED_RUN.lastIndex = 0;
  while ((m = NAMED_RUN.exec(nfc)) !== null) {
    // Skip sentence-initial single words that merely start a sentence.
    if (m[0].split(/\s+/).length < 2) continue;
    out.push({ text: m[0], index: m.index, kind: "named" });
  }
  out.sort((a, b) => a.index - b.index);
  return out;
}

/** Dice coefficient on character bigrams of folded strings; 0..1. */
export function nameSimilarity(a: string, b: string): number {
  const fa = fold(a).replace(/[^\p{L}\p{N}]/gu, "");
  const fb = fold(b).replace(/[^\p{L}\p{N}]/gu, "");
  if (fa.length < 2 || fb.length < 2) return fa === fb ? 1 : 0;
  const grams = (s: string) => { const g = new Map<string, number>(); for (let i = 0; i < s.length - 1; i++) { const k = s.slice(i, i + 2); g.set(k, (g.get(k) ?? 0) + 1); } return g; };
  const ga = grams(fa); const gb = grams(fb);
  let inter = 0;
  for (const [k, v] of ga) inter += Math.min(v, gb.get(k) ?? 0);
  return (2 * inter) / (fa.length - 1 + fb.length - 1);
}

export interface Match {
  reference: PlaceReference;
  landmark: OsmLandmark;
  similarity: number;
}

/** Match named references to a landmark list from Overpass. Category references are matched on the OSM value. */
export function matchReferences(refs: readonly PlaceReference[], landmarks: readonly OsmLandmark[], threshold = 0.6): Match[] {
  if (threshold < 0 || threshold > 1) throw new RangeError("threshold must be 0..1");
  const out: Match[] = [];
  for (const r of refs.slice(0, 500)) {
    let best: Match | null = null;
    for (const lm of landmarks.slice(0, 5000)) {
      const sim = r.kind === "named" ? nameSimilarity(r.text, lm.name) : (fold(lm.value).includes(fold(r.text).replace(/\s+/g, "_")) ? 0.8 : 0);
      if (sim >= threshold && (!best || sim > best.similarity)) best = { reference: r, landmark: lm, similarity: Math.round(sim * 1000) / 1000 };
    }
    if (best) out.push(best);
  }
  return out;
}
