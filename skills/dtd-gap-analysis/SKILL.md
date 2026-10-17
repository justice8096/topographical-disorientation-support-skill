---
name: dtd-gap-analysis
description: Systematic gap identification across navigation technology, clinical practice, workplaces, and public spaces for people with DTD. Identifies the direction-word monoculture of consumer navigation (turn-by-turn apps emit left/right and cardinal terms; Google Maps landmark directions are US-only and not exposed to developers), north-up defaults in printed and web maps, you-are-here signage without facing information, the absence of any clinical code or validated diagnostic instrument, the absence of statutory recognition in US, FR, and ES, the mismatch between DTD research (Calgary, Leiden, Rome) and accommodation practice, missing locale coverage (French and Spanish terminology barely exists outside research), and the routing-engine gap (OSRM and Valhalla emit no landmarks). Includes a DTD-friendly wayfinding audit checklist, a navigation-app heuristics set, and a maturity model for landmark-based guidance.
---
# DTD Gap Analysis Skill

## Purpose
Identify where navigation technology, clinical practice, workplaces, public spaces, and the law fail people with developmental topographical disorientation (DTD / atopia), so that audits, product reviews, and research proposals start from the same list.

## When to Use
Trigger when the user asks:
- "what's missing for people with DTD", "gap analysis", "where do navigation apps fail"
- to audit a navigation product, a wayfinding system, signage, or a campus map for DTD
- to compare US, French, and Spanish provision for topographical disorientation
- for a maturity model or heuristics for landmark-based guidance

## The gaps

### G1. Direction-word monoculture in consumer navigation (Grade A for the problem)
Turn-by-turn products emit "turn left in 200 m" and cardinal terms ("head north on Oak St"). For DTD readers the label-to-direction binding is the unreliable step (Burles and Iaria 2020; Thaler et al. 2025). Google Maps began rolling out landmark-based spoken directions ("turn right after the Thai Siam Restaurant") in the US in 2026, but it is US-only, still pairs the landmark with a direction word, and is not exposed through any developer API. Apple Maps and Waze have no landmark mode. Lever: Wunderlich, Grieger and Gramann 2022 show landmark instructions roughly double turn recall; the rewrite-directions command demonstrates the form.

### G2. North-up defaults (Grade A)
Printed maps, campus maps, transit maps, and most embedded web maps default to north-up. Misaligned maps produce lawful errors and cancel the benefit of landmarks (Rossano and Warren 1989; McKenzie and Klippel 2016). Heading-up is standard in car navigation but rare on foot and absent on paper. Lever: heading-up rendering (MapLibre bearing), printed maps oriented to the reading direction, and a text anchor sentence under every map.

### G3. You-are-here signage without facing information (Grade A)
Mall, hospital, campus, and transit boards mark position but not heading, forcing the reader to infer it from the map's orientation (Warren et al. 1992). Lever: one sentence, "You are facing the fountain", printed under the marker; the content check flags its absence.

### G4. No clinical code, no validated diagnostic instrument (Grade B)
There is no DSM-5-TR or ICD-11 code for DTD and no diagnostic test; the Getting Lost battery, the Familiarity and Spatial Cognitive Style Scale, the Santa Barbara Sense of Direction Scale, and the Leiden Wayfinding Questionnaire are screening tools. Van der Ham et al. 2025 (Neurocase) document repeated misdiagnosis. Consequence: clinicians cannot easily document the condition, which blocks every downstream accommodation pathway. Lever: the clinical summary letter template; the 2025 systematic review's call for a behavioural assessment tool.

### G5. No statutory recognition in US, FR, or ES (Grade C)
All three jurisdictions accommodate cognitive impairment generically. None names topographical disorientation. France's DYS pathway (PAP) explicitly does not cover it; Spain's DEA/ACNEAE framework does not either. Lever: framing by analogy (ADA Title I major bodily functions; MDPH handicap cognitif; RDL 1/2013) with the caveat paragraph.

### G6. Research-to-practice gap (Grade B)
Three active research groups (Iaria and Burles, Calgary; van der Ham, Leiden; Piccardi and Bianchini, Rome) and a 2025 systematic review, but no accommodation guideline, no occupational-health guidance, and no HR or disability-services material mentions DTD. The Leiden awareness effort (atopia, De Weg Kwijt, 2025 onward) is the first public-facing programme. Lever: this plugin's document templates; the gap is the audience for them.

