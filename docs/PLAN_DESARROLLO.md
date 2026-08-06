# Brújula Política AR — Plan de Desarrollo del Producto

**Última actualización:** 11/07/2026
**Estado general:** E4.5 completa · Listo para deploy y piloto (E5)

---

## Norte del producto

Un argentino cualquiera responde 19 preguntas en 4-5 minutos y descubre dónde está parado ideológicamente — sin que el quiz le diga qué está "bien" o "mal" pensar. El resultado es visualmente claro, compartible, y contextualizado con cómo respondieron los demás.

El diferencial no es el quiz: es el **dataset** que se acumula. Con 1.000 respuestas reales, Brújula AR es el primer mapa ideológico multidimensional calibrado para Argentina.

---

## Los tres juegos

| Juego | Pregunta central | Metodología | Estado |
|-------|-----------------|-------------|--------|
| **J1 — Brújula Ideológica** | ¿Cómo pensás? | EFG 4-point actitudinal (sin anclas políticas) | ✅ Listo para deploy — blocker: OG meta tags |
| **J2 — El Legislador** | ¿A qué bloque terminás perteneciendo? | Simulador legislativo · scoring vs. actas reales | Diseño v2.0 cerrado (06/08/2026) — pendiente implementación |
| **J3 — MaxDiff Candidatos** | ¿A quién preferís? | MaxDiff best-worst (20 figuras) | Sin diseñar |

**Transversal:** ancla de intención de voto post-resultado en todos los juegos (implementada en el backend).

---

## Estado del instrumento J1 — versión actual

### brujula.json v5.0 (11/07/2026)

**26 ítems · 9 dimensiones · escala 4-point EFG**

Escala: 1=Claramente A, 2=Más bien A, 3=Más bien B, 4=Claramente B. value=0=escape externo "No tengo postura" (excluido del denominador).

| Dimensión | Eje | Ítems | IDs |
|-----------|-----|-------|-----|
| individualismo | econ | 4 | i1_1, i1_2, i1_3, N2 |
| meritocracia | econ | 3 | i2_1, i2_2, N1 |
| tradicion | social | 2 | i3_1, i3_2 |
| autoridad | social | 3 | i4_2, N3, N8 |
| localismo | social | 2 | i5_1, i5_2 |
| derechos_autonomia | social | 2 | d7_1, d7_2 |
| laicismo | social | 2 | d8_1, d8_2 |
| migracion | social | 2 | d9_1, d9_2 |
| antiestablishment | inst | 6 | i6_2, i6_3, i6_5, N4, N5, N6 |
| **TOTAL** | | **26** | |

**Cobertura por eje:**
- Eje econ: 7 ítems (individualismo + meritocracia)
- Eje social: 13 ítems (tradicion + autoridad + localismo + derechos_autonomia + laicismo + migracion)
- Eje inst: 6 ítems (antiestablishment — eje ortogonal)

**Eliminados en v5.0:** `fuentes_info` (d10_1, d10_2 — dimensión suprimida); `i2_3`, `i4_1`, `i6_1`, `i6_4` (reemplazados por ítems nuevos).

### Ítems nuevos incorporados en v5.0

| ID | Dimensión | Qué mide |
|----|-----------|----------|
| N1 | meritocracia | Creencia nuclear en esfuerzo vs. condiciones de partida |
| N2 | individualismo | Privatismo informal: red de familia/amigos vs. red comunitaria |
| N3 | autoridad | Punitivismo: firmeza vs. entender causas del conflicto |
| N4 | antiestablishment | Poder capturado: representantes trabajan para mantenerse vs. representar |
| N5 | antiestablishment | Valoración de la democracia: valor intrínseco vs. pragmatismo de resultados |
| N6 | antiestablishment | Eficacia política externa: participar cambia algo vs. decisiones ya tomadas |
| N8 | autoridad | Orden vs. criterio propio: reglas claras como marco vs. autonomía individual |

### Ítems en observación para el piloto

| Ítem | Riesgo | Umbral de alarma |
|------|--------|-----------------|
| i6_3 | Mezcla meritocracia con cinismo | item-total < .20 con inst |
| i6_5 | Captura estado emocional coyuntural | Correlación con fecha/contexto político |
| i1_1 | Puede medir preferencia por servicio concreto | item-total < .20 con econ |
| i1_2 | Deseabilidad social | Tasa de escape > 30% |
| d8_2 | Activa posición coyuntural | Distribución extrema (>70% en un polo) |
| i5_1 | Cruce con ciclo vital y región | Diferencias por edad > 20 puntos |

