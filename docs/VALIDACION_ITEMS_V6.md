# Validación de ítems — Brújula Política AR v6.0

## 1. Contexto del instrumento

Quiz ideológico para Argentina. El usuario responde 19 preguntas y recibe un perfil psicográfico situado en 3 ejes.

**Formato de cada ítem:**
- `scenario`: encuadre situacional que aparece como título/pregunta
- `text_a` y `text_b`: dos opciones que el usuario elige mediante un slider de arrastre

**CRÍTICO — Posición aleatoria:** Las opciones aparecen en posición aleatoria (izquierda/derecha en desktop, arriba/abajo en mobile). El usuario NO ve etiquetas A/B. Cada opción debe funcionar de forma completamente autónoma, como si fuera la única frase en pantalla.

**Escala:** 4-point (Totalmente / Bastante × cada opción). Sin opción neutra obligatoria.

---

## 2. Ejes y dimensiones

### Eje ECON (Económico)
- Polo A (positivo): privatista / individual
- Polo B (negativo): estatista / colectivo
- Dimensiones: individualismo, meritocracia, modelo_economico

### Eje SOCIAL (Sociocultural)
- Polo A (positivo): conservador
- Polo B (negativo): progresista
- Dimensiones: tradicion, autoridad, localismo, derechos_autonomia, laicismo, migracion

### Eje INST (Institucional — ortogonal a ECON/SOCIAL)
- Polo A (negativo): institucionalista
- Polo B (positivo): anti-establishment
- Dimensiones: antiestablishment, confianza_institucional

---

## 3. Los 10 arquetipos

| Código | Nombre | Perfil ECON×SOCIAL | Eje INST |
|---|---|---|---|
| colectivista_transformador | El que todavía cree en la política | EP | institucionalista |
| colectivista_rebelde | El que sabe que el cambio viene de abajo | EP | anti-establishment |
| comunitarista_tradicional | El que sabe que sin raíces no hay futuro | EC | institucionalista |
| soberanista_nacionalista | El que defiende lo nuestro sin pedir permiso | EC | anti-establishment |
| republicano_de_orden | El que cree que sin reglas no hay libertad | PC | institucionalista |
| conservador_rebelde | El que labura y no entiende para qué paga tanto | PC | anti-establishment |
| liberal_cosmopolita | El que quiere vivir libre en un mundo sin fronteras | PP | institucionalista |
| libertario_de_autonomia | El que no le debe explicaciones a nadie | PP | anti-establishment |
| centro_institucional | El que prefiere resolver antes que tener razón | C | institucionalista |
| centro_critico | El que no tiene partido pero tiene criterio | C | anti-establishment |

---

## 4. Definición conceptual de cada dimensión

| Dimensión | Tensión central |
|---|---|
| individualismo | Responsabilidad individual vs. colectiva en el bienestar propio |
| meritocracia | Esfuerzo/mérito como determinante del éxito vs. condiciones estructurales |
| modelo_economico | Igualdad formal (reglas parejas) vs. igualdad sustantiva (compensación estatal) |
| tradicion | Cambio gradual vs. transformación profunda como principio de acción |
| autoridad | Jerarquía/obediencia vs. autonomía/pensamiento crítico como valor educativo/social |
| localismo | Arraigo local vs. apertura cosmopolita como identidad y orientación vital |
| derechos_autonomia | Autonomía individual vs. normas comunitarias como límite de las decisiones privadas |
| laicismo | Separación Estado/religión vs. presencia de valores religiosos en el espacio público/legal |
| migracion | Integración cultural como adaptación requerida vs. como derecho a la diferencia |
| antiestablishment | Legitimidad de las instituciones y reglas vs. cuestionamiento del sistema |
| confianza_institucional | Fe en que las instituciones pueden reformarse vs. escepticismo estructural sobre el poder |

---

## 5. Reglas de diseño de ítems (no negociables)

### R1 — Autopercepción positiva (la más importante)
Cada opción debe expresar la postura que su adherente sostendría con orgullo genuino. No basta con que sea "razonable" — tiene que generar identificación ideológica. Pregunta de test: *¿Una persona que genuinamente sostiene esta postura la firmaría con convicción y la defendería públicamente?*

### R2 — Independencia total
Cada opción funciona sola, sin presuponer que el respondente leyó la otra. Si apareciera sola en pantalla (izquierda, derecha, arriba, abajo), tendría pleno sentido. Prohibido: "también", "igualmente", "en cambio", "sin embargo", cualquier conector relacional.

