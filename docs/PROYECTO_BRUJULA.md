# Brújula Política AR — Documento de Presentación del Proyecto

**Versión:** 1.0 — Junio 2026
**Estado:** Diseño de contenido completo · Implementación técnica pendiente

---

## 1. Concepto y visión

**Brújula Política AR** es una plataforma de quizzes políticos e ideológicos para Argentina. Su propósito es que cualquier argentino pueda descubrir dónde está parado ideológicamente, comparar su posición con la de otros, y ver qué figuras políticas o partidos se acercan o alejan de sus valores reales.

El diferencial frente a otros instrumentos similares (Political Compass, test de La Grieta, etc.) es metodológico:

1. **Preguntas sin carga política directa.** No se pregunta por Milei, el kirchnerismo ni ningún partido. Se indaga en actitudes cotidianas y valores personales, que luego se mapean hacia posiciones ideológicas.
2. **Elección Forzada Graduada (EFG).** En vez de "¿qué tan de acuerdo estás?", el respondente elige entre dos afirmaciones opuestas en una escala del 1 al 5. Esto reduce el sesgo de aquiescencia y la deseabilidad social.
3. **Posición aleatoria de los polos.** En cada pregunta, cuál de las dos frases aparece a la izquierda y cuál a la derecha es randomizado, eliminando el sesgo de posición.
4. **Reward de comparación real.** El resultado se muestra en contexto: cómo estás vos vs. cómo respondieron otros jugadores.

---

## 2. Los tres juegos

La plataforma tiene tres juegos con metodologías distintas y outputs complementarios. Un usuario puede jugar los tres y recibir información que no se solapa.

| Juego | Pregunta que responde | Metodología | Output |
|-------|----------------------|-------------|--------|
| **J1 — Brújula Ideológica** | ¿Cómo pensás? | Elección Forzada Graduada sobre actitudes cotidianas | Perfil ideológico en mapa 2D + indicador institucional |
| **J2 — Visión AR** | ¿Con qué visión de Argentina coincidís? | A definir (posicionamiento sobre temas argentinos) | Afinidad con tradiciones políticas argentinas |
| **J3 — MaxDiff de Candidatos** | ¿A quién preferís como figura política? | MaxDiff best-worst (best-worst scaling) | Ranking de preferencia de 20 figuras políticas |

**Elemento transversal:** al finalizar cualquiera de los tres juegos, se le pregunta al respondente: *"¿A quién votarías hoy si hubiera elecciones?"*. Esta ancla de intención de voto aparece DESPUÉS de ver el resultado para no contaminar las respuestas, y es opcional. Permite correlacionar perfiles ideológicos con intención de voto real.

---

## 3. J1 — Brújula Ideológica: diseño completo

### 3.1 ¿Qué mide?

La Brújula mide la posición ideológica de una persona a través de **6 dimensiones actitudinales** que se mapean en **3 ejes**:

#### Eje 1: Económico (Estatista ↔ Privatista)
Capturado por las dimensiones **Individualismo** y **Meritocracia**.

- **Individualismo** mide si la persona se orienta hacia la autonomía y la responsabilidad individual o hacia la interdependencia y la solidaridad con otros.
- **Meritocracia** mide si la persona cree que el progreso depende del esfuerzo propio o de las condiciones estructurales y el contexto de origen.

#### Eje 2: Sociocultural (Progresista ↔ Conservador)
Capturado por las dimensiones **Tradición**, **Autoridad** y **Localismo**.

- **Tradición** mide la preferencia por la estabilidad, los hábitos conocidos y el cambio gradual vs. la apertura a la novedad y el cambio radical.
- **Autoridad** mide si la persona prefiere estructuras jerárquicas y claras o estructuras horizontales y participativas.
- **Localismo** mide si la persona se identifica con lo cercano/local o con lo global/cosmopolita.

#### Eje 3: Institucional (Institucionalista ↔ Anti-establishment)
Capturado por la dimensión **Anti-establishment**.

- **Anti-establishment** mide la confianza en las instituciones, los expertos y los canales formales vs. la desconfianza en el sistema y la preferencia por la acción directa.
- Este eje es **ortogonal** al plano económico/sociocultural: un libertario y un kirchnerista pueden coincidir en el polo anti-establishment.

---

### 3.2 Perfiles de resultado

El cruce de los ejes Económico y Sociocultural produce 4 perfiles base:

