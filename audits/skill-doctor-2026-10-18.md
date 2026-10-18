# Skill Health Report - topographical-disorientation-support-skill v0.1.3 (ec4a4e8)

Run 2026-10-18 with skill-doctor (checkup mode) on a fresh clone. The reviewer agent could not reach the Claude Code docs from the scan container, so the points about `${CLAUDE_PLUGIN_ROOT}`, description length limits and allowed-tools matching come from its training and must be confirmed against code.claude.com/docs before acting. skill-creator format validation was not available and was skipped.

| Skill | Location | Score | Top Issue |
|-------|----------|-------|-----------|
| dtd-standards-compliance | plugin | Warning | description over 1,000 characters with inline citations; date-sensitive legal claims (A.J.T. v. Osseo 2025, WCAG Title II dates) carry no verification date |
| wayfinding-prosthetics | plugin | Warning | description over 1,000 characters; French and Spanish output phrases in the skill body are written without accents |
| dtd-document-generation | plugin | Warning | description is the longest in the set; `templates/route-card-template.md` is a bare relative path that will not resolve from a user project; FR/ES caveat text lacks accents |
| dtd-gap-analysis | plugin | Warning | Google Maps landmark-directions claim stated as settled fact without attribution or date; audit checklist duplicates wayfinding-content-check and wayfinding-prosthetics section 1 |
| commands (group of six) | plugin | Critical | the deterministic path does not work after a marketplace install (see below) |

**Summary:** 4 skills and 6 commands examined. 0 healthy, 4 warnings, 1 critical group.

## The critical finding, and what it means

Every Bash-using command invokes `tooling/node_modules/.bin/tsx bin/wayfinding-audit.ts`. Both halves of that path resolve against the user's project directory, not the plugin directory, and `node_modules/` is gitignored, so a plugin installed from the marketplace into any project other than this repository has no tsx and no `bin/` at that path. Every Step 0 then prints NOT RUN, which is honest but means the 0.1.2 security fixes (F2, F3) only hold when the user runs the commands from inside the repository checkout after `cd tooling && npm ci`. That is the documented setup today, so this is a packaging gap rather than a regression, but it is the gap between "works in the author's checkout" and "works as a plugin".

A second issue sits on the same path: `rewrite`, `refs` and `check` take `<file>`, while the command usage blocks accept quoted text. Write is not granted, so the model cannot create the file, and free text would otherwise land on a shell command line.

## Top Recommendations

1. Ship the CLI as a dependency-free bundle. Build `bin/wayfinding-audit.js` with esbuild at release time (lib/ has no runtime dependencies, so the bundle is small), reference it as `node ${CLAUDE_PLUGIN_ROOT}/bin/wayfinding-audit.js` in both the command bodies and the allowed-tools rules, add a `--stdin` input mode so user text never touches the shell line, and narrow each allowed-tools rule to one subcommand. Acceptance test: install from a marketplace clone into an empty project and run each command once; NOT RUN on that test is a build failure. Confirm `${CLAUDE_PLUGIN_ROOT}` substitution in allowed-tools against the docs first.
2. Fix frontmatter at the source and stop flag drift. Put frontmatter in `source/commands/*.md` so every generator emits it (today only the root copies get it, via syncRootCanonical), add `argument-hint` and an explicit `$ARGUMENTS` reference to each command, and generate the usage blocks from the CLI's `--help` so the documented flags (`--radius-m`, `--offline`, `--viewpoint-shift-profile`) match the real ones (`--radius`, `query`, `--viewpoint-shift`). landmark-route-script grants Bash but never calls the CLI while claiming deterministic salience scoring; add the call or drop the claim.
3. Shorten the four descriptions to about 330 characters each (proposed texts below), move citations, the remediation-evidence section and the date-sensitive legal claims into `references/` with a last-verified date, and write the French and Spanish output phrases with proper accents in the source files. Accent folding is correct for matching; it is wrong for text a native reader or a screen reader will consume.

## Proposed descriptions

- dtd-standards-compliance: "Clinical and legal framing for developmental topographical disorientation (DTD, atopia) with evidence grades: what it is, screening instruments, the lack of a DTD-specific ICD-11 or DSM-5-TR code, and accommodation framing in the US, France, and Spain. Use for getting lost, left-right confusion, or whether DTD counts as a disability."
- wayfinding-prosthetics: "Wayfinding support for DTD: rewrite directions into landmark form with no left, right, or compass words, build landmark route scripts, apply heading-up map rules, and write stress-mode cards. Use when someone with topographical disorientation or getting lost needs landmark directions in English, French, or Spanish."
- dtd-document-generation: "Drafts accommodation documents for DTD: ADA Title I or Section 504 letters, French MDPH and RQTH support, Spanish ajustes razonables requests, clinical summary letters, and site orientation sheets. Each draft carries the no-statutory-recognition caveat. Use when someone with DTD needs an accommodation request or letter."
- dtd-gap-analysis: "Gap analysis for DTD across navigation apps, clinical practice, workplaces, and public spaces: direction-word-only guidance, north-up maps, signs without facing information, missing codes and statutory recognition, and routing engines that emit no landmarks. Use for audits, product reviews, or research gaps."

## Overlap

Three pairs share the legal framing (standards vs document-generation, standards vs gap-analysis, document-generation vs gap-analysis: DTD, statutory recognition, ADA/504/MDPH/RQTH/RDL 1/2013). The fix is ownership, not merging: dtd-standards-compliance owns the "no code, no statute, framing by analogy" statement and the other two cite it. document-generation vs wayfinding-prosthetics share the route card (one specifies, one produces); low risk.

## Mechanism notes

Hooks are the wrong tool for Step 0 (they fire on lifecycle events, not per analysis). A `!` dynamic-injection line in the command body would have the harness insert the checker output, or its error, before the model reasons, which is stronger than a self-reported NOT RUN label; whether allowed-tools governs `!` lines needs confirming in the docs. Keep the untrusted-content block wrapping regardless, since checker excerpts still carry third-party text. The skills themselves are knowledge skills and need no hook or script; name and description are sufficient frontmatter for them.

## Format Validation
Skipped (skill-creator not installed in the scan container).

Run `/skill-doctor:treat` to apply these fixes.
