#!/usr/bin/env python3
"""
Python port of the deterministic core: direction-word detection and the
landmark rewriter, plus an Overpass query builder with the same guards as
lib/overpass.ts. Standard library only.

    python3 rewrite_directions.py --locale fr --anchor "montre:left" \
        --landmarks "l'église rouge,la station-service" < directions.txt

    python3 rewrite_directions.py query --center 48.8584,2.2945 --radius 120
"""
import argparse
import re
import sys
import unicodedata

MAX_SCAN_LENGTH = 200_000
MAX_RADIUS_M = 400
MIN_RADIUS_M = 10
LANDMARK_KEYS = ["amenity", "shop", "tourism", "historic", "leisure", "building",
                 "man_made", "natural", "public_transport", "railway", "place_of_worship"]
OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
]

LEXICON = {
    "en": {
        "lateral": ["left", "right", "left-hand", "right-hand", "leftward", "rightward", "to the left", "to the right",
                    "on the left", "on the right", "to your left", "to your right", "on your left", "on your right", "the left", "the right"],
        "cardinal": ["north", "south", "east", "west", "northeast", "northwest", "southeast", "southwest",
                     "north-east", "north-west", "south-east", "south-west", "northbound", "southbound",
                     "eastbound", "westbound", "northern", "southern", "eastern", "western"],
        "relative": ["straight ahead", "straight on", "ahead", "behind", "backwards", "forward", "forwards"],
        "rotation": ["turn around", "u-turn", "about face", "double back"],
    },
    "fr": {
        "lateral": ["gauche", "droite", "a gauche", "a droite", "sur votre gauche", "sur votre droite", "cote gauche", "cote droit"],
        "cardinal": ["nord", "sud", "est", "ouest", "nord-est", "nord-ouest", "sud-est", "sud-ouest",
                     "vers le nord", "vers le sud", "vers l'est", "vers l'ouest"],
        "relative": ["tout droit", "devant", "derriere", "en arriere", "en avant"],
        "rotation": ["demi-tour", "faire demi-tour", "faites demi-tour"],
    },
    "es": {
        "lateral": ["izquierda", "derecha", "a la izquierda", "a la derecha", "mano izquierda", "mano derecha", "lado izquierdo", "lado derecho"],
        "cardinal": ["norte", "sur", "este", "oeste", "noreste", "noroeste", "sureste", "suroeste", "sudeste", "sudoeste",
                     "hacia el norte", "hacia el sur", "hacia el este", "hacia el oeste"],
        "relative": ["todo recto", "recto", "de frente", "adelante", "atras", "detras", "hacia atras"],
        "rotation": ["media vuelta", "cambio de sentido", "da la vuelta", "de la vuelta"],
    },
}

PHRASES = {
    "en": {"facing": "You are facing {}.", "unknown": "Before you start: name one thing you can see directly in front of you and write it here.",
           "toward": "Turn toward {}.", "keep": "Keep {} on your {} side.", "side": "toward your {} side", "side_on": "on your {} side", "other": "other-",
           "none": "[no landmark available for this step; confirm with a person or a photo before relying on it]",
           "stress": "STRESS MODE: stop. Read the anchor sentence. Confirm ONE landmark. Take ONE step. Repeat."},
    "fr": {"facing": "Vous faites face à {}.", "unknown": "Avant de partir : nommez une chose que vous voyez juste devant vous et notez-la ici.",
           "toward": "Tournez vers {}.", "keep": "Gardez {} du côté de votre {}.", "side": "du côté de votre {}", "side_on": "du côté de votre {}", "other": "autre ",
           "none": "[aucun repère disponible pour cette étape ; confirmez avec une personne ou une photo avant de vous y fier]",
           "stress": "MODE STRESS : arrêtez-vous. Lisez la phrase de repère. Confirmez UN repère. Faites UNE étape. Recommencez."},
    "es": {"facing": "Estás mirando hacia {}.", "unknown": "Antes de salir: nombra una cosa que veas justo delante de ti y anótala aquí.",
           "toward": "Gira hacia {}.", "keep": "Mantén {} del lado de tu {}.", "side": "hacia el lado de tu {}", "side_on": "el lado de tu {}", "other": "otro ",
           "none": "[no hay punto de referencia para este paso; confírmalo con una persona o una foto antes de fiarte]",
           "stress": "MODO ESTRÉS: párate. Lee la frase de orientación. Confirma UN punto de referencia. Haz UN paso. Repite."},
}


