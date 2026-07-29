# Lecciones aprendidas — quiz-ar

## Formato
```
## [FECHA] — [título corto]
**ERROR/DECISIÓN:** qué pasó
**REGLA:** qué hacer en cambio
**PORQUÉ:** razón o consecuencia
```

---

## PROTOCOLO DE GENERACIÓN DE ÍTEMS (validado 28/07/2026)

Antes de escribir cualquier ítem nuevo o rediseñar uno existente, seguir estos 4 pasos en orden. Saltear el paso 1 o 2 produce opciones que fallan R1 o no tienen tensión genuina.

**Paso 1 — Mapear las posiciones opuestas**
Describir en prosa qué cree genuinamente cada polo sobre el tema que mide la dimensión. No las opciones de respuesta — la visión del mundo de cada persona.

**Paso 2 — Identificar las afirmaciones de orgullo**
Para cada polo: ¿qué diría esta persona de sí misma que la haría sentir orgullosa? Buscar frases en primera persona que expresen convicción, no resignación ni ataque al otro polo.

**Paso 3 — Encontrar la situación que los enfrenta**
¿Qué situación concreta y cotidiana genera naturalmente las dos posturas del paso 2? La situación no debe favorecer a ningún polo ni crear víctimas/victimarios. Ambos deben poder reaccionar desde su propia lógica.

**Paso 4 — Escribir las opciones desde el orgullo**
Las opciones son la versión condensada de las afirmaciones del paso 2, ancladas en la situación del paso 3. Verificar R1: ¿una persona que genuinamente sostiene esta postura la firmaría con convicción?

**Por qué funciona:** Las opciones que se escriben sin este mapeo previo tienden a ser observaciones o diagnósticos, no posturas filosóficas. El respondente no se identifica con una observación — se identifica con una convicción.

---

## REGLA DE ORO — Autopercepción positiva en cada afirmación

**REGLA:** Cada afirmación (A y B) debe expresar la autopercepción positiva de quien sostiene esa postura. Nadie se identifica con "soy egoísta" — se identifica con "creo en la responsabilidad individual".

**CÓMO APLICARLA:** ¿Una persona que genuinamente sostiene esta postura la firmaría con orgullo? Si la respuesta es no, hay sesgo de deseabilidad social y hay que reescribir.

**EJEMPLO:**
- ❌ "No me corresponde hacerme cargo de desconocidos" → suena a egoísmo
- ✅ "Creo que si cada uno cuida bien de los suyos, la sociedad funciona mejor" → posición filosófica respetable

**PORQUÉ:** Si un polo suena como "la respuesta mala", el instrumento mide deseabilidad social, no postura ideológica real.

---

## CHECKLIST DE VALIDACIÓN (16 reglas)

### Lenguaje y contenido
- **L1** ¿La frase habla de uno mismo en primera persona, no hace diagnósticos sobre la sociedad?
- **L2** ¿Evita: solidaridad, igualdad, justicia, privilegio, bien común, mérito, casta, Estado, mercado?
- **L3** ¿Evita nombres de partidos, movimientos, líderes políticos?
- **L4** ¿La situación es reconocible en la vida diaria de un argentino promedio?
- **L5** ¿Evita negaciones como apertura ("no creo que...")?

### Equilibrio entre polos
- **E1** ¿Alguien que genuinamente sostiene esa postura firmaría la frase con orgullo? (autopercepción positiva)
- **E2** ¿Ambas frases suenan igualmente razonables a un observador neutral?
- **E3** ¿Ninguna frase suena a egoísmo, ignorancia, ingenuidad o crueldad?
- **E4** ¿Existe una porción real de la población que elegiría cada polo?
- **E5** ¿Las dos frases tienen extensión comparable?

### Discriminación y validez
- **D1** ¿Esta pregunta mide algo que las demás del mismo eje no miden? (sin solapamiento)
- **D2** ¿El par carga principalmente en un solo eje?
- **D3** ¿La respuesta no depende de un hecho verificable sino de una postura?
- **D4** ¿La situación es relevante sin importar edad, género o nivel socioeconómico?

### Estructura del par
- **P1** ¿A y B usan la misma estructura gramatical?
- **P2** ¿Un respondente no puede adivinar qué eje ideológico está midiendo la pregunta?
- **P3** ¿Elegir entre A y B implica un trade-off genuino?

---

## 2026-06-12 — Las preguntas del MVP v0 tenían carga política directa

**ERROR:** Las preguntas iniciales incluían frases como "el kirchnerismo debilitó las instituciones" o "las empresas estatales deberían privatizarse". La respuesta "correcta" era obvia según el sesgo del usuario.

**REGLA:** J1 usa SOLO preguntas actitudinales cotidianas — sin mencionar partidos, leyes, candidatos ni coyuntura.

**PORQUÉ:** Activan el sesgo de deseabilidad social — la persona responde "lo que debería pensar", no lo que siente.

---

## 2026-06-12 — Los 3 juegos no pueden tener el mismo output

**DECISIÓN:** Cada juego responde una pregunta diferente con metodología diferente:
- J1: ¿Cómo pensás? → Likert actitudinal → perfil psicográfico
- J2: ¿Con qué visión coincidís? → elección forzada política → afinidad con tradiciones
- J3: ¿A quién preferís? → MaxDiff best-worst → ranking de candidatos

