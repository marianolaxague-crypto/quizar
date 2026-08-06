# Juego 2 — El Legislador

**Versión del diseño:** 2.0 (06/08/2026)
**Estado:** Diseño cerrado — listo para Fase 1 (contenido) y Fase 2 (datos)
**Documentos complementarios:**
- `tasks/J2_PLAN.md` — plan de trabajo por fases
- `tasks/J2_BANCO_ESCENARIOS.md` — banco completo de candidatos con trazabilidad
- `tasks/J2_INVESTIGACION_DISENO.md` — investigación de referentes y metodología

---

## Pregunta central
> "Comenzás tu carrera política. ¿A qué bloque terminás perteneciendo?"

## Concepto
Simulador de rol legislativo. El usuario asume el rol de un **legislador independiente ficticio**
recién ingresado al Congreso sin bloque. A lo largo de 12 escenarios (8 base fija + 4 rotativos
de temporada), toma decisiones de voto. Sus respuestas se comparan con las posiciones reales
e históricas de los bloques para producir un perfil de afinidad y un arquetipo.

Al final, recibe una **oferta política narrativa** — qué bloque lo quiere y bajo qué condiciones.

**Diferencia con J1:** J1 es atemporal y psicográfico. J2 está anclado en el comportamiento
legislativo argentino concreto.
**Diferencia con J3:** J2 produce afinidad con bloques/tradiciones. J3 produce preferencia
sobre personas.

---

## Mecánica del juego

### Onboarding (2 pasos)
1. **Cámara:** Diputado / Senador (flavor textual; en la primera versión ambas cámaras
   comparten los mismos escenarios)
2. **Provincia:** selector de 24 provincias (solo afecta el texto de la oferta final)

El usuario **no elige bloque** — el juego lo revela.

### Por ronda
- Contexto del escenario (3–4 oraciones neutras, sin revelar la posición "correcta")
- Opciones: **A favor** / **En contra** / **Me abstengo** / **Me ausento**
- En 5 rondas: modal previo tipo "WhatsApp de la rosca" con presión de un actor
  (gobernador, sindicato, correligionario) — el usuario debe leer y aceptar antes de votar.
  El voto sigue siendo libre.
- Después de cada voto: titular de prensa condicional (1 línea, estilo zócalo de noticiero)

### El escenario procedural (P01 — Dietas)
En una ronda, el escenario no es un proyecto de ley sino una situación de gobernabilidad:
vote informal, quórum como arma, etc. Esta ronda alimenta el **perfil de ejercicio** (no
el scoring de afinidad por bloques). Se presenta como una ronda normal; el usuario no sabe
que tiene un propósito diferente.

---

## Bloques de referencia

| Bloque | Sigla | Coalición histórica equivalente (2018–2023) |
|--------|-------|---------------------------------------------|
| Libertad Avanza | LLA | No existía como bloque — se usa posición de plataforma/declaraciones |
| PRO / republicanos | PRO | Juntos por el Cambio (JxC) |
| UCR | UCR | Juntos por el Cambio (JxC) — ala propia |
| Unión por la Patria / PJ | UP | Frente de Todos (FdT) |
| FIT-Unidad | FIT | FIT-U (sin cambio) |

**Restricción metodológica:** Para escenarios anteriores a diciembre de 2023, LLA no tiene
voto observado. Se usa posición reconstruida desde plataforma y declaraciones públicas, marcada
como `posicion_reconstruida = true` en el JSON del escenario. La página de metodología del
juego lo explicita.

---

## Escenarios del juego

### Base fija — 8 escenarios inamovibles

Estos 8 escenarios son los que garantizan comparabilidad entre todos los usuarios.
Nunca rotan. Incluyen 5 reales + 3 ficticios.

| ID | Título | Tipo/Año | Eje | Posiciones (LLA/PRO/UCR/UP/FIT) | Por qué es fijo |
|----|--------|----------|-----|----------------------------------|-----------------|
| B1 | IVE — Aborto legal | Real 2020 (legado) | Social | −/D/D/+/+ | Único reactivo puro del eje valórico. Atraviesa todos los bloques transversalmente |
| B2 | Acuerdo con el FMI | Real 2022 (legado) | Ext/Económico | −/+/+/D/− | "Herradura ideológica": LLA+FIT juntos contra el centro. No hay otro caso igual |
| B3 | Eliminación de Ganancias 4ª categoría | Real 2023 (legado) | Económico | +/−/−/+/+ | Coalición invertida: LLA vota con UP+FIT contra PRO+UCR. Rompe toda predicción |
| B4 | Boleta Única de Papel | Real 2024 | Electoral | +/+/+/−/+ | Más limpio del eje electoral. Rice >95 en 4 de 5 bloques |
| B5 | Ficha Limpia | Real 2025 | Inst/Electoral | +/+/+/−/D | Cayó por un voto en Senado. Aísla al peronismo en defensa corporativa del poder |
| B6 | Autonomía constitucional del BCRA | Ficticio | Económico-monetario | +/+/+/−/− | Ortodoxia monetarista pura, sin contaminación de intereses provinciales |
| B7 | TLC bilateral con EE.UU. | Ficticio | Exterior | +/+/D/−/− | Fractura geopolítica limpia. Divide internamente a UCR (desarrollismo vs. liberalismo) |
| B8 | Baja de imputabilidad (con garantías) | Ficticio | Seguridad/Social | +/+/D/−/− | Arrincona a UCR entre punitivismo electoral y garantismo histórico |

