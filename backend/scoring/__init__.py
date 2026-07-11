"""
Scoring package — punto de entrada unificado.
Exporta load_quiz_data, SCORERS y todos los engines.
"""
import json
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"


def load_quiz_data(quiz_type: str) -> dict:
    if quiz_type == "j1":
        path = DATA_DIR / "j1" / "brujula.json"
    else:
        path = DATA_DIR / f"{quiz_type}.json"
    return json.loads(path.read_text(encoding="utf-8"))


# ── J1 — Brújula Ideológica (nuevo engine, EFG, 3 ejes) ──────────────
from .j1_brujula import score_brujula

# ── J3 — MaxDiff Candidatos ───────────────────────────────────────────
from .j3_maxdiff import score_maxdiff

# ── Legacy engines (backwards compat con "ideological"/"party"/"candidate") ──
def score_ideological(responses: dict) -> dict:
    data = load_quiz_data("ideological")
    questions = {q["id"]: q for q in data["questions"]}
    econ_raw = social_raw = econ_max = social_max = 0.0

    for qid, answer in responses.items():
        if qid not in questions:
            continue
        q = questions[qid]
        value = int(answer) - 3
        we = q["weights"].get("econ", 0)
        ws = q["weights"].get("social", 0)
        econ_raw += value * we
        social_raw += value * ws
        econ_max += 2 * abs(we)
        social_max += 2 * abs(ws)

    econ_pct = round((econ_raw / econ_max * 100) if econ_max else 0, 1)
    social_pct = round((social_raw / social_max * 100) if social_max else 0, 1)

    if econ_pct >= 0 and social_pct >= 0:
        profile = "PC"
    elif econ_pct >= 0 and social_pct < 0:
        profile = "PP"
    elif econ_pct < 0 and social_pct >= 0:
        profile = "EC"
    else:
        profile = "EP"

    profiles = data["profiles"]
    return {
        "quiz_type": "ideological",
        "axes": {"econ": econ_pct, "social": social_pct},
        "profile": profile,
        "profile_data": profiles[profile],
    }


def score_party(responses: dict) -> dict:
    data = load_quiz_data("parties")
    questions = {q["id"]: q for q in data["questions"]}
    parties = list(data["parties"].keys())
    scores = {p: 0 for p in parties}
    max_scores = {p: 0 for p in parties}

    for qid, option_id in responses.items():
        if qid not in questions:
            continue
        q = questions[qid]
        for opt in q["options"]:
            if opt["id"] == option_id:
                for party, score in opt["scores"].items():
                    scores[party] += score
                    max_scores[party] += 3
                break

    affinities = {}
    for p in parties:
        raw = scores[p]
        max_s = max_scores[p]
        min_s = -max_s
        affinities[p] = round((raw - min_s) / (max_s - min_s) * 100 if max_s > 0 else 50, 1)

    ranked = sorted(affinities.items(), key=lambda x: x[1], reverse=True)
    top = ranked[0][0]
    return {
        "quiz_type": "party",
        "affinities": affinities,
        "ranked": [{"party": p, "score": s} for p, s in ranked],
        "top_party": top,
        "top_party_data": data["parties"][top],
    }


def score_candidate(responses: dict) -> dict:
    data = load_quiz_data("candidates")
    questions = {q["id"]: q for q in data["questions"]}
    candidates = list(data["candidates"].keys())
    scores = {c: 0 for c in candidates}
    max_scores = {c: 0 for c in candidates}

    for qid, option_id in responses.items():
        if qid not in questions:
            continue
        q = questions[qid]
        for opt in q["options"]:
            if opt["id"] == option_id:
                for candidate, score in opt["scores"].items():
                    scores[candidate] += score
                    max_scores[candidate] += 3
                break

    affinities = {}
    for c in candidates:
        raw = scores[c]
        max_s = max_scores[c]
        min_s = -max_s
        affinities[c] = round((raw - min_s) / (max_s - min_s) * 100 if max_s > 0 else 50, 1)

    ranked = sorted(affinities.items(), key=lambda x: x[1], reverse=True)
    top = ranked[0][0]
    return {
        "quiz_type": "candidate",
        "affinities": affinities,
        "ranked": [{"candidate": c, "score": s} for c, s in ranked],
        "top_candidate": top,
        "top_candidate_data": data["candidates"][top],
    }


SCORERS = {
    "j1": score_brujula,
    "ideological": score_ideological,
    "party": score_party,
    "candidate": score_candidate,
}

__all__ = ["load_quiz_data", "SCORERS", "score_brujula", "score_maxdiff"]