**REGLA:** Test de diferenciación: ¿puede un usuario jugar los 3 y recibir información complementaria, no redundante?

---

## 2026-06-12 — Formato paired statements (no Likert simple)

**DECISIÓN:** Cambiar de escala Likert de acuerdo/desacuerdo a pares de afirmaciones con escala 1–5 entre dos polos (Elección Forzada Graduada).

**REGLA:** Cada pregunta tiene `text_a` y `text_b`. La posición izquierda/derecha de A y B se **randomiza** en el frontend. El backend recibe `{value, a_is_left}` y normaliza.

**PORQUÉ:** Reduce el sesgo de aquiescencia (tendencia a decir "de acuerdo" por defecto) y el sesgo posicional.

---

## 2026-06-12 — Las afirmaciones no deben ser "explícitamente" sobre individualismo/colectivismo

**ERROR:** i1_3 original decía "Mi primera responsabilidad es con mi familia cercana; hacerme cargo de personas que no conozco no me corresponde" — demasiado obvia la dimensión que mide.

**REGLA:** Las preguntas capturan la tensión de forma oblicua, desde una situación cotidiana concreta. El respondente no debe poder adivinar qué está midiendo.

**PORQUÉ:** Si el eje es obvio, la persona responde según su identidad política declarada, no según sus actitudes reales.

---

## 2026-06-12 — Meritocracia necesita 5 ángulos distintos, no 5 variantes del mismo

**ERROR:** Los 3 primeros ítems de meritocracia medían lo mismo desde distintos ángulos ("¿progresás por esfuerzo o por condiciones?"). Alguien meritócrata respondería A en los tres.

**REGLA:** Los 5 ítems de una dimensión deben poder generar respuestas CRUZADAS en una persona matizada. Si todos apuntan en la misma dirección, son redundantes.

**SOLUCIÓN APLICADA:** 5 ángulos distintos para meritocracia:
1. Agencia personal (locus of control)
2. Mérito técnico vs. capital relacional
3. Plataforma familiar vs. autodeterminación
4. Trayectoria lineal vs. rebusque (muy argentino)
5. Retribución por productividad vs. piso de seguridad

---

## 2026-06-12 — i5_1 (localismo) solapa con i1_5 (individualismo)

**PROBLEMA DETECTADO (no resuelto aún):** Ambas preguntas son sobre compra local vs. global.
- i1_5 (individualismo): optimización de precio/calidad vs. apoyo a comercios locales
- i5_1 (localismo): producción cercana vs. variedad global

**REGLA:** Resolver reencuadrando i5_1 hacia IDENTIDAD (no consumo): ej. "Me identifico principalmente con el lugar donde vivo" vs. "Me identifico con el mundo en general más que con el lugar donde vivo."

---

## Estado de validación de preguntas (al cierre sesión 2026-06-23)

| Dimensión | Estado |
|-----------|--------|
| individualismo (i1) | ✅ validadas |
| meritocracia (i2) | ✅ validadas |
| tradicion (i3) | ✅ validadas (1 fix: "predecibles" → "estables") |
| autoridad (i4) | ✅ validadas |
| localismo (i5) | ✅ validadas |
| antiestablishment (i6) | ✅ validadas (2 reescritas: i6_1 corporaciones, i6_2 reglas/sistema) |
| derechos_autonomia (d7) | ✅ validadas (d7_2 reescrita: vida privada vs. normas comunes) |
| laicismo (d8) | ✅ validadas (ambas reescritas: símbolos públicos + religión en leyes) |
| migracion (d9) | ✅ validadas (ambas reescritas: servicios públicos + integración cultural) |
| fuentes_info (d10) | ✅ validadas (d10_2 reescrita: medio explícito vs. "neutral") |

---

## 2026-06-23 — Neutro en denominador genera compresión centrípeta (scoring)

**ERROR:** El valor neutro (value=2) producía centered=0 pero seguía contando en el denominador de normalización. Esto arrastraba todos los scores hacia 0 artificialmente.

**REGLA:** Los ítems con value=2 ("Ambas igual") y value=0 (escape "No sé") deben excluirse TANTO del numerador como del denominador. El denominador debe ser dinámico: solo incluye dimensiones con al menos una respuesta no-neutra.

**PORQUÉ:** Un usuario que responde claro en 5 preguntas y neutro en 18 debe mostrar un score intenso en lo que respondió, no uno comprimido por las 18 respuestas vacías.

---

## 2026-06-23 — Dimensiones con distinto número de ítems generan sesgo de peso (scoring)

**ERROR:** La suma ponderada original acumulaba directamente los scores de cada ítem al eje. Las dimensiones con 3 preguntas pesaban 50% más que las de 2 preguntas, violando los pesos teóricos definidos.

**REGLA:** Scoring en 2 niveles: primero calcular el promedio centrado por dimensión (D̄ⱼ), luego multiplicar ese promedio por el peso de la dimensión y agregar al eje.

**PORQUÉ:** El impacto de cada dimensión en el eje debe ser proporcional a su peso teórico, independientemente de cuántos ítems tenga.

