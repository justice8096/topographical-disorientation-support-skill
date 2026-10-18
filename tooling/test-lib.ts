/**
 * Functional tests for the deterministic library. Run: tsx test-lib.ts [--verbose]
 */
import { findDirectionWords } from "../lib/direction-lexicon.js";
import { rewriteInstructions } from "../lib/instruction-rewriter.js";
import { rankLandmarks, turnDirection, sideOf, bearingDeg, haversineM } from "../lib/landmark-salience.js";
import { checkContent } from "../lib/content-check.js";
import { extractPlaceReferences, matchReferences, nameSimilarity } from "../lib/place-references.js";
import { parseOverpassResponse, buildAroundQuery } from "../lib/overpass.js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const verbose = process.argv.includes("--verbose");
let passed = 0; const failures: string[] = [];
function test(name: string, fn: () => void): void {
  try { fn(); passed++; if (verbose) console.log("    ok " + name); }
  catch (e) { failures.push(name + ": " + (e instanceof Error ? e.message : String(e))); if (verbose) console.log("    x " + name); }
}
function assert(c: unknown, m: string): asserts c { if (!c) throw new Error(m); }

test("lexicon classifies en/fr/es words", () => {
  const en = findDirectionWords("Go north, then left, then straight ahead at 2 o'clock.", "en");
  assert(en.map((h) => h.cls).join(",") === "cardinal,lateral,relative,clock", "en classes: " + en.map((h) => h.cls).join(","));
  const fr = findDirectionWords("Allez tout droit puis a gauche, direction nord-est.", "fr");
  assert(fr.some((h) => h.cls === "relative") && fr.some((h) => h.cls === "lateral") && fr.some((h) => h.cls === "cardinal"), "fr classes");
  const es = findDirectionWords("Sigue todo recto y gira a la derecha hacia el suroeste.", "es");
  assert(es.some((h) => h.cls === "relative") && es.some((h) => h.cls === "lateral") && es.some((h) => h.cls === "cardinal"), "es classes");
});

test("rewrite with landmarks removes all lateral and cardinal words (en)", () => {
  const r = rewriteInstructions("Head north on Oak Street. Turn left at the second light. The office is on the right after the bank.", {
    locale: "en", landmarks: [{ name: "the red church" }, { name: "the fuel station", side: "left" }, { name: "the bank" }], bodyAnchor: { label: "watch hand", side: "left" }, startFacing: "the red church",
  });
  assert(r.anchorSentence === "You are facing the red church.", r.anchorSentence);
  assert(r.steps[1].includes("Keep the fuel station on your watch hand side."), r.steps[1]);
  assert(r.residualDirectionWords.length === 0, "residual: " + JSON.stringify(r.residualDirectionWords));
});

test("rewrite binds sides to anchor when no landmark (fr, es)", () => {
  const fr = rewriteInstructions("Tournez a gauche au feu.", { locale: "fr", bodyAnchor: { label: "montre", side: "left" } });
  assert(fr.steps[0] === "Tournez du côté de votre montre au feu.", fr.steps[0]);
  const es = rewriteInstructions("Gira a la derecha en el semaforo.", { locale: "es", bodyAnchor: { label: "reloj", side: "left" } });
  assert(es.steps[0] === "Gira hacia el lado de tu otro reloj en el semaforo.", es.steps[0]);
  const en = rewriteInstructions("The office is on the right after the bank. Then turn left.", { locale: "en", bodyAnchor: { label: "watch hand", side: "left" } });
  assert(en.steps[0] === "The office is on your other-watch hand side after the bank.", en.steps[0]);
  assert(en.steps[1] === "Then turn toward your watch hand side.", en.steps[1]);
});

test("rewrite marks steps that cannot be grounded", () => {
  const r = rewriteInstructions("Turn right.", { locale: "en" });
  assert(r.steps[0].includes("[no landmark available"), r.steps[0]);
  assert(r.residualDirectionWords.length === 1, "residual expected");
});

