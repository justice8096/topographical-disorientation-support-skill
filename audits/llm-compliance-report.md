# LLM Compliance and Transparency Report

## topographical-disorientation-support-skill v0.1.3 (second cycle)

Date: 2026-10-18
Commit: 5964921 (previous cycle 1f4f06f, 90/100)
Auditor: Claude (post-commit-audit skill), reviewed by Justice

## Executive Summary

The project is an accessibility skill: knowledge documents, a deterministic library, and command prompts that help people with developmental topographical disorientation (DTD). It does not train models, does not collect user data, and does not make decisions about people. Its model-facing surface is prompt text and tool schemas; its risk profile is prompt injection through pasted directions and untrusted map data, both addressed.

Overall score: 94/100 (EXCELLENT), up from 90.

| Dimension | Cycle 1 | Cycle 2 | Change |
|---|---|---|---|
| 1 Transparency | 95 | 96 | +1: SECURITY.md now says where the controls run and what is model-only |
| 2 Training data | 95 | 95 | none |
| 3 Risk classification | 90 | 95 | +5: driving-use statement added to README |
| 4 Supply chain | 92 | 96 | +4: SBOM drift enforced in CI, Node 24 in matrix |
| 5 Consent | 90 | 94 | +4: relatives' consent note in README and document-generation skill |
| 6 Sensitive data | 88 | 93 | +5: Overpass location-disclosure note and --offline pointer in README |
| 7 Incident response | 85 | 93 | +8: allowlist rotation procedure, [security] CHANGELOG convention, scan report and SARIF committed |
| 8 Bias | 85 | 88 | +3: name:fr / name:es tags requested; landmark-category weights still Western-urban |

## 8 Compliance Dimensions

### Dimension 1: System Transparency (95/100)
README in three languages explains what the skill does, what it does not do (no diagnosis, no promise of training benefit), and which model-facing components exist. Every recommendation carries an evidence grade (A to F) and the research note is shipped in `docs/research/`. The caveat paragraph in every generated document states the absence of statutory recognition. Deduction: the Google Maps landmark-direction claim relies on press coverage, not primary documentation.

### Dimension 2: Training Data Disclosure (95/100)
No model is trained. The lexicons, phrase tables and category weights are hand-written and documented; the salience weights are labelled as a starting point rather than Graser's expert rankings. Research sources are cited with links. Deduction: the Burles 2020 figures were extracted from a secondary fetch of the publisher page rather than the PDF.

### Dimension 3: Risk Classification (90/100)
Not a high-risk use under the EU AI Act taxonomy; it is an accessibility aid that produces text a person reads. The highest-consequence failure (a route card that reintroduces a direction word) is guarded by a deterministic check with a non-zero exit code. The condition's Grade C profiles are labelled so that no clinician or employer mistakes family-reported traits for established findings. Resolved: README states it is not a driving aid and must not be the sole guidance where a wrong turn is dangerous. Remaining deduction: the Grade C profiles are only labelled in output, not gated by a confirmation step.

### Dimension 4: Supply Chain Security (92/100)
Dev-only dependencies, lockfile, SHA-pinned actions, npm audit clean, SBOM present. Resolved: CI regenerates and diffs the SBOM. Remaining deduction: SLSA stays at Build L1 (no signed provenance).

### Dimension 5: Consent and Authorization (90/100)
The library has no accounts, no telemetry and one allowlisted egress. Documents that touch personal circumstances (functional impact, family history) are generated only from text the user supplies and never include identification numbers or addresses. Resolved: README and the document-generation skill say relatives' information is theirs to disclose. Remaining deduction: the reminder is prose, not a required field in the template.

### Dimension 6: Sensitive Data Handling (88/100)
Health-adjacent content (a neurodevelopmental condition, family pedigree) is handled as user-supplied text and never stored by the tool. Placeholders are used for identifiers. The Overpass query carries only coordinates, which can reveal a location of interest to the public mirror; README now says so and points at `--offline`. Remaining deduction: the fixture checked into tests/fixtures/ is a real extract around a public shopping centre, chosen so it reveals nothing personal, but the choice is not documented in the file itself.

### Dimension 7: Incident Response (85/100)
SECURITY.md names GitHub private vulnerability reporting and a real contact address, lists controls and accepted risks, and promises a 48-hour acknowledgment. Resolved: SECURITY.md has the rotation procedure and CHANGELOG uses `[security]` tags; the Claude Security report and SARIF are committed under audits/ and every finding maps to a fix commit. Remaining deduction: no signed releases.

### Dimension 8: Bias Assessment (85/100)
Locale parity: English, French and Spanish lexicons, cue patterns, templates and READMEs ship together; terminology for each language was checked against research usage. Category weights favour Western urban landmarks (churches, fuel stations) and will under-serve other environments; this is documented as tunable. The clinical sample behind the evidence base skews female (5.2 to 1 in Burles 2020) and European and North American; the skill does not generalise beyond what the sources support. Resolved in part: `name:fr` / `name:es` tags are requested. Remaining deduction for the landmark-category bias, which is documented as tunable but has not been reviewed against Graser's published rankings.

## Report Footer
Scores are the auditor's judgment against the post-commit-audit rubric. Items to raise on re-audit: salience weight review against Graser 2016, signed provenance for releases, a comment in the fixture file on why that location was chosen, wiring the generated MCP server handlers to lib.
