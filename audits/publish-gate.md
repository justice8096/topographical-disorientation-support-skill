# Publish gate: topographical-disorientation-support-skill

Run 2026-10-17 19:25. Overall: FAIL. HEAD: 1f4f06fb53b0.

Read it top down. [FAIL] blocks the flip to public. [warn] is a decision for the owner.

## Summary

- [warn] gate: gate-check (skill or plugin: all nine checks): WARN.
- [ok]   license: CC0-1.0 (permissive); 0 Python and 0 npm dependencies surveyed.
- [ok]   supply: no manifests, workflows or pins to check.
- [ok]   cwe: 15 source file(s), 0 dangerous call(s).
- [FAIL] audit: audits/AUDIT_SUMMARY.txt missing.
- [warn] git: 64 tracked file(s), head 1f4f06fb53b0.
- [warn] docs: 2 note(s).

## gate

- [ok] structure: 4 SKILL.md file(s) checked.
- [ok] secrets: 0 suspicious line(s).
- [ok] endings: 0 file(s) with CRLF.
- [ok] ascii: 0 line(s) with em-dashes or smart quotes.
- [warn] dyslexia: 38 prose file(s) measured, 129 note(s).
-     WARN CHANGELOG.md: sentence over 35 words: "[security] : ReDoS resistance, input size limits, Overpass QL injectio..."
-     WARN commands\area-landmarks.md: sentence over 35 words: "Builds a safe Overpass query for named landmark features around a poin..."
-     WARN commands\area-landmarks.md: 7 of 25 sentences are passive
-     WARN commands\landmark-route-script.md: sentence over 35 words: "**Chooses the top landmark per decision point** and writes the step as..."
-     WARN commands\landmark-route-script.md: sentence over 35 words: "**Adds an off-route landmark** for each turn where one is available (a..."
-     WARN commands\place-references.md: sentence over 35 words: "**Recommends a resolver for city-scale toponyms**: for place names tha..."
-     WARN commands\rewrite-directions.md: sentence over 35 words: "Rewrite a set of directions for a person with developmental topographi..."
-     WARN commands\rewrite-directions.md: sentence over 35 words: "If a landmark is supplied for the step (by position in , or by step nu..."
- [warn] dyscalculia: 23 note(s).
-     WARN CHANGELOG.md: ratio in prose: "Two templates: landmark route card (en/fr/es in one file) and accommod" (say the count, or draw the gap)
-     WARN commands\dtd-accommodation-request.md: ratio in prose: "**es / workplace**: solicitud de ajustes razonables under Real Decreto" (say the count, or draw the gap)
-     WARN commands\dtd-accommodation-request.md: ratio in prose: "40 (and Orden PJC/804/2025 for public-employment selection)" (say the count, or draw the gap)
-     WARN docs\research\research-foundation-2026-10-17.md: ratio in prose: "Popular sources repeat "1 to 2 percent" or "1 in 30"" (say the count, or draw the gap)
-     WARN docs\research\research-foundation-2026-10-17.md: ratio in prose: "In Spain, the same: Ley General de Discapacidad 1/2013 with a certific" (say the count, or draw the gap)
-     WARN README.es.md: ratio in prose: "**Documentos de ajustes**: solicitud de ajustes razonables (Real Decre" (say the count, or draw the gap)
-     WARN README.md: ratio in prose: "**Accommodation documents** for the US (ADA Title I, Section 504), Fra" (say the count, or draw the gap)
-     WARN skills\dtd-document-generation\SKILL.md: ratio in prose: "No tiene reconocimiento legal especifico; esta solicitud se formula po" (say the count, or draw the gap)
- [ok] samples: all four runtimes present.
- [warn] audits: no audits/AUDIT_SUMMARY.txt; run post-commit-audit.
- [ok] tests: 1 of 1 test file(s) pass.
-     PASS test_rewrite_directions.py: 

## license

- LICENSE: CC0-1.0 (permissive).

## audit

- Run the post-commit-audit skill (run-audit-suite.sh) on this repo and commit the audits/ folder.

## git

- working tree has 14 uncommitted change(s) outside audits/; the hook requires a clean tree.
- internal hostnames or private addresses in history (1 line(s)): 10.0.0.1
- commit emails approved as public: justice8096@gmail.com

## docs

- no version tag; tag v0.1.0 when it goes out.
- no origin remote yet; gh repo create <name> --private --source . --push, then the gate again, then flip.

## Next step

- fix audit: Run the post-commit-audit skill (run-audit-suite.sh) on this repo and commit the audits/ folder.
