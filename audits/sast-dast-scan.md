# SAST/DAST Scan Report

## topographical-disorientation-support-skill v0.1.0

Date: 2026-10-17
Scope: `lib/`, `tooling/`, `samples/`, `tests/`, `source/`, `.github/`
Tools: sast-dast-scanner scripts (scan-secrets.sh, scan-dependencies.sh), cwe-mapper identify-cwes.py (pattern scanner, advisory), tooling/test-security.ts (51 behavioural tests), npm audit, manual review of every file under `lib/`.

DAST note: this project has no HTTP server, no cookies, no headers, and no TLS endpoint of its own. The only outbound call is `fetchLandmarks` in `lib/overpass.ts`, which is covered by the SSRF section below. The generated MCP server (dist/mcp-server) speaks stdio only.

## Summary

| Severity | Count | Status |
|---|---|---|
| CRITICAL | 0 | |
| HIGH | 0 | |
| MEDIUM | 0 | |
| LOW | 3 | documented, accepted or scheduled |
| INFO | 2 | |

Overall: PASS.

## Pattern-scanner triage

identify-cwes.py reported 72 high-confidence CRITICAL or HIGH matches. Every one was reviewed. None is a vulnerability; the scanner is keyword-based and this project's domain vocabulary collides with its patterns:

| Reported | Count | Finding on review |
|---|---|---|
| CWE-611 XXE | 23 | The token "DTD" is the condition's abbreviation (developmental topographical disorientation) and "system" appears in prose ("AI system", "cardinal system"). No XML parser exists anywhere in the project. False positive. |
| CWE-22 Path traversal | 34 | Relative imports (`../lib/...`) in tests and the build tool, and `Path(__file__)` in the pytest file. No user-controlled path reaches a file API. The one user-facing path (CLI `check <file>`) is resolved against cwd, stat-checked, and size-capped; knowledge names go through `safeKnowledgePath`. False positive. |
| CWE-918 SSRF | 5 | Three are in `overpass.ts` where the allowlist and the `file://` string live in the defence itself; two are hostile fixtures in test-security.ts. See LOW-1. |
| CWE-20 Input validation | 6 | `process.argv` reads in the CLI and test runner. Arguments are validated (`locale`, `anchor` regex, numeric parse with range checks in the library). False positive. |
| CWE-78 Command injection | 3 | Template literals in `console.log` calls in test-build.ts. No shell is invoked with them. False positive. |
| CWE-787 Out-of-bounds write | 1 | `const hits: DirectionHit[] = [];` matched a C-style pattern. JavaScript arrays cannot be written out of bounds. False positive. |

## Findings

### LOW-1: Outbound fetch to a third-party API (CWE-918 adjacent)
File: `lib/overpass.ts:145-170`
`fetchLandmarks` performs an HTTPS POST to an Overpass mirror. Controls: exact-match allowlist of three public mirrors (`assertAllowedEndpoint`), `redirect: "error"`, 25 s timeout via AbortController, 5 MB response cap checked on both Content-Length and body, query size cap 10 kB, query built only from validated numbers and allowlisted tag keys. Tested by 11 security tests including localhost, 169.254.169.254, private ranges, `file://`, `gopher://`, host look-alikes and path variants.
Residual risk: a compromised public mirror could return hostile data; the parser sanitises names, drops malformed elements and truncates at 2,000. Accepted.

### LOW-2: Regular expressions over untrusted input (CWE-1333 ReDoS)
Files: `lib/direction-lexicon.ts`, `lib/content-check.ts`, `lib/place-references.ts`
All patterns are plain alternations with lookaround boundaries; no nested quantifiers, no backreferences. test-security.ts verifies the compiled source shape and times 190k-character scans (observed 22 ms and 35 ms). Input above 200,000 characters is refused. Accepted; re-verify whenever a lexicon entry is added.

### LOW-3: Untrusted text echoed into output (CWE-79 adjacent)
Files: `lib/instruction-rewriter.ts` (`sanitizeName`), `lib/overpass.ts` (`sanitizeName`)
Landmark names, body anchors and OSM tag values are echoed into route cards. Both sanitisers strip control characters and `< > { } [ ] \`` and cap length; the rewriter rejects an anchor that is itself a direction word. Output is plain text or Markdown, never HTML. Tested. Accepted.

### INFO-1: Prompt-injection detection is report-only by design
`lib/content-check.ts` flags en/fr/es patterns that read as instructions to an AI and sets `promptInjectionSuspected`. The library never acts on content; the command markdown instructs the model to treat content as data. This is a control, not a finding, recorded so a future change does not turn detection into action.

### INFO-2: Test fixture contains private IP strings
`tooling/test-security.ts:150-158` lists `10.0.0.1`, `127.0.0.1` and `169.254.169.254` as endpoints that must be refused. The publish gate flags private addresses in history; these are fixtures, not infrastructure.

## Secrets scan
scan-secrets.sh: no secrets found. test-security.ts also asserts no AWS, GitHub, OpenAI, Slack or private-key patterns in tracked sources.

## Dependency scan
npm audit (tooling): 0 vulnerabilities across 52 packages. Runtime dependencies: none (library, CLI and samples are dependency-free). Generated MCP server declares `@modelcontextprotocol/sdk` and `zod` for the consumer to install.

## Behavioural security tests
`tooling/test-security.ts`: 51 passed, 0 failed (ReDoS, size limits, QL injection, SSRF allowlist, untrusted OSM data, output sanitising, prompt injection en/fr/es, path containment, lexicon integrity, repository hygiene, place-reference extraction).

## Remediation
None required for release. Re-run this scan when `lib/overpass.ts` or any lexicon changes.
