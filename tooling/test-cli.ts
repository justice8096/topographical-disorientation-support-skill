/**
 * Tests for the bundled plugin CLI (scripts/wayfinding-audit.mjs) and for the way
 * the commands call it. Run: tsx test-cli.ts [--verbose]
 * Kept apart from test-lib.ts because it spawns processes, which the library
 * hygiene test in test-security.ts forbids under lib-named files.
 */
import { readFileSync, readdirSync, mkdtempSync, copyFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCliBundle, BUNDLE_PATH } from "./bundle-cli.js";

const here = dirname(fileURLToPath(import.meta.url));
const verbose = process.argv.includes("--verbose");
let passed = 0; const failures: string[] = [];
function test(name: string, fn: () => void): void {
  try { fn(); passed++; if (verbose) console.log("    ok " + name); }
  catch (e) { failures.push(name + ": " + (e instanceof Error ? e.message : String(e))); if (verbose) console.log("    x " + name); }
}
function assert(c: unknown, m: string): asserts c { if (!c) throw new Error(m); }

test("bundle is current: scripts/wayfinding-audit.mjs matches a fresh build", () => {
  const committed = readFileSync(BUNDLE_PATH, "utf8").replace(/\r\n/g, "\n");
  assert(committed === buildCliBundle(), "scripts/wayfinding-audit.mjs is stale; run npm run bundle:cli in tooling/");
  assert(committed.startsWith("#!/usr/bin/env node\n"), "shebang");
});

test("bundle runs from an empty directory with no node_modules", () => {
  const dir = mkdtempSync(join(tmpdir(), "tdss-bundle-"));
  try {
    copyFileSync(BUNDLE_PATH, join(dir, "wayfinding-audit.mjs"));
    const run = (args: string[], input: string) => spawnSync(process.execPath, [join(dir, "wayfinding-audit.mjs"), ...args], { input, cwd: dir, encoding: "utf8", env: { PATH: process.env.PATH ?? "" } });
    const bad = run(["check", "--stdin", "--locale", "en", "--json"], "Turn left at the corner and head north.");
    assert(bad.status === 1, "check with direction words should exit 1, got " + bad.status + " " + bad.stderr);
    assert(JSON.parse(bad.stdout).counts.error > 0, "check --stdin reported no errors");
    const rw = run(["rewrite", "--stdin", "--locale", "fr", "--landmarks", "la boulangerie"], "Tournez a gauche.");
    assert(rw.status === 0 && rw.stdout.includes("la boulangerie"), "rewrite --stdin: " + rw.stdout + rw.stderr);
    const q = run(["query", "--center", "38.861,-77.362", "--radius", "120"], "");
    assert(q.status === 0 && q.stdout.includes("around:120"), "query: " + q.stderr);
    const big = run(["check", "--stdin"], "x".repeat(2 * 1024 * 1024 + 10));
    assert(big.status === 2, "oversized stdin must exit 2, got " + big.status);
    const none = run(["check"], "");
    assert(none.status === 2, "check with no input must exit 2, got " + none.status);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("commands call the bundle through the plugin root, never the tsx path or bin/", () => {
  const dir = resolve(here, "../commands");
  let uses = 0;
  for (const f of readdirSync(dir).filter((n) => n.endsWith(".md"))) {
    const text = readFileSync(join(dir, f), "utf8");
    assert(!text.includes("node_modules/.bin/tsx"), f + " still references the tsx path");
    assert(!/\bbin\/wayfinding-audit/.test(text), f + " still references bin/");
    if (text.includes("wayfinding-audit.mjs")) {
      uses++;
      assert(text.includes("node ${CLAUDE_PLUGIN_ROOT}/scripts/wayfinding-audit.mjs"), f + " must call node with the plugin-root path");
      const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] ?? "";
      assert(/allowed-tools:.*Bash\(node \*\/scripts\/wayfinding-audit\.mjs \*\)/.test(fm), f + " allowed-tools must grant exactly the bundle");
      assert(/argument-hint:/.test(fm) && text.includes("$ARGUMENTS"), f + " needs argument-hint and $ARGUMENTS");
    }
  }
  assert(uses >= 4, "expected at least 4 commands to use the bundle, found " + uses);
});

test("the plugin has no bin/ directory (it would block claude.ai and Cowork installs)", () => {
  let exists = true;
  try { readdirSync(resolve(here, "../bin")); } catch { exists = false; }
  assert(!exists, "bin/ must not exist at the plugin root; the CLI source lives in cli/");
});

console.log("\nCLI tests: " + passed + " passed, " + failures.length + " failed");
for (const f of failures) console.log("  FAIL " + f);
if (failures.length) process.exit(1);