**Cobertura de ejes:** Social (B1, B8) · Económico (B2, B3, B6) · Electoral (B4, B5) · Exterior (B2, B7) · Institucional (B5, B6)

**Escenarios con coalición no-obvia (anti-predicción):**
- B2: LLA+FIT juntos — los extremos del espectro
- B3: LLA con UP+FIT — el gobierno con la izquierda
- B6: LLA+PRO+UCR — gobierno+oposición moderada unidos

### Temporada fundacional — 4 escenarios rotativos (lanzamiento 2025–2026)

| ID | Título | Tipo | Eje | Posiciones | Razón de temporada |
|----|--------|------|-----|------------|-------------------|
| T1 | Súper RIGI 2026 | Real 2026 | Económico/Exterior | +/+/+/−/− | Máxima resonancia actual. Extrae la tensión más divisiva de la Ley de Bases |
| T2 | Veto a financiamiento universitario (insistencia) | Real 2024 | Social/Cultural | −/D/+/+/+ | Lealtad cultural de clase media. Fracturó al PRO |
| T3 | Reducción de jornada laboral (32hs) | Ficticio | Económico/Laboral | −/−/−/+/+ | Fractura laboral limpia. Sin ambigüedad entre los 5 bloques |
| T4 | Dietas a mano alzada (sin registro) | Procedural | Perfil de ejercicio | — | No entra al scoring de afinidad. Mide transparencia y costo personal |

**Nota T2:** El escenario se plantea como "¿acompañás el veto del Ejecutivo o lo rechazás?"
(votar a favor = sostener el veto = posición LLA; votar en contra = rechazar el veto).

---

## Metodología de scoring

### Mapeo de votos
Los cuatro votos se mapean a escala numérica:
```
A favor   = +1
En contra = -1
Abstención =  0
Me ausento =  0
```

### Paso 1 — Similitud por distancia de Manhattan
Para cada escenario `i` y bloque `b`:
```
distancia_i[b] = |voto_usuario_i − posicion_bloque_i[b]|
similitud_i[b] = 1 − (distancia_i[b] / 2)   → rango [0, 1]
```

### Paso 2 — Ponderación por Índice de Rice
El Índice de Rice mide la cohesión real del bloque en esa votación:
```
rice_i[b] = 100 × |afirmativos_b − negativos_b| / (afirmativos_b + negativos_b)
coeficiente_i[b] = rice_i[b] / 100   → rango [0, 1]
```
Para bloques con posición "Dividida" o Rice < 55: `coeficiente = 0.5`.
Para escenarios ficticios: Rice se asigna por dossier de confianza (alta=0.9, media=0.7, baja=0.5).

### Paso 3 — Afinidad ponderada
```
afinidad_ponderada_i[b] = similitud_i[b] × coeficiente_i[b]

afinidad_real[b]    = Σ afinidad_ponderada_i[b] para escenarios reales / N_reales
afinidad_ficticio[b] = Σ afinidad_ponderada_i[b] para ficticios / N_ficticios

afinidad_final[b] = afinidad_real[b] × 0.7 + afinidad_ficticio[b] × 0.3
```

### Paso 4 — Bloque ganador y zona de lealtad
```
bloque_afin = argmax(afinidad_final[b])
nivel_afinidad = afinidad_final[bloque_afin]

si nivel_afinidad > 0.80 → zona: "Disciplinado"
si nivel_afinidad 0.60–0.80 → zona: "Moderado"
si nivel_afinidad < 0.60 → zona: "Díscolo"
si ningún bloque > 0.55 → zona: "Freerider puro"
```

---

## Sistema de output

### Capa 1 — Arquetipo acusatorio
Basado en bloque + zona de afinidad. 5 arquetipos posibles:

| Arquetipo | Condición |
|-----------|-----------|
| **El Disciplinado** | Zona "Disciplinado" con bloque claro |
| **El Díscolo** | Zona "Moderado" — afinidad clara pero votos frecuentes en solitario |
| **El Lobbista** | Zona "Moderado" con segundo bloque a menos de 5pp del primero |
| **El Lobo Solitario** | Freerider puro — ningún bloque supera 55% |
| **El Opositor Sistemático** | Afinidad inversa — vota consistentemente contra el bloque más grande del hemiciclo |

### Capa 2 — Oferta política narrativa
Texto en segunda persona. Tono: realismo cínico institucional. Sin nombres de dirigentes reales
(envejecen y parecen propaganda). El actor es "el bloque" o "la conducción".

