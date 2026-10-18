/**
 * Direction-word lexicon for English, French, and Spanish.
 *
 * Why this exists: in developmental topographical disorientation (DTD) the
 * binding between a direction label ("left", "north", "gauche", "derecha")
 * and the physical direction it names is unreliable (Burles and Iaria 2020;
 * Thaler et al. 2025). Every component of this skill needs to find those
 * labels so it can replace them with landmark-and-relation phrasing or flag
 * them in content.
 *
 * Design notes:
 *  - Every pattern is a plain alternation of literal words with word
 *    boundaries. No nested quantifiers, no backreferences, so the regexes are
 *    linear-time and cannot be driven into catastrophic backtracking.
 *  - Input is NFC-normalised before matching so composed and decomposed
 *    accents match the same entry.
 *  - Clock-face ("at two o'clock") and compass-point ("NNE") forms are covered
 *    because navigation apps and military-style instructions use them.
 */

export type Locale = "en" | "fr" | "es";

export type DirectionClass =
  | "lateral" // left / right
  | "cardinal" // north / south / east / west and combinations
  | "relative" // ahead, behind, straight on
  | "clock" // "at 2 o'clock"
  | "rotation"; // turn around, make a U-turn

export interface LexiconEntry {
  locale: Locale;
  cls: DirectionClass;
  words: string[];
}

export const LEXICON: LexiconEntry[] = [
  // English
  {
    locale: "en",
    cls: "lateral",
    words: [
      "left", "right", "left-hand", "right-hand", "leftward", "rightward",
      "to the left", "to the right", "on the left", "on the right",
      "to your left", "to your right", "on your left", "on your right", "the left", "the right",
    ],
  },
  {
    locale: "en",
    cls: "cardinal",
    words: [
      "north", "south", "east", "west",
      "northeast", "northwest", "southeast", "southwest",
      "north-east", "north-west", "south-east", "south-west",
      "northbound", "southbound", "eastbound", "westbound",
      "northern", "southern", "eastern", "western",
    ],
  },
  { locale: "en", cls: "relative", words: ["straight ahead", "straight on", "ahead", "behind", "backwards", "forward", "forwards"] },
  { locale: "en", cls: "rotation", words: ["turn around", "u-turn", "about face", "double back"] },

  // French
  { locale: "fr", cls: "lateral", words: ["gauche", "droite", "a gauche", "a droite", "sur votre gauche", "sur votre droite", "cote gauche", "cote droit"] },
  {
    locale: "fr",
    cls: "cardinal",
    words: [
      "nord", "sud", "est", "ouest",
      "nord-est", "nord-ouest", "sud-est", "sud-ouest",
      "vers le nord", "vers le sud", "vers l'est", "vers l'ouest",
    ],
  },
  { locale: "fr", cls: "relative", words: ["tout droit", "devant", "derriere", "en arriere", "en avant"] },
  { locale: "fr", cls: "rotation", words: ["demi-tour", "faire demi-tour", "faites demi-tour"] },

  // Spanish
  { locale: "es", cls: "lateral", words: ["izquierda", "derecha", "a la izquierda", "a la derecha", "mano izquierda", "mano derecha", "lado izquierdo", "lado derecho"] },
  {
    locale: "es",
    cls: "cardinal",
    words: [
      "norte", "sur", "este", "oeste",
      "noreste", "noroeste", "sureste", "suroeste", "sudeste", "sudoeste",
      "hacia el norte", "hacia el sur", "hacia el este", "hacia el oeste",
    ],
  },
  { locale: "es", cls: "relative", words: ["todo recto", "recto", "de frente", "adelante", "atras", "detras", "hacia atras"] },
  { locale: "es", cls: "rotation", words: ["media vuelta", "cambio de sentido", "da la vuelta", "de la vuelta"] },
];

/** Hard cap on input length for any lexicon scan. Longer input is rejected, not truncated. */
export const MAX_SCAN_LENGTH = 200_000;

/**
 * Strip diacritics and lower-case. Used only for matching; the original text
 * is never modified by this function. Combining marks are removed after NFD
 * decomposition, which is what lets "à", "é", "ñ" entries in the lexicon be
 * written without accents above.
 */
export function foldForMatch(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/**
 * Fold for matching while keeping an index map from each folded code unit
 * back to the NFC code unit it came from. Needed because NFD can lengthen a
 * string with non-mark code points (Hangul syllables decompose to jamo,
 * several Indic vowel signs are spacing marks, and lower-casing a dotted
 * capital I yields two code units), so folded offsets cannot be applied to
 * the NFC text directly.
 */
export function foldWithMap(nfc: string): { folded: string; map: number[] } {
  let folded = "";
  const map: number[] = [];
  for (let i = 0; i < nfc.length; i++) {
    const ch = nfc[i];
    const f = ch.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    for (let k = 0; k < f.length; k++) map.push(i);
    folded += f;
  }
  map.push(nfc.length);
  return { folded, map };
}

/** Characters that must never reach an output: C0/C1 controls (except tab and newline) and Unicode format characters (bidi overrides, zero-width, BOM, line/paragraph separators). */
export const UNSAFE_OUTPUT = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\p{Cf}\u2028\u2029]/gu;

