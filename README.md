# Brújula Política AR

Quiz ideológico multidimensional para Argentina. El usuario responde 19 preguntas en ~4 minutos y recibe un perfil psicográfico situado en un espacio de 3 ejes: económico, sociocultural e institucional.

**Estado:** deployado en producción · piloto activo

**URL de producción:** https://brujula-politica.up.railway.app

---

## Setup en máquina nueva

### Requisitos

- Python 3.13
- Git

### Instalación

```bash
git clone <repo>
cd quiz-ar
pip install -r requirements.txt
```

### Correr en local

```bash
# En Mac/Linux:
uvicorn main:app --reload

# En Windows (Python en AppData):
python -m uvicorn main:app --reload

# → http://localhost:8000
```

El servidor sirve el frontend en `/`, el quiz en `/quiz` y el resultado en `/result`.

### Simular resultados masivos (validación del scoring engine)

```bash
python scripts/simulate.py              # 500 respondentes por perfil, noise=0.3
python scripts/simulate.py --n 2000     # muestra más grande
python scripts/simulate.py --noise 0.1  # sesgo más pronunciado
```

---

## Deploy a Railway ⚠️ Fly.io eliminó el free tier en 2026

Fly.io ya no tiene tier gratuito (requiere tarjeta, mínimo $2–5/mes). La nueva plataforma de deploy es **Railway**, que tiene $1/mes de crédito gratuito — suficiente para el piloto (512MB RAM ≈ $0.17/mes).

El Dockerfile existente funciona sin modificaciones.

### Prerrequisitos

1. Crear cuenta en https://railway.app
2. Tener un bucket R2 en Cloudflare (para backup SQLite via Litestream)
3. Instalar Railway CLI: `npm install -g @railway/cli`

### Pasos de deploy

```bash
# 1. Login
railway login

# 2. Crear proyecto (desde la carpeta del proyecto)
railway init

# 3. Configurar variables de entorno en Railway Dashboard > Variables:
#    APP_ENV = production
#    DB_PATH = /data/brujula.db
#    PORT = 8080
#    LITESTREAM_REPLICA_URL = s3://brujula-backups?endpoint=...
#    LITESTREAM_ACCESS_KEY_ID = TU_ACCESS_KEY
#    LITESTREAM_SECRET_ACCESS_KEY = TU_SECRET_KEY

# 4. Deploy (usa el Dockerfile existente)
railway up
```

### Persistencia de datos

Railway no tiene volúmenes gratuitos — la DB es efímera por defecto.
Litestream resuelve esto: restaura desde R2 al arrancar y replica cada cambio.
Sin R2, los datos se pierden si el container se reinicia.

### URL resultante

Railway asigna una URL pública del tipo `https://brujula-ar.up.railway.app`

---

## Estructura del proyecto

```
quiz-ar/
├── main.py                          # FastAPI app + rutas HTML
├── requirements.txt
├── Dockerfile
├── fly.toml                         # Config Fly.io
├── litestream.yml                   # Config backup SQLite → R2
├── scripts/
│   └── start.sh                     # Entrypoint del container
│
├── backend/
│   ├── database.py                  # SQLite (DB_PATH configurable via env)
│   ├── routers/
│   │   ├── quizzes.py               # GET /api/quizzes/{type}/questions
│   │   ├── sessions.py              # POST /api/sessions, /submit, /vote
│   │   └── stats.py                 # GET /api/stats/{type}
│   ├── scoring/
│   │   ├── j1_brujula.py            # Scoring engine v4 (4-point EFG)
│   │   ├── j2_vision.py             # stub
│   │   └── j3_maxdiff.py            # stub
│   └── data/
│       └── j1/brujula.json          # Banco de ítems v6.1 (19 ítems, 11 dimensiones)
│
├── frontend/
│   ├── index.html                   # Landing
│   ├── quiz.html                    # Quiz (19 preguntas estratificadas)
│   ├── result.html                  # Reward screen
│   ├── css/
│   │   ├── style.css                # Estilos globales + reward
│   │   └── quiz-light.css           # Estilos del quiz (tema crema)
│   ├── js/
│   │   ├── quiz.js                  # Motor EFG + pantallas intermedias
│   │   └── results.js               # Reward + share + loading screen
│   └── images/
│       └── archetypes/              # 10 imágenes PNG de arquetipos
│
├── docs/
│   ├── PLAN_DESARROLLO.md           # Roadmap completo y estado actual
│   ├── AJUSTES_UX_V1.md             # Cambios UX/UI aplicados (11/07/2026)
│   ├── PROYECTO_BRUJULA.md          # Documento de presentación del proyecto
│   └── research/
│       ├── PLAN_REDISENO_BANCO_V1.md
│       └── REVALIDACION_J1_V1.md
│
└── tasks/
    ├── lessons.md                   # Lecciones aprendidas + checklist validación
    ├── J2_PLAN.md                   # Plan de implementación J2 (4 fases)
    ├── J2_BANCO_ESCENARIOS.md       # Set definitivo + banco de candidatos + trazabilidad
    ├── J2_CONTENIDO_NARRATIVO.md    # Contextos, modales, titulares, ofertas
    └── J2_INVESTIGACION_DISENO.md   # Investigación de referentes y metodología
```