---

## 2026-06-23 — "Ambas igual" ≠ "No sé": son estados cognitivos distintos

**DECISIÓN:** Separar el botón neutral en dos opciones:
- "Ambas me representan por igual" (value=2): postura válida de equilibrio, excluida del cálculo pero no penalizada
- "No sé / No aplica" (value=0): botón de escape externo, fuera de la escala de 3 botones

**REGLA:** El punto central de la escala es para equilibrio genuino. El escape es para desconocimiento o irrelevancia. Ambos se excluyen del denominador pero deben presentarse visualmente distinto.

**PORQUÉ:** Unificarlos sesga el diagnóstico: un usuario que "no sabe" y uno que "está en el medio" tienen perfiles muy distintos.

---

## 2026-06-23 — Colores políticos en el compass generan sospecha de sesgo

**ERROR:** Los cuadrantes del compass usaban los colores de los perfiles (rojo, azul, amarillo, violeta) que en Argentina tienen carga simbólica partidaria directa.

**REGLA:** Los cuadrantes del compass deben usar tonos desaturados o grises oscuros. Solo el punto del usuario lleva el color del arquetipo.

**PORQUÉ:** El sesgo cromático es percibido por el usuario como sesgo algorítmico. La credibilidad del instrumento depende de su neutralidad visual.

---

## 2026-06-23 — Mostrar progreso numérico aumenta abandono

**ERROR:** El contador "N / total" arriba del quiz focaliza la atención en el esfuerzo restante, generando fatiga anticipada.

**REGLA:** Usar solo indicadores visuales (barra sin número, fingerprint progresivo). Si hay contador, ocultarlo o ponerlo abajo. Nunca mostrar porcentaje de completado de forma prominente.

**PORQUÉ:** Estudios de psicología conductual (SurveyMonkey, Irrational Labs) confirman que la barra numérica superior aumenta el abandono. El endowed progress (progreso visual que "lleva" al usuario) tiene el efecto opuesto.

---

## 2026-06-23 — Loading screen de 2.4s genera percepción de rigor científico

**DECISIÓN:** Agregar una pantalla de carga simulada con 4 mensajes rotativos (600ms c/u) antes del reveal del resultado.

**Mensajes:** "Compilando tus respuestas..." → "Estratificando dimensiones ideológicas..." → "Modelando tensiones constitucionales..." → "Consolidando tu arquetipo..."

**REGLA:** La pantalla de carga no debe ser genérica ("Cargando..."). Los mensajes deben sonar técnicos y específicos al instrumento.

**PORQUÉ:** La percepción de procesamiento complejo aumenta el valor subjetivo que el usuario le asigna a su resultado. Es una práctica documentada en 16Personalities, ISideWith y otros quizzes de alto engagement.

---

## 2026-06-23 — Anti-establishment en Argentina no es ortogonal ni neutral

**HALLAZGO (pendiente de validación empírica):** El eje anti-establishment tiene correlación asimétrica en Argentina: el kirchnerismo lo dirige hacia corporaciones y medios concentrados; el libertarismo hacia el Estado y la "casta política". Los reactivos actuales capturan mejor la versión kirchnerista.

**PENDIENTE:** Agregar al menos un ítem anti-Estado (tipo "los políticos trabajan para mantenerse, no para la gente") para balancear. Evaluar correlación con ejes económicos en datos piloto.

---

## 2026-06-24 — FP_POSITIONS fuera de rango en fase 2

**ERROR:** `updateFingerprint` accede a `FP_POSITIONS[idx]` donde `idx = answeredCount - 1`. `FP_POSITIONS` tiene exactamente 15 posiciones (fase 1). Al responder la primera pregunta de fase 2, `answeredCount = 16` → `idx = 15` → `undefined`. Destructuring de `undefined` tira `TypeError`, mata `renderQuestion` a mitad de ejecución, y `advancing` queda `true` para siempre → quiz congelado.

**REGLA:** Cualquier array con longitud fija atada al conteo de preguntas de una fase necesita un bounds check antes de acceder por índice. Si hay fase 2, el conteo de respuestas supera ese límite.

**PORQUÉ:** El error ocurre silenciosamente desde el punto de vista del usuario (no hay mensaje visible), pero deja el estado interno roto. El síntoma — "no avanza ni registra" — es consecuencia indirecta del `advancing` bloqueado, no del error directamente.

---

## Estado del proyecto al 01/07/2026

### Completado en sesión 30/06 + 01/07
- ✅ Tema claro/minimalista en todo el proyecto
- ✅ 25 preguntas (D3 piquetes i6_4 + D4 anti-casta i6_5)
- ✅ Fase 2 eliminada — test único uniforme
- ✅ Progress ring (arco coral + número)
- ✅ Barra de avance, botón volver y "No sé / No aplica" eliminados
- ✅ Reward screen rediseñada: hero con nombre primero + color wash + tagline
- ✅ 10 arquetipos con tagline_short, tagline_long, symbol, image_url, nueva paleta
- ✅ 10 imágenes generadas y servidas desde `/static/images/archetypes/`
- ✅ Radar eliminado de la pantalla de resultados
- ✅ Comparación muestra nombre del arquetipo (no perfil genérico)