---

## Etapas del proyecto

### E0 — Diseño y arquitectura `✅ COMPLETA`

- 3 juegos con metodologías distintas y outputs no solapados
- Stack: FastAPI + SQLite + vanilla JS (sin frameworks, sin build step)
- Instrumento J1: Elección Forzada Graduada (EFG) 4-point sin neutro + escape externo
- Ejes: económico / sociocultural / institucional (ortogonal)
- Randomización de posición A/B en cada pregunta

---

### E1 — Instrumento J1 `✅ COMPLETA`

- **v6.1 (28/07/2026):** 19 preguntas · 11 dimensiones · escala 4-point EFG · todos aprobados
- Scoring engine v4 (`backend/scoring/j1_brujula.py`): scoring en 2 niveles, denominador dinámico, perfil Centro, clasificación ternaria del eje inst
- 5 perfiles base (EP, EC, PC, PP, C) + 10 arquetipos con imágenes
- Corpus teórico: 40+ documentos, 42 fichas de revalidación conceptual (`CORPUS TEORICO/`)
- Protocolo de generación de ítems (4 pasos) documentado en `tasks/lessons.md` y `docs/VALIDACION_ITEMS_V6.md`

**Historial de versiones:**
- v5.0 (11/07): 26 ítems, 9 dimensiones — primera versión completa
- v6.0 (24/07): rediseño a 19 ítems, 11 dimensiones, formato scenario_cards
- v6.1 (28/07): 9 ítems corregidos (scenarios abstractos, error de constructo ANT_02, ajustes de opción)

**Constantes por calibrar con datos reales (post-piloto):**
- `CENTER_THRESHOLD = 10.0` — validado por simulación: 8% de aleatorios cae en Centro
- `INST_THRESHOLD = 15.0` — validado por simulación: 37% de aleatorios en inst_moderate
- Score máximo alcanzable con bias puro: ~±40 (no ±100) — consecuencia del balance de ítems en cada eje

**Decisiones abiertas post-piloto:**
- A: ¿Subdividir `antiestablishment` en dos subdimensiones? (datos del piloto deciden)
- B: Dimensiones sociales con 1 ítem cada una — ¿agregar ítems si Cronbach < 0.70?

---

### E2 — Backend plomería `✅ COMPLETA`

- `main.py`: FastAPI con 3 routers + static files serving
- `backend/database.py`: SQLite, tablas `sessions` + `quiz_completions`, CRUD + stats
- `backend/routers/sessions.py`: `POST /api/sessions`, `POST /api/quiz/{type}/submit`, `POST /api/quiz/{type}/vote`
- `backend/routers/stats.py`: estadísticas agregadas J1
- `backend/scoring/__init__.py`: registro de scorers

Bugs I1-I7 resueltos (sesión 03/07/2026):
- ✅ I1: Validación de rango en score_brujula
- ✅ I2: DIM_POLES.derechos_autonomia corregido
- ✅ I3: inst_moderate añadido al resultado
- ✅ I4: Metadata limpiada en brujula.json
- ✅ I5: Perfil "C" contabilizado en stats
- ✅ I6: Endpoint debug gateado con APP_ENV=development, k-anonimato min_n=5
- ✅ I7: Hardcoded 25 reemplazado por quizData.total_questions

---

### E3 — Frontend J1 `✅ COMPLETA`

- `frontend/quiz.html` + `frontend/js/quiz.js`: EFG 4-point, progress ring coral, botón de escape externo
- `frontend/result.html` + `frontend/js/results.js`: hero arquetipo, loading screen 4 mensajes, folds "Qué dice esto de vos" / "Quiénes piensan como vos", canvas portrait IG, botones compartir
- `frontend/css/quiz-light.css`: tema crema, responsive mobile
- Sistema de compartir: Web Share API (mobile) + X + WhatsApp + IG (descarga PNG 4:5) + Copiar

Issues A-D resueltos (sesión 03/07/2026):
- ✅ A: topInsight renderizado con polo correcto
- ✅ B: buildDimensionGroups — polo + barra de intensidad, oculta |score| ≤ 20
- ✅ C: CENTER_THRESHOLD bajado a 10, copy de Centro reescrito
- ✅ D: style.css ya era crema

