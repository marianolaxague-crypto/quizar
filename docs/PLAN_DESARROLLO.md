# Brújula Política AR — Plan de Desarrollo del Producto

**Última actualización:** 11/07/2026
**Estado general:** E4.5 completa · Listo para deploy y piloto (E5)

---

## Norte del producto

Un argentino cualquiera responde 26 preguntas en 5-7 minutos y descubre dónde está parado ideológicamente — sin que el quiz le diga qué está "bien" o "mal" pensar. El resultado es visualmente claro, compartible, y contextualizado con cómo respondieron los demás.

El diferencial no es el quiz: es el **dataset** que se acumula. Con 1.000 respuestas reales, Brújula AR es el primer mapa ideológico multidimensional calibrado para Argentina.

---

## Los tres juegos

| Juego | Pregunta central | Metodología | Estado |
|-------|-----------------|-------------|--------|
| **J1 — Brújula Ideológica** | ¿Cómo pensás? | EFG 4-point actitudinal (sin anclas políticas) | ✅ Listo para deploy |
| **J2 — Visión AR** | ¿Con qué visión de Argentina coincidís? | Elección forzada sobre temas políticos AR | Sin diseñar |
| **J3 — MaxDiff Candidatos** | ¿A quién preferís? | MaxDiff best-worst (20 figuras) | Sin conectar |

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

- v5.0: 26 preguntas · 9 dimensiones · escala 4-point EFG
- Scoring engine v4 (`backend/scoring/j1_brujula.py`): scoring en 2 niveles, denominador dinámico (excluye escapese y neutros), perfil Centro, clasificación ternaria del eje inst
- 5 perfiles base (EP, EC, PC, PP, C) + 10 arquetipos con imágenes
- Corpus teórico: 40+ documentos, 42 fichas de revalidación conceptual (`CORPUS TEORICO/`)
- Revalidación conceptual ítem por ítem documentada en `docs/research/REVALIDACION_J1_V1.md`

**Constantes por calibrar con datos reales (post-piloto):**
- `CENTER_THRESHOLD = 10.0` → calibrar con ±0.5σ del piloto
- `INST_THRESHOLD = 15.0` → evaluar con datos empíricos

**Decisiones abiertas post-piloto:**
- A: ¿Subdividir `antiestablishment` en dos subdimensiones? (Opción 1 = mantener como una con subpuntajes auditables para piloto)
- B: ¿Expandir banco a 31-32 ítems? (Fase 2 del rediseño: 1-2 ítems econ adicionales + 1 social)

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

Flujo completo: usuario abre quiz → completa 26 preguntas → ve resultado con arquetipo, compass, dimensiones, share → datos guardados en SQLite.

---

### E4.5 — Refinamiento pre-piloto `✅ COMPLETA (11/07/2026)`

**Todo resuelto:**
- ✅ Escala: 4-point forced choice + válvula de escape externa (smartvote model)
- ✅ Instrumento Fase 1: 7 nuevos ítems (N1-N6, N8), brujula.json v5.0
- ✅ Revalidación conceptual completa (corpus teórico + fichas)
- ✅ Bugs I1-I7 cerrados
- ✅ Issues A-D cerrados
- ✅ fuentes_info eliminada del instrumento y del frontend (results.js, scoring/j1_brujula.py)

**Pendiente diferido a deploy:**
- OG meta tags dinámicos (imagen por arquetipo para preview WhatsApp/X) — requiere server-side rendering

---

### E5 — Deploy y piloto `PRÓXIMA ETAPA`

#### E5.1 — Pre-deploy (hacer antes de subir)

1. **Smoke test local**
   - Levantar: `uvicorn main:app --reload`
   - Verificar que arranca con brujula.json v5.0 (26 preguntas, sin fuentes_info)
   - Completar el quiz en browser, verificar resultado end-to-end
   - Confirmar que `total_questions=26` se propaga correctamente

2. **OG meta tags dinámicos**
   - Endpoint server-side que genera imagen de preview por arquetipo
   - Meta tags `og:image` dinámicos en `result.html`
   - Objetivo: preview visual en WhatsApp y X al compartir el link del resultado

3. **Rate limiting**
   - 3 intentos completos / IP / 10 min
   - Previene datos artificialmente duplicados en el piloto