### R3 — Sin negaciones primarias
La idea central de cada opción es una afirmación positiva, no la negación de algo que la otra opción afirma. Permitido: negaciones secundarias dentro de una afirmación más amplia. Prohibido: empezar con "No...", "Sin...", "Nunca...", o tener como núcleo la refutación del polo contrario.

### R4 — Scenario concreto
El scenario es una situación reconocible, vivible — no una pregunta filosófica abstracta. El respondente debe poder imaginarse en esa situación o reconocerla del mundo real. Prohibido: "¿Qué pensás sobre X?", "¿Qué hace que Y sea Z?", preguntas directas de opinión sin anclaje situacional.

### R5 — Neutralidad del scenario
El scenario no inclina hacia ninguna opción. No usa lenguaje cargado emocionalmente ni presupone que una postura es correcta.

### R6 — Equivalencia gramatical
Ambas opciones usan la misma persona gramatical (preferentemente primera persona) y registro similar. No mezclar primera persona con tercera, ni coloquial con formal, dentro del mismo ítem.

### R7 — Tensión genuina
Existe una porción real de la población argentina que elegiría cada opción. El trade-off es algo que realmente divide a la gente. Ninguna opción ganaría por consenso aplastante.

### R8 — Validez dimensional
El ítem mide la tensión conceptual de la dimensión declarada, no otra. No tiene carga cruzada fuerte en otra dimensión del instrumento.

### R9 — Opacidad ideológica
El respondente no puede adivinar fácilmente qué eje político mide la pregunta. Evitar keywords del debate político argentino (Estado, mercado, casta, libertad, kirchnerismo, meritocracia, etc.) cuando revelan el constructo.

### R10 — Relevancia argentina
El ítem resuena con tensiones reales de la vida cotidiana o el debate político-cultural argentino. No es un ítem genérico que podría pertenecer a cualquier país occidental.

---

## 6. Ítems actuales — Estado v6.1 (28/07/2026) — TODOS APROBADOS

### ECON

**IND_02 | individualismo**
- Scenario: "Mirás para atrás y ves algo importante que lograste."
- A: "Fui yo quien lo hizo posible."
- B: "Llegué hasta acá porque mucha gente me abrió el camino."
- Estado: APROBADO

**IND_03 | individualismo**
- Scenario: "Pensás en cómo podría mejorar tu ciudad."
- A: "Si cada uno se hace cargo de lo suyo, el conjunto mejora solo."
- B: "Hay cosas que solo mejoran si las encaramos juntos."
- Estado: APROBADO

**MER_02 | meritocracia**
- Scenario: "Dos compañeros de escuela terminan en situaciones muy distintas."
- A: "Cada uno llega donde sus decisiones lo llevan."
- B: "Nadie arranca igual de verdad. El origen pesa más de lo que nos gusta reconocer."
- Estado: APROBADO
- Nota: tensión = atribución del resultado a decisiones individuales vs. condiciones de origen. Diferente de MER_03 (éxito) e IND_02 (crédito del logro).

**MER_03 | meritocracia**
- Scenario: "Pensás en alguien de tu entorno que llegó lejos en la vida."
- A: "Llegó porque se lo propuso y trabajó para eso. El esfuerzo es lo que hace la diferencia."
- B: "Llegó, sí, pero tuvo condiciones que otros no tienen. El esfuerzo solo alcanza cuando el punto de partida lo permite."
- Estado: APROBADO

**ECO_01 | modelo_economico**
- Scenario: "Un gobierno tiene que decidir cómo distribuir un subsidio."
- A: "El mismo monto para todos. La igualdad empieza por tratar a todos de la misma manera."
- B: "Más para quien menos tiene. El objetivo es reducir las diferencias, no ignorarlas."
- Estado: APROBADO

**ECO_02 | modelo_economico**
- Scenario: "Un gobierno tiene que elegir el rumbo económico para los próximos cuatro años."
- A: "Que genere más riqueza. Si la torta crece, llega a todos."
- B: "Que priorice la distribución. Una sociedad más igualitaria es la base de cualquier desarrollo sostenible."
- Estado: APROBADO

### SOCIAL

**TRA_02 | tradicion**
- Scenario: "Se propone cambiar algo que funciona de la misma manera desde hace muchos años."
- A: "Prefiero ir de a poco. Lo que viene funcionando mucho tiempo tiene una razón de ser."
- B: "Si hay motivos para cambiarlo, hay que hacerlo. El tiempo que lleva no lo hace mejor."
- Estado: APROBADO