---

## Estado del proyecto al 02/07/2026 — COMPLETADO EN SESIÓN

### Completado (P1–P4 + instrumento + compartir)
- ✅ P1: Compass SVG eliminado del reward (era confuso, imagen del arquetipo cubre el rol)
- ✅ P2: i6_4 e i6_5 acortadas — nueva tensión derechos de tránsito vs protesta directa / pluralismo vs anti-casta
- ✅ P3: Mobile optimization — imagen hero reduce a 160px en ≤480px, result-wrapper padding, qp-shell padding
- ✅ i1_3 reemplazada — "compro barato vs local" → orden espontáneo vs coordinación colectiva
- ✅ Títulos del reward revisados — "Qué dice esto de vos" / "Quiénes piensan como vos"
- ✅ Texto del `symbol` eliminado del fold (era el prompt de generación de imagen, redundante)
- ✅ "Eje económico promedio" eliminado del fold comparación
- ✅ Sistema de compartir completamente rediseñado (ver sección compartir abajo)

### Pendiente de testing (requiere deploy)
- Web Share API en iOS Safari y Android Chrome real
- OG meta tags para preview de link en WhatsApp/X (server-side)
- Calibrar CENTER_THRESHOLD con datos reales (≥100 respuestas)

---

## 2026-07-02 — Instrumento: negaciones en afirmaciones crean carga argumentativa

**REGLA:** Nunca usar "no hace falta", "no es necesario", etc. en las afirmaciones del EFG. Las negaciones hacen que la opción suene reactiva o defensiva en lugar de expresar una postura propia.

**PORQUÉ:** El EFG mide posturas genuinas. Una afirmación que empieza negando algo activa automáticamente la tensión con el otro polo, en vez de expresar la posición por su propio mérito.

**CÓMO APLICARLA:** ¿La afirmación puede sostenerse sola, sin referirse implícitamente al otro polo? Si no puede, hay que reescribir.

---

## 2026-07-02 — Compartir: `wa.me/?text=` no soporta archivos

**REGLA:** El botón de WhatsApp con `wa.me/?text=...` solo envía texto. Para compartir imágenes en WhatsApp hay que usar Web Share API (mobile) o descarga manual.

**FLUJO CORRECTO:**
- WhatsApp button → abre chat con texto de invitación + link (adquisición)
- IG button → descarga imagen portrait para adjuntar manualmente

---

## 2026-07-02 — Canvas PNG: profilePct usa archetypes_pct, no profiles_pct

**ERROR:** `stats.profiles_pct[profile]` devuelve null para arquetipos con tipo "C" (Centro), que no está en el mapa EP/EC/PC/PP.

**REGLA:** Usar `stats.archetypes_pct[archId]` como primera opción, con fallback a `profiles_pct[profile]`.

---

## 2026-07-02 — iOS Safari Web Share API descarta texto al compartir archivo

**ERROR:** En iOS, `navigator.share({ files: [img], text: "...", url: "..." })` silenciosamente descarta el texto y la URL, compartiendo solo el archivo.

**REGLA:** Detectar iOS con `/iPad|iPhone|iPod/.test(navigator.userAgent)`. En iOS: copiar texto al portapapeles primero (toast de confirmación), luego `navigator.share({ files: [img] })` solo con el archivo.

---

## 2026-07-02 — Canvas portrait: franja de color en footer llena el espacio vacío

**DECISIÓN:** El canvas 4:5 (630×788) tiene demasiado espacio vacío después del contenido textual. Solución: franja del color del arquetipo en el 27% inferior con stat + CTA + hostname en blanco.

**RESULTADO:** Llena el espacio, refuerza la identidad visual del arquetipo, y convierte el espacio vacío en CTA de adquisición.

---

## Estado del proyecto al 03/07/2026 — Sesión de bugs I1-I7

### Decisión desbloqueada
- ✅ **Escala:** 4-point forced choice + válvula de escape externa (basado en deep research + modelo smartvote). Pendiente de implementación en instrumento y frontend.

### Bugs resueltos (Sesión 2)
- ✅ **I1 CRÍTICO:** Validación de rango en `score_brujula` — values fuera de `{1,2,3}` para scale=3 se descartan antes del cálculo
- ✅ **I2 ALTO:** `DIM_POLES.derechos_autonomia` en `results.js` tenía `pos`/`neg` invertidos — corregido
- ✅ **I3 ALTO:** `inst_moderate: bool` añadido al resultado (True cuando `|inst| < INST_THRESHOLD`) — frontend puede usarlo en Sesión 3
- ✅ **I4 ALTO:** Metadata limpia: `brujula.json` v3.0 (scale dict corregido, sin phase fields), `quizzes.py` questions_count=25, time_minutes=4
- ✅ **I5 ALTO:** `"C"` agregado a `profiles` dict en `database.py` y `stats.py` — Centro Pragmático ya se contabiliza
- ✅ **I6 MEDIO:** Endpoint debug `/api/stats/j1/last-result` gateado con `APP_ENV=development`. k-anonimato subido a `min_n=5`
- ✅ **I7 MEDIO:** Hardcoded `25` reemplazado por `quizData.total_questions` en `quiz.js`