---

### E4 — Integración end-to-end `✅ COMPLETA (24/06/2026)`

Flujo completo: usuario abre quiz → completa 19 preguntas → ve resultado con arquetipo, dimensiones, share → datos guardados en SQLite.

---

### E4.5 — Refinamiento pre-piloto `✅ COMPLETA (11/07/2026)`

- ✅ Escala: 4-point forced choice + válvula de escape externa (smartvote model)
- ✅ Instrumento Fase 1: 7 nuevos ítems (N1-N6, N8), brujula.json v5.0
- ✅ Revalidación conceptual completa (corpus teórico + fichas)
- ✅ Bugs I1-I7 cerrados · Issues A-D cerrados

---

### E4.6 — Rediseño instrumento v6.0 → v6.1 `✅ COMPLETA (28/07/2026)`

- ✅ Instrumento rediseñado a 19 ítems, 11 dimensiones, formato scenario_cards
- ✅ 9 ítems corregidos: ANT_02 (error de constructo), 6 scenarios abstractos, 2 ajustes de opción
- ✅ Protocolo de generación de ítems (4 pasos) formalizado
- ✅ Simulación masiva: 6.500 respondentes sintéticos, 8/8 arquetipos correctamente asignados (100%)
- ✅ Validación de thresholds via simulación: CENTER=10 (8% aleatorios en Centro) y INST=15 (37% inst_moderate)
- ✅ Smoke test local iniciado (validación manual del flujo completo en browser)

---

### E4.7 — Hardening pre-deploy `✅ COMPLETA (29/07/2026)`

Revisión crítica de código antes del deploy. 7 bugs identificados y corregidos:

| ID | Severidad | Problema | Fix |
|----|-----------|----------|-----|
| I8 | Crítico | DIM_POLES pos/neg swapped para 4 dimensiones con peso negativo — usuarios veían el polo opuesto al que eligieron | Intercambiados pos/neg en `results.js` para `laicismo`, `migracion`, `antiestablishment`, `confianza_institucional` |
| I9 | Alto | Submit sin deduplicación — mismo session_id podía acumular múltiples filas en quiz_completions | `save_completion` hace UPDATE si ya existe, INSERT si no |
| I10 | Alto | XSS estructural en share page — `result_json` embebido en `<script>` sin escapar `</script>` | `.replace("</", "<\\/")` antes de insertar en template |
| I11 | Alto | Sin mínimo de respuestas — perfiles calculados con 1-9 respuestas contaminaban la muestra | Validación `MIN_ANSWERS = 10` no-escape en submit endpoint |
| I12 | Medio | `dim_weights` leía solo el primer ítem por dimensión sin validar uniformidad | `_validate_weights()` en startup — falla ruidosamente si hay inconsistencia |
| I13 | Medio | Sin rate limiting — stats podían inflarse con submits masivos | Middleware en `main.py`: 5 submits / IP / 10 min (en memoria, sin dependencias) |
| I14 | Bajo | Dead code: `.qp-choice` en `selectAndAdvance` nunca matcheaba elementos del drag slider | Bloque removido |

Ver detalle completo en `tasks/lessons.md` (I8–I14).

---

### E4.8 — Módulo demográfico transversal `✅ COMPLETA (06/08/2026)`

Recolección gamificada de datos declarados para control demuestral de cara a las presidenciales 2027.

**Arquitectura:**
- Tabla nueva `demographics` (1:1 con `session_id`) — se pregunta **una sola vez** al completar cualquier juego
- El check `GET /api/demographics/{session_id}/exists` devuelve `true` → overlay no aparece en J2/J3
- La intención de voto sigue en `quiz_completions` (se re-pregunta por juego, puede cambiar)

**Variables (5):**

| Variable | Opciones |
|---|---|
| sexo | Hombre · Mujer · No binario · Prefiero no responder |
| edad_rango | 16-24 · 25-34 · 35-44 · 45-59 · 60+ · Prefiero no responder |
| provincia | 24 jurisdicciones (23 prov + CABA) · Prefiero no responder |
| nivel_educativo | Primaria · Secundaria · Superior · Prefiero no responder |
| ingreso_familiar | Tramos AtlasIntel julio 2026: <$630K · $630K–$1M · $1M–$1.5M · $1.5M–$2.2M · $2.2M–$3M · >$3M · Prefiero no responder |

