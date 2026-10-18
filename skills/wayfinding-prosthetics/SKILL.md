---
name: wayfinding-prosthetics
description: Wayfinding support for DTD: rewrite directions into landmark form with no left, right, or compass words, build landmark route scripts, apply heading-up map rules, and write stress-mode cards. Use when someone with topographical disorientation or getting lost needs landmark directions in English, French, or Spanish.
---
# Wayfinding Prosthetics and Remediation Skill

## Purpose
Define what this plugin actually does for a person with DTD. The balance is deliberate: the **prosthetics track** is the product, because the mental-map formation that DTD lacks does not train up reliably in real environments, while the compensations are highly learnable. The **remediation track** exists, is thin, and carries its evidence grade on every line.

## When to Use
Trigger this skill when the user asks to:
- rewrite, simplify, or "fix" directions for someone who gets lost or confuses left and right
- make a route card, route script, or "directions without left and right"
- design a map, signage, a you-are-here board, or a navigation prompt for DTD readers
- build a stress fallback, "what to do when the directions stop making sense"
- decide whether navigation training is worth trying
- phrase any of the above in French (gauche/droite, repère, carte) or Spanish (izquierda/derecha, punto de referencia, mapa)

## 1. The instruction-rewriting rules (core; Grade A for the deficit, Grade B for the remedy)

1. **Replace every direction word with a landmark relation.** "Turn left at Main Street" becomes "Turn toward the red church". The evidence: landmark-based turn instructions roughly doubled correct turn recall three weeks later in two driving-simulator experiments (25.7 to 44.8 and 48.6 percent; 29.5 to 49.5 percent), improved landmark recognition, and reduced wrong turns on an unassisted re-drive; the effect needed neither a visual arrow nor personalised content (Wunderlich, Grieger and Gramann 2022).
2. **Never emit cardinal directions.** North, south, east, west and their compounds are replaced by a landmark or by a "keep X on your <anchor> side" relation. Cardinal terms are labels with no body referent at all, and the deficit is in label binding.
3. **When a side is unavoidable, bind it to a body fact the person states once.** "Your watch hand", "the hand you write with", "the side your bag hangs on". The plugin never guesses the side; the person states it, and the rewriter refuses an anchor that is itself a direction word ("left hand"). The opposite side is "the side away from your watch hand", never the bare opposite label.
4. **Never express a side relative to a third party or an object.** "The left of the church" requires the reader to adopt the church's frame, which is the operation that fails (Shusterman and Li 2016).
5. **Open every output with an orientation anchor sentence.** "You are facing the bakery." If the start facing is unknown, the first line asks the person to name one thing directly in front of them and write it down.
6. **One instruction per landmark, one landmark per instruction.** Compound sentences are split.
7. **Add a confirmation cue after each turn where one exists.** "If you see the fountain, you are on the right path" is the one place where an in-route check is safe, because it tests recognition of a landmark ahead, not recall of a place behind.
8. **Never rely on the person recognising a place they have been before** as evidence that they are oriented. Landmark recognition is spared, but place-to-position binding is not.

### Locale phrasing
- **English**: "Turn toward the X." "Keep the X on your <anchor> side." "You are facing the X."
- **French**: "Tournez vers le/la X." "Gardez le/la X du côté de votre <ancre>." "Vous faites face à X." Avoid "à gauche/à droite" entirely; where unavoidable, "du côté de votre montre" (watch side). French prose often uses "en face de" for "opposite"; keep it, it is a landmark relation.
- **Spanish**: "Gira hacia el/la X." "Mantén el/la X del lado de tu <ancla>." "Estás mirando hacia X." Avoid "a la izquierda/derecha"; where unavoidable, "del lado de tu reloj". "Todo recto" (straight on) is acceptable because it is relative to the body, not a label; "de frente a" is a landmark relation.

## 2. Landmark route scripts (Grade B)
A route script is a sequence of decision points, each with one chosen landmark, in the form:

```
You are facing <start landmark>.
1. Walk until you see <landmark A> ahead. Turn toward it.
2. Keep <landmark B> on your <anchor> side. Walk until <landmark C> is directly ahead.
3. Stop when you reach <destination landmark>.
If you see <off-route landmark>, you have gone past the turn: stop and read line 2 again.
```

Landmark choice uses the salience recipe from Graser (2016): distance to the decision point, category weight (churches, fuel stations, towers, bridges, parks, supermarkets score high; generic buildings low), same-side-as-turn bonus, before-or-after position, and a visibility proxy (within 60 m counts as visible; no line-of-sight analysis). The deterministic implementation is in `lib/landmark-salience.ts` and the landmark list comes from `lib/overpass.ts` (see the area-landmarks command). Routing engines (OSRM, Valhalla) supply decision points and bearings; neither emits landmarks, so landmark enrichment is a post-process on the manoeuvre list.

