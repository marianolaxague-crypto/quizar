# Plan de trabajo — J2 El Legislador

**Fecha de diseño:** 2026-08-06
**Última actualización:** 2026-08-06
**Estado:** Diseño v2.0 cerrado — Fase 1 y Fase 2 pueden arrancar en paralelo

**Documentación del proyecto:**
| Documento | Rol |
|-----------|-----|
| `docs/JUEGO_2_VISION.md` | Diseño canónico — scoring, output, mecánicas, decisiones confirmadas |
| `tasks/J2_BANCO_ESCENARIOS.md` | Set definitivo + banco completo de candidatos + protocolo de trazabilidad |
| `tasks/J2_INVESTIGACION_DISENO.md` | Referencia de investigación — referentes, metodología, reglas |
| `tasks/J2_PLAN.md` | Este archivo — checklist de implementación por fases |

**Set definitivo confirmado:**
- Base fija: B1 IVE · B2 FMI · B3 Ganancias 4ª · B4 BUP · B5 Ficha Limpia · B6 BCRA · B7 TLC · B8 Imputabilidad
- Temporada fundacional: T1 Súper RIGI · T2 Veto universitario · T3 Jornada 32hs · T4 Dietas (procedural)

> **Reglas metodológicas vigentes:** scoring por Manhattan distance + Rice Index ponderado ·
> separar afinidad de perfil de ejercicio · posición LLA reconstruida en B1/B2/B3 ·
> no codificar “dividida” como coincidencia automática · trazabilidad completa antes de producción.

---

## Fase 1 — Contenido narrativo (sin código)

**Documento de contenido:** `tasks/J2_CONTENIDO_NARRATIVO.md`

### 1.1 Contextos de escenarios (12 en total)
- [x] B1 — IVE 2020
- [x] B2 — Acuerdo con el FMI 2022
- [x] B3 — Eliminación de Ganancias 4ª categoría 2023
- [x] B4 — Boleta Única de Papel 2024
- [x] B5 — Ficha Limpia 2025
- [x] B6 — Autonomía constitucional del BCRA (ficticio)
- [x] B7 — TLC bilateral con EE.UU. (ficticio)
- [x] B8 — Baja de imputabilidad (ficticio)
- [x] T1 — Súper RIGI 2026
- [x] T2 — Veto a financiamiento universitario (insistencia)
- [x] T3 — Reducción jornada laboral 32hs (ficticio)
- [x] T4 — Dietas a mano alzada (procedural — opciones especiales)

### 1.2 Textos de oferta política (16 combinaciones)
- [x] LLA × Disciplinado / Díscolo / Lobbista
- [x] PRO × Disciplinado / Díscolo / Lobbista
- [x] UCR × Disciplinado / Díscolo / Lobbista
- [x] UP × Disciplinado / Díscolo / Lobbista
- [x] FIT × Disciplinado / Díscolo / Lobbista
- [x] Lobo Solitario (ningún bloque > 55%)

### 1.3 Arquetipos acusatorios (5)
- [x] El Disciplinado — nombre, tagline y descripción
- [x] El Díscolo
- [x] El Lobbista
- [x] El Lobo Solitario
- [x] El Opositor Sistemático

### 1.4 Modales "WhatsApp de la rosca" (5 rondas)
- [x] B1 — IVE (jefa de bloque)
- [x] B2 — FMI (gobernador)
- [x] B5 — Ficha Limpia (correligionario)
- [x] T1 — RIGI (ejecutivo empresarial)
- [x] T2 — Veto universitario (rector)

### 1.5 Titulares reactivos (11 escenarios × 3 votos)
- [x] B1 a T3 — tabla completa en `J2_CONTENIDO_NARRATIVO.md`

### 1.6 Onboarding y micro-copy
- [x] Pantalla de bienvenida
- [x] Instrucciones de voto (primer escenario)
- [x] Transiciones entre escenarios (6 variantes aleatorias)

### Pendientes de revisión editorial (Fase 1)
- [ ] Revisión de tono en todos los textos — confirmar que ningún escenario revela la posición "correcta"
- [ ] Revisar que los modales de WhatsApp no nombran a dirigentes reales
- [ ] Definir los 7 modales que NO tienen presión (transición limpia) vs. los 5 con modal
- [ ] Confirmar texto de T4 (Dietas) — las opciones especiales son distintas a las 4 estándar
- [ ] Textos para arquetipos Opositor Sistemático — falta la oferta política de este perfil

---

## Fase 2 — Datos (técnica, sin frontend)

### 2.1 Explorar dataset de comovoto
Descargar y analizar `votaciones.json` para identificar los IDs reales de R1–R7.

- [ ] Descargar `https://comovoto.dev.ar/data/votaciones.json`
- [ ] Buscar los IDs correspondientes a cada escenario real por fecha + título
- [ ] Registrar `real_vote_id` en el JSON del instrumento para cada uno
- [ ] Verificar que el ID tiene cobertura suficiente (≥ 100 legisladores con voto registrado)

