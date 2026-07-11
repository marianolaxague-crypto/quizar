import os
import sqlite3
import json
from pathlib import Path

DB_PATH = Path(os.environ.get("DB_PATH", str(Path(__file__).parent.parent / "data.db")))


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_conn() as conn:
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA busy_timeout=5000")
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS quiz_completions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                quiz_type TEXT,
                responses TEXT,
                result TEXT,
                voting_intention TEXT,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_qc_type
                ON quiz_completions(quiz_type);

            CREATE INDEX IF NOT EXISTS idx_qc_session
                ON quiz_completions(session_id);
        """)
        # Migración: agregar voting_intention si no existe (SQLite no soporta IF NOT EXISTS en ALTER)
        try:
            conn.execute("ALTER TABLE quiz_completions ADD COLUMN voting_intention TEXT")
        except Exception:
            pass  # La columna ya existe


def create_session(session_id: str):
    with get_conn() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO sessions (id) VALUES (?)",
            (session_id,)
        )


def session_exists(session_id: str) -> bool:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT 1 FROM sessions WHERE id = ?", (session_id,)
        ).fetchone()
        return row is not None


def save_completion(session_id: str, quiz_type: str, responses: dict, result: dict):
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO quiz_completions (session_id, quiz_type, responses, result) VALUES (?, ?, ?, ?)",
            (session_id, quiz_type, json.dumps(responses), json.dumps(result))
        )


def save_voting_intention(session_id: str, quiz_type: str, party: str):
    """Actualiza el último completion del usuario con su intención de voto."""
    with get_conn() as conn:
        conn.execute(
            """UPDATE quiz_completions
               SET voting_intention = ?
               WHERE id = (
                   SELECT id FROM quiz_completions
                   WHERE session_id = ? AND quiz_type = ?
                   ORDER BY completed_at DESC
                   LIMIT 1
               )""",
            (party, session_id, quiz_type)
        )


def get_nearby_vote_stats(archetype: str, min_n: int = 5) -> dict:  # I6: umbral k-anonimato subido a 5
    """
    Retorna la distribución de intención de voto para jugadores con el mismo arquetipo.
    Si hay menos de min_n respuestas, retorna insufficient_data=True.
    """
    with get_conn() as conn:
        rows = conn.execute(
            """SELECT voting_intention, COUNT(*) as n
               FROM quiz_completions
               WHERE quiz_type = 'j1'
                 AND voting_intention IS NOT NULL
                 AND JSON_EXTRACT(result, '$.archetype') = ?
               GROUP BY voting_intention
               ORDER BY n DESC""",
            (archetype,)
        ).fetchall()

    if not rows:
        return {"insufficient_data": True, "n": 0}

    total = sum(r["n"] for r in rows)
    if total < min_n:
        return {"insufficient_data": True, "n": total}

    return {
        "insufficient_data": False,
        "n": total,
        "distribution": [
            {"party": r["voting_intention"], "pct": round(r["n"] / total * 100, 1), "n": r["n"]}
            for r in rows
        ]
    }


def get_completion_by_session(session_id: str, quiz_type: str = "j1") -> dict | None:
    with get_conn() as conn:
        row = conn.execute(
            """SELECT result FROM quiz_completions
               WHERE session_id = ? AND quiz_type = ?
               ORDER BY completed_at DESC LIMIT 1""",
            (session_id, quiz_type)
        ).fetchone()
    return json.loads(row["result"]) if row else None


def get_completions(quiz_type: str) -> list[dict]:
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT result FROM quiz_completions WHERE quiz_type = ?",
            (quiz_type,)
        ).fetchall()
    return [json.loads(row["result"]) for row in rows]


def count_completions(quiz_type: str) -> int:
    with get_conn() as conn:
        count = conn.execute(
            "SELECT COUNT(*) FROM quiz_completions WHERE quiz_type = ?",
            (quiz_type,)
        ).fetchone()[0]
    return count


def get_j1_stats_sql() -> dict:
    with get_conn() as conn:
        total = conn.execute(
            "SELECT COUNT(*) FROM quiz_completions WHERE quiz_type = 'j1'"
        ).fetchone()[0]

        if total == 0:
            return {"total": 0, "profiles_pct": {}, "archetypes_pct": {}, "avg_econ": 0, "avg_social": 0, "avg_inst": 0}

        rows = conn.execute(
            "SELECT result FROM quiz_completions WHERE quiz_type = 'j1'"
        ).fetchall()

    results = [json.loads(r["result"]) for r in rows]
    profiles = {"EP": 0, "EC": 0, "PC": 0, "PP": 0, "C": 0}  # I5: incluir Centro Pragmático
    archetypes = {}
    econ_vals, social_vals, inst_vals = [], [], []

    for r in results:
        p = r.get("profile")
        if p in profiles:
            profiles[p] += 1
        a = r.get("archetype")
        if a:
            archetypes[a] = archetypes.get(a, 0) + 1
        if "econ" in r:
            econ_vals.append(r["econ"])
        if "social" in r:
            social_vals.append(r["social"])
        if "inst" in r:
            inst_vals.append(r["inst"])

    def avg(lst):
        return round(sum(lst) / len(lst), 1) if lst else 0

    # Promedios por dimensión
    dim_sums: dict[str, float] = {}
    dim_counts: dict[str, int] = {}
    for r in results:
        for dim, score in (r.get("dimensions") or {}).items():
            dim_sums[dim]   = dim_sums.get(dim, 0.0) + score
            dim_counts[dim] = dim_counts.get(dim, 0) + 1
    avg_dimensions = {
        dim: round(dim_sums[dim] / dim_counts[dim], 1)
        for dim in dim_sums if dim_counts[dim] > 0
    }

    return {
        "total": total,
        "profiles_pct": {k: round(v / total * 100, 1) for k, v in profiles.items()},
        "archetypes_pct": {k: round(v / total * 100, 1) for k, v in archetypes.items()},
        "avg_econ": avg(econ_vals),
        "avg_social": avg(social_vals),
        "avg_inst": avg(inst_vals),
        "avg_dimensions": avg_dimensions,
    }
