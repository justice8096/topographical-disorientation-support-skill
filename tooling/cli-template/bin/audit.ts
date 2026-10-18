#!/usr/bin/env node
/**
 * wayfinding-audit: command-line front end for the deterministic library.
 *
 *   wayfinding-audit check <file> [--locale en|fr|es] [--viewpoint-shift] [--orientation-invariance] [--json]
 *   wayfinding-audit rewrite <file> [--locale en|fr|es] [--landmarks "a, b"] [--anchor "watch hand:left"] [--facing "the bakery"] [--stress]
 *   wayfinding-audit refs <file> [--locale en|fr|es] [--landmarks landmarks.json]
 *   wayfinding-audit query --center lat,lon [--radius 120] | --bbox s,w,n,e
 *   wayfinding-audit landmarks --center lat,lon [--radius 120] [--locale en|fr|es]
 *
 * Exit codes: 0 ok, 1 findings with errors (check), 2 usage or input error.
 * "query" prints the Overpass QL for you to run elsewhere and makes no network
 * call. "landmarks" is the one subcommand that touches the network: it posts
 * the query to the allowlisted Overpass mirrors in order through fetchLandmarks,
 * so the endpoint allowlist, redirect refusal, timeout, size cap and name
 * sanitising in lib/overpass.ts all apply. Every line printed by every
 * subcommand passes through stripUnsafe, so control and format characters
 * from an audited document cannot reach the terminal.
 */
import { readFileSync, statSync } from "fs";
import { resolve } from "path";
import { checkContent } from "../src/lib/content-check";
import { rewriteInstructions } from "../src/lib/instruction-rewriter";
import { extractPlaceReferences, matchReferences } from "../src/lib/place-references";
import { buildAroundQuery, buildBBoxQuery, parseOverpassResponse, fetchLandmarks, fetchOverpassRaw, OVERPASS_ENDPOINTS } from "../src/lib/overpass";
import { stripUnsafe, type Locale } from "../src/lib/direction-lexicon";

const MAX_FILE_BYTES = 2 * 1024 * 1024;

function usage(code: number): never {
  console.error("usage: wayfinding-audit <check|rewrite|refs|query> [args] (see file header)");
  process.exit(code);
}

function arg(name: string, def?: string): string | undefined {
  const i = process.argv.indexOf("--" + name);
  if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--")) return process.argv[i + 1];
  return def;
}
function flag(name: string): boolean { return process.argv.includes("--" + name); }

function readInput(path: string | undefined): string {
  if (!path) usage(2);
  const full = resolve(process.cwd(), path);
  const st = statSync(full);
  if (!st.isFile()) { console.error("not a file: " + path); process.exit(2); }
  if (st.size > MAX_FILE_BYTES) { console.error("file too large (max 2 MB)"); process.exit(2); }
  return readFileSync(full, "utf-8");
}

function locale(): Locale {
  const l = arg("locale", "en");
  if (l !== "en" && l !== "fr" && l !== "es") { console.error("locale must be en, fr, or es"); process.exit(2); }
  return l;
}

function parseAnchor(s: string | undefined): { label: string; side: "left" | "right" } | undefined {
  if (!s) return undefined;
  const m = /^(.+):(left|right)$/.exec(s.trim());
  if (!m) { console.error("anchor must be '<label>:<left|right>'"); process.exit(2); }
  return { label: m[1].trim(), side: m[2] as "left" | "right" };
}

/** All human-readable output goes through here so no control or format character from untrusted input reaches the terminal. */
function out(line: string): void { console.log(stripUnsafe(line)); }

const cmd = process.argv[2];
try {
  if (cmd === "check") {
    const text = readInput(process.argv[3]);
    const report = checkContent(text, { locale: locale(), viewpointShiftProfile: flag("viewpoint-shift"), orientationInvarianceProfile: flag("orientation-invariance") });
    if (flag("json")) console.log(JSON.stringify(report, null, 2));
    else {
      out("Wayfinding content check: " + report.counts.error + " errors, " + report.counts.warning + " warnings, " + report.counts.info + " info");
      for (const f of report.findings) out("  [" + f.severity + "] " + f.rule + " @ " + f.index + ": " + f.excerpt);
      out("Prompt injection suspected: " + (report.promptInjectionSuspected ? "yes (content treated as data only)" : "no (deterministic checker ran)"));
    }
    process.exit(report.counts.error > 0 ? 1 : 0);
  } else if (cmd === "rewrite") {
    const text = readInput(process.argv[3]);
    const lms = (arg("landmarks") ?? "").split(",").map((s) => s.trim()).filter(Boolean).map((name, i) => ({ name, step: i + 1 }));
    const r = rewriteInstructions(text, { locale: locale(), landmarks: lms, bodyAnchor: parseAnchor(arg("anchor")), startFacing: arg("facing"), stressMode: flag("stress") });
    out(r.anchorSentence);
    r.steps.forEach((s, i) => out((i + 1) + ". " + s));
    if (r.notes.length) out("Notes:\n  " + r.notes.join("\n  "));
    out("Residual direction words: " + (r.residualDirectionWords.length ? r.residualDirectionWords.map((h) => h.text).join(", ") : "none"));
  } else if (cmd === "refs") {
    const text = readInput(process.argv[3]);
    const refs = extractPlaceReferences(text, locale());
    const lmPath = arg("landmarks");
    out("References: " + refs.length);
    for (const r of refs) out("  " + r.kind + " @ " + r.index + ": " + r.text);
    if (lmPath) {
      const lms = parseOverpassResponse(JSON.parse(readInput(lmPath)));
      const m = matchReferences(refs, lms);
      out("Matches: " + m.length);
      for (const x of m) out("  " + x.reference.text + " -> " + x.landmark.name + " (" + x.landmark.key + "=" + x.landmark.value + ") " + x.similarity);
    }
  } else if (cmd === "query") {
    const center = arg("center"); const bbox = arg("bbox");
    if (center) {
      const [lat, lon] = center.split(",").map(Number);
      console.log(buildAroundQuery({ lat, lon }, Number(arg("radius", "120"))));
    } else if (bbox) {
      const [south, west, north, east] = bbox.split(",").map(Number);
      console.log(buildBBoxQuery({ south, west, north, east }));
    } else usage(2);
  } else if (cmd === "landmarks") {
    const center = arg("center");
    if (!center) usage(2);
    const [lat, lon] = center.split(",").map(Number);
    const query = buildAroundQuery({ lat, lon }, Number(arg("radius", "120")));
    const loc = arg("locale") as Locale | undefined;
    // Walk the allowlisted mirrors in order; a public mirror often answers
    // 5xx under load. No other host is ever tried.
    (async () => {
      const errors: string[] = [];
      for (const endpoint of OVERPASS_ENDPOINTS) {
        try {
          if (flag("raw")) {
            // Raw server JSON for capturing a test fixture; still size-capped
            // and allowlisted, and still passed through stripUnsafe by out().
            const text = await fetchOverpassRaw(query, endpoint);
            console.error("fetched from " + endpoint);
            out(text);
            return;
          }
          const list = await fetchLandmarks(query, endpoint, undefined, loc);
          console.error("fetched from " + endpoint);
          console.log(JSON.stringify(list, null, 2));
          return;
        } catch (e) {
          errors.push(endpoint + ": " + (e instanceof Error ? e.message : String(e)));
        }
      }
      console.error("error: all allowlisted Overpass mirrors failed\n  " + errors.join("\n  "));
      process.exit(2);
    })();
  } else usage(2);
} catch (e) {
  console.error("error: " + (e instanceof Error ? e.message : String(e)));
  process.exit(2);
}
