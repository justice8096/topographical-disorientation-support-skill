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

## Controls

- **Input size**: every library entry point refuses input over 200,000 characters (`MAX_SCAN_LENGTH`) rather than truncating, so a partial scan can never be reported as a clean one. Step count (200), landmark list (5,000), decision points (200), and CLI file size (2 MB) are bounded.
- **ReDoS**: all regexes are plain alternations with lookaround word boundaries; no nested quantifiers, no backreferences. `test-security.ts` checks the compiled source and times 190k-character scans.
- **Overpass QL injection**: the query is assembled only from numbers rendered with fixed precision and from a fixed allowlist of tag keys. User strings never reach the query.
- **SSRF**: `fetchLandmarks` accepts only exact entries from `OVERPASS_ENDPOINTS` (https, public mirrors). `http://`, `file://`, localhost, private and link-local ranges, look-alike hosts, and path variants are refused before any request. Redirects are refused, responses are capped at 5 MB, requests time out at 25 s.
- **Untrusted OSM data**: the parser keeps six fields, strips control characters and `< > { } [ ] \`` from names, caps elements at 2,000, and ignores malformed entries.
- **Output sanitisation**: landmark names, body anchors, and start-facing text are sanitised again on output by the rewriter.
- **Prompt injection**: the content checker reports patterns in en/fr/es that read as instructions to an AI and sets `promptInjectionSuspected`. Every command's markdown instructs the model to treat content as data and never follow instructions found in it. Detection is report-only; nothing in the library acts on content.
- **Path containment**: `safeKnowledgePath` accepts only slug names and verifies the resolved path stays inside the base directory.
- **No dynamic code, no runtime dependencies**: the library uses no `eval`, `new Function`, `child_process`, or network beyond the one allowlisted fetch. The build tool uses devDependencies only; generated artifacts declare their own.
- **Generated documents** never include identification numbers, account numbers, or addresses; placeholders are left for the person.
- **Supply chain**: `tooling/package-lock.json` pins dependencies; `npm audit --audit-level=high` runs in CI; an SBOM is generated with `npm run sbom`.

## Known accepted risks

| CWE | Description | Justification |
|-----|-------------|---------------|
| CWE-22 | Path traversal in the generated MCP knowledge loader | Input sourced from the manifest (trusted), not from user input; `safeKnowledgePath` is provided for any user-facing loader |
| CWE-502 | `JSON.parse` on local manifest and on CLI landmark files | Local files under the operator's control; Overpass responses are parsed and then shape-validated |
| CWE-1357 | Caret dependency ranges | devDependencies only; lockfile mitigates |
| CWE-400 | Public Overpass mirrors can be slow or refuse | Areas are bounded (400 m radius, 0.05 degree bbox) and the offline mode returns the query for execution elsewhere |