| Perfil | Nombre | Descripción breve |
|--------|--------|-------------------|
| **EP** | Estatista Progresista | Intervención del Estado + ampliación de derechos. Cercano al kirchnerismo/izquierda. |
| **EC** | Estatista Conservador | Rol activo del Estado + valores tradicionales. Cercano al peronismo clásico. |
| **PC** | Privatista Conservador | Mercado privado + valores tradicionales. Cercano al PRO/centroderecha. |
| **PP** | Privatista Progresista | Libertad individual en lo económico Y en lo personal. Cercano al liberalismo social/libertarismo. |

El eje institucional se muestra como un indicador independiente: más o menos cercano al anti-establishment, sin importar el cuadrante.

---

### 3.3 Las 30 preguntas

Las preguntas usan el formato de Elección Forzada Graduada:

> *¿Con cuál de estas afirmaciones te sentís más identificado?*
>
> **[Afirmación A]**  ①  ②  ③  ④  ⑤  **[Afirmación B]**

Donde 1 = totalmente A, 3 = ninguna/ambas, 5 = totalmente B. La posición de A y B se randomiza en cada pregunta.

---

#### DIMENSIÓN 1: Individualismo vs. Comunidad
*(Eje económico — 5 preguntas)*

| ID | Polo Privatista (A) | Polo Estatista (B) |
|----|--------------------|--------------------|
| i1_1 | Prefiero hacerme cargo de mi propia salud y elegir los servicios que se ajustan a lo que yo necesito. | Prefiero aportar a un sistema compartido donde todos tenemos acceso a lo mismo, aunque no sea personalizado. |
| i1_2 | Lo que tengo lo conseguí fundamentalmente con mi propio esfuerzo y mis decisiones. | Gran parte de lo que tengo lo debo al apoyo de otros, la familia y las oportunidades que me dieron. |
| i1_3 | Cuando tengo tiempo o energía para dar, primero me ocupo de los que están cerca mío. | Cuando tengo tiempo o energía para dar, no me importa tanto si conozco a la persona o no. |
| i1_4 | Prefiero resolver mis problemas por mis propios medios antes que depender de otros. | Prefiero pedir ayuda cuando la necesito; apoyarme en otros me parece lo más natural. |
| i1_5 | Cuando compro algo, elijo lo que me da mejor precio y calidad, aunque sea importado. | Cuando compro algo, prefiero que sea de un comercio o productor de acá, aunque no sea la opción más barata. |

---

#### DIMENSIÓN 2: Meritocracia vs. Estructuralismo
*(Eje económico — 5 preguntas)*

| ID | Polo Meritocrático (A) | Polo Estructural (B) |
|----|----------------------|----------------------|
| i2_1 | Creo que mis posibilidades de progresar dependen principalmente de las decisiones que tomo y el esfuerzo que pongo. | Creo que mis posibilidades de progresar dependen mucho de cosas que no dependen de mí. |
| i2_2 | Prefiero progresar apoyándome en mis capacidades técnicas y mi propio desempeño. | Prefiero progresar construyendo relaciones con personas que puedan recomendarme o abrirme puertas. |
| i2_3 | Siento que mi empuje personal es lo que define mi rumbo, sin importar los recursos que tuvo mi familia. | Siento que el esfuerzo y el sostén de mi familia fueron la base que hizo posibles mis logros. |
| i2_4 | Apuesto a formarme y especializarme en lo mío pensando en el largo plazo. | Apuesto a diversificar lo que hago día a día, adaptándome rápido a las oportunidades del momento. |
| i2_5 | Prefiero que lo que gano dependa directamente de lo que produzco y el valor que genero. | Prefiero tener un ingreso base fijo que me dé seguridad, aunque no dependa de lo que produzco cada día. |

---

#### DIMENSIÓN 3: Tradición/Orden vs. Apertura/Cambio
*(Eje sociocultural — 5 preguntas)*

| ID | Polo Conservador (A) | Polo Progresista (B) |
|----|--------------------|----------------------|
| i3_1 | Suelo organizar mis planes del día con anticipación para saber qué esperar de mi jornada. | Suelo dejar mis planes del día abiertos a lo que vaya surgiendo para adaptarme en el momento. |
| i3_2 | Cuando tengo que hacer algo que no sé hacer bien, busco cómo se hace correctamente antes de intentarlo. | Cuando tengo que hacer algo que no sé hacer bien, prefiero lanzarme a probarlo y ajustarlo sobre la marcha. |
| i3_3 | Cuando algo se hace distinto de como siempre se hizo en mi familia o entorno, me genera cierta incomodidad. | Cuando algo se hace distinto de como siempre se hizo en mi familia o entorno, lo vivo con naturalidad; es parte de que las cosas evolucionen. |
| i3_4 | Creo que es mejor cambiar las cosas de a poco, sin tirar todo lo que funciona por la borda. | Creo que hay momentos en que hay que cambiar todo de raíz, aunque sea disruptivo. |
| i3_5 | Cuando salgo, suelo volver a los mismos lugares de siempre; me gusta saber lo que me espera. | Cuando salgo, suelo buscar lugares nuevos; me aburre repetir siempre los mismos sitios. |

