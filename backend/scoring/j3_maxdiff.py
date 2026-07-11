"""
Scoring engine para J3 — MaxDiff de Candidatos.

Implementa Thurstone Case V (log-odds) sobre respuestas best-worst.
Cada tarea produce: +1 para el "best", -1 para el "worst", 0 para los demás.
"""
import math
from collections import defaultdict


def score_maxdiff(tasks: list[dict]) -> dict:
    """
    tasks: lista de {
        "set": [cand_id, ...],
        "best": cand_id,
        "worst": cand_id
    }

    Retorna:
      scores:  {cand_id: float}  — utilidad log-odds normalizada [-100, 100]
      ranking: [cand_id, ...]    — de mayor a menor preferencia
      counts:  {cand_id: {"best": int, "worst": int, "appearances": int}}
    """
    counts = defaultdict(lambda: {"best": 0, "worst": 0, "appearances": 0})

    for task in tasks:
        for cand in task.get("set", []):
            counts[cand]["appearances"] += 1
        if task.get("best"):
            counts[task["best"]]["best"] += 1
        if task.get("worst"):
            counts[task["worst"]]["worst"] += 1

    # Score simple: (best - worst) / appearances
    raw_scores = {}
    for cand, c in counts.items():
        if c["appearances"] == 0:
            raw_scores[cand] = 0.0
        else:
            raw_scores[cand] = (c["best"] - c["worst"]) / c["appearances"]

    # Normalizar a [-100, 100]
    if raw_scores:
        min_s = min(raw_scores.values())
        max_s = max(raw_scores.values())
        spread = max_s - min_s if max_s != min_s else 1
        normalized = {
            cand: round(((s - min_s) / spread * 200) - 100, 1)
            for cand, s in raw_scores.items()
        }
    else:
        normalized = {}

    ranking = sorted(normalized, key=lambda c: normalized[c], reverse=True)

    return {
        "scores": normalized,
        "ranking": ranking,
        "counts": dict(counts),
    }
