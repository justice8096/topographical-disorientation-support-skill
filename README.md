# topographical-disorientation-support-skill

Accommodation framework and tooling for **developmental topographical disorientation** (DTD, also called **atopia**): the lifelong, often familial inability to form a cognitive map of the environment, with unreliable binding between direction words (left, right, north, south) and physical directions, intact landmark recognition, and loss of the deliberate directional workaround under stress.

Third skill in the accessibility family alongside [dyslexia-support-skill](https://github.com/justice8096/dyslexia-support-skill) and dyscalculia-support-skill. Same build system, same four output formats, same three jurisdictions (US, France, Spain), same rule that every recommendation carries an evidence grade.

[Version francaise](README.fr.md) | [Version en espanol](README.es.md)

## What it does

DTD is treated as a **bypass condition**, not a remediation condition. The product is the cognitive-prosthetics track:

- **Rewrite directions** so they contain no direction words: landmark relations instead of left/right, sides bound to a body fact the person states once, an orientation anchor sentence at the top, and a stress-mode card that assumes the person's workaround has already failed.
- **Landmark route scripts** from routing-engine decision points, ranking landmarks with the Graser 2016 salience recipe over OpenStreetMap data.
- **References from a geographic area**: a safe Overpass query builder with an endpoint allowlist, bounded areas, and sanitised results; also the entry point for reading a map image and grounding it in vector data.
- **References from text**: extract place references from prose (a neighbour's description, an emailed route) and match them to the area's landmarks.
- **Content check** that flags direction words without landmarks, any cardinal direction, north-up maps, you-are-here markers without a facing sentence, and (per profile) rotation-dependent or look-up instructions. It also reports prompt-injection patterns and treats content as data only.
- **Accommodation documents** for the US (ADA Title I, Section 504), France (MDPH, RQTH, amenagement de poste), and Spain (RDL 1/2013), each stating plainly that DTD has no statutory recognition and that the framing is by analogy.

Two optional comorbid profiles are supported and labelled Grade C: **viewpoint shift when looking up** and **orientation-invariant reading** (not noticing that a page or map is rotated).

## Scope and limits

This is a reading aid for a person on foot or as a passenger. It is not a driving aid and must not be used as the sole guidance in a vehicle or anywhere a wrong turn is dangerous. The area-landmarks command sends the coordinates you give it to a public OpenStreetMap Overpass mirror, so do not query a location you would not want a third party to see; use `--offline` to get the query text instead. Family-history paragraphs in generated documents describe relatives; their information is theirs to disclose, so confirm with them before sending such a document anywhere.

## Skills and commands

| Skill | Purpose |
|---|---|
| `dtd-standards-compliance` | Clinical framing, evidence grades, screening instruments, nearest codes, legal framing in US/FR/ES |
| `wayfinding-prosthetics` | Instruction rewriting rules, route scripts, map rules, stress mode, thin remediation track, profiles |
| `dtd-document-generation` | Accommodation letters, dossiers, clinical summaries, route cards, site orientation sheets |
| `dtd-gap-analysis` | Twelve gaps across apps, signage, clinics, law; audit checklist; heuristics; maturity model |

| Command | Purpose |
|---|---|
| `/rewrite-directions` | Prose directions in, landmark route card out (en, fr, es) |
| `/landmark-route-script` | Decision points plus landmark list in, printable route card out |
| `/area-landmarks` | Point or bbox in, sanitised OSM landmark list out; map-image reading |
| `/place-references` | Prose in, place references and landmark matches out |
| `/wayfinding-content-check` | Any wayfinding content in, graded findings out |
| `/dtd-accommodation-request` | Context and jurisdiction in, accommodation document out |

## Deterministic library

`lib/` is dependency-free TypeScript that the commands, the MCP server, and the CLI all use: the three-language direction lexicon, the instruction rewriter, the Overpass query builder and parser, the salience scorer, the content checker, and the place-reference extractor. It performs no network access except `fetchLandmarks`, which only talks to allowlisted Overpass mirrors.

## Build

```
cd tooling
npm ci
npx tsx build.ts --clean        # all formats into ../dist
npx tsx test-build.ts --verbose # format integration tests
npx tsx test-lib.ts --verbose   # library functional tests
npx tsx test-security.ts --verbose
```

Output formats: Claude Code plugin (`dist/claude-plugin`, also synced to the repo root), OpenAI function schemas, n8n node definition, prompt library, MCP server, and a standalone CLI (`wayfinding-audit`).

## Evidence

The research base, with grades, is in `docs/research/research-foundation-2026-10-17.md`. Key sources: Iaria et al. 2009; Iaria and Barton 2010; Barclay et al. 2016; Burles and Iaria 2020; van der Ham et al. 2025 (systematic review); Piccardi et al. 2022; Thaler et al. 2025; Brown et al. 2020; Wunderlich, Grieger and Gramann 2022; Pazzaglia and De Beni 2006; McKenzie and Klippel 2016; Graser 2016.

## Gates

Before release: `post-commit-audit`, dyslexia-support-skill content check, dyscalculia-support-skill content check (distances, bearings, and clock-face positions are numeric), plus `test-security.ts`.

## Licence

CC0-1.0. OpenStreetMap data used at runtime is ODbL and must be attributed by the consuming application.
