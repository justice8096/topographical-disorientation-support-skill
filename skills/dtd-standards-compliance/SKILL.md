---
name: dtd-standards-compliance
description: Clinical and legal framing for developmental topographical disorientation (DTD, atopia) with evidence grades: what it is, screening instruments, the lack of a DTD-specific ICD-11 or DSM-5-TR code, and accommodation framing in the US, France, and Spain. Use for getting lost, left-right confusion, or whether DTD counts as a disability.
---
# DTD Standards and Clinical Framing Skill

## Purpose
Give every other component of this plugin a single, honest statement of what developmental topographical disorientation (DTD) is, how strong the evidence is for each claim, and how the condition maps onto the legal frameworks of the United States, France, and Spain. Nothing in this skill invents a compliance checklist where the law is silent. Where the law is silent, the skill says so and frames the accommodation by analogy.

> **Evidence grades used throughout this plugin.** A = replicated group studies or a systematic review. B = one large study or a well-designed small study. C = case reports, expert opinion, or extrapolation from an adjacent literature. F = family report only (the maintainer's own pedigree), to be labelled as such wherever it appears. Every recommendation in this plugin carries one of these letters. If a user asks for a recommendation without a grade, add the grade.

## When to Use
Trigger this skill when the user mentions:
- "developmental topographical disorientation", "DTD", "atopia", "topographical disorientation"
- "desorientation topographique developpementale", "desorientacion topografica del desarrollo", "disorientamento topografico evolutivo"
- "no sense of direction", "always getting lost", "can't read a map", "can't tell left from right", "left-right confusion"
- "gettinglost", "Getting Lost Questionnaire", "Santa Barbara Sense of Direction", "Wayfinding Questionnaire"
- "is this a disability", "accommodation for getting lost", "ADA" together with navigation, "MDPH" or "RQTH" together with orientation, "certificado de discapacidad" together with orientacion
- any request to cite the research on DTD or to grade the evidence for a navigation accommodation

## 0. Definition and naming

DTD is a lifelong, selective inability to orient in the environment, present from childhood, in the absence of acquired brain injury, neurological disease, or general cognitive impairment. The single most discriminating deficit is the inability to form a cognitive map, a mental representation of the relative positions of places (Iaria, Bogod, Fox and Barton 2009; Iaria and Barton 2010). The 2025 systematic review by van der Ham and colleagues (15 empirical papers) confirms that the impairment concentrates in allocentric location knowledge and path knowledge (route and survey), while landmark knowledge is largely spared; where landmark recognition is also impaired the review attributes it to a co-occurring visual agnosia, typically with face recognition deficits, rather than to DTD itself. **Grade A.**

Naming. The Leiden group (van der Ham) began using **atopia** in 2025 and 2026 as a public-facing name, with an awareness site (De Weg Kwijt), a public Space Maze experiment (Lowlands, August 2026), and an Atopia Training Game prototype under pilot in Dutch rehabilitation centres. Treat "atopia" as a synonym and trigger term; DTD remains the term in the peer-reviewed literature. **Grade B for the facts; the name is not yet in a peer-reviewed definition.**

Prevalence. 3 percent of 1,698 Italian adults aged 18 to 35 met DTD criteria on the Familiarity and Spatial Cognitive Style Scale plus interview (Piccardi et al. 2022). Popular sources repeat "1 to 2 percent" or "1 in 30"; cite the 3 percent figure with its instrument and sample. **Grade B.**

## 1. Phenotype, with the family-trait mapping this plugin was built around

The plugin distinguishes a core trait from two optional profiles. The split comes from the maintainer's family (four affected members across three generations) and is then checked against the literature.

### 1a. Core trait: direction words do not bind reliably to physical directions
Burles and Iaria (2020; 1,211 DTD cases, 1,624 controls) found self-reported difficulty distinguishing left from right to be one of the largest group differences in the whole battery (mean difference 0.84, Bayes factor on the order of 10 to the 23), while mental rotation accuracy and speed did not differ from controls. Thaler and colleagues' 2025 systematic review of left-right confusion across clinical populations (20 case-control studies) names DTD as the developmental condition with objective direction-discrimination deficits, associated with low functional connectivity between hippocampus and right prefrontal cortex. **Grade A.**

General-population baseline, for calibration: 14.6 percent of healthy adults self-report insufficient left-right identification and 42.9 percent use a hand-related strategy; aligning the arms with the stimulus improves performance; the mechanism appears to be a top-down stored body representation rather than sensory input (van der Ham et al. 2020). Left-right difficulty is a verbal-labelling effect: judgments are slower for "left/right" and "east/west" than for "up/down" and "north/south" (Egeth 1981). Children acquire "left" and "right" only when the words are anchored on their own bodies and fail to extend them to another body (Shusterman and Li 2016). **Grade A/B.**

Design consequence (applied in wayfinding-prosthetics): remove direction words wherever a landmark can replace them; when a side must be named, bind it to a body fact the user supplies once; never express a side relative to a third party or an object.

### 1b. Core trait: the deliberate simulation cuts out under stress
People with DTD often run an effortful, explicit directional simulation in place of a cognitive map. Acute psychological stress disrupts hippocampal-prefrontal activity for mnemonic retrieval and mental simulation during navigational planning, and participants abandon novel shortcuts for familiar paths (Brown et al. 2020, Current Biology, fMRI plus cortisol). Acute stress impairs visual path integration, especially at high difficulty and after cue removal (Akan et al. 2023); the Trier Social Stress Test impairs spatial working memory and attention (Olver et al. 2015); threat of shock increases errors and non-spatial strategy use on a hippocampus-dependent maze but not on a striatal version (Goodman et al. 2020). Against: a PASAT stressor biased participants toward allocentric strategy (van Gerven et al. 2016) and the TSST had no effect on systematic spatial search (Husa et al. 2022). **Grade B, mixed.** The honest reading is that stress reliably degrades prospective simulation and working-memory-dependent spatial computation, and does not reliably switch strategy. The stress-mode fallback therefore assumes the simulation has already failed.

### 1c. Profile: viewpoint shift when looking up
Reported by two of four family members. No DTD paper describes it. Adjacent literature is normative: subjective visual vertical in healthy adults is accurate to within about 2.5 to 3 degrees (Perennou et al. 2016; van der Waal et al. 2024), upward head and gaze orientation is overestimated by a factor of about 1.5 (Shaffer et al. 2026; Tardeh et al. 2024), straight-ahead and visual-vertical appear to be dissociated reference frames (Lafitte et al. 2026), and field dependence produces large, stable individual differences in how far the perceived upright is captured by a tilted visual frame (Witkin and Asch 1948). **Grade C as applied to DTD.** Accommodations derived from it are reasonable but untested.

### 1d. Profile: orientation-invariant reading
Reported by one family member: reading an inverted book without noticing. Not in the DTD literature. The reading literature says the opposite is normal: literacy removes mirror invariance for letters (Erlikhman et al. 2017; Fernandes et al. 2025 show residual mirror invariance in dyslexic adults), rotated letters cost reading time progressively with angle (Fernandez-Lopez et al. 2021), rotated words prime upright words only weakly (Benyhe et al. 2021). **Grade C.** Its design consequence generalises, though: never assume a reader will notice that a map, diagram, or sign is rotated.

## 2. Heritability
Barclay, Burles, Potocki, Rancourt and Iaria (2016) tested relatives of DTD probands and of control probands and found the trait clustering in DTD families and absent in control families. Burles and Iaria (2020) found DTD participants far more likely to report first-degree relatives with childhood-onset orientation difficulty (odds ratio 2.91, p on the order of 10 to the minus 59); affected relatives were reported as female about 2.4 to 1 in both groups; the DTD sample itself was 5.2 to 1 female, mean age 35.7. No molecular genetics exist. **Grade A for familial aggregation; mode of inheritance unknown.** A single pedigree consistent with dominant transmission is **Grade F** and must be labelled as such.

## 3. Assessment
There is no clinical diagnostic test. Instruments in use, all screening-level (**Grade B**):
- Getting Lost project online battery (Iaria lab, University of Calgary): Cognitive Map Test, Spatial Configuration Task, Four Mountains perspective-taking task, and self-report scales reported in Burles and Iaria 2020.
- Familiarity and Spatial Cognitive Style Scale (Piccardi, Italian norms).
- Santa Barbara Sense of Direction Scale (general-population self-report; not DTD-specific).
- Leiden Wayfinding Questionnaire and navigation-game reference values (van der Ham).
- Case documentation standards: van der Ham et al. 2025 (Neurocase) describes a case repeatedly misdiagnosed before DTD was recognised and gives clinical recommendations.

Identification is by history (lifelong, childhood onset, familiar environments affected) plus exclusion of acquired causes (neurological examination, imaging where indicated). Any document this plugin generates says that explicitly.

## 4. Clinical codes
There is no DSM-5-TR or ICD-11 code specific to DTD. Nearest placements: ICD-11 **6A0Y** (Other specified neurodevelopmental disorders); DSM-5-TR **Other specified neurodevelopmental disorder** (ICD-10-CM F88) with the specifier written out, or **Unspecified neurodevelopmental disorder** (F89). 6A04 (Developmental motor coordination disorder) is sometimes suggested and is wrong: DTD is not a motor disorder. A clinician assigns the code; this plugin only reports the options. **Grade C.**

## 5. Legal framing by jurisdiction (all Grade C: reasoned extrapolation, no statutory recognition anywhere)

Owner: this section is the single source for the legal framing; dtd-document-generation and dtd-gap-analysis cite it instead of restating it. Date-sensitive claims below carry a last-checked date.

### United States
- **ADA Title I (workplace).** Argue substantial limitation of a major life activity. The ADAAA list includes thinking, concentrating, and working; "major bodily functions" includes neurological and brain functions. Navigation is not enumerated. The interactive process applies as for any cognitive impairment. Job Accommodation Network cognitive-impairment ideas apply by analogy (written instructions, consistent workspace, buddy or mentor systems); pull current wording from askjan.org when drafting.
- **Section 504 and ADA Title II/III (education, public entities, public accommodations).** Same analogy. For higher education, the disability-services office needs documentation of functional impact and a clinician's summary; see dtd-document-generation. A.J.T. v. Osseo Area Schools (US Supreme Court, June 2025; last checked 2026-10-18) removed the "bad faith or gross misjudgment" bar for education ADA/504 claims, which raises the stakes of documented non-delivery of an agreed accommodation.
- Title II web rule (WCAG 2.1 AA; DOJ extended the compliance dates in April 2026, now 26 April 2027 for entities serving 50,000 or more and 26 April 2028 for smaller; last checked 2026-10-18, confirm on ada.gov before quoting) governs public-sector maps and wayfinding pages; WCAG itself has no direction-word rule, so the plugin's content check is additive.

### France
- No DYS-specific pathway applies. PAP (Circulaire 2015-016) is for learning disorders in schooling and a DTD request routed through PAP will be refused on scope. Use the general **handicap cognitif** route: dossier MDPH with a **bilan neuropsychologique** as evidence; **RQTH** (Reconnaissance de la Qualite de Travailleur Handicape) for workplace; **amenagement de poste** negotiated with the employer and, where present, the referent handicap (mandatory at 250 or more employees). Loi 2005-102 defines handicap broadly enough to include a lasting cognitive limitation on participation in social life; getting lost in one's own neighbourhood meets that description.
- Terminology: desorientation topographique developpementale (DTD). The term is used in research reporting but is not an MDPH category.

### Spain
- No DEA or ACNEAE classification applies (those cover specific learning difficulties in schooling). Use **Real Decreto Legislativo 1/2013** (Ley General de Discapacidad): **certificado de discapacidad** (33 percent threshold for most employment measures), **ajustes razonables** under article 40 for workplace, and the public-employment adaptations framework of Orden PJC/804/2025 where relevant. For universities, the servicio de atencion a la discapacidad handles requests with a clinical report.
- Terminology: desorientacion topografica del desarrollo (DTD).

## 6. DTD accommodation checklist (use in audits)
1. Every written direction set has an orientation anchor sentence at the top.
2. No cardinal directions anywhere in traveller-facing text.
3. No left/right without a landmark in the same sentence; preferably none at all.
4. Sides, when unavoidable, are bound to a body fact the person stated.
5. Maps are heading-up or carry an explicit text anchor; you-are-here markers state what the reader is facing.
6. A stress-mode card exists for every route the person must do alone.
7. New sites get a photo-based orientation sheet before the first visit.
8. The person is never asked to recognise a place they have been to as proof of orientation.
9. Profile flags (viewpoint shift, orientation invariance) are recorded and their accommodations applied.
10. Every document states the evidence grade and the absence of statutory recognition.

## Sources
See `docs/research/research-foundation-2026-10-17.md` for the full citation list with links. Key items: Iaria et al. 2009 (Neuropsychologia); Iaria and Barton 2010 (Exp Brain Res); Barclay et al. 2016 (Cogn Neuropsychol); Burles and Iaria 2020 (Sci Rep 10:20932); van der Ham et al. 2025 (Neuropsychol Rev); Piccardi et al. 2022 (PLoS ONE); Thaler et al. 2025 (Brain Res Bull); van der Ham et al. 2020 (QJEP); Brown et al. 2020 (Curr Biol); Wunderlich, Grieger, Gramann 2022 (Spat Cogn Comput 23:31-56); Pazzaglia and De Beni 2006 (Perception); Viita et al. 2006 (HFES); McKenzie and Klippel 2016 (Cartogr J).