---

## Estado del instrumento J1 (v6.1)

**19 ítems · 11 dimensiones · escala 4-point EFG · sin neutro · todos aprobados**

| Eje | Dimensiones | Ítems |
|-----|-------------|-------|
| Económico | individualismo (2) + meritocracia (2) + modelo_economico (2) | 6 |
| Sociocultural | tradicion (1) + autoridad (1) + localismo (1) + derechos_autonomia (1) + laicismo (1) + migracion (1) | 6 |
| Institucional | antiestablishment (4) + confianza_institucional (3) | 7 |

**5 perfiles base:** EP · EC · PC · PP · C  
**10 arquetipos:** cada perfil × institucionalista/anti-establishment

Ver `docs/VALIDACION_ITEMS_V6.md` para el estado completo y el protocolo de generación de ítems.

---

## Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `DB_PATH` | `data.db` (raíz del proyecto) | Ruta absoluta de la base de datos SQLite |
| `APP_ENV` | `development` | `production` desactiva endpoints de debug |
| `LITESTREAM_REPLICA_URL` | — | URL R2 para backup continuo (opcional) |
| `LITESTREAM_ACCESS_KEY_ID` | — | Credencial R2 |
| `LITESTREAM_SECRET_ACCESS_KEY` | — | Credencial R2 |

---

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Landing page |
| GET | `/quiz` | Quiz page |
| GET | `/result` | Reward page |
| GET | `/share/{session_id}` | Share page con OG tags dinámicos |
| POST | `/api/sessions` | Crear sesión anónima |
| GET | `/api/quizzes/j1/questions` | Banco de preguntas completo |
| POST | `/api/quiz/j1/submit` | Procesar respuestas → resultado |
| POST | `/api/quiz/j1/vote` | Guardar intención de voto |
| GET | `/api/stats/j1` | Estadísticas agregadas |

---

## Próximos pasos (al retomar)

1. **Deploy Railway** — crear cuenta en railway.app, configurar variables de entorno, ejecutar `railway up`
2. **Piloto** — 150-200 respondentes, círculo cerrado con diversidad ideológica
3. **Análisis post-piloto** — Cronbach ≥ 0.70 por eje · item-total ≥ 0.20 · PCA
4. **Calibrar** — CENTER_THRESHOLD (ahora 10) e INST_THRESHOLD (ahora 15)

Ver `docs/PLAN_DESARROLLO.md` para el roadmap completo.

---

## Documentos de referencia

| Documento | Para qué sirve |
|-----------|----------------|
| `docs/PLAN_DESARROLLO.md` | Estado de cada etapa, próximos pasos, criterios del piloto |
| `docs/VALIDACION_ITEMS_V6.md` | Estado v6.1: todos los ítems aprobados + protocolo de generación |
| `tasks/lessons.md` | Protocolo de generación de ítems + lecciones aprendidas |
| `backend/data/j1/brujula.json` | Fuente de verdad del instrumento (v6.1, 19 ítems) |
| `backend/scoring/j1_brujula.py` | Scoring engine v4 (4-point EFG) |
| `scripts/simulate.py` | Simulación masiva para validar el scoring engine |
