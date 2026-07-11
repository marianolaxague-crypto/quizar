# Juego 1 — Brújula Ideológica

**Última actualización:** 2026-07-02
**Estado:** E4 completa · E4.5 pendiente (ver PLAN_DESARROLLO.md)

---

## Pregunta central
> "¿Cómo pensás?"

## Qué ES
- Perfilamiento psicográfico/ideológico profundo
- Preguntas actitudinales cotidianas sin carga política directa
- Tensiones universales expresadas en primera persona
- Metodología: Elección Forzada Graduada (EFG) — escala de 3 puntos + escape

## Qué NO ES
- No menciona partidos, candidatos ni figuras políticas
- No pregunta sobre leyes ni posiciones de coyuntura
- No evalúa conocimiento político
- No recomienda a quién votar (eso lo hace el ancla post-resultado)

---

## Ejes de medición (3)

| Eje | Polo negativo (-100) | Polo positivo (+100) |
|-----|---------------------|---------------------|
| **Económico** | Estatista / Colectivista | Privatista / Individualista |
| **Sociocultural** | Progresista | Conservador |
| **Institucional** | Anti-establishment | Institucionalista |

---

## Dimensiones (10)

| Código | Dimensión | Eje | Ítems |
|--------|-----------|-----|-------|
| `individualismo` | Coordinación espontánea vs. colectiva | Económico | 3 |
| `meritocracia` | Origen de las desigualdades | Económico | 3 |
| `tradicion` | Cambio vs. continuidad social | Sociocultural | 2 |
| `autoridad` | Tolerancia a la autoridad y el orden | Sociocultural | 2 |
| `localismo` | Identidad local vs. apertura al mundo | Sociocultural | 2 |
| `antiestablishment` | Crítica al sistema vs. defensa institucional | Institucional | 5 |
| `derechos_autonomia` | Autonomía individual vs. normas comunes | Sociocultural | 2 |
| `laicismo` | Laicismo vs. rol de la religión en lo público | Sociocultural | 2 |
| `migracion` | Apertura vs. restricción migratoria | Sociocultural | 2 |
| `fuentes_info` | Medios alternativos vs. medios establecidos | Institucional | 2 |

**Total: 25 preguntas — todas validadas con checklist de 16 reglas** (sesión 23/06)

---

## Escala de respuesta (EFG)

| Valor | Significado |
|-------|-------------|
| 1 | Completamente A |
| 2 | Más A que B |
| 3 | Ambas igual / Me da lo mismo |
| 4 | Más B que A |
| 5 | Completamente B |
| 0 | No puedo elegir / Prefiero no responder |

- **value=3** (Ambas igual): incluido en el denominador del scoring. Señal real de postura moderada.
- **value=0** (escape): excluido del denominador. Señal de rechazo a la pregunta.
- Si >50% de respuestas son escape → perfil `UNDETERMINED`.

---

## Scoring engine (v3)

**Archivo:** `backend/scoring/j1_brujula.py`

### Nivel 1 — Dimensión
Para cada dimensión:
```
score_dim = media(respuestas_no_escape) normalizada a [-100, +100]
```
Denominador dinámico: excluye escapes (value=0) pero incluye neutros (value=3).

### Nivel 2 — Eje
```
score_eje = media(scores de dimensiones del eje)
```
Evita que dimensiones con más ítems dominen el eje.

### Perfil base (5 perfiles)
| Código | Nombre | Condición |
|--------|--------|-----------|
| EP | Estatista Progresista | econ < 0 y social < 0 |
| EC | Estatista Conservador | econ < 0 y social > 0 |
| PC | Privatista Conservador | econ > 0 y social > 0 |
| PP | Privatista Progresista | econ > 0 y social < 0 |
| C | Centro Pragmático | \|econ\| < CENTER_THRESHOLD (20.0) Y \|social\| < CENTER_THRESHOLD |

### Eje institucional (clasificación ordinal)
| Valor de `inst` | Label |
|----------------|-------|
| < -INST_THRESHOLD (-15) | Anti-establishment |
| > +INST_THRESHOLD (+15) | Institucionalista |
| Entre -15 y +15 | Centro institucional |

### Arquetipo (10 en total)
Cada perfil base tiene 2 arquetipos según el eje inst:
- **Institucionalista** (inst > 15): arquetipo 1
- **Anti-establishment** (inst < -15): arquetipo 2

| Perfil | Institucionalista | Anti-establishment |
|--------|------------------|--------------------|
| EP | Colectivista Transformador | Colectivista Rebelde |
| EC | Comunitarista Tradicional | Soberanista Nacionalista |
| PC | Republicano de Orden | Conservador Rebelde |
| PP | Liberal Cosmopolita | Libertario de Autonomía |
| C | Pragmático Institucional | Pragmático Crítico |

### Constantes por calibrar (post-piloto con ≥100 respuestas)
- `CENTER_THRESHOLD = 20.0` → calibrar con ±0.5σ del piloto
- `INST_THRESHOLD = 15.0` → evaluar con datos empíricos

