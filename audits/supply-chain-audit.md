# Supply Chain Security Audit

## topographical-disorientation-support-skill v0.1.3 (second cycle)

Date: 2026-10-18
Commit: 5964921
Tools: supply-chain-auditor scripts (check-lockfiles.sh, audit-ci-config.sh), publish-gate supply check, npm audit, CycloneDX SBOM (`tooling/sbom.cdx.json`).

## Summary

| Area | Result |
|---|---|
| Lockfile integrity | PASS: tooling/package-lock.json present and consistent |
| Dependency pinning | PASS: devDependencies only; lockfile pins exact versions |
| Vulnerabilities | PASS: npm audit 0 findings (52 packages) |
| CI/CD pinning | PASS: both GitHub Actions pinned to commit SHAs with version comments |
| CI permissions | PASS: `permissions: contents: read` at workflow level |
| Secrets in CI | PASS: none used |
| SBOM | PASS: CycloneDX 1.6, 42 components; CI regenerates and diffs it on every run, ignoring platform-specific optional packages |
| Runtime dependencies | PASS: none in lib/, bin/, CLI, or samples |
| Runtime data | PASS with note: Overpass mirrors reached only through the CLI, three allowlisted hosts tried in order; a captured response is checked into tests/fixtures/ as test data only |
| SLSA | Level 1 (scripted build, provenance via git history); Level 2 requires a hosted build with signed provenance, not configured |

Overall: PASS. 0 HIGH, 0 MEDIUM, 1 LOW (LOW-SC-1 resolved).

## Dependency inventory (tooling, dev only)

| Package | Purpose | Pinned by |
|---|---|---|
| typescript | type check, CLI compile | lockfile (latest at audit time) |
| tsx | run build and tests | lockfile (bumped from the sister repo's pin; the older pin failed ESM `.js` to `.ts` resolution on Node 24) |
| @types/node | types | lockfile |
| js-yaml, @types/js-yaml, glob | build tool helpers inherited from the shared build.ts | lockfile |

Generated artifacts declare their own dependencies for the consumer: MCP server (`@modelcontextprotocol/sdk`, `zod`), CLI (`typescript` dev only). The Python sample and tests use the standard library plus pytest.

## CI/CD review (`.github/workflows/ci.yml`)
- `actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4` and `actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4`: SHA-pinned.
- Steps: npm ci, type check, build, test-build, test-lib, test-security, npm audit, SBOM presence check.
- No `pull_request_target`, no curl-pipe-to-shell, no secrets.
- Matrix: Node 18, 20, 22, 24. Latest run on 5964921: success on all four.
- SBOM drift step: regenerates `tooling/sbom.cdx.json` and compares component purls, filtering `@esbuild/*`, `@rollup/rollup-*`, `@typescript/typescript-<platform>` and `fsevents`, which differ by runner OS.

## Findings

### LOW-SC-1 (resolved in 0.1.1): SBOM drift
CI now regenerates the SBOM and fails on drift (platform packages excluded). The first attempt failed because CycloneDX names lack the npm scope and runner OS changes the optional package set; the purl filter in ci.yml is the fix (7e0c379).

### LOW-SC-2: Third-party data source at runtime
Overpass mirrors are a runtime data dependency, not a package. Allowlisted, size-capped, time-limited, sanitised (see sast-dast-scan.md LOW-1), and since 0.1.2 reachable only through the CLI so the model cannot pick another host. A rotation procedure for the allowlist is in SECURITY.md. OpenStreetMap data is ODbL; consuming applications must attribute, noted in README. The checked-in fixture is a point-in-time ODbL extract used only by tests.

## Framework mapping
- NIST SSDF PW.4 (reuse well-secured components): dev-only, pinned, audited.
- SLSA v1.0: Build L1.
- OpenSSF Scorecard equivalents: Pinned-Dependencies pass, Token-Permissions pass, Dangerous-Workflow pass, SBOM pass, Vulnerabilities pass.