**Calibración:** tramos de ingreso referenciados a AtlasIntel/Bloomberg LATAM PULSE julio 2026. Campo `calibration_date = '2026-07'` en la tabla. Actualizar tramos cuando se recalibre.

**UX — semi-obligatorio:**
- Overlay aparece 1.5s después de renderizar el resultado (solo en `/result`, nunca en `/share/`)
- Botón "Continuar" deshabilitado hasta que todas las preguntas tienen selección ("Prefiero no responder" cuenta)
- No tiene botón de cierre

**Archivos modificados:**
- `backend/database.py` — tabla + `save_demographics()` + `demographics_exist()`
- `backend/routers/sessions.py` — `POST /api/demographics` + `GET /api/demographics/{id}/exists`
- `frontend/js/results.js` — `showDemographicsOverlay()` + `maybeShowDemographics()` (llamado en `init()` para todos los quiz types)
- `frontend/css/style.css` — estilos `.demo-overlay`, `.demo-card`, `.demo-chip`, `.demo-select`, `.demo-btn`

**Para J2 y J3:** el `results.js` ya llama a `maybeShowDemographics()` fuera del condicional de quiz_type. Solo hay que asegurar que el renderer de cada juego use ese mismo `results.js` o llame a la función en su propio archivo de resultados.

---

### E5 — Deploy y piloto `PRÓXIMA ETAPA`

#### E5.1 — Pre-deploy (hacer antes de subir)

1. **Smoke test local** ✅ EN VALIDACIÓN (28/07/2026)
   - `python -m uvicorn main:app --reload` → http://localhost:8000
   - Validar flujo completo en browser: quiz → reward → share
   - Confirmar que `total_questions=19` se propaga correctamente

2. **OG meta tags dinámicos**
   - Endpoint server-side que genera imagen de preview por arquetipo
   - Meta tags `og:image` dinámicos en `result.html`
   - Objetivo: preview visual en WhatsApp y X al compartir el link del resultado
   - **Nota:** único item restante de pre-deploy — rate limiting ya implementado en E4.7

#### E5.2 — Deploy (stack definido)

⚠️ **Fly.io eliminó el free tier en 2026** — plataforma migrada a Railway.

- **Railway** — $1/mes de crédito gratuito (512MB RAM ≈ $0.17/mes). Dockerfile existente funciona sin cambios.
- **Litestream** — backup continuo WAL → Cloudflare R2 (sidecar del contenedor)
- **Cloudflare R2** — bucket para backup SQLite (gratuito hasta 10GB)
- **SQLite modo WAL** — `PRAGMA journal_mode=WAL` + `busy_timeout=5000`

**Pasos (ver README para detalle completo):**
```bash
npm install -g @railway/cli
railway login
railway init          # desde la carpeta del proyecto
railway up
```

**Variables de entorno en Railway Dashboard:**
```
APP_ENV = production
DB_PATH = /data/brujula.db
PORT = 8080
LITESTREAM_REPLICA_URL = s3://brujula-backups?endpoint=...
LITESTREAM_ACCESS_KEY_ID = ...
LITESTREAM_SECRET_ACCESS_KEY = ...
```

#### E5.3 — Piloto de calibración

**Muestra objetivo:** 150-200 respondentes con diversidad ideológica (evitar grupo homogéneo).

**Distribución:**
- Círculo cerrado inicial (Whatsapp + X)
- UTM params: `?utm_source=whatsapp`, `?utm_source=x` para trackear origen
- Monitoreo: completions/día, distribución de perfiles, tasa de abandono

**Criterios de éxito (análisis offline en Python con pandas + pingouin + factor_analyzer):**

| Criterio | Umbral | Acción si falla |
|----------|--------|-----------------|
| Cronbach Alpha por eje | ≥ 0.70 | Revisar ítems del eje con alpha bajo |
| Item-total correlation | ≥ 0.20 por ítem | Reformular o eliminar ítems bajo umbral |
| Completion rate | > 80% | Identificar preguntas con abandono |
| Correlación inter-eje | < 0.30 (Pearson) | Revisar solapamiento conceptual |
| PCA 3 factores: varianza explicada | > 50% | Confirma estructura tridimensional |
| KMO | ≥ 0.70 | Confirma adecuación muestral |
| Distribución Centro | < 20% de la muestra | Recalibrar CENTER_THRESHOLD |

