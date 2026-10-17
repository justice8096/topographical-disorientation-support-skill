# Publish gate: topographical-disorientation-support-skill

Run 2026-10-17 19:31. Overall: WARN. HEAD: c6b9cbf13d33.

Read it top down. [FAIL] blocks the flip to public. [warn] is a decision for the owner.

## Summary

- [warn] gate: gate-check (skill or plugin: all nine checks): WARN.
- [ok]   license: CC0-1.0 (permissive); 0 Python and 0 npm dependencies surveyed.
- [ok]   supply: no manifests, workflows or pins to check.
- [ok]   cwe: 15 source file(s), 0 dangerous call(s).
- [warn] audit: post-commit-audit summary: PASS (commit 1f4f06f).
- [warn] git: 73 tracked file(s), head c6b9cbf13d33.
- [ok]   docs: 3 note(s).

## gate

- [ok] structure: 4 SKILL.md file(s) checked.
- [ok] secrets: 0 suspicious line(s).
- [ok] endings: 0 file(s) with CRLF.
- [ok] ascii: 0 line(s) with em-dashes or smart quotes.
- [warn] dyslexia: 37 prose file(s) measured, 129 note(s).
-     WARN CHANGELOG.md: sentence over 35 words: "[security] : ReDoS resistance, input size limits, Overpass QL injectio..."
-     WARN commands\area-landmarks.md: sentence over 35 words: "Builds a safe Overpass query for named landmark features around a poin..."
-     WARN commands\area-landmarks.md: 7 of 25 sentences are passive
-     WARN commands\landmark-route-script.md: sentence over 35 words: "**Chooses the top landmark per decision point** and writes the step as..."
-     WARN commands\landmark-route-script.md: sentence over 35 words: "**Adds an off-route landmark** for each turn where one is available (a..."
-     WARN commands\place-references.md: sentence over 35 words: "**Recommends a resolver for city-scale toponyms**: for place names tha..."
-     WARN commands\rewrite-directions.md: sentence over 35 words: "Rewrite a set of directions for a person with developmental topographi..."
-     WARN commands\rewrite-directions.md: sentence over 35 words: "If a landmark is supplied for the step (by position in , or by step nu..."
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
- [ok] tests: 1 of 1 test file(s) pass.
-     PASS test_rewrite_directions.py: 

## license

- LICENSE: CC0-1.0 (permissive).

## audit

- audit ran at commit 1f4f06f; HEAD is c6b9cbf13d33. Re-run post-commit-audit after the last change.

## git

- internal hostnames or private addresses in history (3 line(s)): 10.0.0.1
- commit emails approved as public: justice8096@gmail.com

## docs

- latest tag v0.1.0.
- origin https://github.com/justice8096/topographical-disorientation-support-skill.git
- GitHub says the repo is PRIVATE.

## Next step

- read the warn notes (gate, audit, git), commit, tag v0.1.0, then gh repo edit --visibility public --accept-visibility-change-consequences.