test("salience geometry: side and turn", () => {
  const dp = { lat: 0, lon: 0, approachBearing: 0, exitBearing: 90 }; // heading north, turning right
  assert(turnDirection(dp) === "right", "turn");
  assert(sideOf(dp, { lat: 0, lon: 0.0005 }) === "right", "east of a northbound traveller is right");
  assert(sideOf(dp, { lat: 0, lon: -0.0005 }) === "left", "west is left");
  assert(sideOf(dp, { lat: 0.0005, lon: 0 }) === "ahead", "north is ahead");
  assert(Math.abs(bearingDeg({ lat: 0, lon: 0 }, { lat: 0, lon: 1 }) - 90) < 0.01, "bearing east");
  assert(Math.abs(haversineM({ lat: 0, lon: 0 }, { lat: 0, lon: 0.001 }) - 111.2) < 1, "haversine 111 m");
});

test("salience ranking prefers same-side high-category landmark", () => {
  const dp = { lat: 0, lon: 0, approachBearing: 0, exitBearing: 90 };
  const lms = parseOverpassResponse({ elements: [
    { type: "node", id: 1, lat: 0, lon: 0.0004, tags: { name: "St Mary", amenity: "place_of_worship" } },
    { type: "node", id: 2, lat: 0, lon: -0.0004, tags: { name: "Shed", building: "yes" } },
    { type: "node", id: 3, lat: 0.0003, lon: 0, tags: { name: "Cafe Luna", amenity: "cafe" } },
    { type: "node", id: 4, lat: 0.01, lon: 0, tags: { name: "Far Tower", man_made: "tower" } },
  ] });
  const r = rankLandmarks(dp, lms, 3);
  assert(r[0].name === "St Mary" && r[0].side === "right", "best should be St Mary on the right: " + JSON.stringify(r.map((x) => x.name)));
  assert(!r.some((x) => x.name === "Far Tower"), "far landmark excluded");
});

test("content check scores a bad direction set", () => {
  const r = checkContent("Head north on Oak. Turn left in 200 m. The map is north-up. You are here.", { locale: "en", orientationInvarianceProfile: true });
  const rules = r.findings.map((f) => f.rule);
  assert(rules.includes("cardinal-direction"), "cardinal");
  assert(rules.includes("direction-without-landmark"), "no landmark");
  assert(rules.includes("north-up-map"), "north-up");
  assert(rules.includes("you-are-here-without-facing"), "yah");
  assert(r.counts.error >= 4, "errors " + r.counts.error);
});

test("content check accepts a good direction set in fr and es", () => {
  const fr = checkContent("Vous faites face à la gare. Tournez vers l'église. Gardez la riviere du côté de votre montre.", { locale: "fr" });
  assert(fr.counts.error === 0, "fr errors: " + JSON.stringify(fr.findings));
  const es = checkContent("Estás mirando hacia la estacion. Gira hacia la iglesia. Sigue todo recto hasta la farmacia.", { locale: "es" });
  assert(es.counts.error === 0, "es errors: " + JSON.stringify(es.findings));
});

test("place references match landmarks", () => {
  const refs = extractPlaceReferences("Walk past the bakery and meet me at Saint Mary Church.", "en");
  const lms = parseOverpassResponse({ elements: [
    { type: "node", id: 1, lat: 0, lon: 0, tags: { name: "St. Mary's Church", amenity: "place_of_worship" } },
    { type: "node", id: 2, lat: 0, lon: 0, tags: { name: "Luna Bakery", shop: "bakery" } },
  ] });
  const m = matchReferences(refs, lms, 0.5);
  assert(m.some((x) => x.landmark.name === "Luna Bakery"), "category match");
  assert(m.some((x) => x.landmark.name.startsWith("St. Mary")), "named match: " + JSON.stringify(m));
  assert(nameSimilarity("Eglise Saint-Pierre", "Église Saint Pierre") > 0.9, "accent-insensitive similarity");
});

test("overpass parser prefers localized name tag when asked", () => {
  const json = { elements: [{ type: "node", id: 1, lat: 1, lon: 1, tags: { name: "Saint Mary Church", "name:fr": "Eglise Sainte-Marie", amenity: "place_of_worship" } }] };
  assert(parseOverpassResponse(json, "fr")[0].name === "Eglise Sainte-Marie", "fr name not preferred");
  assert(parseOverpassResponse(json, "es")[0].name === "Saint Mary Church", "fallback to name when name:es is absent");
  assert(parseOverpassResponse(json)[0].name === "Saint Mary Church", "no locale keeps name");
});