**Post-piloto:**
- Calibrar `CENTER_THRESHOLD` e `INST_THRESHOLD` con datos reales
- Evaluar si `antiestablishment` necesita subdividirse (Decisión A)
- Evaluar Fase 2 del banco de ítems (31-32 ítems totales)
- Publicar dataset anonimizado en Kaggle / Hugging Face

---

### E6 — J2 El Legislador `DISEÑO CERRADO — IMPLEMENTACIÓN PENDIENTE`

**Criterio de entrada:** puede implementarse en paralelo con E5 (no bloquea el deploy de J1).

**Diseño v2.0 cerrado el 06/08/2026.** Documentación completa en:
- `docs/JUEGO_2_VISION.md` — diseño canónico (mecánica, scoring, output)
- `tasks/J2_BANCO_ESCENARIOS.md` — set definitivo + banco de candidatos + trazabilidad
- `tasks/J2_PLAN.md` — plan de implementación en 4 fases
- `tasks/J2_CONTENIDO_NARRATIVO.md` — onboarding, contextos, modales, titulares, ofertas

**Concepto:** simulador de rol. El usuario es un legislador independiente ficticio sin bloque.
12 escenarios (8 base fija + 4 temporada), sus votos se comparan con actas reales del Congreso.
Output: arquetipo acusatorio + oferta política narrativa + radar de afinidad por 5 bloques.

**Set definitivo — base fija (8):**
IVE 2020 · FMI 2022 · Ganancias 4ª 2023 · BUP 2024 · Ficha Limpia 2025
+ BCRA autónomo (ficticio) · TLC EE.UU. (ficticio) · Baja imputabilidad (ficticio)

**Scoring:** Manhattan distance + Índice de Rice ponderado. `real×0.7 + ficticio×0.3`.

**Estado de implementación:**
- `backend/scoring/j2_vision.py` — STUB, reescribir desde cero
- `backend/data/j2/j2_legislador.json` — NO EXISTE (crear en Fase 2)
- `frontend/games/j2/` — vacío (crear en Fase 4)

**Fases pendientes:**
1. Contenido narrativo — 95% completo (`tasks/J2_CONTENIDO_NARRATIVO.md`)
2. Datos — explorar comovoto.dev.ar, calcular Rice Index, construir JSON instrumento
3. Backend — reescribir `j2_vision.py` con nuevo engine
4. Frontend — onboarding, quiz, resultado, compartir

---

### E7 — J3 MaxDiff Candidatos `FUTURO`

**Criterio de entrada:** J1 en producción con ≥500 respuestas.

**Notas de diseño:**
- 20 figuras políticas, 20 rondas de 4 candidatos, cada candidato aparece ~4 veces
- Scoring Thurstone Case V → normalizado [-100, +100]
- `backend/scoring/j3_maxdiff.py` existe, `backend/data/j3/candidates.json` existe
- Frontend por construir desde cero

---

### E8 — Features de crecimiento `FUTURO`

Para cuando J1 esté validado en producción:

- Comparación social en tiempo real: "Sos más privatista que el X% de los jugadores"
- ~~Datos demográficos~~ — ✅ implementado en E4.8
- Dashboard público de estadísticas (versión reducida)
- API de datos anonimizados para investigadores
- Tracking temporal: el mismo usuario puede repetir el quiz y ver si se desplazó

---

## Próximos pasos — orden de trabajo

**Actualizado:** 06/08/2026

| # | Tarea | Estado | Bloquea |
|---|-------|--------|---------|
| 1 | Smoke test local (19 preguntas end-to-end en browser) | ✅ Iniciado (28/07) | Deploy |
| 2 | OG meta tags dinámicos (server-side, imagen por arquetipo) | 🔴 **Único blocker pre-deploy** | Calidad del share |
| 3 | ~~Rate limiting~~ | ✅ E4.7 | — |
| 4 | ~~Módulo demográfico~~ | ✅ E4.8 | — |
| 5 | Deploy Railway + Litestream + R2 | 🔴 Pendiente | Piloto |
| 6 | Piloto cerrado 150-200 respondentes | 🔴 Pendiente | Calibración |
| 7 | Análisis de piloto (Cronbach, PCA, item-total) | 🔴 Pendiente | Lanzamiento público |
| 8 | Calibrar CENTER_THRESHOLD e INST_THRESHOLD | 🔴 Post-piloto | Resultados precisos |
| 9 | Decisión sobre Fase 2 del banco J1 (31-32 ítems) | 🔴 Post-piloto | — |
| 10 | ~~J2 — sesión de diseño~~ | ✅ Diseño cerrado (06/08) | — |
| 11 | J2 — Fase 2 datos (comovoto + Rice + JSON instrumento) | 🔴 Pendiente | J2 backend |
| 12 | J2 — Fase 3 backend + Fase 4 frontend | 🔴 Pendiente | J2 launch |
| 13 | Lanzamiento público J1 | 🔴 Post-piloto | E5 completa |

