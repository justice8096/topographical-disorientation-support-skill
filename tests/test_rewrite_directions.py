"""Tests for the Python runtime sample. Run: python -m pytest tests/ -q"""
import importlib.util
import pathlib
import sys

import pytest

SAMPLE = pathlib.Path(__file__).resolve().parents[1] / "samples" / "rewrite_directions.py"
spec = importlib.util.spec_from_file_location("rewrite_directions", SAMPLE)
rd = importlib.util.module_from_spec(spec)
sys.modules["rewrite_directions"] = rd
spec.loader.exec_module(rd)


def test_lexicon_classes_en():
    hits = rd.find_direction_words("Go north, then left, then straight ahead.", "en")
    assert [h["cls"] for h in hits] == ["cardinal", "lateral", "relative"]


def test_accented_french_matches():
    assert len(rd.find_direction_words("Tournez à gauche puis à droite.", "fr")) == 2


def test_rewrite_with_landmarks_removes_cardinal_and_lateral():
    sentence, steps, notes = rd.rewrite(
        "Head north on Oak Street. Turn left at the light.", "en",
        landmarks=["the red church", "the fuel station"], start_facing="the red church",
    )
    assert sentence == "You are facing the red church."
    assert steps == ["Turn toward the red church.", "Turn toward the fuel station."]
    assert all(not rd.find_direction_words(s, "en") for s in steps)


def test_anchor_binding_fr_es():
    _, fr, _ = rd.rewrite("Tournez a gauche au feu.", "fr", anchor=("montre", "left"))
    assert fr == ["Tournez du côté de votre montre au feu."]
    _, es, _ = rd.rewrite("Gira a la derecha en el semaforo.", "es", anchor=("reloj", "left"))
    assert es == ["Gira hacia el lado de tu otro reloj en el semaforo."]


def test_anchor_that_is_a_direction_word_is_rejected():
    with pytest.raises(ValueError):
        rd.rewrite("Turn left.", "en", anchor=("left hand", "left"))


def test_oversized_input_rejected():
    with pytest.raises(ValueError):
        rd.find_direction_words("x" * (rd.MAX_SCAN_LENGTH + 1), "en")


def test_landmark_name_sanitised():
    _, steps, _ = rd.rewrite("Turn left.", "en", landmarks=["<b>church</b> {x} [y] `z`"])
    assert "<" not in steps[0] and "{" not in steps[0] and "`" not in steps[0]


def test_overpass_query_guards():
    q = rd.build_around_query(48.8584, 2.2945, 100, ["amenity", 'shop"]; out body; //'])
    assert "out body" not in q and 'nwr["amenity"]' in q
    for bad in [(float("nan"), 0, 100), (91, 0, 100), (0, 0, 5), (0, 0, 10000)]:
        with pytest.raises(ValueError):
            rd.build_around_query(*bad)


def test_offsets_survive_hangul_and_dotted_i():
    _, steps, _ = rd.rewrite("한국 Turn left.\nİstanbul: turn right.", "en", anchor=("watch hand", "left"))
    assert steps[0] == "한국 Turn toward your watch hand side."
    assert all(not [h for h in rd.find_direction_words(s, "en") if h["cls"] == "lateral"] for s in steps)


def test_control_and_format_characters_stripped_from_steps_and_names():
    _, steps, notes = rd.rewrite("Walk on.\x1b[2J\x1b]0;x\x07 Then stop.", "en", landmarks=["Cafe‮tfel nrut"])
    joined = "".join(steps)
    assert "\x1b" not in joined and "\x07" not in joined
    assert "‮" not in joined


def test_direction_word_landmark_is_dropped():
    _, steps, notes = rd.rewrite("Turn at the corner.", "en", landmarks=["the left alley"])
    assert "left alley" not in "".join(steps)
    assert any("dropped" in n for n in notes)
