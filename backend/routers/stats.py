import os
from fastapi import APIRouter, HTTPException
from ..database import get_completions, count_completions, get_j1_stats_sql, get_conn

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("/j1/last-result")
def get_last_result():
    """Debug endpoint — solo disponible en modo desarrollo."""
    if os.getenv("APP_ENV", "production") != "development":
        raise HTTPException(status_code=404, detail="Not found")
    import json
    with get_conn() as conn:
        row = conn.execute(
            "SELECT result FROM quiz_completions WHERE quiz_type='j1' ORDER BY completed_at DESC LIMIT 1"
        ).fetchone()
    if not row:
        return {"error": "no results yet"}
    return json.loads(row["result"])


@router.get("/{quiz_type}")
def get_stats(quiz_type: str):
    if quiz_type == "j1":
        return get_j1_stats_sql()

    total = count_completions(quiz_type)
    results = get_completions(quiz_type)

    if not results:
        return {"total": 0, "data": {}}

    if quiz_type == "ideological":
        return _ideological_stats(results, total)
    elif quiz_type == "party":
        return _party_stats(results, total)
    elif quiz_type == "candidate":
        return _candidate_stats(results, total)
    return {"total": total}


def _ideological_stats(results: list, total: int) -> dict:
    profiles = {"EP": 0, "EC": 0, "PC": 0, "PP": 0, "C": 0}  # I5: incluir Centro Pragmático
    econ_values, social_values = [], []

    for r in results:
        if "profile" in r:
            profiles[r["profile"]] = profiles.get(r["profile"], 0) + 1
        # Soporte para formato viejo (axes wrapper) y nuevo (directo)
        econ = r.get("econ") or (r.get("axes") or {}).get("econ")
        social = r.get("social") or (r.get("axes") or {}).get("social")
        if econ is not None:
            econ_values.append(econ)
        if social is not None:
            social_values.append(social)

    pct_profiles = {k: round(v / total * 100, 1) for k, v in profiles.items()}
    avg_econ = round(sum(econ_values) / len(econ_values), 1) if econ_values else 0
    avg_social = round(sum(social_values) / len(social_values), 1) if social_values else 0

    return {
        "total": total,
        "profiles_pct": pct_profiles,
        "avg_econ": avg_econ,
        "avg_social": avg_social,
    }


def _party_stats(results: list, total: int) -> dict:
    party_counts = {}
    for r in results:
        p = r.get("top_party")
        if p:
            party_counts[p] = party_counts.get(p, 0) + 1
    pct = {k: round(v / total * 100, 1) for k, v in party_counts.items()}
    return {"total": total, "top_party_pct": pct}


def _candidate_stats(results: list, total: int) -> dict:
    candidate_counts = {}
    for r in results:
        c = r.get("top_candidate")
        if c:
            candidate_counts[c] = candidate_counts.get(c, 0) + 1
    pct = {k: round(v / total * 100, 1) for k, v in candidate_counts.items()}
    return {"total": total, "top_candidate_pct": pct}
