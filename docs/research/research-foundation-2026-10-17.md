# topographical-disorientation-support-skill: foundation research (2026-10-17)

Purpose: the literature base for a third accessibility skill, alongside dyslexia-support-skill and dyscalculia-support-skill, covering developmental topographical disorientation (DTD). This note is the equivalent of the "research update" notes the other two skills carry, except that it is a first pull rather than a refresh, so it also fixes the skill's architecture and names the tooling the final skill will need (map reading, geographic-area references, text references).

Evidence grades used below: A = replicated group studies or systematic review; B = single large study or well-designed small study; C = case reports, expert opinion, or extrapolation from adjacent literature; F = family report only (Justice's pedigree), to be labelled as such in the skill.

## 1. What DTD is, and what it is now being called

DTD was first described as a single case in 2009 (Iaria, Bogod, Fox and Barton, Neuropsychologia) and then as a group phenomenon in 120 internet-recruited cases in 2010 (Iaria and Barton, Experimental Brain Research). The defining feature is a lifelong, selective inability to orient in the environment, present from childhood, in the absence of brain injury, neurological disease, or general cognitive impairment. The single most discriminating deficit is the inability to form a cognitive map, a mental representation of the relative positions of places. [Grade A]

The 2025 systematic review by van der Ham and colleagues (Neuropsychology Review, 15 empirical papers) confirms that the impairment is concentrated in allocentric location knowledge and path knowledge (route and survey), while landmark knowledge is largely spared. Where landmark recognition is also impaired, the review attributes it to a co-occurring visual agnosia (typically with face recognition deficits) rather than to DTD itself. Egocentric location knowledge is rarely tested. The review's bottom line is that poor mental-map quality, combined with a landmark-focused navigation strategy, is the clinical core. [Grade A]

Naming. The Leiden group (van der Ham) has in 2025 and 2026 begun using the term "atopia" for the congenital condition, explicitly to give it a name the public can use. Leiden runs an awareness site (De Weg Kwijt, launched September 2025), a Space Maze public experiment (Lowlands festival, August 2026), and an Atopia Training Game prototype piloted at UMC Utrecht, Delft Rehabilitation Center and De Hoogstraat in 2025 and 2026. The skill should treat "atopia" as a synonym and trigger term, with DTD as the primary term in the literature. [Grade B for the facts; naming is not yet in a peer-reviewed definition]

Prevalence. Piccardi and colleagues (PLoS ONE 2022) found 3 percent of 1,698 Italian adults aged 18 to 35 met DTD criteria on the Familiarity and Spatial Cognitive Style Scale plus interview. Popular sources repeat "1 to 2 percent" or "1 in 30". The skill should cite the 3 percent figure with its instrument and sample. [Grade B]

Clinical status. There is no DSM-5-TR or ICD-11 code specific to DTD. The nearest ICD-11 placement is 6A0Y (Other specified neurodevelopmental disorders); 6A04 (Developmental motor coordination disorder) is sometimes suggested but DTD is not a motor disorder and should not be filed there. The nearest DSM-5-TR placements are "Other specified neurodevelopmental disorder" (ICD-10-CM F88) with the specifier written out, or "Unspecified neurodevelopmental disorder" (F89). The skill must say this plainly, because every document-generation template in the other two skills leans on a code. [Grade C; a clinician assigns the code, the skill only reports the options]

## 2. Heritability

Barclay, Iaria and colleagues (Cognitive Neuropsychology 2016) tested relatives of DTD probands and relatives of control probands and found the trait clustering in DTD families and absent in control families; this is the first direct familial-aggregation evidence. [Grade B]

Burles and colleagues (Scientific Reports 2020), the 10-year cohort of 1,211 DTD cases and 1,624 controls, found DTD participants far more likely to report first-degree relatives with childhood-onset orientation difficulty (OR 2.91, p ~ 1e-59). Affected relatives were reported as female roughly 2.4 to 1 in both groups. The DTD sample itself was 5.2 to 1 female, mean age 35.7. No molecular genetics exist yet. [Grade A for familial aggregation; mode of inheritance is unknown]

Justice's pedigree (grandfather, mother, youngest aunt, Justice) is consistent with dominant transmission across three generations but is a single family and cannot be cited as evidence of mode of inheritance. [Grade F]

## 3. The three traits in Justice's family, mapped to the literature

### 3a. Core trait: direction words do not bind reliably to physical directions

This is the trait all four family members share, and it is the one the literature supports most directly.

Burles 2020 found self-reported difficulty distinguishing left from right to be one of the largest group differences in the whole battery (mean difference 0.84 on the scale, BF ~ 3e23), while mental rotation accuracy and speed did not differ between DTD and controls. In other words, DTD people can rotate objects in the mind as well as anyone; what fails is the mapping between direction labels and the body or the world. [Grade A]

Thaler and colleagues' 2025 systematic review of left-right confusion across clinical populations (Brain Research Bulletin, 20 case-control studies) singles out DTD as the developmental condition with objective direction-discrimination deficits, associated with low functional connectivity between hippocampus and right prefrontal cortex. [Grade A]

Baseline in the general population: van der Ham 2020 (QJEP, three experiments) found 14.6 percent of healthy adults self-report insufficient left-right identification and 42.9 percent use a hand-related strategy; aligning the arms with the stimulus improves performance; the mechanism appears to be a top-down stored body representation, not sensory input. [Grade A] Egeth 1981 showed left-right difficulty is a verbal-labelling effect: judgments are slower for "left/right" and "east/west" than for "up/down" and "north/south". [Grade B] Shusterman 2016 showed children acquire left and right only when the words are anchored on their own bodies, and fail to extend them to another person's body. [Grade B]

Design consequence: the instruction-rewriting layer should (1) remove left/right/north/south entirely where a landmark can replace them, (2) when a side must be named, bind it to a body fact the user supplies once ("your watch hand", "the side you write with") rather than to a label, and (3) never rely on a side relative to a third party or an object ("the left of the church").

### 3b. Stress cutout of the deliberate simulation

Justice reports he can run a deliberate simulation of directions but it drops out under stress. The literature is mixed, and the skill must say so.

Supporting: Brown and colleagues (Current Biology 2020, fMRI plus cortisol) found acute psychological stress disrupted hippocampal-prefrontal activity for mnemonic retrieval and mental simulation during navigational planning, with participants abandoning novel shortcuts for familiar paths; the effect was tied to disrupted neural replay of future locations. [Grade B] Akan 2023 found acute stress impaired visual path integration, especially at high difficulty and after cue removal, mostly through distance estimation. [Grade B] Olver 2015 found the Trier Social Stress Test impaired spatial working memory and attention, with attention remaining impaired after rest. [Grade B] Goodman 2020 found threat of shock increased errors and non-spatial strategy use on a hippocampus-dependent radial maze but not on a striatal stimulus-response version. [Grade B]

Not supporting: van Gerven 2016 found a PASAT stressor biased participants toward allocentric, not egocentric, strategy; Husa 2022 found no TSST effect on systematic spatial search strategy. [Grade B]

Reading of the evidence: acute stress reliably degrades prospective simulation and working-memory-dependent spatial computation, which is exactly what Justice's deliberate directional simulation is. It does not reliably switch strategy. The skill's "stress mode" fallback should therefore assume the simulation has already failed and reduce the task to a single landmark check, not try to re-run the simulation more carefully.

### 3c. Viewpoint shift when looking up (Justice and his youngest aunt)

No DTD paper describes this. The adjacent literature on verticality perception is normative rather than clinical: subjective visual vertical in healthy adults is accurate to within about 2.5 to 3 degrees (Pérennou 2016 review; van der Waal 2024 norms), upward head and gaze orientation is overestimated by a factor of about 1.5 (Shaffer 2026; Tardeh 2024), and the brain appears to keep straight-ahead and visual-vertical as dissociated reference frames (Lafitte 2026). Witkin 1948 documented large, stable individual differences in how far the perceived upright is captured by a tilted visual frame (field dependence). [Grade C as applied to DTD]

The honest framing for the skill: a reported comorbid profile, present in two of four family members, with a plausible mechanism in field dependence or verticality reference instability, and no DTD-specific evidence. Accommodations drawn from it (prefer ground-level reference points, avoid simultaneous looking-up and position tracking, treat overhead signage and stairs as higher-risk) are reasonable but untested.

### 3d. Orientation-invariant reading (Justice only)

Reading an inverted book without noticing is not described in the DTD literature. The reading literature says the opposite is normal: skilled readers lose mirror invariance for letters as they learn to read (Erlikhman 2017 review; Fernandes 2025 shows dyslexic adults retain residual mirror invariance for some letters), rotated letters cost reading time progressively with angle (Fernández-López 2021), and rotated words prime upright words only weakly (Benyhe 2021). A reader who processes 180-degree-rotated text without noticing is retaining a form of orientation invariance that literacy normally removes. [Grade C]

Framing for the skill: a single-member comorbid profile, labelled as such. Its design consequences are the strongest of any trait, though, because they generalise: never assume the reader will notice that a map, diagram or sign is rotated. Every visual must carry an explicit orientation anchor (a "you are facing X" sentence, a fixed landmark icon, a horizon line), and the content check must flag any visual whose meaning depends on the reader noticing rotation.

## 4. What trains and what does not

Formation of cognitive maps can be stimulated with intensive, structured virtual-environment training, but the evidence is small-sample and the transfer to real environments is unproven. McLaren-Gradinaru, Burles and Iaria 2020 (Frontiers in Human Neuroscience) report a 12-day computerised programme in 15 healthy volunteers with preliminary improvement in cognitive-map formation. Bate 2019 trained one person with developmental prosopagnosia and topographical difficulty to form a map of one specific environment after intense overlearning. Liu 2026 (Journal of Intelligence, RCT, n = 96 college students with "DTD-like" difficulties) found 8 weeks of VR orienteering improved a laboratory spatial-memory task versus VR exercise and control. The Leiden Atopia Training Game pilot is unpublished. [Grade B for lab gains; Grade C for real-world transfer]

What is well supported is compensation: Rivest 2018 (acquired TD) used an errorless smartphone-route method and eliminated surplus direction changes; Bouwmeester 2015 (acquired TD, 12-year follow-up) built an egocentric, written-route system that eventually allowed implicit learning of frequent routes but never of new ones without help. [Grade B, acquired TD not DTD]

Architecture consequence: the remediation track should be thin and honest (optional structured VR or route-overlearning for specific high-value routes), and the prosthetics track is the product. This mirrors the dyslexia skill's "remediation targets versus bypass targets" split, with the balance shifted almost entirely to bypass.

## 5. Prosthetics evidence that the skill can cite

Landmark-based instructions. Wunderlich, Grieger and Gramann (Spatial Cognition and Computation 2022, two driving-simulator experiments) found that adding a landmark to each turn instruction roughly doubled correct turn recall three weeks later (25.7 to 44.8 and 48.6 percent in experiment 1; 29.5 to 49.5 percent in experiment 2), improved landmark recognition, and reduced wrong turns on an unassisted re-drive. The effect did not depend on a visual arrow and did not need personalised content. [Grade B] Google Maps began rolling out landmark-based spoken directions ("turn right after the Thai Siam Restaurant") in the US on Android and iOS in 2026; no developer API exposes it. [Grade B for the fact; useful as a precedent, not a dependency]

Map alignment. Misaligned maps produce lawful errors (Rossano and Warren 1989; Warren 1992); users prefer map-to-environment alignment even at the cost of map-to-self alignment (Warren 1992); misalignment cancels the benefit of landmarks in you-are-here maps (McKenzie 2016); the alignment cost lives in a pre-decision mental alignment stage (Tlauka 2018); and turn decisions tolerate roughly plus or minus 50 degrees of misalignment with little cost but degrade beyond that (Viita 2006). Pazzaglia 2006 found that low mental rotators prefer landmark-based representations and are hurt most by counter-aligned maps, while high rotators become immune with practice. [Grade A] Design consequence: heading-up by default, never north-up without an explicit anchor, and the content check should flag north-up maps presented to a navigating user.

Stress fallback. See 3b. The fallback script is: stop; read the one-line orientation anchor; confirm one landmark; take one instruction; repeat.

## 6. Assessment instruments

There is no clinical diagnostic test for DTD. The instruments in use are: the Getting Lost project online battery (Iaria group, University of Calgary; the Four Mountains perspective-taking task, Cognitive Map Test and Spatial Configuration Task reported in Burles 2020 come from this battery; the site address gettinglost.ca appears in secondary sources and was not fetched for this note); the Familiarity and Spatial Cognitive Style Scale (Piccardi, Italian norms); the Santa Barbara Sense of Direction Scale (general-population self-report, not DTD-specific); and the Leiden Wayfinding Questionnaire and navigation-game reference values. Van der Ham 2025 (Neurocase) documents a case repeatedly misdiagnosed before DTD was recognised and gives clinical recommendations. The skill's audit and document-generation components should treat these as screening instruments and say that diagnosis is by history plus exclusion of acquired causes. [Grade B]

## 7. Legal and accommodation layer

DTD has no statutory recognition in any of the three jurisdictions the other skills cover. In the US it would be argued under ADA Title I as a substantial limitation of a major life activity (the ADAAA list includes "thinking", "concentrating" and "working"; navigation is not enumerated but "major bodily functions" includes "neurological" and "brain" functions); JAN lists cognitive-impairment accommodations such as written directions, maps with landmarks, buddy systems and consistent workstation placement, which apply by analogy. In France, DTD would route through the general handicap cognitif pathway (MDPH, RQTH) with a bilan neuropsychologique as evidence, not through the DYS-specific PAP route, because PAP is for learning-disorder accommodations in schooling. In Spain, the same: Ley General de Discapacidad 1/2013 with a certificado de discapacidad, no DEA classification. All three framings are reasoned extrapolation. [Grade C] The skill should say that explicitly rather than inventing a compliance checklist.

Terminology for locales: French "désorientation topographique développementale" (DTD), Spanish "desorientación topográfica del desarrollo" (DTD, used by psyciencia.com), Italian "disorientamento topografico evolutivo" (Piccardi group, Sapienza). Dutch public term "atopia".

## 8. Skill architecture

Core (all family members; evidence-backed): direction-word binding failure, cognitive-map absence, stress cutout. Components: instruction rewriter (direction words to landmark-and-relation form, body-anchored sides when unavoidable), landmark route-script generator, stress-mode fallback card, content-accessibility check (flags left/right/north/south without a landmark, north-up maps, rotation-dependent visuals, unanchored "you are here" markers), remediation note (thin), assessment summary, accommodation-request templates with the Grade C caveat.

Profile: viewpoint-shift (two of four; Grade C): vertical-task accommodations, ground-level anchors, stairs and overhead-signage flags.

Profile: orientation-invariance (one of four; Grade C): mandatory orientation anchors on every visual, heading-up enforcement, rotation flags in the content check.

Locale layer: en, fr, es at launch (matching the other two skills), with the terminology above and the Grade C legal framing.

## 9. Tooling the final skill needs

Justice's requirement: map reading, references from a geographic area, references from text.

Map reading (raster or screenshot to structured): the model's own vision for one-off reads; for repeatable work, OpenStreetMap vector data via the Overpass API is the honest route because it gives named features with coordinates rather than pixels. Heading-up rendering needs a tile library that supports bearing (MapLibre GL does; Leaflet needs a plugin). Any map the skill emits must carry an orientation anchor sentence as text, not only as a compass glyph.

References from a geographic area (given a bounding box or a route, return the landmarks that matter): Overpass queries for amenity, shop, tourism, building, natural, and man_made tags around each decision point, then salience scoring. Graser 2016 (Walk21 paper) gives a published scoring recipe over OSM: distance to decision point, expert category weight, same-side-as-turn bonus, before-or-after position, and a visibility proxy. That recipe can be reimplemented in TypeScript or Python in under 200 lines and is the right starting point. Routing from OSRM or Valhalla gives the decision points; neither engine emits landmarks itself, so landmark enrichment is a post-process on the manoeuvre list.

References from text (a friend's description of their neighbourhood, an email with directions): toponym recognition plus resolution. Two maintained open options: geoparser 0.6.0 (University of Zurich, MIT, August 2026; spaCy recognizer plus SentenceTransformer resolver over a GeoNames or custom gazetteer, swappable modules) and mordecai3 (MIT; needs a local Elasticsearch GeoNames index and en_core_web_trf). For neighbourhood-scale references ("the bakery on the corner") GeoNames is too coarse and the gazetteer should be the Overpass result for the area, which geoparser's YAML gazetteer config supports. Direction-word detection for the content check is a regex plus a small multilingual lexicon (left/right/north/south/east/west, gauche/droite/nord/sud/est/ouest, izquierda/derecha/norte/sur/este/oeste, and the clock-face and compass-point variants).

Runtime samples: Python (geoparser plus Overpass), n8n (HTTP node to Overpass, Code node for salience scoring), Codex and Ollama (text rewriter only; no geo calls), matching the project's four-runtime rule.

## 10. Gates and release

Same gates as the other two skills: post-commit-audit, dyslexia-support-skill content check, dyscalculia-support-skill content check (the latter matters here because distances, bearings and clock-face directions are numeric). Suggested first release 0.1.0 as a Directory-ready core plus the en locale, with fr and es and the two profiles in 0.2.0 once the Grade C material has been reviewed once more.

## Sources

- Iaria, Bogod, Fox, Barton 2009, Developmental topographical disorientation: case one, Neuropsychologia 47:30-40. https://consensus.app/papers/details/eb9f6ebc37a7597185c14b4ef9a5e6e8/
- Iaria and Barton 2010, DTD: a newly discovered cognitive disorder, Experimental Brain Research 206:189-196. https://consensus.app/papers/details/ee615e56ffd8547097aed675d794a14d/
- Iaria and Burles 2016, Developmental Topographical Disorientation, Trends in Cognitive Sciences. https://consensus.app/papers/details/56aab42772e75b21b4d51f6c000b6bdd/
- Barclay, Burles, Potocki, Rancourt, Iaria 2016, Familial aggregation in DTD, Cognitive Neuropsychology. https://consensus.app/papers/details/231cdc2f1a2e58be83eefc99c8bd7e55/
- Burles and Iaria 2020, Behavioural and cognitive mechanisms of DTD, Scientific Reports 10:20932. https://www.nature.com/articles/s41598-020-77759-8
- van der Ham et al. 2025, Always Getting Lost: Defining DTD, a systematic review, Neuropsychology Review. https://consensus.app/papers/details/90505719533959719fc8f56c7e1f1eff/
- van der Ham et al. 2025, A case of DTD: impact on diagnostic trajectory and everyday life, Neurocase. https://consensus.app/papers/details/6e0adf3c4abc557ba19868dc0e2b60e0/
- Piccardi et al. 2022, Where am I? DTD among young Italian adults, PLoS ONE. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9299294/
- Bianchini et al. 2014, Where Am I? A new case of DTD, Journal of Neuropsychology. https://consensus.app/papers/details/e23dd763c7215652a9b2b54e73d73e6f/
- Rusconi et al. 2021, DTD with concurrent face recognition deficit, Frontiers in Psychiatry. https://consensus.app/papers/details/5ab3b0ba39e45d9b8499d328a8eb7daf/
- Leiden University, Lost at Lowlands: Leiden psychologists study atopia, 25 Aug 2026. https://www.universiteitleiden.nl/en/news/2026/08/lost-at-lowlands-leiden-psychologists-study-atopia
- 8D, Atopia: working toward recognition and treatment through creative tools (van der Ham interview). https://8d.nl/en/professor-ineke-van-der-ham-on-recognition-and-treatment-of-topographical-disorientation-disorder-atopia/
- Thaler et al. 2025, Left-right confusion in psychiatric, neurodevelopmental and neurological disorders: a systematic review, Brain Research Bulletin. https://consensus.app/papers/details/b9613fb04b99505fac0bd4fdfa5a5658/
- van der Ham et al. 2020, Distinguishing left from right, QJEP. https://consensus.app/papers/details/f00790005e8b5f7ea8ca41d264a1a783/
- Egeth 1981, Right-left confusion in the adult: a verbal labeling effect, Memory and Cognition. https://consensus.app/papers/details/c6c0f6103e1c5bd381213122509f0394/
- Shusterman and Li 2016, Frames of reference in spatial language acquisition, Cognitive Psychology. https://consensus.app/papers/details/9819789d6bfe55bf8c756ca0c84936e5/
- Brown et al. 2020, Stress disrupts human hippocampal-prefrontal function during prospective spatial navigation, Current Biology. https://consensus.app/papers/details/56bb785193cf521aa295a8e7dfcf0e43/
- Akan et al. 2023, Acute stress impairs visual path integration, Neurobiology of Stress. https://consensus.app/papers/details/13e697dddd09544fb7d04718aabb70c4/
- Olver et al. 2015, Impairments of spatial working memory and attention following acute psychosocial stress, Stress and Health. https://consensus.app/papers/details/e77021c6ecff5a8f96b94f6297e9ade2/
- Goodman et al. 2020, Threat-induced modulation of hippocampal and striatal memory systems, Neurobiology of Learning and Memory. https://consensus.app/papers/details/ccaeadf04e32597abcb74ba262415fc7/
- van Gerven et al. 2016, Acute stress switches spatial navigation strategy from egocentric to allocentric, Neurobiology of Learning and Memory. https://consensus.app/papers/details/54b45ad7d901522b980054bdde91d3e5/
- Husa et al. 2022, Acute stress and human spatial working memory strategy use, Stress. https://consensus.app/papers/details/f6e4948e0c9c52d09d89a90532fb2550/
- Pérennou et al. 2016, Visual verticality perception after stroke: systematic review, Annals of PRM. https://consensus.app/papers/details/c3a36dfd8382569cbb6b132648c81509/
- van der Waal et al. 2024, Clinical assessment of subjective visual and haptic vertical norms, Archives of Clinical Neuropsychology. https://consensus.app/papers/details/e844827f74405ebdbd5b6bed27af18f5/
- Shaffer et al. 2026, Things are looking (farther) up, Attention, Perception and Psychophysics. https://consensus.app/papers/details/222f20ffa78c5f28bd7fb3cd96cf4b74/
- Tardeh et al. 2024, Default reference frames for angular expansion, Vision. https://consensus.app/papers/details/1d10d3d36a695e66b060fa4ce0308d12/
- Lafitte et al. 2026, Prism adaptation and virtual-tilted environment: dissociated 2D coordinate systems, Experimental Brain Research. https://consensus.app/papers/details/a1f6c5888e1c57a3bfd70415af23b2c7/
- Witkin and Asch 1948, Studies in space orientation, J Exp Psychol. https://consensus.app/papers/details/745db80e49175c518062f2cf2ad765cc/
- Erlikhman et al. 2017, On the legibility of mirror-reflected and rotated text, Symmetry. https://consensus.app/papers/details/4e6df8de6ff45a65af7dbd6f3dbf9663/
- Fernandes et al. 2025, Mirror invariance dies hard during letter processing by dyslexic college students, Scientific Reports. https://consensus.app/papers/details/d2f8bc8597305950aac01da6b3d2cfdf/
- Fernández-López et al. 2021, How resilient is reading to letter rotations, JEP:LMC. https://consensus.app/papers/details/37fc11de6658540db064b834f91b50b0/
- Benyhe et al. 2021, Can rotated words be processed automatically, Memory and Cognition. https://consensus.app/papers/details/5e976adb5a9a5d62a9dfdfadca7dc94b/
- McLaren-Gradinaru et al. 2020, A novel training program to improve human spatial orientation, Frontiers in Human Neuroscience. https://consensus.app/papers/details/00e055921a1e538bbdb049e6c2b7c558/
- Bate et al. 2019, Developmental prosopagnosia with concurrent topographical difficulties, Neuropsychological Rehabilitation. https://consensus.app/papers/details/a11a13efafa45b5eaae23ccde369337d/
- Liu et al. 2026, VR orienteering training in students with DTD-like difficulties, Journal of Intelligence. https://consensus.app/papers/details/546e53f9473e56eaad9db7cb3b8a004f/
- Rivest et al. 2018, Behavioural intervention for achieving independent navigation, Neuropsychological Rehabilitation. https://consensus.app/papers/details/5d6f47181ecc5cc6b078ecc147a4e0ae/
- Bouwmeester et al. 2015, Rehabilitation in a complex case of topographical disorientation, Neuropsychological Rehabilitation. https://consensus.app/papers/details/1fdfff84bcc859b3b24ea84a2e5106cd/
- Wunderlich, Grieger, Gramann 2022, Landmark information included in turn-by-turn instructions induce incidental acquisition of lasting route knowledge, Spatial Cognition and Computation 23(1):31-56. https://doi.org/10.1080/13875868.2021.2022681 (preprint: https://www.biorxiv.org/content/10.1101/2020.11.30.403428.full.pdf)
- PhoneArena 2026, Google Maps adds landmark-based navigation. https://www.phonearena.com/news/google-maps-landmark-based-navigation-gemini-powered-lens_id175495
- Rossano and Warren 1989, Misaligned maps lead to predictable errors, Perception. https://consensus.app/papers/details/25f649def83e5fab9a09675005cb6893/
- Warren et al. 1992, Finding locations in the environment: the map as mediator, Perception. https://consensus.app/papers/details/6c2e5d481f6558029465e6fbda5f2399/
- McKenzie and Klippel 2016, The interaction of landmarks and map alignment in you-are-here maps, Cartographic Journal. https://consensus.app/papers/details/9f99ea6e4f5654d098501b6d94f15085/
- Tlauka et al. 2018, Heading south with a north-up map, Spatial Cognition and Computation. https://consensus.app/papers/details/15cbbaf43ef5570590da9a747943f7a6/
- Viita et al. 2006, Alignment effects on simple turn decisions in track-up and north-up maps, HFES Proceedings. https://consensus.app/papers/details/05f1517d08db5bd28df07df8013424c1/
- Pazzaglia and De Beni 2006, Are people with high and low mental rotation abilities differently susceptible to the alignment effect, Perception. https://consensus.app/papers/details/b00c59eb02f85b369ed61e9a15e10d75/
- psyciencia.com, Spanish-language coverage of Piccardi 2022 (term: desorientación topográfica del desarrollo). https://psyciencia.com/?p=89522
- Sapienza neuropsychology lab, DTD explained (Italian group). https://web.uniroma1.it/neuropsicologia/en/node/80
- geoparser 0.6.0 (PyPI, University of Zurich). https://pypi.org/project/geoparser
- mordecai3 (GitHub). https://github.com/ahalterman/mordecai3
- Graser 2016, Developing an open pedestrian landmark navigation model (Walk21). https://anitagraser.com/wp-content/uploads/2019/03/graser_2016_developing-an-open-pedestrian-landmark.pdf
- Getting Lost project (Iaria lab, University of Calgary): referenced via Burles 2020 and the Calgary news item https://ucalgary.ca/news/lost-neuroscientists-training-program-could-get-you-going-right-direction (site not fetched for this note)
- findacode ICD-11 neurodevelopmental block (6A04, 6A0Y). https://www.findacode.com/icd-11/block-1516623224.html