### Pendientes (Sesión 3)
- Issues A-D (requieren I2 resuelto — ya resuelto): verificar en browser antes de asumir qué falta
- OG meta tags dinámicos (server-side)
- Implementar escala 4-point con válvula de escape en frontend y engine (Sesión 1 del instrumento)

---

## 2026-07-03 — DIM_POLES en results.js debe coincidir con pole_a/pole_b del JSON

**ERROR:** `DIM_POLES.derechos_autonomia` tenía `pos="Marco comunitario"` y `neg="Autonomía"` — exactamente al revés. Un usuario que elige autonomía (pole_a) ve etiquetado su perfil como "Marco comunitario".

**REGLA:** `DIM_POLES[dim].pos` debe corresponder a `pole_a` del JSON (dim_score > 0 = votó más por A). `DIM_POLES[dim].neg` debe corresponder a `pole_b`.

**CÓMO DETECTARLO:** Para cada dimensión, trazar: ¿si alguien elige siempre la opción A, qué etiqueta muestra el radar? Comparar con `pole_a` en el JSON. Si no coinciden, hay swap.

---

## 2026-07-03 — Valores fuera de rango en el scoring no fallan ruidosamente

**ERROR:** `_compute_centered(value=5, a_is_left=True, scale=3)` producía `centered=-6.0`, fuera del rango `[-2, +2]`. Un eje con todas las preguntas en value=5 podía llegar a -300.

**REGLA:** Antes de calcular `_compute_centered`, validar que `value` está en `{1,2,3}` para scale=3 o `{1,2,3,4,5}` para scale=5. Valores inválidos → `continue` (skip silencioso).

**PORQUÉ:** La API acepta JSON arbitrario. Sin validación, una request malformada puede producir scores aberrantes que se guardan en la base de datos y contaminan las estadísticas.

---

## Estado del proyecto al 03/07/2026 — Sesión Issues A-D

### Completado
- ✅ **Issue A:** topInsight renderizado en el hero con polo correcto (usa DIM_POLES por signo de score)
- ✅ **Issue B:** Radar eliminado. Nueva sección buildDimensionGroups: polo + barra de intensidad, agrupado por eje, oculta dimensiones con |score| ≤ 20. Insertada en fold "Qué dice esto de vos"
- ✅ **Issue C:** CENTER_THRESHOLD bajado de 20 a 10 + copy de centro_institucional y centro_critico reescrito para reconocer que Centro puede ser moderación O valores contradictorios que se cancelan
- ✅ **Issue D:** Ya estaba resuelto desde sesión anterior (style.css ya era crema)

### Completado — Workstream 1: Escala 4-point (03/07/2026)
- ✅ Engine: `_compute_centered` para scale=4 (valores 1-4 → centered en [-2,+2] con paso 4/3)
- ✅ Engine: `NEUTRAL_VALUES = {0}` — solo el escape es neutro, value=2 ahora es "Más bien A"
- ✅ Engine: `valid_range` actualizado por scale (4→{1,2,3,4})
- ✅ JSON: todas las preguntas migradas a `"scale": 4`, metadata actualizada v4.0
- ✅ Frontend: `buildEFG` reescrito — 4 botones (Claramente/Más bien × A/B) + escape externo
- ✅ CSS: nuevas clases `.qp-4btn-*`, `.qp-escape`, eliminadas clases 3-point

### Completado — Corpus teórico y revalidación conceptual (03/07/2026)
- ✅ Corpus de 40+ documentos construido en `CORPUS TEORICO/`
- ✅ 42 fichas generadas (3 batches): Batch 01 (21), Batch 02 (4), Batch 03 (17)
- ✅ Brussino (2011) leído completo: 22 ítems extraídos, estructura factorial confirmada
- ✅ Revalidación conceptual ítem por ítem documentada en `docs/research/REVALIDACION_J1_V1.md`
- ✅ Diagnóstico por dimensión: 2 débiles (autoridad, fuentes_info), 1 crítica (antiestablishment), resto sólidos
- ✅ 4 brechas identificadas: privatismo informal, anti-establishment estructural, autoritarismo político, eficacia externa

### Pendientes — Redacción de ítems nuevos (próxima sesión)

Estado al 03/07/2026:
- ✅ N1 (meritocracia, reemplaza i2_3): APROBADO — "Con esfuerzo y dedicación, casi siempre se puede salir adelante." / "El esfuerzo importa, pero el punto de partida cambia mucho las posibilidades."
- ✅ N2 (individualismo, privatismo informal): APROBADO (07/07/2026)
  - A: "En la vida cuento con los míos — familia y amigos de confianza — y con eso me alcanza y me sobra."
  - B: "Cuento con mi barrio, mis compañeros, la gente de mi comunidad: ese respaldo más amplio no lo cambiaría por nada."
- ✅ N3 (autoridad, punitivismo): APROBADO (07/07/2026)
  - A: "Cuando hay conflicto, lo que hace falta es firmeza: las consecuencias claras son lo que pone orden."
  - B: "Cuando hay conflicto, prefiero entender qué lo genera: sin eso, cualquier solución es pasajera."
