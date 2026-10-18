# SAST/DAST Scan Report

## topographical-disorientation-support-skill v0.1.3 (second cycle)

Date: 2026-10-18
Commit: 5964921
Scope: `lib/`, `bin/`, `tooling/`, `samples/`, `tests/`, `source/`, `.github/`
Tools: sast-dast-scanner scan-secrets.sh, cwe-mapper identify-cwes.py run per file (pattern scanner, advisory), tooling/test-security.ts (57 behavioural tests), npm audit, the Claude Security scan of 23c2f70 (audits/CLAUDE-SECURITY-RESULTS-2026-10-17.md), manual review of every file under `lib/` and `bin/`.

Previous cycle: 1f4f06f (v0.1.0), PASS, 3 LOW, 2 INFO. Between the cycles the Claude Security workflow (57 agents) found nine issues, three MEDIUM and six LOW; all nine were fixed in 0.1.2 and are listed under Resolved below.

DAST note: this project has no HTTP server, no cookies, no headers, and no TLS endpoint of its own. The only outbound call is `fetchOverpassRaw` in `lib/overpass.ts` (wrapped by `fetchLandmarks`), which is covered by the SSRF section below. The generated MCP server (dist/mcp-server) speaks stdio only.

## Summary

| Severity | Count | Status |
|---|---|---|
| CRITICAL | 0 | |
| HIGH | 0 | |
| MEDIUM | 0 | |
| LOW | 3 | documented and accepted (unchanged from cycle 1) |
| INFO | 3 | |

Resolved since cycle 1: 9 (Claude Security F1 to F9, see below).

Overall: PASS.

## Pattern-scanner triage

identify-cwes.py reads one file on stdin, so it was run over every source, sample, test, skill, command and workflow file (41 files). It reported 269 matches, 0 of them high-confidence CRITICAL or HIGH. Every category was reviewed:

