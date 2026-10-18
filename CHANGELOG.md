# Changelog

All notable changes to this project are documented here. Tags: [evidence] research-driven content change, [regulatory] legal or standards change, [defect] correction, [security] security fix or test, [tooling] build or test infrastructure.

## [0.1.7] - 2026-10-18

### Changed
- Generated MCP server now bundles `lib/` and its rewrite-directions, wayfinding-content-check, place-references and landmark-route-script tools call it instead of returning a stub. area-landmarks and dtd-accommodation-request still return skill knowledge only (the first needs network, the second is document drafting).
- Dyscalculia glosses: 14.6 and 42.9 percent given as about 1 in 7 and about 4 in 10; simulator recall figures given as fractions first.
- Salience wording corrected: the weights in `lib/landmark-salience.ts` are this project's heuristic values, not figures from Graser (2016).

### Known items
- references/ split for citations is not done.
- Codex sample run and the live allowed-tools permission check still need an OpenAI key and a live Claude Code session.

## [0.1.6] - 2026-10-18

### Fixed
- [defect] French and Spanish text is now spelled with its accents everywhere a person reads it: README.fr.md, README.es.md, the FR and ES sections of both templates, the FR/ES passages of the skills and commands, the rewriter phrase tables in lib/instruction-rewriter.ts (so the CLI prints "Vous faites face à", "Estás mirando hacia", "Mantén", "MODE STRESS : arrêtez-vous", "MODO ESTRÉS: párate"), and the same tables in samples/rewrite_directions.py and the n8n sample. Matching still folds accents (lib/direction-lexicon.ts is unchanged), so "a gauche" and "à gauche" are both found. Closes the dyslexia-gate FAIL for fr and es from audits/accessibility-gates-2026-10-18.md.
- The first Spanish statute citation in the accommodation template reads "Real Decreto Legislativo 1 de 2013, RDL 1/2013" so the fraction shape is explained once (dyscalculia note).

### Added
- Library test: French and Spanish output phrases carry their accents, and accented output is not re-flagged as a residual direction word.

### Known
- Manifest keywords and command flag values stay ASCII on purpose (they are identifiers). The dyscalculia notes on glossing the 14.6 and 42.9 percent figures and the odds ratio are still open.

## [0.1.5] - 2026-10-18

Applies the skill-doctor treatment from audits/skill-doctor-2026-10-18.md.

### Fixed
- [defect] The commands now work after a marketplace install. They called `tooling/node_modules/.bin/tsx bin/wayfinding-audit.ts`, which only resolved inside this repository's checkout after `npm ci`; elsewhere every Step 0 printed NOT RUN. The CLI is now bundled into one dependency-free file, `scripts/wayfinding-audit.mjs` (built by `npm run bundle:cli`), and the commands call `node ${CLAUDE_PLUGIN_ROOT}/scripts/wayfinding-audit.mjs`. `tooling/test-cli.ts` fails the build if the committed bundle is stale and runs it from an empty directory with no node_modules.
- [defect] The CLI source moved from `bin/` to `cli/`. A plugin-root `bin/` directory puts its files on PATH and prevents installation in Claude.ai and Cowork; the plugin has no `bin/` now, and a test keeps it that way.
- allowed-tools narrowed to `Read, Bash(node */scripts/wayfinding-audit.mjs *)` on the four commands that run the CLI. landmark-route-script no longer requests Bash (it never called the CLI). `${CLAUDE_PLUGIN_ROOT}` is substituted in command bodies but not in allowed-tools, so the rule matches the script by its relative tail; a project that contains its own `scripts/wayfinding-audit.mjs` would match it too.
- All six commands gained `argument-hint` and a `$ARGUMENTS` line.
- Skill descriptions shortened to about 330 characters each (manifest-driven, so the MCP, OpenAI and prompt formats get them too). The full detail stays in the skill bodies.
- Date-sensitive claims carry a last-checked date: A.J.T. v. Osseo Area Schools (June 2025), the DOJ Title II web rule dates (extended April 2026), and Google's landmark directions (announced November 2025, US first; developer API availability unconfirmed).
- dtd-standards-compliance section 5 is the single owner of the legal framing; dtd-document-generation and dtd-gap-analysis point to it. The gap-analysis checklist says which items the content-check command covers.
- French and Spanish caveat paragraphs in dtd-document-generation and the locale phrasing in wayfinding-prosthetics are written with accents.
- The route-card template path in dtd-document-generation is given as `${CLAUDE_PLUGIN_ROOT}/templates/route-card-template.md`, with a fallback to the rules in the skill.

### Added
- `--stdin` for `check`, `rewrite` and `refs` (2 MB cap) so untrusted text never has to appear on a shell command line.
- esbuild as an explicit devDependency (it was already present through tsx); SBOM regenerated.

### Known
- French and Spanish text in the READMEs, commands, templates and the rewriter phrase tables in lib/ is still unaccented; only the skill caveats and phrasing above were fixed here. The CLI output ("Vous faites face a ...") therefore still differs from the accented phrasing the skill describes.
- Not done from the skill-doctor report: moving citations and the remediation-evidence section into `references/`, frontmatter in `source/commands/` (it is still synced into the root copies by the build), and generating the usage blocks from the CLI's `--help`.
- Unverified in a live Claude Code session: that the `Bash(node */scripts/wayfinding-audit.mjs *)` rule suppresses the permission prompt for the plugin-root path.

## [0.1.4] - 2026-10-18

Audit round: plugin security scan (SAFE TO USE), skill-doctor checkup, full dyslexia and dyscalculia content checks, n8n and Ollama sample runs on the homelab. Reports under audits/.

### Fixed
- samples/n8n-landmark-lookup-workflow.json: Webhook now accepts POST and responds through the Respond node (it only accepted GET and answered before the card was built); the scorer honours the requested radius instead of a hard-coded 120 m; explicit Accept and User-Agent headers (overpass-api.de answered 406 without them); the fetch walks the three allowlisted mirrors in order and returns `fetch: "NOT RUN"` with the query text when all fail.
- samples/ollama-rewrite-directions-prompt.md and samples/codex-rewrite-directions.md: paths updated from the old examples/ layout to samples/rewrite_directions.py and bin/wayfinding-audit.ts.

### Known (from this round, not yet fixed)
- French and Spanish text carries no accents anywhere (READMEs, skills, commands, templates, rewriter phrases). Dyslexia gate FAIL for those locales; English unaffected.
- The commands' CLI path resolves against the user's project, so a marketplace install always reports NOT RUN until the CLI is bundled and referenced through the plugin root (skill-doctor critical).

## [0.1.3] - 2026-10-18

### Added
- `fetchOverpassRaw` in lib/overpass.ts and a `--raw` flag on the CLI `landmarks` subcommand, so a real mirror response can be captured as a fixture under the same allowlist, timeout and size cap.
- tests/fixtures/overpass-fairfax-38.861_-77.362-r200.json, a captured response, and a library test that parses it (ids, finite coordinates, sanitised names, way centres).

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