---

#### DIMENSIÓN 4: Autoridad vs. Horizontalidad
*(Eje sociocultural — 5 preguntas)*

| ID | Polo Autoridad (A) | Polo Horizontal (B) |
|----|------------------|--------------------|
| i4_1 | Rindo mejor en mi trabajo cuando sé bien qué tengo que hacer y quién es responsable de qué. | Rindo mejor en mi trabajo cuando tengo margen para definir mis tareas junto con mis compañeros según las necesidades del momento. |
| i4_2 | Cuando hay que decidir el rumbo de algo en grupo, prefiero que alguien a cargo tome la decisión para no perder tiempo. | Cuando hay que decidir el rumbo de algo en grupo, prefiero que debatamos entre todos hasta llegar a un acuerdo, aunque tarde más. |
| i4_3 | En la crianza, lo más importante para mí es que los chicos aprendan a respetar a los mayores y las costumbres de la familia. | En la crianza, lo más importante para mí es que los chicos desarrollen su curiosidad y encuentren su propio camino. |
| i4_4 | Cuando tengo una duda técnica importante, confío en los profesionales del tema o en lo que dicen las instituciones. | Cuando tengo una duda técnica importante, confío más en lo que me cuentan personas que ya pasaron por lo mismo. |
| i4_5 | Me siento más tranquilo cuando sigo las reglas al pie de la letra; así sé cómo funcionan las cosas. | Me siento más tranquilo cuando puedo adaptar las reglas a lo que va surgiendo en la realidad. |

---

#### DIMENSIÓN 5: Localismo vs. Cosmopolitismo
*(Eje sociocultural — 5 preguntas)*

| ID | Polo Localista (A) | Polo Cosmopolita (B) |
|----|-------------------|---------------------|
| i5_1 | Prefiero construir mi vida donde crecí, cerca de los míos y de lo que conozco. | Prefiero proyectar mi futuro con la posibilidad de irme a donde haya mejores oportunidades, aunque implique empezar de cero. |
| i5_2 | Me siento más cómodo con personas que hablan como yo y con las que nos entendemos sin tener que aclarar todo. | Disfruto relacionarme con personas de mundos muy distintos al mío, aunque tengamos que esforzarnos para entendernos. |
| i5_3 | Cuando elijo una película para ver, me inclino más por las historias que retratan personajes y situaciones de acá. | Cuando elijo una película para ver, me inclino más por las producciones internacionales que me llevan a mundos que no conozco. |
| i5_4 | La opinión que tienen en el exterior sobre Argentina me importa poco; lo que somos habla por sí solo. | Me importa cómo nos ven afuera; eso tiene consecuencias reales para todos. |
| i5_5 | Cuando elijo dónde comprar, prefiero el comercio de barrio aunque no tenga todo lo que busco. | Cuando elijo dónde comprar, voy a donde encuentro la mejor oferta, aunque sea un supermercado grande o una plataforma online. |

---

#### DIMENSIÓN 6: Anti-establishment vs. Institucionalismo
*(Eje institucional — ortogonal — 5 preguntas)*

| ID | Polo Institucionalista (A) | Polo Anti-establishment (B) |
|----|--------------------------|----------------------------|
| i6_1 | Cuando debo tomar una decisión importante sobre mi salud o mis finanzas, prefiero guiarme por las recomendaciones de profesionales con credenciales reconocidas. | Cuando debo tomar una decisión importante sobre mi salud o mis finanzas, prefiero confiar en mi propia intuición y en la experiencia de personas comunes que pasaron por lo mismo. |
| i6_2 | Cuando tengo que resolver algo con una institución, suelo seguir los pasos aunque sea lento y burocrático. | Cuando tengo que resolver algo que depende de una institución, suelo buscar a alguien que conozca el sistema y pueda ayudarme a resolverlo más rápido. |
| i6_3 | Cuando hay un problema en mi barrio o edificio, prefiero canalizarlo a través de los representantes o autoridades que correspondan. | Cuando hay un problema en mi barrio o edificio, prefiero juntar a los vecinos y resolverlo entre todos sin esperar que alguien se haga cargo. |
| i6_4 | Estoy seguro de que si me esfuerzo y cumplo bien con mi trabajo o estudio, tarde o temprano se va a notar. | Tengo claro que para progresar en mi trabajo o estudio no basta el esfuerzo individual; las oportunidades reales dependen de a quién conocés. |
| i6_5 | En los grupos en los que participo, prefiero que todos cedamos un poco para llegar a un acuerdo y que todo fluya. | En las actividades grupales en las que participo, priorizo defender mis convicciones con firmeza, aunque eso genere tensiones o desacuerdos. |