/** Strip control and format characters from text that will be shown to a person or placed in a prompt. Keeps tab and newline. */
export function stripUnsafe(text: string): string {
  return text.replace(UNSAFE_OUTPUT, "");
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Build a single linear-time regex for one locale (or all locales). */
export function buildDirectionRegex(locale?: Locale): RegExp {
  const entries = locale ? LEXICON.filter((e) => e.locale === locale) : LEXICON;
  const words = entries.flatMap((e) => e.words).map(escapeRegex);
  // Longest first so "straight ahead" wins over "ahead".
  words.sort((a, b) => b.length - a.length);
  // Word boundaries are approximated with lookarounds on non-letters because
  // \b does not understand letters outside ASCII once diacritics are folded.
  const body = words.join("|");
  return new RegExp("(?<![\\p{L}\\p{N}])(?:" + body + ")(?![\\p{L}\\p{N}])", "giu");
}

const CLOCK_EN = /(?<![\p{L}\p{N}])(?:at\s+)?(?:1[0-2]|[1-9])\s*o'?clock(?![\p{L}\p{N}])/giu;
const CLOCK_FR = /(?<![\p{L}\p{N}])(?:a\s+)?(?:1[0-2]|[1-9])\s*heures?(?![\p{L}\p{N}])/giu;
const CLOCK_ES = /(?<![\p{L}\p{N}])(?:a\s+las\s+)?(?:1[0-2]|[1-9])\s*en\s+punto(?![\p{L}\p{N}])/giu;
const COMPASS_ABBREV = /(?<![\p{L}\p{N}])(?:N|S|E|W|O|NE|NW|NO|SE|SW|SO|NNE|ENE|ESE|SSE|SSW|WSW|WNW|NNW|SSO|OSO|ONO|NNO)(?![\p{L}\p{N}])/gu;

export interface DirectionHit {
  text: string;
  index: number;
  cls: DirectionClass;
  locale: Locale | "any";
}

function classify(word: string, locale?: Locale): { cls: DirectionClass; locale: Locale | "any" } {
  const folded = foldForMatch(word);
  for (const e of LEXICON) {
    if (locale && e.locale !== locale) continue;
    if (e.words.includes(folded)) return { cls: e.cls, locale: e.locale };
  }
  return { cls: "lateral", locale: "any" };
}

/**
 * Find every direction word in the text. Throws on oversized input rather
 * than silently scanning a partial string, so callers cannot be tricked into
 * reporting "no direction words" on a truncated document.
 */
export function findDirectionWords(text: string, locale?: Locale, includeCompassAbbrev = false): DirectionHit[] {
  if (typeof text !== "string") throw new TypeError("text must be a string");
  if (text.length > MAX_SCAN_LENGTH) throw new RangeError("input exceeds MAX_SCAN_LENGTH (" + MAX_SCAN_LENGTH + ")");
  // Match on the folded form, but report every hit as an offset into the NFC
  // form of the input, translated through the fold map, so callers can slice
  // and replace in the text they actually hold.
  text = text.normalize("NFC");
  const { folded, map } = foldWithMap(text);
  const hits: DirectionHit[] = [];
  const re = buildDirectionRegex(locale);
  let m: RegExpExecArray | null;
  const push = (fm: RegExpExecArray, cls: DirectionClass, loc: Locale | "any") => {
    const start = map[fm.index];
    const end = map[fm.index + fm[0].length];
    hits.push({ text: text.slice(start, end), index: start, cls, locale: loc });
  };
  while ((m = re.exec(folded)) !== null) {
    const c = classify(m[0], locale);
    push(m, c.cls, c.locale);
  }
  const clockRes = locale === "en" ? [CLOCK_EN] : locale === "fr" ? [CLOCK_FR] : locale === "es" ? [CLOCK_ES] : [CLOCK_EN, CLOCK_FR, CLOCK_ES];
  for (const cre of clockRes) {
    cre.lastIndex = 0;
    while ((m = cre.exec(folded)) !== null) push(m, "clock", locale ?? "any");
  }
  if (includeCompassAbbrev) {
    COMPASS_ABBREV.lastIndex = 0;
    // Abbreviations are matched against the original text so case is preserved
    // (a lowercase "e" in French prose is not a compass point).
    while ((m = COMPASS_ABBREV.exec(text)) !== null) {
      hits.push({ text: m[0], index: m.index, cls: "cardinal", locale: locale ?? "any" });
    }
  }
  hits.sort((a, b) => a.index - b.index);
  return hits;
}
