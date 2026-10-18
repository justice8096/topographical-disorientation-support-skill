# Accessibility gates: dyslexia and dyscalculia content checks

Project: topographical-disorientation-support-skill v0.1.3 (ec4a4e8)
Date: 2026-10-18
Checks: dyslexia-support-skill /content-accessibility-check (locales us, fr, es) and dyscalculia-support-skill /content-accessibility-check (locales us, fr, es), applied to the user-facing prose: README.md, README.fr.md, README.es.md, the four SKILL.md files, the six command files and the two templates. Measurements were taken with a script over the prose only (code blocks, tables, headings and inline code excluded). The earlier gate-check pass (publish gate, WARN) covered the same files with lighter rules; this is the full check.

Result: dyslexia WARN (one locale failure that must be fixed before any French or Spanish user sees the text), dyscalculia PASS with notes. Neither blocks release in English.

## Dyslexia check

Typography, layout, navigation controls and media do not apply: the output is Markdown rendered by the reader's own tool. The domains that do apply are content structure and, for French and Spanish, orthography.

### Measurements

| File | Sentences | Avg words | Over 25 words | Over 35 words | Paragraphs over 5 sentences | Passive sentences | FK grade |
|---|---|---|---|---|---|---|---|
| README.md | 33 | 18.5 | 10 | 4 | 2 | 5 | 12.7 |
| README.fr.md | 25 | 25.2 | 12 | 7 | 1 | 0 | n/a |
| README.es.md | 26 | 25.3 | 11 | 5 | 1 | 0 | n/a |
| dtd-standards-compliance | 108 | 17.6 | 21 | 13 | 9 | 14 | 13.9 |
| wayfinding-prosthetics | 70 | 19.2 | 17 | 10 | 4 | 10 | 11.6 |
| dtd-document-generation | 54 | 25.0 | 19 | 10 | 5 | 3 | 17.1 |
| dtd-gap-analysis | 74 | 14.1 | 6 | 4 | 4 | 4 | 11.5 |
| six commands (range) | 19 to 42 | 13.0 to 16.6 | 1 to 7 | 0 to 3 | 1 to 2 | 1 to 8 | 7.8 to 13.0 |
| route-card-template | 53 | 8.3 | 0 | 0 | 6 | 0 | 6.8 |
| accommodation-request-template | 85 | 12.3 | 9 | 2 | 7 | 3 | 11.9 |

Some "sentences" over 35 words are trigger lists written as one line (the three longest, at 92 to 100 words, are the "Trigger this skill when" lists), which a reader sees as bullets. Excluding those, the long sentences that matter are: the opening sentence of README.fr.md (59 words) and README.es.md (62 words), two semicolon-chained template outlines in dtd-document-generation (70 and 73 words), and the Burles 2020 and van der Ham 2025 evidence sentences in dtd-standards-compliance (56 and 59 words).

### Domain scores

| Domain | Score | Finding |
|---|---|---|
| Typography and layout | n/a | Markdown; the reader's renderer decides. The route card template is the one artefact meant to be printed and it already says to print at 14pt or larger, left aligned, one step per line. |
| Content structure (English) | Partial | Commands and templates are good (average 8 to 17 words, grade 7 to 13). The four skills are reference documents and read like one: grade 11.5 to 17.1, 6 to 21 sentences over 25 words each, up to 9 paragraphs over 5 sentences in dtd-standards-compliance. The skills are consumed by the model, not by the person, so the bar is lower, but the sections the model is told to quote into letters (document-generation section 0 caveats, standards section 5 legal framing) should be short. |
| Content structure (French, Spanish) | Partial | Averages of 25 words per sentence and 11 to 12 sentences over 25 words in each README; both opening sentences are over 55 words. Same content as the English README but written denser. |
| Orthography (French) | Fail | Zero accented characters in README.fr.md (629 words) and in every French passage of the skills, commands and templates: "desorientation", "amenagement", "repere", "reecriture", "developpementale". French without accents is harder to decode for every reader and is wrong for a dyslexic one, who relies on the accent to disambiguate (a / à, ou / où, des / dès) and to segment syllables. Screen readers mispronounce unaccented French. |
| Orthography (Spanish) | Fail | Zero accented characters in README.es.md (658 words) and in every Spanish passage: "desorientacion", "topografica", "tambien", "indicacion". Spanish dyslexia is a fluency deficit and the tilde carries stress, so its absence slows reading directly; it also changes meaning (esta / está, si / sí, mas / más). |
| Navigation | Pass | Every file has a heading hierarchy, the skills are numbered by section, every command has Usage, Output Format and Related sections, and the READMEs cross-link. |
| Consistent terminology | Pass | "DTD", "atopia", "landmark relation", "orientation anchor", "stress mode" and the three locale names are used the same way across all 15 files. |
| Plain language and active voice | Partial | Passive sentences are 13 percent of dtd-standards-compliance and 14 percent of wayfinding-prosthetics, mostly in evidence summaries ("was found", "were reported"). Commands and templates are almost entirely active. |