**AUT_01 | autoridad**
- Scenario: "Estás criando —o pensando en criar— a un chico."
- A: "Le enseño a respetar a los mayores y a la autoridad. Eso es la base."
- B: "Le enseño a pensar por sí mismo y a cuestionar cuando algo no le parece bien."
- Estado: APROBADO — ítem de referencia

**LOC_02 | localismo**
- Scenario: "Argentina aparece en los medios internacionales con una nota muy crítica."
- A: "Me concentro en lo que pasa acá. Lo cotidiano es lo que define cómo vivimos."
- B: "La imagen de Argentina afuera tiene consecuencias concretas en nuestra vida diaria."
- Estado: APROBADO

**DER_02 | derechos_autonomia**
- Scenario: "Un vecino hace algo legal en su casa que a mucha gente del barrio le molesta."
- A: "Cada persona tiene derecho a hacer lo que quiera en su vida privada."
- B: "Convivir implica que ciertas decisiones personales tienen consecuencias para los demás."
- Estado: APROBADO — ítem de referencia, 0 fallas

**LAI_02 | laicismo**
- Scenario: "Una escuela pública organiza un acto y el director propone incluir una oración."
- A: "En un espacio para todos, los actos tienen que ser para todos. Una oración excluye a quien no comparte esa fe."
- B: "Una oración expresa valores que son profundos para mucha gente. Eso merece tener lugar en un espacio compartido."
- Estado: APROBADO

**MIG_02 | migracion**
- Scenario: "Una comunidad de inmigrantes en tu barrio mantiene sus costumbres, idioma y tradiciones."
- A: "Me parece bien. Cada uno tiene derecho a mantener su cultura."
- B: "Si eligen vivir acá, deberían adaptarse a los valores y costumbres del lugar."
- Estado: APROBADO

### INST

**ANT_01 | antiestablishment**
- Scenario: "Una regla que te parece injusta sigue vigente."
- A: "La respeto igual. Las reglas, aunque imperfectas, son lo que hace funcionar al conjunto."
- B: "Las reglas ganan su legitimidad cuando son justas. Una ley injusta merece ser cuestionada."
- Estado: APROBADO

**ANT_02 | antiestablishment**
- Scenario: "Surge un político nuevo que parece genuinamente distinto a los demás."
- A: "Lo apoyo. Si nadie le da una chance a alguien diferente, nada va a cambiar."
- B: "Ya lo he visto. Con el tiempo, o el sistema los dobla, o descubrís que nunca fueron tan distintos."
- Estado: APROBADO
- Nota: reemplazó ítem sobre IA que medía ECON (regulación vs. mercado), no INST.

**ANT_03 | antiestablishment**
- Scenario: "Un gobierno no democrático logra resultados económicos muy buenos."
- A: "La democracia tiene un valor en sí misma. Poder votar y cambiar gobernantes es irrenunciable."
- B: "Lo que importa es que la gente viva bien. Los resultados son la única vara que vale."
- Estado: APROBADO

**ANT_04 | antiestablishment**
- Scenario: "Un problema del barrio lleva meses sin resolverse."
- A: "Persisto por los canales formales — nota al municipio, reunión con el concejal, reclamo oficial."
- B: "Movilizo públicamente — redes, medios, presión directa. Eso es lo que genera cambios reales."
- Estado: APROBADO — ítem de referencia, 0 fallas

**CON_01 | confianza_institucional**
- Scenario: "Una decisión que te perjudica se aprueba siguiendo todos los procedimientos."
- A: "Si los procedimientos se respetaron, es legítima. Aunque no me guste."
- B: "Que hayan seguido los pasos no la hace justa. Las reglas las escriben los que ganan."
- Estado: APROBADO
- Nota: tensión = legitimidad procedimental vs. captura del proceso por el poder.

**CON_02 | confianza_institucional**
- Scenario: "Un juez falla de manera sorpresiva en un caso de alto perfil."
- A: "Un fallo que nadie puede predecir de antemano es la mejor prueba de que el sistema funciona."
- B: "Los fallos sorpresivos casi siempre tienen una explicación que no figura en la sentencia."
- Estado: APROBADO

**CON_03 | confianza_institucional**
- Scenario: "Un medio de comunicación publica una investigación que compromete a un político importante."
- A: "Eso es el periodismo haciendo su trabajo. Sin prensa libre, esta información nunca habría salido a la luz."
- B: "La información puede ser real. Lo que nunca es neutral es quién la publica y por qué ahora."
- Estado: APROBADO

