# Changelog

All notable changes to this project are documented here. Tags: [evidence] research-driven content change, [regulatory] legal or standards change, [defect] correction, [security] security fix or test, [tooling] build or test infrastructure.

## [0.1.2] - 2026-10-17

Response to the Claude Security scan of 23c2f70 (nine findings, three MEDIUM, six LOW; report in audits/CLAUDE-SECURITY-RESULTS-2026-10-17.md).

### Fixed
- [security] F1, F4: bounded whitespace atoms in the NAMED_RUN and `<system>` patterns; static test rejects adjacent unbounded `\s` quantifiers; timing test on long whitespace runs.
- [security] F2, F3: commands now run the repository CLI (`bin/wayfinding-audit.ts`, new) before the model reads any content, print NOT RUN when they could not, wrap untrusted content in labelled data blocks, and reach Overpass only through the CLI, which walks the hardcoded allowlist of three mirrors in order; prose no longer claims controls the code did not run.
- [security] F5: direction-word offsets are translated through a fold map in both the library and the Python sample, so Hangul, Indic and dotted-capital-I text no longer leaves direction words behind.
- [security] F6, F9: every step, excerpt and CLI line is stripped of control and format characters; the CLI routes all output through one helper.
- [security] F7: sanitisers strip Unicode format characters (bidi overrides, zero-width, BOM) and line separators in the library, the Python sample and the n8n Code node.
- [security] F8: the Codex sample post-checks the final completion with the lexicon and refuses to print direction words; landmark names containing direction words are dropped by the rewriter in both languages.

## [0.1.1] - 2026-10-17

### Added
- [evidence] parseOverpassResponse(json, locale) prefers 
ame:fr / 
ame:es tags when a locale is given; `/area-landmarks` passes its locale through.
- README scope-and-limits section (not a driving aid; Overpass receives the coordinates you query; relatives' information in family-history paragraphs is theirs to disclose) in en, fr, es.
- SECURITY.md procedure for rotating the Overpass mirror allowlist.
- [tooling] CI matrix adds Node 24; CI fails when tooling/sbom.cdx.json drifts from the lockfile.

## [0.1.0] - 2026-10-17

First release: core plus English, French, and Spanish locales, both comorbid profiles, security test suite.

### Added
- [evidence] Four skills: `dtd-standards-compliance`, `wayfinding-prosthetics`, `dtd-document-generation`, `dtd-gap-analysis`, built from `docs/research/research-foundation-2026-10-17.md` with an A to F evidence grade on every recommendation.
- [evidence] Six commands: `rewrite-directions`, `landmark-route-script`, `area-landmarks`, `place-references`, `wayfinding-content-check`, `dtd-accommodation-request`.
- Two templates: landmark route card (en/fr/es in one file) and accommodation request (ADA Title I, amenagement de poste, ajustes razonables RDL 1/2013).
- Deterministic library in `lib/`: three-language direction lexicon, instruction rewriter with body-anchor binding, Overpass query builder and parser, Graser 2016 landmark salience scorer, content checker with prompt-injection reporting, place-reference extractor and matcher, safe path helper.
- [security] `tooling/test-security.ts`: ReDoS resistance, input size limits, Overpass QL injection, SSRF endpoint allowlist, untrusted OSM data handling, rewriter output sanitisation, prompt-injection detection in en/fr/es, path containment, lexicon integrity, repository hygiene (secrets, dynamic code, markup in sources, manifest schema).
- [tooling] `tooling/test-lib.ts` functional tests; `wayfinding-audit` CLI template; CI step for security tests.
- README in English, French, and Spanish.
- [security] SECURITY.md points to GitHub private vulnerability reporting plus a real contact address.
- [tooling] GitHub Actions pinned to commit SHAs; samples/ laid out for gate-check (Python, n8n, Codex, Ollama); pytest tests for the Python sample; CycloneDX SBOM in tooling/.
- [security] First post-commit audit in audits/ (SAST/DAST PASS, supply chain PASS, CWE mapping, LLM compliance 90/100, contribution analysis).

### Known limits
- Overpass `name:fr` and `name:es` tags are not requested yet (planned 0.2.0).
- Category weights in the salience scorer are a starting point, not the Graser 2016 expert rankings.
- Viewpoint-shift and orientation-invariance profiles are family-reported traits with no DTD-specific literature (Grade C) and are labelled as such in every output.
- No statutory recognition of DTD exists in the US, France, or Spain; all legal framing is by analogy (Grade C).