- ✅ N4 (antiestablishment, poder capturado, reemplaza i6_1): APROBADO (11/07/2026)
  - text_a JSON (pole institucionalista): "Para mí, elegir representantes sigue siendo la forma más legítima que tenemos de decidir colectivamente."
  - text_b JSON (pole antiestablishment): "Creo que quienes llegan al poder político terminan trabajando para mantenerse en él, no para la gente que los eligió."
  - Nota: A/B swapeados en JSON para mantener convención pole_a=institucionalista. Frontend randomiza igual.
- ✅ N5 (antiestablishment, valoración de la democracia, reemplaza i6_4): APROBADO (11/07/2026)
  - A: "Para mí, poder votar y cambiar a quienes gobiernan es lo más importante que tenemos — aunque la democracia sea lenta e imperfecta."
  - B: "Para mí, lo que importa es que las cosas funcionen y que la gente esté bien. Si eso se logra o no con elecciones es secundario."
  - Foco reencuadrado: no "canales formales vs. presión directa" sino valor intrínseco de la democracia vs. pragmatismo de resultados.
- ✅ N6 (antiestablishment, eficacia política externa): APROBADO (11/07/2026)
  - A: "Creo que cuando la gente se organiza y participa de verdad, termina logrando que las cosas cambien. Vale la pena involucrarse."
  - B: "Creo que por más que uno participe, las decisiones importantes las siguen tomando los de siempre. La participación cambia poco."
- ✅ N8 (autoridad, orden vs. criterio propio): APROBADO (11/07/2026)
  - Foco reencuadrado: no "obediencia personal" (trampa de deseabilidad) sino valoración de la autoridad/orden como principio organizador de la convivencia.
  - A: "Me siento más tranquilo cuando hay reglas claras y figuras que las hacen respetar. Eso es lo que hace posible vivir juntos."
  - B: "Me siento más cómodo cuando puedo actuar según mi propio criterio, sin depender de que alguien externo establezca lo que está bien."

### Fase 1 completada ✅ (11/07/2026)
- brujula.json actualizado a v5.0: 26 ítems, fuentes_info eliminada del eje inst
- OG meta tags dinámicos (server-side, requiere deploy)

---

## 2026-07-03 — Copy de Centro no debe asumir que el usuario es moderado

**DECISIÓN:** El perfil Centro puede recibir a dos tipos de usuario muy distintos: (a) genuinamente moderado, sin posiciones extremas, y (b) alguien con valores fuertes que se cancelan entre sí en los ejes. El copy original decía "tu posición es moderada", lo que es falso para el caso (b).

**REGLA:** El copy de Centro debe dejar abierta la interpretación. Frase clave: "Puede que genuinamente estés en el centro, o que tus valores tiren en direcciones opuestas y se compensen."

**PORQUÉ:** El usuario que llega a Centro con posiciones intensas siente que el quiz no lo entendió si le dice que es "moderado". La credibilidad del instrumento depende de que el resultado nunca contradiga la experiencia del respondente.

---

## 2026-07-03 — DIM_LABELS en results.js (dead code de buildRadarChart)

**REGLA:** `buildRadarChart` fue eliminada. Si se necesita mostrar dimensiones, usar `buildDimensionGroups`. No reimplementar el radar SVG.

---

## Estado del proyecto al 24/07/2026 — Rediseño instrumento v5.1 → v6.0

### Decisiones del rediseño

**DECISIÓN:** El instrumento fue rediseñado de v5.1 (31 ítems, 9 dimensiones) a v6.0 (19 ítems, 11 dimensiones).

Cambios estructurales:
- Se agregó la dimensión `modelo_economico` al eje econ (ECO_01, ECO_02)
- Se agregó la dimensión `confianza_institucional` al eje inst (CON_01, CON_02, CON_03) — separada de `antiestablishment`
- Muchas dimensiones del eje social se redujeron a 1 ítem cada una (son 6 dimensiones × 1 ítem = 6 ítems para el eje social completo)
- Los ítems N2 (privatismo informal) y N8 (orden vs. criterio) del banco v5.0 quedaron fuera del v6.0
- Se actualizaron las etiquetas de escala: "Claramente/Más bien" → "Totalmente/Bastante"
- Nuevo format: "scenario_cards"

**PORQUÉ:** El foco del rediseño fue privilegiar scenarios situacionales concretos (R4) sobre preguntas de actitud directas.

---

## 2026-07-24 — Checklist de 16 reglas consolidado en 10 reglas de diseño (R1-R10)

**DECISIÓN:** Las 16 reglas del checklist anterior fueron reemplazadas por 10 reglas de diseño en `docs/VALIDACION_ITEMS_V6.md`. Son más precisas, más accionables y tienen nombres canónicos.

**Reglas R1-R10 (ver doc completo en VALIDACION_ITEMS_V6.md):**
- **R1** Autopercepción positiva — cada opción se firmaría con orgullo genuino
- **R2** Independencia total — cada opción funciona sola, sin presuponer que se leyó la otra
- **R3** Sin negaciones primarias — la idea central es una afirmación, no la negación del otro polo
- **R4** Scenario concreto — situación vivible, no pregunta filosófica abstracta
- **R5** Neutralidad del scenario — no inclina hacia ninguna opción
- **R6** Equivalencia gramatical — misma persona y registro en A y B
- **R7** Tensión genuina — existe población real que elegiría cada polo
- **R8** Validez dimensional — mide la tensión de la dimensión declarada, no otra
- **R9** Opacidad ideológica — no revela el constructo con keywords políticas
- **R10** Relevancia argentina — tensión reconocible en el contexto argentino