#### E5.2 — Deploy (stack recomendado)

- **Fly.io** — persistencia real de SQLite en disco (3GB volumes gratuitos). Render descartado: pierde SQLite en restart.
- **Litestream** — backup continuo WAL → Cloudflare R2 (sidecar del contenedor)
- **Cloudflare R2** — imágenes de arquetipos (~5MB c/u) por CDN, no desde FastAPI
- **SQLite modo WAL** — `PRAGMA journal_mode=WAL` + `busy_timeout=5000`
- **URL:** `brujula.fly.dev` suficiente para piloto

```yaml
# litestream.yml
dbs:
  - path: /data/brujula.db
    replicas:
      - type: s3
        endpoint: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
        bucket: brujula-backups
        region: auto
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

### E6 — J2 Visión AR `FUTURO`

**Criterio de entrada:** J1 validado con datos piloto.

**Diseño pendiente de sesión dedicada:**
- Preguntas sobre visiones concretas de Argentina (mezcla de temas políticos y no políticos)
- Tradiciones a mapear: kirchnerismo, peronismo clásico, radicalismo, liberalismo, izquierda
- `backend/scoring/j2_vision.py` — archivo creado, contenido pendiente
- `backend/data/j2/` — carpeta existe, vacía

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
- Datos demográficos opcionales: provincia, edad, género — para análisis cruzados
- Dashboard público de estadísticas (versión reducida)
- API de datos anonimizados para investigadores
- Tracking temporal: el mismo usuario puede repetir el quiz y ver si se desplazó

---

## Próximos pasos — orden de trabajo

| # | Tarea | Bloquea |
|---|-------|---------|
| 1 | Smoke test local (26 preguntas end-to-end en browser) | Deploy |
| 2 | OG meta tags dinámicos (server-side) | Calidad del share |
| 3 | Rate limiting (3 intentos / IP / 10 min) | Piloto limpio |
| 4 | Deploy Fly.io + Litestream + R2 | Piloto |
| 5 | Piloto cerrado 150-200 respondentes | Calibración |
| 6 | Análisis de piloto (Cronbach, PCA, item-total) | Lanzamiento público |
| 7 | Calibrar CENTER_THRESHOLD e INST_THRESHOLD | Resultados precisos |
| 8 | Decisión sobre Fase 2 del banco (31-32 ítems) | Post-piloto |
| 9 | J2 Visión AR — sesión de diseño | E6 |
| 10 | Lanzamiento público | E5 completa |

---

## Archivos clave del proyecto

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `backend/data/j1/brujula.json` | 26 preguntas + arquetipos + perfiles + escala v5.0 | ✅ Actualizado 11/07 |
| `backend/scoring/j1_brujula.py` | Scoring engine v4 (4-point, denominador dinámico, ternario inst) | ✅ |
| `backend/database.py` | SQLite schema + CRUD + stats | ✅ |
| `backend/routers/sessions.py` | Endpoints submit + vote + session | ✅ |
| `backend/routers/stats.py` | Estadísticas agregadas | ✅ |
| `backend/routers/quizzes.py` | Endpoints de metadata del quiz | ✅ |
| `frontend/js/quiz.js` | Motor del quiz (EFG 4-point, progress ring, escape, localStorage) | ✅ |
| `frontend/js/results.js` | Resultado (arquetipos, folds, share, loading screen) | ✅ Actualizado 11/07 |
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
E1   ✅  26 preguntas · scoring v4 · 10 arquetipos · imágenes · compartir · comparación social
E2   ✅  Backend FastAPI funcionando · bugs I1-I7 cerrados
E3   ✅  Frontend conectado · escala 4-point · issues A-D cerrados
E4   ✅  Flujo end-to-end en browser
E4.5 ✅  brujula.json v5.0 · instrumento Fase 1 completo · revalidación conceptual
E5   ⏳  OG tags · rate limiting · deploy Fly.io + Litestream · piloto 150-200 · Cronbach + PCA
E6   🔴  J2 Visión AR diseñado e implementado
E7   🔴  J3 MaxDiff conectado e implementado
E8   🔴  Features de crecimiento + dataset público Kaggle/HuggingFace
```
