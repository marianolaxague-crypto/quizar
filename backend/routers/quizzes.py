from fastapi import APIRouter
from ..scoring import load_quiz_data

router = APIRouter(prefix="/api/quizzes", tags=["quizzes"])

J1_DATA = load_quiz_data("j1")

QUIZ_META = {
    "j1": {
        "title": "Brújula Ideológica",
        "subtitle": "Descubrí dónde estás en el espectro político",
        "icon": "🧭",
        "color": "#1a1a2e",
        "questions_count": J1_DATA.get("total_questions", len(J1_DATA.get("questions", []))),
        "time_minutes": 4,
        "format": J1_DATA.get("format", "efg"),
        "version": J1_DATA.get("version"),
    },
    "ideological": {
        "title": "Brújula Ideológica (v0)",
        "subtitle": "Versión legacy",
        "icon": "🧭",
        "color": "#1a1a2e",
        "questions_count": 24,
        "time_minutes": 5,
        "format": "likert"
    },
    "party": {
        "title": "¿A qué partido me parezco?",
        "subtitle": "Encontrá tu fuerza política más afín",
        "icon": "🗳️",
        "color": "#16213e",
        "questions_count": 8,
        "time_minutes": 3,
        "format": "options"
    },
    "candidate": {
        "title": "¿Mi candidato?",
        "subtitle": "¿Con qué figura política coincidís?",
        "icon": "🎯",
        "color": "#0f3460",
        "questions_count": 6,
        "time_minutes": 3,
        "format": "options"
    }
}


@router.get("")
def list_quizzes():
    return {"quizzes": [{"id": k, **v} for k, v in QUIZ_META.items()]}


@router.get("/{quiz_type}/questions")
def get_questions(quiz_type: str):
    data = load_quiz_data(quiz_type)
    return data