---

## 7. Estado final — CERRADO (28/07/2026)

**19 ítems · 11 dimensiones · todos aprobados · listo para deploy y piloto**

Fixes aplicados en sesión 28/07:

| Ítem | Problema original | Solución |
|---|---|---|
| ANT_02 | Medía ECON, no INST | Rediseño completo — nuevo político que parece distinto |
| MER_02 | B impersonal (R6), tensión confusa | Nuevo scenario — dos compañeros de escuela |
| MER_03 | Scenario abstracto (R4) | Nuevo scenario — alguien que llegó lejos |
| ECO_01 | Scenario abstracto (R4), "El Estado" revela constructo (R9) | Nuevo scenario — subsidio y criterio de distribución |
| TRA_02 | Scenario abstracto (R4), asimetría gramatical (R6) | Nuevo scenario — algo que funciona igual hace años |
| CON_01 | Scenario abstracto (R4) | Nuevo scenario — decisión aprobada por procedimientos |
| CON_02 | Scenario abstracto (R4), keywords reveladoras (R9) | Nuevo scenario — juez falla de forma sorpresiva |
| CON_03 | Statement de actitud, no scenario (R4) | Nuevo scenario — medio publica investigación |
| LAI_02 | "laicos" revela constructo (R9), scenario sesgado (R5) | Nuevo scenario — oración en acto escolar |

---

## 8. Ítems de referencia (modelo a seguir)

Estos ítems pasaron todos los criterios con 0 fallas. Usarlos como guía de estilo:

**DER_02 — MODELO:**
- Scenario: "Un vecino hace algo legal en su casa que a mucha gente del barrio le molesta."
- A: "Cada persona tiene derecho a hacer lo que quiera en su vida privada."
- B: "Convivir implica que ciertas decisiones personales tienen consecuencias para los demás."

**ANT_04 — MODELO:**
- Scenario: "Un problema del barrio lleva meses sin resolverse."
- A: "Persisto por los canales formales — nota al municipio, reunión con el concejal, reclamo oficial."
- B: "Movilizo públicamente — redes, medios, presión directa. Eso es lo que genera cambios reales."

**AUT_01 — MODELO:**
- Scenario: "Estás criando —o pensando en criar— a un chico."
- A: "Le enseño a respetar a los mayores y a la autoridad. Eso es la base."
- B: "Le enseño a pensar por sí mismo y a cuestionar cuando algo no le parece bien."

---

## 8. Protocolo de generación de ítems (validado 28/07/2026)

Antes de escribir cualquier ítem nuevo, seguir estos 4 pasos:

1. **Mapear las posiciones opuestas** — describir en prosa qué cree genuinamente cada polo
2. **Identificar las afirmaciones de orgullo** — ¿qué diría cada persona de sí misma con convicción?
3. **Encontrar la situación** — scenario concreto donde ambas posturas emergen naturalmente, sin víctimas ni victimarios
4. **Escribir desde el orgullo** — las opciones son la versión condensada de las afirmaciones del paso 2

Síntoma de que el protocolo no se aplicó: opciones que suenan a observaciones o diagnósticos en vez de convicciones. El respondente no se identifica con una observación — se identifica con una convicción.

---

## 9. Tarea solicitada — COMPLETADA (28/07/2026)

Rediseñar los 9 ítems con problemas respetando las 10 reglas y el estilo de los ítems de referencia.

Para cada ítem a rediseñar, producir:

```
ÍTEM [ID] — [DIMENSION]
Scenario: "..."
A: "..."
B: "..."

Verificación R1 (autopercepción positiva):
- A: [¿la firmaría con orgullo quien genuinamente la sostiene? sí/no + justificación]
- B: [ídem]

Verificación R2 (independencia):
- A sola: [¿tiene sentido sin leer B?]
- B sola: [¿tiene sentido sin leer A?]

Verificación R4 (concreteness):
- [¿es una situación vivible o una pregunta abstracta?]

Verificación R8 (validez dimensional):
- [¿la elección entre A y B refleja la tensión central de la dimensión declarada?]
```

**Orden de trabajo:**
1. ANT_02 (prioridad 1 — error de constructo)
2. MER_03
3. ECO_01
4. TRA_02
5. CON_01
6. CON_02
7. CON_03
8. MER_02
9. LAI_02