### Why the accents are missing

The repository's ASCII gate forbids em-dashes and smart quotes, not accented letters, and the content checker folds accents only for matching. The French and Spanish text was written without accents from the start, which skill-doctor also flagged on the same day. This is the one finding that must be fixed before the French or Spanish surfaces are offered to anyone: restore accents in source/ (skills, commands, templates, READMEs) and in the lexicon output strings in lib/instruction-rewriter.ts, leave the folded forms for matching, and add a test that French and Spanish output phrases contain at least one accented character where the correct spelling has one.

### Recommendations

1. Restore French and Spanish accents everywhere a person will read the text (source/, templates/, README.fr.md, README.es.md, rewriter phrase tables). Verify with the dyslexia check again; the accented-word count must be non-zero.
2. Split the two README opening sentences (59 and 62 words) into three sentences each, and the two template-outline sentences in dtd-document-generation into lists.
3. In dtd-standards-compliance, move the evidence sentences with inline statistics (Burles 2020, van der Ham 2020 and 2025) into a references file and leave one plain sentence per finding in the skill. This also serves the skill-doctor recommendation to shorten the skill.

## Dyscalculia check

Format: tool (a plugin whose prose and templates a person reads). Audience: adult. Depth: standard. Most of the fifteen dimensions address math instruction and do not apply (CRA, number sense, multisensory, manipulatives, progress monitoring, data visualisation: there are no charts). The dimensions that apply are scored below.

| Dimension | Score | Status | Finding |
|---|---|---|---|
| Visual accessibility | n/a | | Markdown. The route card template specifies one step per line and no numbering dependence. |
| Accommodation and scaffolding | 3 | Pass | Route cards externalise every step; stress-mode cards cut each step to one line; the orientation anchor sentence removes the need to compute a heading; body anchors replace left and right with a worn object. |
| Math anxiety | 3 | Pass | Stress mode exists precisely because the user's own simulation cuts out under stress; cards are untimed and carry no step counts the reader must track. |
| Equity and inclusion | 3 | Pass | DTD framed as a neurodevelopmental difference, family-reported traits labelled Grade C, three locales shipped together, no deficit language. |
| Comorbidity support | 2 | Pass | Dyslexia and dyscalculia comorbidity are named in the standards skill; the route card avoids reliance on numerals. Spatial deficits are the subject itself. ADHD and dysgraphia are not mentioned (not in scope). |
| Number-to-word alternatives | 2 | Concern | Distances are always numeric with a unit ("200 m", "120 m", "60 m") but the rewriter already substitutes landmarks for distances where one exists, and the route card says "about N steps" is preferred over metres. Statistics in the standards skill mostly carry a plain gloss ("roughly doubled correct turn recall"), but "14.6 percent" and "42.9 percent" (van der Ham 2020) and "odds ratio 2.91" have none. |
| Rounding and decimals | 2 | Concern | Coordinates (38.861, -77.362) and salience weights (0.3, 0.6) are decimals by nature and are parameters for the model, not text for the reader. Test-result decimals in the skills (25.7, 44.8, 48.6, 29.5, 49.5) could be rounded in prose. Five-digit numbers are Cerfa form identifiers (12102, 15695) and must not be chunked. |
| Percentage and ratio alternatives | 2 | Concern | "1/2013" (Real Decreto Legislativo 1/2013) appears 12 times and reads as a ratio; it is a statute citation and cannot be rewritten, but the first occurrence in each file could be written "Real Decreto Legislativo 1 de 2013 (RDL 1/2013)". "Bayes factor on the order of 10 to the 23" and "p on the order of 10 to the minus 59" are already in words. "about 2.4 to 1" has no frequency framing. |
| Cognitive processing accommodation | 3 | Pass | The whole skill is a bypass design: the thesis (prosthetics over remediation, remediation thin and labelled low-evidence) matches the Butterworth-style persistent-deficit model this dimension asks for; supports are permanent features, not faded scaffolds. |
| French number words 60 to 99 | n/a | | No French number words appear; all quantities are digits. |

Composite over the nine applicable dimensions: 20 of 27 (74 percent). PASS.

### Recommendations

1. Add a natural-frequency gloss to the two general-population percentages ("14.6 percent, about 1 in 7" and "42.9 percent, about 4 in 10") and to the odds ratio ("about three times the odds").
2. Write the first RDL 1/2013 citation in each file as "Real Decreto Legislativo 1 de 2013 (RDL 1/2013)" so the fraction shape is explained once.
3. Round the driving-simulator percentages in wayfinding-prosthetics to whole numbers in prose (26 to 45 percent, 49 percent; 30 to 50 percent); the exact figures stay in the research note.

## Gate verdict

Dyslexia: WARN for English (long sentences and passive voice in the four skills, advisory), FAIL for French and Spanish orthography (accents absent). Dyscalculia: PASS, three advisory notes. Release of the English surface is not blocked; the French and Spanish surfaces should not be promoted until the accents are restored.