**REGLA:** Usar R1-R10 como checklist de validación para cualquier ítem nuevo o revisado. El doc en VALIDACION_ITEMS_V6.md es el documento de referencia.

---

## 2026-07-24 — Validación ítem por ítem del instrumento v6.0

**Estado al 24/07/2026:**

| Ítem | Dimensión | Estado |
|------|-----------|--------|
| IND_02 | individualismo | APROBADO |
| IND_03 | individualismo | APROBADO (scenario levemente abstracto, no crítico) |
| MER_02 | meritocracia | REQUIERE AJUSTE — B en impersonal vs. A en primera persona (R6) |
| MER_03 | meritocracia | REQUIERE AJUSTE — scenario abstracto (R4) |
| ECO_01 | modelo_economico | REQUIERE AJUSTE — scenario abstracto (R4), "El Estado" revela constructo (R9) |
| ECO_02 | modelo_economico | APROBADO |
| TRA_02 | tradicion | REQUIERE AJUSTE — scenario abstracto (R4), A/B asimétricos (R6) |
| AUT_01 | autoridad | APROBADO |
| LOC_02 | localismo | APROBADO |
| DER_02 | derechos_autonomia | APROBADO — ítem de referencia, 0 fallas |
| LAI_02 | laicismo | REQUIERE AJUSTE — "laicos" revela constructo (R9), scenario levemente sesgado (R5) |
| MIG_02 | migracion | APROBADO |
| ANT_01 | antiestablishment | APROBADO |
| ANT_02 | antiestablishment | REDISEÑO COMPLETO — mide ECON (regulación), no INST. Prioridad 1. |
| ANT_03 | antiestablishment | APROBADO |
| ANT_04 | antiestablishment | APROBADO — ítem de referencia, 0 fallas |
| CON_01 | confianza_institucional | REQUIERE AJUSTE — scenario abstracto (R4) |
| CON_02 | confianza_institucional | REQUIERE AJUSTE — scenario abstracto (R4), keywords reveladoras (R9) |
| CON_03 | confianza_institucional | REQUIERE AJUSTE — no es scenario, es un statement de actitud (R4) |

**10 ítems aprobados, 9 necesitan trabajo.**

**Orden de fix pendiente:**
1. ANT_02 (prioridad 1 — error de constructo)
2. MER_03, ECO_01, TRA_02, CON_01, CON_02, CON_03 (prioridad 2 — scenario abstracto)
3. MER_02, LAI_02 (prioridad 3 — ajustes de opción)

---

## 2026-07-24 — ANT_02 mide ECON, no INST: error de constructo silencioso

**ERROR:** ANT_02 ("El avance de la IA plantea riesgos serios. ¿Quién debería controlarlo?") enfrenta "control democrático y supervisión pública" vs. "empresas y el mercado". Eso mide la tensión Estado vs. mercado (ECON), no la tensión institucionalista vs. anti-establishment (INST). Un privatista-institucionalista elegiría "empresas y el mercado" por razones económicas, no por desconfianza en el sistema — contaminando el eje inst para todos los respondentes.

**REGLA:** Un ítem del eje INST debe capturar la creencia en la legitimidad del sistema político (instituciones, reglas, representantes) vs. el escepticismo sobre ese sistema. No puede resolverse eligiendo entre "Estado" y "mercado" — eso es ECON.

**PORQUÉ:** El error es silencioso (el quiz funciona, no hay crash), pero el score inst queda contaminado para todos los respondentes que tienen posición económica fuerte.

---

---

## Estado del proyecto al 29/07/2026 — Sesión de hardening pre-deploy

### Bugs encontrados y resueltos

7 problemas identificados en revisión crítica pre-deploy. Todos corregidos en la misma sesión.

#### I8 CRÍTICO — DIM_POLES swapped para dimensiones con peso negativo

**ERROR:** La regla documentada el 03/07/2026 ("DIM_POLES[dim].pos debe corresponder a pole_a del JSON, dim_score > 0 = votó más por A") fue aplicada solo a `derechos_autonomia`. Las otras 4 dimensiones con peso negativo quedaron con pos/neg invertidos:

| Dimensión | pole_a | DIM_POLES incorrecto | DIM_POLES correcto |
|---|---|---|---|
| laicismo | laicismo | neg="Laico" | pos="Laico" |
| migracion | apertura | neg="Apertura" | pos="Apertura" |
| antiestablishment | institucionalista | neg="Institucionalista" | pos="Institucionalista" |
| confianza_institucional | institucionalista | neg="Institucionalista" | pos="Institucionalista" |