---

### 3.4 Modelo de scoring

Cada pregunta tiene pesos en los 3 ejes: `econ`, `social`, `inst`.

La respuesta del usuario (1 a 5) se convierte en un valor centrado: 1 → −2, 2 → −1, 3 → 0, 4 → +1, 5 → +2.

Si la afirmación A estaba a la derecha en pantalla (randomización), el valor se invierte antes de calcular.

La puntuación final por eje se normaliza a **[-100, +100]**, donde:
- `econ`: −100 = Estatista puro, +100 = Privatista puro
- `social`: −100 = Progresista puro, +100 = Conservador puro
- `inst`: −100 = Institucionalista puro, +100 = Anti-establishment puro

---

### 3.5 Output para el respondente

Al terminar el quiz, el respondente ve:

**1. Mapa de posición (compass 2D)**
Un plano cartesiano con el eje económico (horizontal) y el eje sociocultural (vertical). Un punto indica su posición exacta. Los otros puntos del mapa son los resultados de todos los jugadores anteriores.

**2. Perfil nombrado**
Por ejemplo: *"Estatista Progresista"* — con una descripción en lenguaje accesible de qué implica ese perfil y con qué tradición política argentina tiene más afinidad.

**3. Posición relativa**
- "Sos más privatista que el 67% de los jugadores."
- "Sos más conservador que el 44% de los jugadores."
- "Tu nivel de desconfianza institucional es mayor que el 71% de los jugadores."

**4. Ancla de intención de voto (opcional)**
> *"¿A quién votarías hoy si hubiera elecciones?"*
> → Opciones: listado de partidos.
>
> Si responde: *"El 58% de las personas con tu perfil votaría a [partido]."*

**5. Comparación con otros perfiles**
Distribución de los 4 perfiles en la población de jugadores, con el del usuario destacado.

---

### 3.6 Output para el analista de datos

El dataset acumulado permite análisis de alta calidad:

**Descripción del espacio ideológico argentino**
- Distribución de los 4 perfiles base en la población de jugadores.
- Posición media en cada eje por región, edad, género (si se recopilan datos demográficos).
- Identificación de clusters naturales más allá de los 4 cuadrantes.

**Correlaciones eje × eje**
- ¿Cuánto correlacionan el eje económico y el sociocultural? (En Argentina, históricamente no tanto como en Europa.)
- ¿Es el eje anti-establishment realmente ortogonal, o hay una correlación con alguno de los otros ejes?

**Mapeo perfil ideológico × intención de voto**
- ¿Qué porcentaje de los Privatistas Progresistas vota LLA? ¿Cuántos votan PRO?
- ¿Hay Estatistas Conservadores que votan LLA? (fenómeno observado en 2023)
- ¿El eje anti-establishment predice intención de voto mejor que el eje económico?

**Análisis dimensional**
- ¿Qué dimensión (de las 6) tiene más varianza en la población? (→ más capacidad discriminante)
- ¿Cuáles tienen menor varianza? (→ posible consenso social o pregunta mal calibrada)
- ¿Hay preguntas con respuestas muy sesgadas hacia un polo? (posible sesgo de deseabilidad residual)

**Perfiles cruzados**
- Personas que responden "A" en meritocracia pero "B" en antiestablishment: ¿existen? ¿cuántos?
- Localistas en lo cultural pero cosmopolitas en lo laboral: ¿cuántos?
- Estas combinaciones revelan la complejidad del espacio ideológico que los instrumentos unidimensionales no capturan.

**Series temporales** (si se reitera el estudio)
- Tracking del desplazamiento del eje económico en la población argentina a lo largo del tiempo.
- Impacto de eventos políticos en la distribución de perfiles.

---

## 4. J3 — MaxDiff de Candidatos

### 4.1 Mecánica