test("overpass parser handles a captured real response", () => {
  // tests/fixtures/*.json are raw Overpass responses captured with
  // `cli/wayfinding-audit.ts landmarks --center ... --raw`.
  const here = dirname(fileURLToPath(import.meta.url));
  const raw = readFileSync(resolve(here, "../tests/fixtures/overpass-fairfax-38.861_-77.362-r200.json"), "utf8");
  const parsed = JSON.parse(raw);
  assert(Array.isArray(parsed.elements) && parsed.elements.length > 0, "fixture has elements");
  const lms = parseOverpassResponse(parsed, "fr");
  assert(lms.length > 0 && lms.length <= parsed.elements.length, "parser returned landmarks");
  for (const lm of lms) {
    assert(typeof lm.id === "string" && /^(node|way|relation)\/\d+$/.test(lm.id), "id shape: " + lm.id);
    assert(Number.isFinite(lm.lat) && Number.isFinite(lm.lon), "finite coordinates for " + lm.id);
    assert(lm.name.length > 0 && !/[<>{}\[\]`\u0000-\u001f]/.test(lm.name), "name sanitised: " + lm.name);
    assert(typeof lm.key === "string" && typeof lm.value === "string", "key/value present");
  }
  // Ways and relations carry a center in the fixture; the parser must use it.
  const way = lms.find((l) => l.id.startsWith("way/"));
  assert(!way || (Math.abs(way.lat - 38.861) < 0.01 && Math.abs(way.lon + 77.362) < 0.01), "way center used");
});

test("French and Spanish output phrases carry their accents", () => {
  // Matching folds accents; output must not. A native reader or a screen reader gets the real spelling.
  const fr = rewriteInstructions("Tournez a gauche au feu.", { locale: "fr", landmarks: [{ name: "la boulangerie", step: 1 }], startFacing: "la gare", stressMode: true });
  const frText = [fr.anchorSentence, ...fr.steps].join("\n");
  assert(/Vous faites face à la gare\./.test(frText), "fr facing: " + frText);
  assert(/MODE STRESS : arrêtez-vous\. Lisez la phrase de repère\. Confirmez UN repère\. Faites UNE étape\./.test(frText), "fr stress header: " + frText);
  const frNo = rewriteInstructions("Tournez a gauche.", { locale: "fr" });
  assert(frNo.steps[0].includes("aucun repère disponible pour cette étape"), "fr noLandmark: " + frNo.steps[0]);
  const es = rewriteInstructions("Gira a la derecha.", { locale: "es", landmarks: [{ name: "la farmacia", step: 1, side: "right" }], startFacing: "la estación", stressMode: true, bodyAnchor: { label: "reloj", side: "right" } });
  const esText = [es.anchorSentence, ...es.steps].join("\n");
  assert(/Estás mirando hacia la estación\./.test(esText), "es facing: " + esText);
  assert(/Mantén la farmacia del lado de tu reloj\./.test(esText), "es keepOnSide: " + esText);
  assert(/MODO ESTRÉS: párate\. Lee la frase de orientación\./.test(esText), "es stress header: " + esText);
  const esUnknown = rewriteInstructions("Sigue.", { locale: "es" });
  assert(esUnknown.anchorSentence.includes("anótala aquí"), "es facingUnknown: " + esUnknown.anchorSentence);
  // Accented output must not be re-flagged as a residual direction word.
  assert(fr.residualDirectionWords.length === 0 && es.residualDirectionWords.length === 0, "accented phrases flagged as residual");
});

test("overpass query shape", () => {
  const q = buildAroundQuery({ lat: 48.8584, lon: 2.2945 }, 100, ["amenity", "tourism"]);
  assert(q.includes('nwr["amenity"]["name"](around:100,48.858400,2.294500);'), q);
  assert(q.includes('nwr["tourism"]'), q);
});

console.log("\nLibrary tests: " + passed + " passed, " + failures.length + " failed");
for (const f of failures) console.log("  FAIL " + f);
if (failures.length) process.exit(1);