Referencia de tono: *El Estudiante* (Santiago Mitre). Léxico: recinto, dictamen, cuarto
intermedio, sesión caída, pasillo, rosca, bloque, expediente.

Apertura sugerida para el juego:
> "Entraste sin bloque. Eso te da libertad; también te deja sin teléfono cuando empieza la sesión."

Borradores de oferta (afinar en Fase 1):

| Bloque | Disciplinado | Díscolo | Lobo Solitario |
|--------|-------------|---------|----------------|
| LLA | "El oficialismo te quiere en la lista. Banca segura, disciplina de hierro." | "LLA te necesita pero no te controla. Sos el voto más buscado del recinto." | "Tres bloques te llaman. Ninguno te tiene garantizado." |
| PRO | "El PRO te ofrece estructura y proyección. Perfil técnico, gestión." | "JxC te da margen de criterio. A largo plazo, eso vale." | ídem |
| UCR | "El radicalismo te adopta. Más de un siglo de historia te respalda." | "La UCR necesita renovarse. Sos parte de ese proceso." | ídem |
| UP | "El movimiento te reconoce. Te ofrecen encabezar la lista en [provincia]." | "El PJ te quiere pero no te entiende. Sos un activo impredecible." | ídem |
| FIT | "La izquierda te incorpora. Compromiso militante, cero componendas." | "El FIT te admira pero necesita que te definas." | ídem |
| Freerider | — | — | "Ningún bloque te tiene. Sos el legislador más libre del Congreso — y el más solo. Te proponen armar tu propio sello provincial." |

### Capa 3 — Radar de afinidad
Gráfico de radar (Chart.js o canvas puro) con los 5 bloques y el porcentaje de afinidad de
cada uno. Transparencia que legitima el resultado y genera debate ("¿cómo tengo 40% con ese?").

### Capa 4 — Historial comparativo
Lista de los 11 escenarios de afinidad con:
- El voto del usuario
- La posición del bloque afín
- Coincidencia o divergencia (✓/✗)

Esta pantalla es el momento de "revelación incómoda" que genera share orgánico.

### Compartir (Canvas client-side)
Imagen generada en `<canvas>` con:
- Arquetipo (tipografía prominente)
- Bloque más afín
- "Tu voto más inesperado" (escenario de mayor distancia al bloque)
- CTA: "¿A qué bloque llegás vos? → [url]"
- Sin logotipos ni colores partidarios dominantes

---

## Perfil de ejercicio legislativo (track separado)

El escenario procedural (T4 Dietas + eventuales P02 Quórum / P03 Interpelación) alimenta
un perfil de ejercicio que se muestra como dato adicional en el resultado, sin alterar el
scoring de afinidad:

| Perfil de ejercicio | Descripción |
|--------------------|-------------|
| Negociador | Resuelve vía intermediación y acuerdos |
| Disciplinado | Sigue siempre la línea formal |
| Confrontativo | Expone en voz alta, pide votación nominal |
| Pragmático territorial | Evalúa el impacto en su provincia antes que la doctrina |

---

## Decisiones de diseño confirmadas

- [x] Scoring: Manhattan distance + Rice Index ponderado
- [x] Output: arquetipo acusatorio + oferta narrativa + radar + historial
- [x] Sin nombres de dirigentes reales en la oferta
- [x] 5 arquetipos (Disciplinado / Díscolo / Lobbista / Lobo Solitario / Opositor Sistemático)
- [x] Base fija: 8 escenarios (5 reales + 3 ficticios)
- [x] Temporada fundacional: 4 (RIGI 2026, Universitario veto, 32hs, Dietas)
- [x] Escenarios legado (IVE, FMI, Ganancias): posición LLA reconstruida desde plataforma
- [x] Escenarios procedurales: track separado, no afectan scoring de afinidad
- [x] WhatsApp de la rosca: modal de presión en 5 rondas (no cambia voto, solo fricción narrativa)
- [x] Titular reactivo: 1 línea por escenario tras el voto
- [x] Freerider puro: ningún bloque supera 55% → arquetipo "Lobo Solitario"
- [x] Sin eje izquierda-derecha tradicional en el output
- [x] Página de metodología pública con fuentes y reglas de codificación

---

## Pendientes de diseño (pre-implementación)

- [ ] Textos completos de oferta política (30 combinaciones) — Fase 1
- [ ] Contexto narrativo de los 12 escenarios (3–4 oraciones neutras c/u) — Fase 1
- [ ] Micro-copy de los modales "WhatsApp de la rosca" por escenario — Fase 1
- [ ] Titulares reactivos condicionales por escenario × voto — Fase 1
- [ ] Texto de onboarding y pantalla de bienvenida — Fase 1
- [ ] Mapeo de real_vote_id en dataset comovoto para B1–B5, T1–T2 — Fase 2
- [ ] Cálculo de Rice Index por bloque para los 7 escenarios reales — Fase 2
- [ ] Dossier de confianza para ficticios B6–B8, T3 — Fase 2
- [ ] Diseño de arquetipos (nombre + copy) — Fase 1/2