### 2.2 Extraer posiciones reales por bloque (R1–R7)
Para cada escenario real: ¿cuál fue el voto mayoritario de cada bloque?

- [ ] Calcular `voto_mayoritario[bloque][escenario]` desde los datos individuales de legisladores
- [ ] Registrarlo en el JSON del instrumento (campo `bloc_positions` para escenarios reales)
- [ ] Validar contra lo que ya está documentado en el diseño (los estimados actuales)

### 2.3 Construir el JSON del instrumento `j2_legislador.json`
Estructura definida en `docs/JUEGO_2_VISION.md`. 12 ítems completos.

- [ ] Poblar R1–R7 con datos reales (real_vote_id + bloc_positions confirmados)
- [ ] Poblar F1–F5 con posiciones por bloque (ya definidas en el diseño)
- [ ] Smoke test: leer el JSON, simular 5 combinaciones de respuestas, verificar scoring a mano

---

## Fase 3 — Backend

### 3.1 Engine de scoring J2
Nuevo módulo `backend/j2_legislador.py`. Misma arquitectura que `j1_brujula.py`.

- [ ] `load_j2()` — carga y valida `j2_legislador.json`
- [ ] `score_j2(answers)` — computa afinidad por bloque (real 0.7 + ficticio 0.3)
- [ ] `classify_loyalty(afinidad_ganador)` — línea dura / moderado / díscolo / freerider puro
- [ ] `get_offer(bloque, lealtad, provincia)` — devuelve el texto de oferta correspondiente
- [ ] Tests unitarios: simular 6 perfiles extremos (1 por bloque + freerider puro)

### 3.2 Endpoint API
Extender `main.py` con las rutas de J2.

- [ ] `GET /api/quiz/j2/questions` — devuelve los 12 escenarios (sin bloc_positions)
- [ ] `POST /api/quiz/j2/submit` — recibe respuestas, devuelve resultado + oferta
- [ ] Reutilizar middleware de rate limiting existente (ya cubre `{type}/submit`)
- [ ] Reutilizar lógica de sesión de J1 (mismo session_id, distinto quiz_type)

### 3.3 Base de datos
Reutilizar tabla `quiz_completions` con `quiz_type = "j2"`. Verificar que el schema existente
soporta el nuevo resultado (bloque + lealtad + oferta).

- [ ] Revisar schema actual de `database.py`
- [ ] Agregar columnas si es necesario (bloque_afin, lealtad_nivel) o guardar en result_json

---

## Fase 4 — Frontend

### 4.1 Pantalla de onboarding J2
- [ ] Selector de cámara (Diputado / Senador)
- [ ] Selector de provincia (dropdown 24 provincias)
- [ ] Botón "Comenzar sesión"

### 4.2 Pantalla de quiz J2
Adaptar `quiz.js` y `quiz.html` para J2. Los escenarios son más largos que los de J1 —
el contexto (3-4 oraciones) necesita más espacio visual.

- [ ] Layout de escenario: título + contexto + 4 botones de voto
- [ ] Progreso: barra o contador (12 escenarios)
- [ ] Transición entre escenarios

### 4.3 Pantalla de resultado J2 ("La oferta")
Esta es la pantalla más importante del juego — requiere diseño cuidadoso.

- [ ] Bloque afín + barra comparativa de los 5 bloques
- [ ] Indicador de lealtad (línea dura / moderado / díscolo)
- [ ] Texto de la oferta política (protagonista visual)
- [ ] Revisión de mis votos: lista de los 12 escenarios con mi voto + posición del bloque afín
- [ ] Compartir: imagen canvas (similar a J1) + link

---

## Orden de ejecución recomendado

```
Fase 1 (contenido) → Fase 2 (datos) → Fase 3 (backend) → Fase 4 (frontend)
```

El contenido y los datos pueden hacerse en paralelo si hay tiempo.
El backend requiere tener el JSON del instrumento completo (Fase 2).
El frontend puede avanzar en wireframe antes de tener el backend.

---

## Criterios de completado por fase

| Fase | Criterio |
|------|----------|
| 1 — Contenido | Los 12 contextos y 31 textos de oferta están escritos y revisados |
| 2 — Datos | `j2_legislador.json` completo con real_vote_ids validados + smoke test manual |
| 3 — Backend | 6 tests unitarios pasan; endpoint responde correctamente a respuestas simuladas |
| 4 — Frontend | Smoke test manual en browser: onboarding → quiz → oferta → compartir |

---

## Dependencias externas

- Dataset comovoto actualizado (se regenera diariamente vía GitHub Actions — no hay riesgo de desactualización para votaciones históricas de 2020-2024)
- Imágenes de bloques / logos (para la pantalla de resultado) — definir si se usan o no
