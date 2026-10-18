# Publish gate: topographical-disorientation-support-skill

Run 2026-10-18 05:24. Overall: WARN. HEAD: 5964921ce7e3.

Read it top down. [FAIL] blocks the flip to public. [warn] is a decision for the owner.

## Summary

- [warn] gate: gate-check (skill or plugin: all nine checks): WARN.
- [ok]   license: CC0-1.0 (permissive); 0 Python and 0 npm dependencies surveyed.
- [ok]   supply: no manifests, workflows or pins to check.
- [ok]   cwe: 16 source file(s), 0 dangerous call(s).
- [ok]   audit: post-commit-audit summary: PASS (commit 5964921).
- [warn] git: 78 tracked file(s), head 5964921ce7e3.
- [warn] docs: 4 note(s).

## gate

- [ok] structure: 4 SKILL.md file(s) checked.
- [ok] secrets: 0 suspicious line(s).
- [ok] endings: 0 file(s) with CRLF.
- [ok] ascii: 0 line(s) with em-dashes or smart quotes.
- [warn] dyslexia: 37 prose file(s) measured, 121 note(s).
-     WARN CHANGELOG.md: average sentence is 21 words (limit 20)
-     WARN CHANGELOG.md: sentence over 35 words: "[security] F2, F3: commands now run the repository CLI (, new) before ..."
-     WARN CHANGELOG.md: sentence over 35 words: "[security] : ReDoS resistance, input size limits, Overpass QL injectio..."
-     WARN commands\rewrite-directions.md: sentence over 35 words: "Rewrite a set of directions for a person with developmental topographi..."
-     WARN commands\rewrite-directions.md: sentence over 35 words: ": "Gira hacia X." / "Manten X del lado de tu <ancla>." / "Estas mirand..."
-     WARN commands\wayfinding-content-check.md: sentence over 35 words: "Scoring: A no errors and no warnings; B warnings only; C one to three ..."
-     WARN docs\research\research-foundation-2026-10-17.md: sentence over 35 words: "This note is the equivalent of the "research update" notes the other t..."
-     WARN docs\research\research-foundation-2026-10-17.md: sentence over 35 words: "Evidence grades used below: A = replicated group studies or systematic..."
- [warn] dyscalculia: 24 note(s).
-     WARN CHANGELOG.md: ratio in prose: "Two templates: landmark route card (en/fr/es in one file) and accommod" (say the count, or draw the gap)
-     WARN CHANGELOG.md: ratio in prose: "[security] First post-commit audit in audits/ (SAST/DAST PASS, supply " (say the count, or draw the gap)
-     WARN commands\dtd-accommodation-request.md: ratio in prose: "**es / workplace**: solicitud de ajustes razonables under Real Decreto" (say the count, or draw the gap)
-     WARN commands\dtd-accommodation-request.md: ratio in prose: "40 (and Orden PJC/804/2025 for public-employment selection)" (say the count, or draw the gap)
-     WARN docs\research\research-foundation-2026-10-17.md: ratio in prose: "Popular sources repeat "1 to 2 percent" or "1 in 30"" (say the count, or draw the gap)
-     WARN docs\research\research-foundation-2026-10-17.md: ratio in prose: "In Spain, the same: Ley General de Discapacidad 1/2013 with a certific" (say the count, or draw the gap)
-     WARN README.es.md: ratio in prose: "**Documentos de ajustes**: solicitud de ajustes razonables (Real Decre" (say the count, or draw the gap)
-     WARN README.md: ratio in prose: "**Accommodation documents** for the US (ADA Title I, Section 504), Fra" (say the count, or draw the gap)
- [ok] samples: all four runtimes present.
- [ok] audits: post-commit-audit summary says PASS.
- [ok] tests: 1 test file(s) present (not run; add --run-tests).

## license

- LICENSE: CC0-1.0 (permissive).

## git

- working tree has 1 uncommitted change(s) outside audits/; the hook requires a clean tree.
- internal hostnames or private addresses in history (6 line(s)): 10.0.0.1
- commit emails approved as public: justice8096@gmail.com

## docs

- latest tag v0.1.3.
- origin https://github.com/justice8096/topographical-disorientation-support-skill.git
- GitHub says the repo is PUBLIC.
- already public: the gate is now a cleanup list, not a lock.

## Next step

- read the warn notes (gate, git, docs), commit, tag v0.1.0, then gh repo edit --visibility public --accept-visibility-change-consequences.
