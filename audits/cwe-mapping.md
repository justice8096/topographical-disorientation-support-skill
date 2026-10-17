# CWE Mapping and Compliance Matrix

## topographical-disorientation-support-skill v0.1.0

Date: 2026-10-17
Source: sast-dast-scan.md findings plus the controls the project implements by design. The pattern scanner's 72 raw matches were triaged to zero vulnerabilities (see sast-dast-scan.md); this document maps the controls and the accepted residual risks.

## CWEs tracked

| CWE | Name | Where | Status | Evidence |
|---|---|---|---|---|
| CWE-918 | Server-Side Request Forgery | lib/overpass.ts fetchLandmarks | Mitigated | exact allowlist, redirect refused, timeout, size cap; 11 tests |
| CWE-1333 | Inefficient Regular Expression Complexity | lib/*.ts regexes | Mitigated | no nested quantifiers or backreferences; timed tests |
| CWE-400 | Uncontrolled Resource Consumption | all lib entry points | Mitigated | 200k char cap, 200 steps, 5,000 landmarks, 2,000 OSM elements, 5 MB response, 2 MB CLI file |
| CWE-20 | Improper Input Validation | overpass.ts coordinates/radius/bbox, rewriter anchors, CLI args | Mitigated | finite-number and range checks, fixed-precision rendering, enum checks |
| CWE-77 / CWE-943 | Injection into a downstream query language (Overpass QL) | overpass.ts query builders | Mitigated by construction | only numbers and allowlisted keys reach the query; hostile keys dropped; tested |
| CWE-79 | Improper Neutralisation in output (markup in route cards) | instruction-rewriter.ts, overpass.ts sanitizeName | Mitigated | control chars and `< > { } [ ] \`` stripped, length capped; tested |
| CWE-22 | Path Traversal | lib/safe-path.ts, CLI file read | Mitigated / Accepted | slug-only names contained to base dir; CLI reads a user-named file by design |
| CWE-502 | Deserialisation of untrusted data | JSON.parse of Overpass response and CLI landmark file | Mitigated | JSON only (no code execution), shape-validated by parseOverpassResponse |
| CWE-1357 | Reliance on Insufficiently Trustworthy Component | tooling devDependencies | Accepted | dev-only, lockfile, npm audit clean, SBOM |
| CWE-1426 (LLM) | Improper Validation of Generative AI Output | commands that let a model edit route cards | Mitigated | deterministic rewriter runs first; CLI `check` exits 1 if a direction word returns; Ollama and Codex samples enforce the check |
| OWASP LLM01 | Prompt Injection | content-check.ts, all command markdown | Mitigated (report-only detection) | en/fr/es patterns flagged; content treated as data |

Resolved this cycle: none (first audit). Open: none. Accepted risk: CWE-22 (CLI by design), CWE-1357.

## Framework compliance matrix

| Framework | Relevant controls | Status |
|---|---|---|
| OWASP Top 10 2021 | A03 Injection (QL, output markup), A05 Misconfiguration (CI permissions), A06 Vulnerable components, A10 SSRF | Addressed |
| OWASP LLM Top 10 2025 | LLM01 Prompt Injection, LLM02 Sensitive Information Disclosure (documents never generate IDs or addresses), LLM05 Improper Output Handling, LLM06 Excessive Agency (library has no side effects beyond one allowlisted fetch) | Addressed |
| NIST SP 800-53 | SI-10 Input Validation, SC-7 Boundary Protection (egress allowlist), SA-11 Developer Testing, SR-3/SR-4 Supply Chain | Addressed |
| EU AI Act Art. 25 and accessibility context | Not a high-risk system; a cognitive-accessibility support tool. Transparency met by evidence grades on every recommendation and the explicit "no diagnosis" statement | Addressed |
| ISO 27001:2022 | A.8.25 Secure development, A.8.28 Secure coding, A.8.29 Security testing, A.5.21 ICT supply chain | Addressed |
| SOC 2 | CC6.x logical access not applicable (no auth surface); CC7.1 vulnerability management via CI audit; CC8.1 change management via gates | Addressed where applicable |
| MITRE ATT&CK | T1190 (no exposed service), T1071 (single HTTPS egress, allowlisted) | Low exposure |
| MITRE ATLAS | AML.T0051 LLM Prompt Injection: detected and reported; AML.T0043 Craft Adversarial Data: OSM data sanitised | Addressed |

## Accessibility and domain-specific compliance
The project's own gates: dyslexia-support-skill content check (WARN: long sentences in command docs), dyscalculia-support-skill content check (WARN: legal citations read as ratios, e.g. "1/2013"), both advisory. WCAG does not govern this repository's output format (Markdown and plain text); the content check adds a direction-word rule WCAG lacks.
