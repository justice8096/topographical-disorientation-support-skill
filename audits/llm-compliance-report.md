# LLM Compliance and Transparency Report

## topographical-disorientation-support-skill v0.1.0

Date: 2026-10-17
Commit: see AUDIT_SUMMARY.txt
Auditor: Claude (post-commit-audit skill), reviewed by Justice

## Executive Summary

The project is an accessibility skill: knowledge documents, a deterministic library, and command prompts that help people with developmental topographical disorientation (DTD). It does not train models, does not collect user data, and does not make decisions about people. Its model-facing surface is prompt text and tool schemas; its risk profile is prompt injection through pasted directions and untrusted map data, both addressed.

Overall score: 90/100 (EXCELLENT). First audit; no delta table.

## 8 Compliance Dimensions

### Dimension 1: System Transparency (95/100)
README in three languages explains what the skill does, what it does not do (no diagnosis, no promise of training benefit), and which model-facing components exist. Every recommendation carries an evidence grade (A to F) and the research note is shipped in `docs/research/`. The caveat paragraph in every generated document states the absence of statutory recognition. Deduction: the Google Maps landmark-direction claim relies on press coverage, not primary documentation.

### Dimension 2: Training Data Disclosure (95/100)
No model is trained. The lexicons, phrase tables and category weights are hand-written and documented; the salience weights are labelled as a starting point rather than Graser's expert rankings. Research sources are cited with links. Deduction: the Burles 2020 figures were extracted from a secondary fetch of the publisher page rather than the PDF.

### Dimension 3: Risk Classification (90/100)
Not a high-risk use under the EU AI Act taxonomy; it is an accessibility aid that produces text a person reads. The highest-consequence failure (a route card that reintroduces a direction word) is guarded by a deterministic check with a non-zero exit code. The condition's Grade C profiles are labelled so that no clinician or employer mistakes family-reported traits for established findings. Deduction: no explicit statement about use in safety-critical navigation (driving); add to README in 0.2.0.

### Dimension 4: Supply Chain Security (92/100)
Dev-only dependencies, lockfile, SHA-pinned actions, npm audit clean, SBOM present. Deduction: SBOM drift is not enforced in CI (LOW-SC-1).

### Dimension 5: Consent and Authorization (90/100)
The library has no accounts, no telemetry and one allowlisted egress. Documents that touch personal circumstances (functional impact, family history) are generated only from text the user supplies and never include identification numbers or addresses. Deduction: the family-history paragraph should remind the user that relatives' information is theirs to disclose; add to the document-generation skill.

### Dimension 6: Sensitive Data Handling (88/100)
Health-adjacent content (a neurodevelopmental condition, family pedigree) is handled as user-supplied text and never stored by the tool. Placeholders are used for identifiers. The Overpass query carries only coordinates, which can reveal a location of interest to the public mirror; README notes should say so. Deduction for that missing note.

### Dimension 7: Incident Response (85/100)
SECURITY.md names GitHub private vulnerability reporting and a real contact address, lists controls and accepted risks, and promises a 48-hour acknowledgment. Deduction: no written process for rotating the Overpass allowlist if a mirror is compromised, and no CHANGELOG convention yet for security releases.

### Dimension 8: Bias Assessment (85/100)
Locale parity: English, French and Spanish lexicons, cue patterns, templates and READMEs ship together; terminology for each language was checked against research usage. Category weights favour Western urban landmarks (churches, fuel stations) and will under-serve other environments; this is documented as tunable. The clinical sample behind the evidence base skews female (5.2 to 1 in Burles 2020) and European and North American; the skill does not generalise beyond what the sources support. Deduction for the landmark-category bias and for the absence of `name:fr` / `name:es` tag requests in this version.

## Report Footer
Scores are the auditor's judgment against the post-commit-audit rubric. Items to raise on re-audit: driving-use statement, Overpass location-disclosure note, relatives' consent note, SBOM drift check, allowlist rotation procedure, localized name tags.