**REGLA:** Siempre que se agregue o modifique una dimensión, trazar explícitamente: "si alguien elige siempre pole_a, ¿qué dim_score produce? ¿Qué etiqueta muestra DIM_POLES?" Para dimensiones con peso negativo, el dim_score es positivo cuando se elige pole_a (a pesar de que el score de eje sea negativo). DIM_POLES.pos debe alinearse con dim_score > 0, no con el polo positivo del eje.

**PORQUÉ:** Un institucionalista puro (inst=-100) veía "Anti-establishment" como su rasgo dominante en la reward screen. El bug era invisible en tests de scoring (el engine era correcto) pero visible para cualquier usuario con posición clara en el eje institucional.

---

#### I9 ALTO — Submit sin deduplicación contaminaba stats

**ERROR:** Un mismo session_id podía llamar a `/api/quiz/{type}/submit` múltiples veces. Cada llamada insertaba una nueva fila en `quiz_completions`. Los stats agregados (profiles_pct, archetypes_pct) contaban todas las filas, inflando la N y distorsionando las distribuciones.

**REGLA:** `save_completion` ahora hace UPDATE si ya existe un completion para ese session_id + quiz_type, INSERT si no existe. Un usuario que retoma el quiz actualiza su registro en lugar de duplicarlo. El campo `voting_intention` se resetea a NULL al resubmitir (consistencia con el nuevo resultado).

**PORQUÉ:** Si el link del piloto se comparte ampliamente, algunos usuarios volverán a tomar el quiz. Sin deduplicación, esos resubmits contarían múltiple veces en la muestra del piloto.

---

#### I10 ALTO — XSS estructural en share page

**ERROR:** `result_json` se insertaba directamente en un tag `<script>` sin escapar la secuencia `</script>`. Un valor con esa cadena en los datos haría que el navegador cerrase el tag prematuramente, potencialmente ejecutando código arbitrario.

**REGLA:** Siempre reemplazar `</` → `<\/` (y `<!--` → `<\!--`) en cualquier JSON embebido dentro de un tag `<script>` en HTML generado por el servidor.

**PORQUÉ:** Los datos actualmente vienen del JSON del servidor, por lo que el riesgo real es bajo. Pero si en el futuro se permiten campos user-generated (comentarios, apodos), la vulnerabilidad escalaría a XSS almacenado sin cambiar nada del template.

---

#### I11 ALTO — Sin mínimo de respuestas no-escape

**ERROR:** El endpoint de submit aceptaba cualquier número de respuestas ≥ 1. Con 1-9 respuestas, el scoring producía perfiles basados en datos insuficientes (los ejes con 0 respuestas daban 0.0, que con CENTER_THRESHOLD=10 aparecía como "centro" silenciosamente).

**REGLA:** Antes de llamar al scorer, verificar que hay al menos `MIN_ANSWERS = 10` respuestas con value ≠ 0 (no-escape). Si no, retornar HTTP 400.

**PORQUÉ:** Un usuario que abandona a mitad del quiz (o un bot que manda 1 respuesta) generaría un perfil en la base de datos que contaminaría los stats y las distribuciones del piloto.

---

#### I12 MEDIO — dim_weights silencioso si hay inconsistencia

**ERROR:** El engine leía los pesos del primer ítem de cada dimensión y los aplicaba a todos los ítems de esa dimensión. Si algún ítem futuro tuviera pesos distintos, el cálculo sería incorrecto sin ningún aviso.

**REGLA:** Al cargar el JSON (`_load`), llamar a `_validate_weights` que verifica que todos los ítems de cada dimensión tienen los mismos pesos. Si hay discrepancia, lanza ValueError en startup (falla ruidosamente, no en producción silenciosamente).

**PORQUÉ:** Los errores de configuración del instrumento deben detectarse en startup, no en producción. Si se agregan ítems experimentales con pesos distintos, el error aparece inmediatamente al levantar el servidor.

---

#### I13 MEDIO — Rate limiting ausente

**ERROR:** El endpoint `/api/quiz/{type}/submit` no tenía límite de llamadas por IP. Cualquier actor podía inflar los stats del piloto con respuestas sintéticas en masa.

**REGLA:** Middleware en `main.py` que limita a 5 submits por IP por ventana de 10 minutos, aplicado a los paths que terminan en `/submit`, `/vote` y `/sessions`. Implementado en memoria (sin dependencias externas). Suficiente para el piloto; reemplazar por Redis si se escala.

**PORQUÉ:** El piloto necesita datos genuinos. Sin rate limiting, cualquier persona técnica puede generar cientos de completions en segundos.

---

#### I14 BAJO — Dead code `.qp-choice` en selectAndAdvance

**ERROR:** `selectAndAdvance` llamaba a `container.querySelectorAll(".qp-choice")` para destacar visualmente la opción seleccionada. La clase `.qp-choice` es del EFG de botones anterior (eliminado); el drag slider actual no genera esos elementos. El selector siempre devolvía NodeList vacío — código sin efecto.

**REGLA:** Remover el bloque de highlight. El drag slider ya tiene feedback visual propio (puck animado, cards activas/dim).

---

## Pendientes — J2 Visión AR y J3 MaxDiff Candidatos
- J2 y J3: sin desarrollo iniciado
- Deploy: Railway (Fly.io abandonado — eliminó free tier en 2026). README ya tiene instrucciones Railway.