## 3. Map rules (Grade A)
- **Heading-up by default.** Misaligned maps produce lawful, predictable errors (Rossano and Warren 1989; Warren et al. 1992); users keep map-to-environment alignment even at the cost of map-to-self alignment (Warren 1992); misalignment cancels the benefit of landmarks on you-are-here maps (McKenzie and Klippel 2016); the cost sits in a pre-decision mental alignment stage (Tlauka et al. 2018).
- **Tolerance is about plus or minus 50 degrees** before turn decisions degrade (Viita et al. 2006). A static map that cannot rotate should be oriented to the direction the reader will face when reading it, and must say so in words.
- **Low mental rotators prefer landmark representations and are hurt most by counter-aligned maps** (Pazzaglia and De Beni 2006). DTD readers as a group have intact mental rotation (Burles and Iaria 2020) but the orientation-invariance profile may not detect that rotation is needed at all, so the anchor must be text, not only a compass glyph.
- **Every map carries an orientation anchor sentence**: "You are facing the station. The river is on your watch-hand side."
- **Rendering**: MapLibre GL supports bearing for heading-up tiles; Leaflet needs a rotation plugin. Printed maps: rotate to the reading direction and print the anchor sentence under the map.

## 4. Stress-mode fallback (Grade B, mixed evidence)
Assume the deliberate simulation has already failed. The card is:

```
STRESS MODE
1. Stop walking.
2. Read the anchor sentence at the top of the card.
3. Confirm ONE landmark you can see right now.
4. Do ONE instruction.
5. Come back to this box.
If nothing on the card is visible: stand still, call <contact>, read them the last landmark you confirmed.
```

French: "MODE STRESS : arrêtez-vous. Lisez la phrase de repère. Confirmez UN repère. Faites UNE étape. Recommencez." Spanish: "MODO ESTRÉS: párate. Lee la frase de orientación. Confirma UN punto de referencia. Haz UN paso. Repite."

Rationale: Brown et al. 2020 (stress disrupts hippocampal-prefrontal prospective simulation and replay), Akan 2023, Olver 2015, Goodman 2020; contrary results in van Gerven 2016 and Husa 2022. Do not tell the person to "think it through more carefully"; the point is to stop demanding the computation.

## 5. Errorless route overlearning for high-value routes (Grade B, acquired TD populations)
For a route the person must do alone and often (home to work, hotel to conference venue), build the route card, walk it with a companion three times reading the card aloud, then alone with the card, then alone with the card in a pocket. Rivest et al. 2018 eliminated surplus direction changes in acquired topographical disorientation with an errorless smartphone method; Bouwmeester et al. 2015 reached implicit learning of frequent routes after years of written-route use but never of new routes without help. Expect route-specific gains and no transfer.

## 6. Remediation track (thin by design)
- Structured virtual-environment training can stimulate cognitive-map formation in small samples: McLaren-Gradinaru, Burles and Iaria 2020 (12-day computerised programme, 15 healthy volunteers, preliminary improvement); Bate et al. 2019 (one person with developmental prosopagnosia and topographical difficulty formed a map of one specific environment after intense overlearning); Liu et al. 2026 (RCT, 96 students with "DTD-like" difficulties, 8 weeks of VR orienteering improved a laboratory spatial-memory task). The Leiden Atopia Training Game pilot (UMC Utrecht, Delft, De Hoogstraat, 2025 to 2026) is unpublished. **Grade B for laboratory gains; Grade C for real-world transfer.**
- Offer it as optional, time-boxed, and measured (before and after on the same screening instrument). Never make a prosthetic conditional on completing training.

## 7. Profiles
### Viewpoint shift when looking up (Grade C)
Prefer ground-level reference points (doors, shopfronts, kerb features) over overhead signage. Do not require simultaneous looking-up and position tracking. Treat stairs, escalators, mezzanines, and ceiling-mounted signs as higher-risk decision points and give them a ground-level confirmation cue. In content checks, flag "look up", "overhead sign", "above you".

### Orientation-invariant reading (Grade C)
Every visual (map, diagram, sign mock-up) carries an explicit text anchor. Heading-up is enforced, not optional. Any cue that depends on the reader noticing or performing a rotation ("rotate the map", "clockwise", "mirror image") is flagged. Photos used as landmarks are taken from the approach direction and labelled "as seen when walking toward X".

## 8. What this plugin does not do
- It does not diagnose. See dtd-standards-compliance for screening instruments and the identification-by-history rule.
- It does not promise improvement from training.
- It does not emit a route it has not grounded in a landmark list; if no landmarks are available for a step, the step is marked "[no landmark available for this step; confirm with a person or a photo before relying on it]".