### G7. Locale gap (Grade B)
French and Spanish terminology exists in research reporting ("desorientation topographique developpementale", "desorientacion topografica del desarrollo") but not in clinical or administrative vocabulary; Italian has "disorientamento topografico evolutivo" through the Rome group; Dutch has "atopia". No non-English screening norms except the Italian FSCS. Lever: locale-aware commands and the FR/ES document templates in this plugin.

### G8. Routing engines emit no landmarks (Grade A for the fact)
OSRM and Valhalla return manoeuvres with bearings and street names; neither emits landmarks at decision points. Graser 2016 published an open salience recipe over OpenStreetMap that has not been adopted upstream. Lever: the area-landmarks and landmark-route-script commands reimplement it as a post-process.

### G9. Stress is not designed for (Grade B, mixed)
Navigation products assume a calm user with attention to spare. Acute stress degrades prospective spatial simulation (Brown et al. 2020). Nothing in consumer navigation offers a "stop, anchor, one step" mode. Lever: the stress-mode card.

### G10. Comorbid orientation profiles are invisible (Grade C)
Viewpoint shift when looking up and orientation-invariant reading are family-reported traits with no DTD literature. Overhead signage, mezzanine wayfinding, rotated diagrams, and "turn the map" instructions are hostile to them and no accessibility standard flags any of it. Lever: profile flags in the content check.

### G11. Secure facilities and no-phone environments (Grade C)
Clearance environments, hospitals, courts, and exam halls often prohibit the device that carries the navigation prosthetic. No policy provides an alternative. Lever: printed route cards, escort accommodation, and site orientation sheets delivered before the first visit.

### G12. Family reporting is not captured (Grade A for aggregation, F for any single pedigree)
Familial aggregation is well established (Barclay 2016; Burles 2020) but clinicians rarely ask, and no intake form includes it. Lever: the family history summary template.

## DTD-friendly wayfinding audit checklist
1. Are there direction words with no landmark in the same sentence? (error)
2. Are there cardinal directions in traveller-facing text? (error)
3. Is any map north-up without a heading-up alternative or a text anchor? (error)
4. Does every you-are-here marker say what the reader is facing? (error if not)
5. Is there a stress-mode fallback for every self-guided route? (warning if not)
6. Are confirmation cues ahead of the traveller rather than recognition of places behind? (warning)
7. Do any instructions require looking up while moving? (warning under the viewpoint-shift profile)
8. Do any visuals depend on the reader noticing rotation? (warning under the orientation-invariance profile)
9. Is a printed or offline form of the route available for no-phone settings? (warning)
10. Is the evidence grade stated for any training claim? (error if a training benefit is asserted without a grade)

## Navigation-app heuristics for DTD (extending the audit checklist to product design)
H1. Landmarks are the primary turn cue; direction words are optional secondary text that can be switched off.
H2. Heading-up is the default and the only mode in stress mode.
H3. Each step shows one landmark photo taken from the approach direction.
H4. A "where am I facing" sentence is one tap away at all times.
H5. The app never asks "do you recognise this place?".
H6. Stress mode reduces the screen to one landmark, one instruction, and one call button.
H7. Printed route cards are exportable from any route.
H8. Body anchors are a profile setting, entered once, never inferred.
H9. All copy is checked with the wayfinding content check in the user's language.
H10. The evidence grade for any "training" feature is shown in the feature's description.

## Maturity model for landmark-based guidance
- **Level 0, label-only**: left/right/cardinal instructions, north-up map.
- **Level 1, labelled landmarks**: "turn left at the church"; still a direction word per step.
- **Level 2, landmark relations**: "turn toward the church"; heading-up map; anchor sentence on start.
- **Level 3, anchored and confirmable**: body-anchored sides where unavoidable; confirmation cue ahead at every turn; off-route landmark stated.
- **Level 4, stress-aware and profile-aware**: stress mode; profile flags applied; printed fallback; no recognition demands.
- **Level 5, evidence-graded and localised**: every claim graded; FR and ES parity; documented accommodation pathway per jurisdiction.