| Reported | Count | Finding on review |
|---|---|---|
| CWE-352 CSRF | 103 | The evidence string is `put`, matched inside `input`, `output` and `computed`. There is no HTTP handler in the project. False positive. |
| CWE-611 XXE | 79 | The token "DTD" (the condition's abbreviation) and the word "system" in prose. No XML parser exists anywhere in the project. False positive. |
| CWE-22 Path traversal | 41 | Relative imports (`../lib/...`), `Path(__file__)` in pytest, and `safe-path.ts` where the defence lives. The one user-facing path (CLI `check <file>`) is resolved against cwd, stat-checked and capped at 2 MB. False positive. |
| CWE-78 Command injection | 29 | Template literals in `console.log` calls in test-build.ts. The only `child_process` import in the repository is test-build.ts running the build; nothing from input reaches a shell. False positive. |
| CWE-20 Input validation | 11 | `process.argv` reads in the two CLI copies and the test runner. Arguments are validated (`locale` enum, anchor regex, numeric parse with range checks in the library). False positive. |
| CWE-918 SSRF | 5 | Three are in `overpass.ts` where the allowlist and the `file://` comment live in the defence itself; two are hostile fixtures in test-security.ts. See LOW-1. |
| CWE-79 XSS | 1 | The words "function (" in a prose sentence of a skill document. False positive. |

## Findings

### LOW-1: Outbound fetch to a third-party API (CWE-918 adjacent)
File: `lib/overpass.ts` (`fetchOverpassRaw`, `fetchLandmarks`)
`fetchOverpassRaw` performs an HTTPS POST to an Overpass mirror; `fetchLandmarks` parses the result and the CLI `landmarks` subcommand walks the three allowlisted mirrors in order. Controls: exact-match allowlist of three public mirrors (`assertAllowedEndpoint`), `redirect: "error"`, 25 s timeout via AbortController, 5 MB response cap checked on both Content-Length and body, query size cap 10 kB, query built only from validated numbers and allowlisted tag keys. Tested by 11 security tests including localhost, 169.254.169.254, private ranges, `file://`, `gopher://`, host look-alikes and path variants.
Residual risk: a compromised public mirror could return hostile data; the parser sanitises names, drops malformed elements and truncates at 2,000. Accepted.

### LOW-2: Regular expressions over untrusted input (CWE-1333 ReDoS)
Files: `lib/direction-lexicon.ts`, `lib/content-check.ts`, `lib/place-references.ts`
All patterns are plain alternations with lookaround boundaries; no nested quantifiers, no backreferences, and since 0.1.2 no two unbounded whitespace quantifiers separated only by an optional atom (Claude Security F1 and F4 found that shape in NAMED_RUN and the `<system>` pattern). test-security.ts checks the compiled source for both shapes and times 190k-character scans including long whitespace runs. Input above 200,000 characters is refused. Accepted; re-verify whenever a pattern is added.

### LOW-3: Untrusted text echoed into output (CWE-79 adjacent)
Files: `lib/instruction-rewriter.ts` (`sanitizeName`), `lib/overpass.ts` (`sanitizeName`)
Landmark names, body anchors and OSM tag values are echoed into route cards. Since 0.1.2 one function, `stripUnsafe`, removes control characters, Unicode format characters (bidi overrides, zero-width, BOM) and U+2028/2029 from every step, name, anchor, excerpt and CLI line; the name sanitisers additionally strip `< > { } [ ] \`` and cap length. The rewriter rejects an anchor that is a direction word and drops a landmark whose name contains one. Output is plain text or Markdown, never HTML. Tested (F6, F7, F9 regression tests). Accepted.

### INFO-1: Prompt-injection detection is report-only by design
`lib/content-check.ts` flags en/fr/es patterns that read as instructions to an AI and sets `promptInjectionSuspected`. The library never acts on content; the command markdown instructs the model to treat content as data. This is a control, not a finding, recorded so a future change does not turn detection into action.

### INFO-2: Model-side controls are instructions, not code (CWE-1427)
The commands now run `bin/wayfinding-audit.ts` before the model reads any content, label results NOT RUN when the code did not run, and delimit untrusted content as data blocks (Claude Security F2, F3). What remains is the model's compliance with its own instructions, which no prose can make certain. Recorded in SECURITY.md as an accepted risk.

### INFO-3: Test fixture contains private IP strings
`tooling/test-security.ts:150-158` lists `10.0.0.1`, `127.0.0.1` and `169.254.169.254` as endpoints that must be refused. The publish gate flags private addresses in history; these are fixtures, not infrastructure.

## Resolved since cycle 1 (Claude Security scan of 23c2f70, fixed in 0.1.2)

| ID | Severity | Issue | Fix |
|---|---|---|---|
| F1 | MEDIUM | NAMED_RUN regex quadratic on long whitespace runs | bounded whitespace atoms; static and timing tests |
| F2 | MEDIUM | checker documented but not executed; model asked to assert "no injection" itself | repository CLI run first; NOT RUN labelling; data blocks; allowed-tools frontmatter |
| F3 | MEDIUM | model could fetch Overpass itself, bypassing allowlist and caps | all fetches through the CLI, which walks the allowlist in order |
| F4 | LOW | `<system>` pattern quadratic on whitespace | bounded atoms |
| F5 | LOW | fold-then-index offset drift on Hangul, Indic, dotted I | fold map in lib and Python sample |
| F6 | LOW | control characters survived into rewriter steps | stripUnsafe on every step |
| F7 | LOW | bidi overrides survived sanitizeName | stripUnsafe covers Cf |
| F8 | LOW | Codex sample printed the completion unchecked | lexicon post-check, non-zero exit |
| F9 | LOW | CLI echoed control bytes | all output through one helper |

## Secrets scan
scan-secrets.sh: no secrets found. A manual grep for key, secret, password and token assignments over tracked text files found none. test-security.ts also asserts no AWS, GitHub, OpenAI, Slack or private-key patterns in tracked sources.

## Dependency scan
npm audit (tooling): 0 vulnerabilities across 52 packages. Runtime dependencies: none (library, CLI and samples are dependency-free). Generated MCP server declares `@modelcontextprotocol/sdk` and `zod` for the consumer to install.

## Behavioural security tests
`tooling/test-security.ts`: 57 passed, 0 failed (ReDoS shape and timing including whitespace runs, size limits, QL injection, SSRF allowlist, untrusted OSM data, control and format character stripping, direction-word landmarks dropped, fold-map offsets, prompt injection en/fr/es, path containment, lexicon integrity, repository hygiene). `tooling/test-lib.ts` 12 passed, including a parse of a captured real Overpass response (`tests/fixtures/`). `tests/test_rewrite_directions.py` 11 passed.

## Remediation
None required for release. Re-run this scan when `lib/overpass.ts`, `bin/`, or any regex changes. The generated MCP server handlers in dist/mcp-server remain stubs; when they are wired to lib, the stdio surface needs its own review.
