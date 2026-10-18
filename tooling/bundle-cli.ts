/**
 * Bundle cli/wayfinding-audit.ts and lib/ into one dependency-free ES module,
 * scripts/wayfinding-audit.mjs, so the plugin commands work after a marketplace
 * install (no tsx, no node_modules). Run: tsx bundle-cli.ts   (npm run bundle:cli)
 * test-lib.ts rebuilds the bundle in memory and fails if the committed file differs.
 */
import { buildSync } from "esbuild";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const BUNDLE_PATH = resolve(here, "../scripts/wayfinding-audit.mjs");

export function buildCliBundle(): string {
  const result = buildSync({
    entryPoints: [resolve(here, "../cli/wayfinding-audit.ts")],
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node18",
    write: false,
    legalComments: "none",
    logLevel: "silent",
    absWorkingDir: resolve(here, ".."),
  });
  const text = result.outputFiles[0].text.replace(/\r\n/g, "\n");
  return text.startsWith("#!") ? text.replace(/^#![^\n]*\n/, "#!/usr/bin/env node\n") : "#!/usr/bin/env node\n" + text;
}

if (process.argv[1] && /bundle-cli\.(ts|js)$/.test(process.argv[1])) {
  const text = buildCliBundle();
  mkdirSync(dirname(BUNDLE_PATH), { recursive: true });
  writeFileSync(BUNDLE_PATH, text);
  console.log("wrote " + BUNDLE_PATH + " (" + text.length + " bytes)");
}
