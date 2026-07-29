import json
import time
from collections import defaultdict
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from backend.database import init_db, get_completion_by_session
from backend.routers.quizzes import router as quizzes_router
from backend.routers.sessions import router as sessions_router
from backend.routers.stats import router as stats_router

app = FastAPI(title="Quiz Político AR")

# ── Rate limiting (in-memory, pilot-grade) ────────────────────────────
# Máx. 5 submits por IP en una ventana de 10 minutos.
_RATE_LIMIT_MAX     = 5
_RATE_LIMIT_WINDOW  = 600  # segundos
_rate_hits: dict[str, list[float]] = defaultdict(list)

def _check_rate_limit(ip: str) -> bool:
    """Retorna True si la IP está dentro del límite, False si lo supera."""
    now = time.monotonic()
    hits = _rate_hits[ip]
    hits[:] = [t for t in hits if now - t < _RATE_LIMIT_WINDOW]
    if len(hits) >= _RATE_LIMIT_MAX:
        return False
    hits.append(now)
    return True

init_db()


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    if request.url.path.endswith(("/submit", "/vote", "/sessions")):
        ip = request.client.host if request.client else "unknown"
        if not _check_rate_limit(ip):
            return JSONResponse(
                status_code=429,
                content={"detail": "Demasiados intentos. Esperá unos minutos antes de volver a intentarlo."}
            )
    return await call_next(request)


app.include_router(quizzes_router)
app.include_router(sessions_router)
app.include_router(stats_router)

FRONTEND = Path(__file__).parent / "frontend"
app.mount("/static", StaticFiles(directory=FRONTEND), name="static")


@app.get("/")
def index():
    return FileResponse(FRONTEND / "index.html")


@app.get("/quiz")
def quiz_page():
    return FileResponse(FRONTEND / "quiz.html")


@app.get("/result")
def result_page():
    return FileResponse(FRONTEND / "result.html")


@app.get("/share/{session_id}")
def share_page(session_id: str, request: Request):
    result = get_completion_by_session(session_id)
    if not result:
        return RedirectResponse(url="/quiz?type=j1")

    arch       = result.get("archetype_data") or {}
    arch_id    = result.get("archetype", "")
    arch_name  = arch.get("name", "Brújula Política AR")
    tagline    = arch.get("tagline_long", "Descubrí dónde estás parado ideológicamente.")
    image_path = arch.get("image_url") or f"/static/images/archetypes/{arch_id}.png"

    base_url   = str(request.base_url).rstrip("/")
    og_image   = f"{base_url}{image_path}"
    canonical  = f"{base_url}/share/{session_id}"
    result_json = json.dumps(result, ensure_ascii=False).replace("</", "<\\/").replace("<!--", "<\\!--")

    def esc(s): return s.replace('"', "&quot;").replace("'", "&#39;")

    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{esc(arch_name)} · Brújula Política AR</title>
  <meta property="og:type" content="website">
  <meta property="og:url" content="{canonical}">
  <meta property="og:title" content="Soy {esc(arch_name)} · Brújula Política AR">
  <meta property="og:description" content="{esc(tagline)}">
  <meta property="og:image" content="{og_image}">
  <meta property="og:image:width" content="800">
  <meta property="og:image:height" content="800">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Soy {esc(arch_name)} · Brújula Política AR">
  <meta name="twitter:description" content="{esc(tagline)}">
  <meta name="twitter:image" content="{og_image}">
  <link rel="stylesheet" href="/static/css/style.css">
  <script>window.__QUIZ_RESULT__ = {result_json};</script>
</head>
<body>
<header>
  <div class="container">
    <div class="inner">
      <div class="logo">Brújula <span>Política AR</span></div>
      <a href="/" style="font-size:0.85rem;color:var(--text-muted)">← Inicio</a>
    </div>
  </div>
</header>
<main>
  <div class="result-wrapper" id="result-wrapper">
    <div style="text-align:center;padding:80px 0;color:var(--text-muted)">Cargando tu resultado...</div>
  </div>
</main>
<script src="/static/js/results.js"></script>
</body>
</html>"""

    return HTMLResponse(content=html)
