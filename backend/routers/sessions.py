import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..database import create_session, session_exists, save_completion, save_voting_intention, get_nearby_vote_stats
from ..scoring import SCORERS

router = APIRouter(prefix="/api", tags=["sessions"])


class SubmitRequest(BaseModel):
    session_id: str
    responses: dict


class VoteRequest(BaseModel):
    session_id: str
    voting_intention: str


@router.post("/sessions")
def create_session_endpoint():
    session_id = str(uuid.uuid4())
    create_session(session_id)
    return {"session_id": session_id}


@router.post("/quiz/{quiz_type}/submit")
def submit_quiz(quiz_type: str, body: SubmitRequest):
    if quiz_type not in SCORERS:
        raise HTTPException(status_code=404, detail=f"Quiz '{quiz_type}' no encontrado")

    if not session_exists(body.session_id):
        raise HTTPException(status_code=400, detail="Sesión inválida")

    # Validación básica de respuestas
    if not body.responses:
        raise HTTPException(status_code=400, detail="No se recibieron respuestas")

    result = SCORERS[quiz_type](body.responses)
    save_completion(body.session_id, quiz_type, body.responses, result)
    return result


@router.post("/quiz/{quiz_type}/vote")
def save_vote(quiz_type: str, body: VoteRequest):
    """Guarda la intención de voto y retorna estadísticas de jugadores con el mismo arquetipo."""
    if not session_exists(body.session_id):
        raise HTTPException(status_code=400, detail="Sesión inválida")

    save_voting_intention(body.session_id, quiz_type, body.voting_intention)

    # Buscar el arquetipo del usuario para devolver stats relevantes
    nearby_stats = None
    if quiz_type == "j1":
        from ..database import get_conn
        import json as _json
        with get_conn() as conn:
            row = conn.execute(
                """SELECT result FROM quiz_completions
                   WHERE session_id = ? AND quiz_type = ?
                   ORDER BY completed_at DESC LIMIT 1""",
                (body.session_id, quiz_type)
            ).fetchone()
        if row:
            result = _json.loads(row["result"])
            archetype = result.get("archetype")
            if archetype:
                nearby_stats = get_nearby_vote_stats(archetype)

    return {"saved": True, "nearby_stats": nearby_stats}
