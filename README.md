# Brújula Política AR

Quiz ideológico multidimensional para Argentina. El usuario responde 26 preguntas en ~5 minutos y recibe un perfil psicográfico situado en un espacio de 3 ejes: económico, sociocultural e institucional.

**Estado:** listo para deploy y piloto (E4.5 completa — ver `docs/PLAN_DESARROLLO.md`)

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
uvicorn main:app --reload
# → http://localhost:8000
```

El servidor sirve el frontend en `/`, el quiz en `/quiz` y el resultado en `/result`.

Para probar el flujo completo sin browser, levantar en puerto 8765 y usar curl:

```bash
# Crear sesión
curl -X POST http://localhost:8765/api/sessions

# Ver preguntas
curl http://localhost:8765/api/quizzes/j1/questions | python -m json.tool | head -30
```

---

## Deploy a Fly.io

### Prerrequisitos

1. Instalar flyctl: https://fly.io/docs/flyctl/install/
2. Tener cuenta en Fly.io
3. (Opcional pero recomendado) Bucket R2 en Cloudflare para backup de SQLite

### Pasos

```bash
# 1. Login
fly auth login

# 2. Crear app y volumen
fly apps create brujula-ar --org personal
fly volumes create brujula_data --region gru --size 1

# 3. Configurar backup R2 (reemplazar con tus credenciales)
fly secrets set \
  LITESTREAM_REPLICA_URL="s3://brujula-backups?endpoint=https://TU_ACCOUNT_ID.r2.cloudflarestorage.com&region=auto" \
  LITESTREAM_ACCESS_KEY_ID="TU_ACCESS_KEY" \
  LITESTREAM_SECRET_ACCESS_KEY="TU_SECRET_KEY"

# 4. Deploy
fly deploy
```

Si no tenés R2 aún, podés deployar igual — el script detecta que `LITESTREAM_REPLICA_URL` no está y levanta el servidor directamente. Los datos quedan en el volumen de Fly.io.

### URL resultante

`https://brujula-ar.fly.dev`

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
│       └── j1/brujula.json          # Banco de ítems v5.1 (31 ítems)
│
├── frontend/
│   ├── index.html                   # Landing
│   ├── quiz.html                    # Quiz (26 preguntas estratificadas)
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
    └── lessons.md                   # Lecciones aprendidas + checklist validación
```

---

## Estado del instrumento J1 (v5.1)

**31 ítems · 11 dimensiones · escala 4-point EFG · sin neutro**

| Eje | Dimensiones | Ítems |
|-----|-------------|-------|
| Económico | individualismo + meritocracia + modelo_economico | 9 |
| Sociocultural | tradicion + autoridad + localismo + derechos_autonomia + laicismo + migracion | 13 |
| Institucional | antiestablishment + confianza_institucional | 9 |

Cada sesión muestra 26 ítems seleccionados estratificadamente (al menos 1 por dimensión).

**5 perfiles base:** EP · EC · PC · PP · C  
**10 arquetipos:** cada perfil × institucionalista/anti-establishment

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

1. **Deploy Fly.io** — instalar flyctl en PC personal, ejecutar pasos de deploy arriba
2. **Piloto** — 150-200 respondentes, círculo cerrado con diversidad ideológica
3. **Análisis post-piloto** — Cronbach ≥ 0.70 por eje · item-total ≥ 0.20 · PCA
4. **Calibrar** — CENTER_THRESHOLD (ahora 10) e INST_THRESHOLD (ahora 15)

Ver `docs/PLAN_DESARROLLO.md` para el roadmap completo.

---

## Documentos de referencia

| Documento | Para qué sirve |
|-----------|----------------|
| `docs/PLAN_DESARROLLO.md` | Estado de cada etapa, próximos pasos, criterios del piloto |
| `docs/AJUSTES_UX_V1.md` | Cambios de UX/UI aplicados en julio 2026 |
| `tasks/lessons.md` | Checklist de 16 reglas para validar ítems nuevos |
| `backend/data/j1/brujula.json` | Fuente de verdad del instrumento |
| `backend/scoring/j1_brujula.py` | Scoring engine v4 |
