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
- "désorientation topographique développementale", "desorientación topográfica del desarrollo", "disorientamento topografico evolutivo"
- "no sense of direction", "always getting lost", "can't read a map", "can't tell left from right", "left-right confusion"
- "gettinglost", "Getting Lost Questionnaire", "Santa Barbara Sense of Direction", "Wayfinding Questionnaire"
- "is this a disability", "accommodation for getting lost", "ADA" together with navigation, "MDPH" or "RQTH" together with orientation, "certificado de discapacidad" together with orientación
- any request to cite the research on DTD or to grade the evidence for a navigation accommodation

## 0. Definition and naming

DTD is a lifelong, selective inability to orient in the environment, present from childhood, in the absence of acquired brain injury, neurological disease, or general cognitive impairment. The single most discriminating deficit is the inability to form a cognitive map, a mental representation of the relative positions of places (Iaria, Bogod, Fox and Barton 2009; Iaria and Barton 2010). The 2025 systematic review by van der Ham and colleagues (15 empirical papers) confirms that the impairment concentrates in allocentric location knowledge and path knowledge (route and survey), while landmark knowledge is largely spared; where landmark recognition is also impaired the review attributes it to a co-occurring visual agnosia, typically with face recognition deficits, rather than to DTD itself. **Grade A.**

Naming. The Leiden group (van der Ham) began using **atopia** in 2025 and 2026 as a public-facing name, with an awareness site (De Weg Kwijt), a public Space Maze experiment (Lowlands, August 2026), and an Atopia Training Game prototype under pilot in Dutch rehabilitation centres. Treat "atopia" as a synonym and trigger term; DTD remains the term in the peer-reviewed literature. **Grade B for the facts; the name is not yet in a peer-reviewed definition.**

Prevalence. 3 percent of 1,698 Italian adults aged 18 to 35 met DTD criteria on the Familiarity and Spatial Cognitive Style Scale plus interview (Piccardi et al. 2022). Popular sources repeat "1 to 2 percent" or "1 in 30"; cite the 3 percent figure with its instrument and sample. **Grade B.**

## 1. Phenotype, with the family-trait mapping this plugin was built around

The plugin distinguishes a core trait from two optional profiles. The split comes from the maintainer's family (four affected members across three generations) and is then checked against the literature.

### 1a. Core trait: direction words do not bind reliably to physical directions
People with DTD report left-right difficulty as one of the largest differences from controls, while mental rotation is intact; a 2025 review names DTD as the developmental condition with objective direction-discrimination deficits. **Grade A.** In the general population about 1 in 7 adults (14.6 percent) also self-report left-right trouble, and the difficulty is largely a verbal-labelling effect. **Grade A/B.**

Design consequence (applied in wayfinding-prosthetics): remove direction words wherever a landmark can replace them; when a side must be named, bind it to a body fact the user supplies once; never express a side relative to a third party or an object.

### 1b. Core trait: the deliberate simulation cuts out under stress
Acute stress reliably degrades the effortful mental simulation and working-memory-dependent spatial computation that DTD relies on, and does not reliably switch strategy. **Grade B, mixed.** The stress-mode fallback therefore assumes the simulation has already failed.

### 1c. Profile: viewpoint shift when looking up
Reported by two of four family members; no DTD paper describes it, and adjacent normative literature only suggests it is plausible. **Grade C as applied to DTD.** Accommodations derived from it are reasonable but untested.

### 1d. Profile: orientation-invariant reading
Reported by one family member; not in the DTD literature, and normal reading is orientation-sensitive. **Grade C.** Its design consequence generalises: never assume a reader will notice that a map, diagram, or sign is rotated.

## 2. Heritability
DTD clusters in families: relatives of people with DTD are about three times as likely (odds ratio 2.91) to report childhood-onset orientation difficulty. No molecular genetics exist. **Grade A for familial aggregation; mode of inheritance unknown.** A single pedigree consistent with dominant transmission is **Grade F** and must be labelled as such.

Full citations, sample sizes and counter-evidence: `references/phenotype-evidence.md` in this skill's folder, and `docs/research/research-foundation-2026-10-17.md`.

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
- No DYS-specific pathway applies. PAP (Circulaire 2015-016) is for learning disorders in schooling and a DTD request routed through PAP will be refused on scope. Use the general **handicap cognitif** route: dossier MDPH with a **bilan neuropsychologique** as evidence; **RQTH** (Reconnaissance de la Qualité de Travailleur Handicapé) for workplace; **aménagement de poste** negotiated with the employer and, where present, the référent handicap (mandatory at 250 or more employees). Loi 2005-102 defines handicap broadly enough to include a lasting cognitive limitation on participation in social life; getting lost in one's own neighbourhood meets that description.
- Terminology: désorientation topographique développementale (DTD). The term is used in research reporting but is not an MDPH category.

### Spain
- No DEA or ACNEAE classification applies (those cover specific learning difficulties in schooling). Use **Real Decreto Legislativo 1/2013** (Ley General de Discapacidad): **certificado de discapacidad** (33 percent threshold for most employment measures), **ajustes razonables** under article 40 for workplace, and the public-employment adaptations framework of Orden PJC/804/2025 where relevant. For universities, the servicio de atención a la discapacidad handles requests with a clinical report.
- Terminology: desorientación topográfica del desarrollo (DTD).

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