El respondente ve sets de 4 figuras políticas y debe elegir en cada set:
- ¿A quién **más** preferís?
- ¿A quién **menos** preferís?

Se repite en 20 rondas. El banco tiene 20 candidatos. Cada candidato aparece ~4 veces.

**Banco de candidatos:**
Milei, Bullrich, Macri, Larreta, Vidal, Morales, Lousteau, Frigerio, Massa, Scioli, CFK, Kicillof, Grabois, Bregman, Del Caño, Villarruel, Adorni, Caputo, Pichetto, Schiaretti.

### 4.2 Scoring (Thurstone Case V)

Score por candidato = (veces elegido como mejor − veces elegido como peor) / apariciones totales → normalizado a [-100, +100].

### 4.3 Output para el respondente

- Ranking personal de los 20 candidatos (scores individuales).
- "El X% de los jugadores también puso a [candidato] en su top 3."
- Ranking agregado de todos los jugadores para comparar.

### 4.4 Output para el analista

- Preferencia media por candidato en la población.
- Comparación de rankings entre distintos perfiles del J1 (¿los Privatistas Progresistas rankean distinto a los Estatistas Conservadores?).
- Correlación entre preferencia de candidato e intención de voto declarada.
- Mapeo de candidatos en el espacio bidimensional del J1: ¿dónde "viven" cada candidato según los votantes?

---

## 5. J2 — Visión AR (pendiente de diseño)

Este juego está pendiente de una sesión de diseño dedicada. La premisa es:

- Preguntas sobre visiones concretas de Argentina (mezcla de temas políticos y no políticos).
- Output: afinidad con tradiciones políticas argentinas (kirchnerismo, radicalismo, liberalismo, peronismo clásico, izquierda).
- A diferencia del J1 (atemporal y universal), el J2 está anclado en Argentina.

---

## 6. Principios de diseño metodológico

El banco de preguntas del J1 fue diseñado con las siguientes reglas canónicas:

1. **Autopercepción positiva en ambos polos.** Nadie se identifica con "soy egoísta" o "soy autoritario". Cada afirmación expresa el valor positivo que el que la sostiene ve en su postura.

2. **Primera persona.** Las frases hablan de uno mismo, no diagnostican la sociedad ni hablan de terceros.

3. **Sin palabras cargadas.** Prohibidas: solidaridad, igualdad, justicia, privilegio, bien común, mérito, casta, Estado, mercado, tradición, progreso, democracia.

4. **Encuadre cotidiano.** Situaciones de la vida diaria, no debates abstractos.

5. **Trade-off genuino.** Ambas opciones deben ser igualmente defendibles como posición adulta razonable.

6. **Sin revelar el eje.** La pregunta no debe permitir que el respondente adivine qué dimensión ideológica está midiendo.

7. **Sin solapamiento.** Cada pregunta captura un ángulo distinto de su dimensión. Las 5 preguntas de una dimensión pueden generar respuestas cruzadas en alguien con visión matizada.

---

## 7. Arquitectura técnica

- **Backend:** Python / FastAPI + SQLite (sin dependencias pesadas, fácil de hostear)
- **Frontend:** HTML / CSS / JS vanilla (sin frameworks, sin build step)
- **Hosting:** Railway (backend) + dominio propio (cuando se publique)

El backend expone una API REST:
- `GET /api/quizzes/{tipo}/questions` — devuelve las preguntas
- `POST /api/sessions` — crea sesión anónima
- `POST /api/quiz/{tipo}/submit` — recibe respuestas y devuelve resultado + comparación
- `GET /api/stats/{tipo}` — estadísticas agregadas

La base de datos guarda sesiones anónimas (UUID), respuestas, resultados computados e intención de voto declarada.

---

## 8. Potencial de investigación

Esta plataforma, con suficiente masa crítica de respondentes, puede:

- Ofrecer la primera **brújula ideológica multidimensional calibrada para Argentina**, con datos reales en lugar de posiciones auto-reportadas.
- Validar empíricamente qué tan ortogonales son los ejes en la sociedad argentina (¿el eje económico y el sociocultural correlacionan más o menos que en 2023?).
- Servir como **panel de seguimiento** de desplazamientos ideológicos antes, durante y después de ciclos electorales.
- Contrastar con los datos de Pulsar UBA y otros estudios de creencias sociales para validar la calidad del instrumento.
- Ofrecer a partidos y analistas una herramienta de segmentación del electorado basada en actitudes reales, no en autoidentificación.

---

*Documento generado para evaluación y feedback externo del diseño.*