---

## Archivos clave del proyecto

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `backend/data/j1/brujula.json` | 19 preguntas + arquetipos + perfiles + escala v6.1 | ✅ Actualizado 28/07 |
| `backend/scoring/j1_brujula.py` | Scoring engine v4 (4-point, denominador dinámico, ternario inst) | ✅ |
| `backend/database.py` | SQLite schema + CRUD + stats · upsert en save_completion (29/07) | ✅ |
| `backend/routers/sessions.py` | Endpoints submit + vote + session · MIN_ANSWERS=10 (29/07) | ✅ |
| `backend/routers/stats.py` | Estadísticas agregadas | ✅ |
| `backend/routers/quizzes.py` | Endpoints de metadata del quiz | ✅ |
| `frontend/js/quiz.js` | Motor del quiz (EFG 4-point, progress ring, escape, localStorage) | ✅ |
| `frontend/js/results.js` | Resultado (arquetipos, folds, share, loading screen) · DIM_POLES corregidos (29/07) | ✅ |
| `frontend/css/quiz-light.css` | Estilos quiz (tema crema, mobile-first) | ✅ |
| `frontend/css/style.css` | Estilos resultado (tema oscuro) | ✅ |
| `tasks/lessons.md` | Lecciones aprendidas + checklist de 16 reglas + estado de ítems | ✅ |
| `docs/research/PLAN_REDISENO_BANCO_V1.md` | Plan Fase 1 del rediseño del banco (03/07) | ✅ Completo |
| `docs/research/REVALIDACION_J1_V1.md` | Revalidación conceptual ítem por ítem | ✅ |
| `docs/research/ARQUETIPOS_CONTENIDO_V1.md` | Contenido completo de los 10 arquetipos | ✅ |
| `CORPUS TEORICO/` | 40+ documentos académicos + 42 fichas de revalidación | ✅ |

---

## Decisiones estratégicas abiertas

| # | Decisión | Criterio para resolver |
|---|----------|----------------------|
| A | ¿Subdividir `antiestablishment` en dos subdimensiones? | Datos del piloto (correlación interna, alpha) |
| B | ¿Fase 2 del banco de ítems (31-32 ítems)? | Alpha del piloto por eje — si eje econ o inst < 0.70 |
| C | ¿Datos demográficos opcionales en el piloto? | Decisión antes del deploy (afecta el formulario post-resultado) |
| D | ¿J1 sale solo o esperamos los 3 juegos? | Criterio recomendado: J1 solo, J2/J3 en etapas posteriores |

---

## Checklist por etapa

```
E0   ✅  Arquitectura definida
E1   ✅  19 preguntas · scoring v4 · 10 arquetipos · imágenes · compartir · comparación social
E2   ✅  Backend FastAPI funcionando · bugs I1-I7 cerrados
E3   ✅  Frontend conectado · escala 4-point · issues A-D cerrados
E4   ✅  Flujo end-to-end en browser
E4.5 ✅  brujula.json v5.0 · instrumento Fase 1 completo · revalidación conceptual
E4.6 ✅  brujula.json v6.1 · 9 ítems corregidos · simulación 6.500 respondentes
E4.7 ✅  Hardening pre-deploy · 7 bugs cerrados (I8-I14) · rate limiting implementado
E5   ⏳  OG tags (único restante) · deploy Railway + Litestream · piloto 150-200 · Cronbach + PCA
E6   🔴  J2 Visión AR diseñado e implementado
E7   🔴  J3 MaxDiff conectado e implementado
E8   🔴  Features de crecimiento + dataset público Kaggle/HuggingFace
```
