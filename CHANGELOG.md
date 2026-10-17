# Changelog

All notable changes to this project are documented here. Tags: [evidence] research-driven content change, [regulatory] legal or standards change, [defect] correction, [security] security fix or test, [tooling] build or test infrastructure.

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

### Known limits
- Overpass `name:fr` and `name:es` tags are not requested yet (planned 0.2.0).
- Category weights in the salience scorer are a starting point, not the Graser 2016 expert rankings.
- Viewpoint-shift and orientation-invariance profiles are family-reported traits with no DTD-specific literature (Grade C) and are labelled as such in every output.
- No statutory recognition of DTD exists in the US, France, or Spain; all legal framing is by analogy (Grade C).