---

## Perfiles de salida

Cada arquetipo incluye: `name`, `subtitle`, `color` (hex), `description`, `tagline_short`, `tagline_long`, `symbol`, `image_url`.

Las 10 imágenes fueron generadas el 01/07/2026 y se sirven desde `/static/images/archetypes/`.

---

## Reward screen

**Estructura:**
1. Hero: imagen del arquetipo + nombre en color + subtitle + tagline
2. Botones de compartir (WhatsApp, X, Instagram, Copiar, Web Share API)
3. Fold "Qué dice esto de vos": descripción + tensión
4. Fold "Quiénes piensan como vos": % arquetipo + distribución de voto
5. Botones de navegación: "Mi perfil ↓" | "Comparación ↓"

**Eliminados:**
- Compass SVG (reemplazado por imagen del arquetipo)
- Radar chart
- Overlay de compartir

---

## Archivos clave

| Archivo | Descripción |
|---------|-------------|
| `backend/data/j1/brujula.json` | 25 preguntas + 10 arquetipos + perfiles + escala |
| `backend/scoring/j1_brujula.py` | Scoring engine v3 |
| `frontend/js/quiz.js` | Motor del quiz (EFG, selección estratificada, progress ring) |
| `frontend/js/results.js` | Reward screen (arquetipos, compartir, comparación) |
| `frontend/css/quiz-light.css` | Estilos quiz (tema crema) |
| `frontend/css/style.css` | Estilos resultado (tema oscuro) |
| `docs/research/ARQUETIPOS_CONTENIDO_V1.md` | Contenido completo de los 10 arquetipos |
| `tasks/lessons.md` | Lecciones + checklist de validación de 16 reglas |

---

## Estado

### Funcional
- [x] Diseño de ejes y perfiles (3 ejes, 5 perfiles, 10 arquetipos)
- [x] 25 preguntas validadas en 10 dimensiones (sesión 23/06)
- [x] Engine de scoring v3.0 con detección de evasión
- [x] 10 imágenes de arquetipos generadas (01/07)
- [x] Frontend quiz flow: EFG, progress ring, submit automático
- [x] Reward screen: hero, folds, comparación social
- [x] Sistema de compartir: WhatsApp, X, Instagram, copiar, canvas PNG
- [x] Mobile responsive ≤480px
- [x] Intención de voto post-resultado

### Decisión bloqueante (definir antes de todo lo demás)
- [ ] **A0: ¿Escala 4-point sin neutral (recomendada) o mantener EFG 3-point?** — afecta preguntas, engine y frontend

### Instrumento v2
- [ ] **Issue E:** redistribuir ítems por eje (target: 8 económico / 8 sociocultural / 9 institucional)
- [ ] 50% de ítems con codificación inversa por eje
- [ ] Eliminar o reescribir ítems con carga política explícita (aborto, religión, cortes, corporaciones)
- [ ] Resolver solapamientos: i2_1/i2_2/i6_3 · i6_2/i6_4 · localismo/migración

### Bugs de implementación (Codex review, 02/07/2026)
- [ ] **I1 CRÍTICO:** Validación de input — `value=5` produce `econ=-180` · sin mínimo de respuestas por eje
- [ ] **I2 ALTO:** Signo semántico de dimensiones — backend debe devolver `score_semantic` + `pole_label`
- [ ] **I3 ALTO:** Clasificación binaria de inst → institucionalista por defecto; agregar tercer estado
- [ ] **I4 ALTO:** Metadata legacy en brujula.json (`quiz_type="ideological"`, escala 1→5)
- [ ] **I5 ALTO:** `stats.profiles_pct` no cuenta perfil C → usar `archetypes_pct`
- [ ] **I6 MEDIO:** Privacidad — eliminar endpoint debug + subir k-anonimato a n≥10
- [ ] **I7 MEDIO:** quiz.js hardcodea 25 preguntas — leer de `quizData.total_questions`

### UX/UI (estado incierto — verificar en browser)
- [ ] Issue A: bug top_dimension_label (requiere I2 resuelto primero)
- [ ] Issue B: rediseño "Mis Dimensiones" (requiere I2 resuelto primero)
- [ ] Issue C: tratamiento perfil Centro (simplificado si se adopta 4-point)
- [ ] Issue D: homepage CSS

### Pre-deploy
- [ ] OG meta tags dinámicos para WhatsApp/X (imagen por resultado)
- [ ] WAL mode + busy_timeout=5000 en SQLite
- [ ] Rate limiting (max 3 intentos por IP cada 10 min)

### Deploy y piloto
- [ ] Deploy en Fly.io (no Render) + Litestream + Cloudflare R2
- [ ] Imágenes arquetipos → CDN R2
- [ ] Piloto 150–200 respondentes con diversidad ideológica
- [ ] Análisis: Cronbach ≥ 0.7 · item-total ≥ 0.20 · completion > 80% · PCA 3 factores
