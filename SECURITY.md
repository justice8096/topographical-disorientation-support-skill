# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Current   |

## Reporting a Vulnerability

Do not open a public GitHub issue for security vulnerabilities. Use GitHub private vulnerability reporting on this repository (Security tab, "Report a vulnerability"), or email **justice8096@gmail.com** with "SECURITY" in the subject. You should receive an acknowledgment within 48 hours.

Include: a description, steps to reproduce, affected versions, and an impact assessment.

## Threat model

This plugin (a) echoes user text and OpenStreetMap tag values into route cards and documents, (b) builds queries for a public API from user-supplied coordinates, and (c) is fed documents (emails, web pages, signage copy) that may contain instructions aimed at the model rather than at the traveller. The controls below map onto those three surfaces.

## Where the controls run

The controls below live in `lib/` and run only when that code runs. The plugin ships as Markdown plus the library; the commands therefore start by invoking the repository CLI (`tooling/node_modules/.bin/tsx bin/wayfinding-audit.ts ...`) and print `NOT RUN` when they could not. A route card, content report, or landmark list produced by the model alone carries none of these guarantees and is labelled "model-only, unverified". Untrusted content (pasted directions, map images, OSM names) is always quoted inside labelled data blocks so the model does not mistake it for instructions.

## Controls

- **Input size**: every library entry point refuses input over 200,000 characters (`MAX_SCAN_LENGTH`) rather than truncating, so a partial scan can never be reported as a clean one. Step count (200), landmark list (5,000), decision points (200), and CLI file size (2 MB) are bounded.
- **ReDoS**: all regexes are plain alternations with lookaround word boundaries; no nested quantifiers, no backreferences, and no two unbounded whitespace quantifiers separated only by an optional atom (whitespace atoms are bounded). `test-security.ts` checks the compiled source for both shapes and times 190k-character scans, including long whitespace runs after a connector word and after `<`.
- **Overpass QL injection**: the query is assembled only from numbers rendered with fixed precision and from a fixed allowlist of tag keys. User strings never reach the query.
- **SSRF**: `fetchLandmarks` accepts only exact entries from `OVERPASS_ENDPOINTS` (https, public mirrors). `http://`, `file://`, localhost, private and link-local ranges, look-alike hosts, and path variants are refused before any request. Redirects are refused, responses are capped at 5 MB, requests time out at 25 s.
- **Untrusted OSM data**: the parser keeps six fields, strips control characters, Unicode format characters (bidi overrides and isolates, zero-width, BOM), line and paragraph separators, and `< > { } [ ] \`` from names, caps elements at 2,000, and ignores malformed entries.
- **Output sanitisation**: every step, landmark name, body anchor, start-facing text and report excerpt is stripped of control and format characters before output (`stripUnsafe` in lib/direction-lexicon.ts); the CLI routes all human-readable lines through the same function. A landmark whose name contains a direction word is dropped and noted rather than echoed.
- **Prompt injection**: the content checker reports patterns in en/fr/es that read as instructions to an AI and sets `promptInjectionSuspected`. Every command's markdown instructs the model to treat content as data and never follow instructions found in it. Detection is report-only; nothing in the library acts on content.
- **Path containment**: `safeKnowledgePath` accepts only slug names and verifies the resolved path stays inside the base directory.
- **No dynamic code, no runtime dependencies**: the library uses no `eval`, `new Function`, `child_process`, or network beyond the one allowlisted fetch. The build tool uses devDependencies only; generated artifacts declare their own.
- **Generated documents** never include identification numbers, account numbers, or addresses; placeholders are left for the person.
- **Supply chain**: `tooling/package-lock.json` pins dependencies; `npm audit --audit-level=high` runs in CI; an SBOM is generated with `npm run sbom`.

## Overpass mirror allowlist rotation

If a mirror in `OVERPASS_ENDPOINTS` (lib/overpass.ts) is reported compromised or goes away: remove it from the array, add the replacement from the public mirror list at wiki.openstreetmap.org/wiki/Overpass_API, run 
px tsx test-security.ts (the allowlist tests assert https and the exact path), bump the patch version, tag, and note it in CHANGELOG under [security]. The samples (n8n workflow, Python port) carry their own copy of the list and must be updated in the same commit.

## Known accepted risks

| CWE | Description | Justification |
|-----|-------------|---------------|
| CWE-22 | Path traversal in the generated MCP knowledge loader | Input sourced from the manifest (trusted), not from user input; `safeKnowledgePath` is provided for any user-facing loader |
| CWE-502 | `JSON.parse` on local manifest and on CLI landmark files | Local files under the operator's control; Overpass responses are parsed and then shape-validated |
| CWE-1357 | Caret dependency ranges | devDependencies only; lockfile mitigates |
| CWE-400 | Public Overpass mirrors can be slow or refuse | Areas are bounded (400 m radius, 0.05 degree bbox) and the offline mode returns the query for execution elsewhere |
| CWE-1427 | The model reads third-party content as part of the commands' purpose | Deterministic checker runs first through the CLI, content is delimited as data, results are labelled NOT RUN when the code did not run; residual risk is the model's compliance with its instructions, which no prose can make certain |