def fold(text):
    return "".join(c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn").lower()


def fold_with_map(nfc):
    """Fold for matching and return (folded, map) where map[i] is the NFC index
    of folded index i. NFD can lengthen text with non-mark code points (Hangul
    jamo, some Indic vowel signs) and lower-casing a dotted capital I yields two
    code points, so folded offsets cannot be applied to the NFC text directly."""
    folded = []
    index_map = []
    for i, ch in enumerate(nfc):
        f = fold(ch)
        folded.append(f)
        index_map.extend([i] * len(f))
    index_map.append(len(nfc))
    return "".join(folded), index_map


def strip_unsafe(text):
    """Remove control characters (except tab and newline) and Unicode format
    characters (bidi overrides, zero-width, BOM) and line/paragraph separators
    from anything that will be shown to a person or placed in a prompt."""
    out = []
    for c in text:
        if c in "\t\n":
            out.append(c)
        elif unicodedata.category(c) in ("Cc", "Cf") or c in "\u2028\u2029":
            continue
        else:
            out.append(c)
    return "".join(out)


def sanitize(name):
    return re.sub(r"[<>`{}\[\]]", "", strip_unsafe(name)).strip()[:120]


def build_regex(locale):
    words = [w for cls in LEXICON[locale].values() for w in cls]
    words.sort(key=len, reverse=True)
    body = "|".join(re.escape(w) for w in words)
    return re.compile(r"(?<![^\W_])(?:" + body + r")(?![^\W_])", re.IGNORECASE)


def find_direction_words(text, locale):
    if not isinstance(text, str):
        raise TypeError("text must be a string")
    if len(text) > MAX_SCAN_LENGTH:
        raise ValueError("input exceeds MAX_SCAN_LENGTH")
    nfc = unicodedata.normalize("NFC", text)
    folded, index_map = fold_with_map(nfc)
    hits = []
    for m in build_regex(locale).finditer(folded):
        word = m.group(0)
        cls = next((c for c, ws in LEXICON[locale].items() if word in ws), "lateral")
        start, end = index_map[m.start()], index_map[m.end()]
        hits.append({"text": word, "index": start, "end": end, "cls": cls})
    return hits


def rewrite(instructions, locale, landmarks=None, anchor=None, start_facing=None, stress=False):
    landmarks_in = landmarks
    if len(instructions) > MAX_SCAN_LENGTH:
        raise ValueError("instructions exceed MAX_SCAN_LENGTH")
    p = PHRASES[locale]
    steps = [s.strip() for s in re.split(r"\r?\n|(?<=[.;!?])\s{1,4}(?=[A-Z\u00C0-\u00DC])", strip_unsafe(instructions)) if s.strip()]
    if len(steps) > 200:
        raise ValueError("too many steps")
    notes = []
    landmarks = []
    for l in (landmarks_in or []):
        name = sanitize(l)
        if not name:
            continue
        if any(h["cls"] != "relative" for h in find_direction_words(name, locale)):
            notes.append("landmark dropped because its name contains a direction word: " + name)
            continue
        landmarks.append(name)
    if anchor:
        label, side = anchor
        label = sanitize(label)
        if side not in ("left", "right") or not label or find_direction_words(label, locale):
            raise ValueError("anchor must be '<body fact>:<left|right>' and must not be a direction word")
        anchor = (label, side)
    out = []
    for i, step in enumerate(steps):
        hits = find_direction_words(step, locale)
        lm = landmarks[i] if i < len(landmarks) else None
        if not hits:
            out.append(step)
            continue
        lateral = [h for h in hits if h["cls"] == "lateral"]
        if lm:
            out.append(p["toward"].format(lm))
        elif lateral and anchor:
            label, side = anchor
            rebuilt = unicodedata.normalize("NFC", step)
            for h in reversed(lateral):
                hit = h["text"]
                is_left = re.search(r"left|gauche|izquierd", hit) is not None
                same = (side == "left") if is_left else (side == "right")
                side_label = label if same else p["other"] + label
                if locale == "en":
                    phrase = (p["side_on"] if hit.startswith("on ") else p["side"]).format(side_label)
                elif locale == "es":
                    phrase = (p["side"] if hit.startswith("a la ") else p["side_on"]).format(side_label)
                else:
                    phrase = p["side"].format(side_label)
                rebuilt = rebuilt[:h["index"]] + phrase + rebuilt[h["end"]:]
            out.append(rebuilt)
            notes.append("step %d: side bound to body anchor" % (i + 1))
        else:
            out.append(step + " " + p["none"])
            notes.append("step %d: direction word kept, no landmark or anchor" % (i + 1))
        if any(h["cls"] == "cardinal" for h in hits):
            notes.append("step %d: cardinal direction replaced" % (i + 1))
    if stress:
        out.insert(0, p["stress"])
    anchor_sentence = p["facing"].format(sanitize(start_facing)) if start_facing else p["unknown"]
    return anchor_sentence, out, notes


def build_around_query(lat, lon, radius_m, keys=None):
    for v, lo, hi, name in ((lat, -90, 90, "lat"), (lon, -180, 180, "lon")):
        if not isinstance(v, (int, float)) or v != v or v in (float("inf"), float("-inf")) or not lo <= v <= hi:
            raise ValueError(name + " out of range")
    if not MIN_RADIUS_M <= radius_m <= MAX_RADIUS_M:
        raise ValueError("radius must be between %d and %d" % (MIN_RADIUS_M, MAX_RADIUS_M))
    keys = [k for k in (keys or LANDMARK_KEYS) if k in LANDMARK_KEYS]
    if not keys:
        raise ValueError("no allowed landmark keys")
    clauses = "\n".join('  nwr["%s"]["name"](around:%d,%.6f,%.6f);' % (k, round(radius_m), lat, lon) for k in keys)
    return "[out:json][timeout:20];\n(\n%s\n);\nout center tags 200;" % clauses


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("mode", nargs="?", default="rewrite", choices=["rewrite", "query"])
    ap.add_argument("--locale", default="en", choices=["en", "fr", "es"])
    ap.add_argument("--landmarks", default="")
    ap.add_argument("--anchor")
    ap.add_argument("--facing")
    ap.add_argument("--stress", action="store_true")
    ap.add_argument("--center")
    ap.add_argument("--radius", type=float, default=120)
    a = ap.parse_args()
    if a.mode == "query":
        lat, lon = (float(x) for x in a.center.split(","))
        print(build_around_query(lat, lon, a.radius))
        return
    text = sys.stdin.read()
    anchor = tuple(a.anchor.rsplit(":", 1)) if a.anchor else None
    sentence, steps, notes = rewrite(text, a.locale, [s.strip() for s in a.landmarks.split(",") if s.strip()], anchor, a.facing, a.stress)
    print(sentence)
    for i, s in enumerate(steps, 1):
        print("%d. %s" % (i, s))
    for n in notes:
        print("note: " + n)


if __name__ == "__main__":
    main()
