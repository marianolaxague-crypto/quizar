# Revalidación J1 — Proceso, hallazgos y estado de situación

**Fecha:** 03/07/2026  
**Versión del instrumento evaluada:** v4.0 (25 ítems, 10 dimensiones, escala 4-point EFG)  
**Archivo base:** `backend/data/j1/brujula.json`

---

## 1. El proceso: cómo se construyó el corpus teórico

### 1.1 Motivación

El banco de preguntas de J1 fue construido bottom-up: desde intuición editorial, validación iterativa y criterios de diseño internos (checklist de 16 reglas en lessons.md). El proceso produjo 25 ítems funcionales, pero sin ancla teórica externa que garantizara:
- Que cada dimensión mide lo que dice medir (validez de constructo)
- Que los ejes son empíricamente ortogonales en población argentina
- Que no hay dimensiones subrepresentadas o sesgadas hacia un polo ideológico

La revalidación buscó resolver eso con evidencia del campo de la psicología política.

### 1.2 Etapas del corpus

**Etapa 1 — Deep research vía Gemini**  
Prompt estructurado en tres bloques: (1) estructura dimensional de la ideología, (2) teoría política argentina, (3) psicometría de actitudes. Output: 24 referencias con ficha de acceso, prioridad y aporte concreto al instrumento. Se identificaron tres brechas del instrumento actual:
- Brecha 1: privatismo informal/cuentapropismo
- Brecha 2: anti-establishment estructural vs. coyuntural
- Brecha 3: deseabilidad bipolar en contexto argentino polarizado

**Etapa 2 — Descarga y verificación de corpus**  
21 de 24 referencias conseguidas en abierto (Sci-Hub, CONICET Digital, Redalyc, Scielo, URLs directas). Pendientes: Semán 2023, Zaller 1992, Nolan 1971. Además: 2 libros en EPUB (Natanson 2012, Stefanoni 2021), manuscrito de Inglehart & Welzel (2005), ANES 2020/2024, corpus empírico Creencias Sociales 2025 (8 PDFs). Total en carpeta: ~40 archivos.

**Etapa 3 — Lectura exhaustiva y fichado**  
Tres batches de fichas generadas por otra IA con el mismo formato de 6 secciones:
- Batch 01 (FICHAS_COMPLETAS_01): 21 fichas — documentos teóricos y Creencias Sociales
- Batch 02 (FICHAS_COMPLETAS_02): 4 fichas — Bobbio, Morresi, Kinder & Sears, ANES codebooks
- Batch 03 (FICHAS_COMPLETAS_03): 17 fichas — corpus CONICET de Brussino y colaboradores

**Etapa 4 — Lectura directa del paper fundacional**  
Brussino et al. (2011), "Dimensión Operativa de la Ideología Política en ciudadanos de Córdoba/Argentina", Psicología Política Nº 43, pp. 85-106. Leído íntegramente. Se extrajeron los 22 ítems completos de la Escala de Ideología Política (EIP) y su estructura factorial.

---

## 2. El instrumento de referencia más importante: Brussino (2011)

La EIP es el único instrumento de ideología política validado psicométricamente para Argentina con muestra cuotificada por edad, sexo y NSE.

### 2.1 Estructura de la EIP

| Dimensión | Ítems | Alpha |
|---|---|---|
| Conservadurismo sexual religioso | 7 | .77 |
| Progresismo multiculturalista | 7 | .71 |
| Conservadurismo represivo nacionalista | 5 | .70 |
| Progresismo garantista | 3 | .66 |

Escala: Likert 5-point (1=nada de acuerdo, 5=totalmente de acuerdo)  
Eje subyacente: intervención vs. no intervención del Estado por tema concreto

### 2.2 Los 22 ítems completos

**Conservadurismo sexual religioso:**
1. El aborto es un crimen y debe ser perseguido y penado por la justicia en todas las circunstancias.
2. Los políticos deberían escuchar más los reclamos y propuestas de la Iglesia Católica sobre los problemas que atraviesa la sociedad.
3. Está bien que el Estado sostenga económicamente a la Iglesia Católica.
4. El Estado debería prohibir la exhibición pública de obras de arte que sean ofensivas a la moral o religión de determinados grupos de personas.
5. Sólo los padres tienen derecho a enseñar a sus hijos temas relacionados con la sexualidad; el colegio no debería intervenir en estas cuestiones.
6. La educación sexual en jóvenes es peligrosa porque los motiva a una iniciación sexual temprana.
7. La ley no debería permitir a personas homosexuales dar clases en las escuelas.

**Progresismo multiculturalista:**
8. En todas las escuelas se debería enseñar un idioma de nuestros pueblos indígenas para aprender a apreciar su herencia cultural.
9. El Estado debería hacer lo posible por evitar la concentración de medios de comunicación en pocas manos, y asegurar así la pluralidad de expresión.
10. El Estado debería garantizar que todos los ciudadanos accedan por igual al teatro, cine y demás producciones culturales locales.
11. El Estado debería otorgarle tierras a las comunidades indígenas que habitan en el país para que puedan autogobernarse.
12. La propiedad de la tierra debe ser de quien la trabaje.
13. El Estado debería poner límites a la producción de soja en el territorio nacional a los fines de frenar el monocultivo y los efectos de desertización de los suelos.
14. El Estado debería promover campañas de concientización sobre el consumo responsable de sustancias como la marihuana.

**Conservadurismo represivo nacionalista:**
15. La pena de muerte es una medida que ayuda a bajar la delincuencia.
16. A veces un gobierno militar puede ser preferible a uno democrático.
17. Se debería detener por "apología del delito" a aquellos jóvenes que utilicen ropas estampadas con referencias favorables al consumo de drogas.
18. El Estado debería asegurar más policías en la calle para el control del crimen y la delincuencia, aún si para ello fuera necesario recortar el presupuesto de otras áreas importantes como trabajo, salud y educación.
19. Es un problema que en nuestro país se respeten cada vez menos los símbolos patrios (bandera, himno, escarapela).

**Progresismo garantista:**
20. Está bien que desocupados y vecinos realicen piquetes y cortes de calles o rutas, ya que es la única manera que tienen para presionar y lograr que sus reclamos sean atendidos por los gobiernos.
21. Si una persona mata a un delincuente debería ser juzgado con el mismo trato y consideración que quien comete asesinato.
22. Los servicios públicos esenciales (agua, luz, gas) deberían ser propiedad del Estado.

### 2.3 Qué le falta a la EIP vs. J1

La EIP no tiene:
- Eje institucional propiamente dicho (anti-establishment, confianza, eficacia política)
- Meritocracia como dimensión económica diferenciada
- Localismo / cosmopolitismo
- Fuentes de información como constructo ideológico

Eso es el diferencial de J1. La EIP confirma que lo que J1 llama "sociocultural" tiene respaldo empírico argentino, pero no garantiza lo mismo para el eje institucional.

---

## 3. Evaluación ítem por ítem: situación actual vs. corpus

### Eje económico

#### `individualismo` (i1_1, i1_2, i1_3)

| Ítem | Evaluación | Riesgo | Fuente |
|---|---|---|---|
| i1_1: Prefiero ocuparme de mi propia salud / sistema de salud para todos | Aceptable. Mide privatismo en servicios básicos. | Puede capturar preferencia por salud pública concreta, no valor privatista. | Creencias Sociales CS2025 |
| i1_2: Lo que tengo lo construí yo / muchos me lo posibilitaron | Bueno. Mide locus of control económico. | i1_2 es ítem fuerte pero con riesgo de deseabilidad: "construí yo" puede sonar egoísta. | Feldman 1988 |
| i1_3: La sociedad avanza cuando cada uno se hace cargo / es más que la suma | Bueno. Captura filosofía social de fondo. | Abstracto pero bien formulado. | Feldman 1988, Natanson 2012 |

**Diagnóstico:** Sólidos como ítems de filosofía individual. **Brecha**: no capturan privatismo informal — el cuentapropista que quiere "que lo dejen trabajar sin permisos" no se ve reflejado.

#### `meritocracia` (i2_1, i2_2, i2_3)

| Ítem | Evaluación | Riesgo | Fuente |
|---|---|---|---|
| i2_1: Mi futuro depende de mis decisiones / de cosas que no controlo | Bueno. Mide creencia en agencia personal. | Puede activar resentimiento moral (Kinder & Sears). | Feldman 1988 |
| i2_2: Progreso por lo que sé y hago / también importa a quién conocés | Bueno. Trade-off entre mérito técnico y capital relacional. | Fuerte, puede capturar percepción de sistema injusto más que meritocracia. | Feldman 1988 |
| i2_3: Apuesto a especializarme a largo plazo / diversificarme y adaptarme al momento | **Débil**. Mide estrategia laboral contemporánea, no valor meritocrático. | Alto riesgo: puede capturar preferencia por trabajo estable vs. flexible. | Feldman 1988, Brussino 2021 |

**Diagnóstico:** i2_1 e i2_2 sólidos. i2_3 **candidato a reemplazar**.

---

### Eje sociocultural

#### `tradicion` (i3_1, i3_2)

| Ítem | Evaluación | Riesgo | Fuente |
|---|---|---|---|
| i3_1: Entornos estables / entornos que cambian | Bueno. Mide preferencia por orden vs. cambio. | Puede capturar temperamento antes que ideología. | Jost 2003 |
| i3_2: Cambios graduales / a veces cambiar todo de raíz | Bueno. Mide método del cambio, no su contenido. | Bien formulado. Distingue reformismo de radicalismo. | Bobbio, Jost |

**Diagnóstico:** Sólidos. Solo 2 ítems — fragilidad psicométrica (Acuña 2022, Brown & Maydeu). Candidato a agregar un tercero post-piloto.

#### `autoridad` (i4_1, i4_2)

| Ítem | Evaluación | Riesgo | Fuente |
|---|---|---|---|
| i4_1: Roles y estructuras claras / organizo mi trabajo libremente | Débil para eje ideológico. Mide preferencia de organización laboral. | Baja carga ideológica. Puede medir cultura organizacional más que autoritarismo. | Imhoff 2013 (RWA) |
| i4_2: Los chicos deben respetar a los mayores / pensar por sí mismos | Aceptable como convencionalismo moral. | Tiene deseabilidad: ambos polos suenan razonables. Riesgo de concentración en "pensar por sí mismos". | Imhoff 2013, Jost 2003 |

**Diagnóstico:** `autoridad` es la dimensión más subrepresentada conceptualmente. El corpus (Imhoff RWA, Etchezahar, Sorribas) distingue: convencionalismo (i4_2), estructura funcional (i4_1), agresión autoritaria (ausente), sumisión política (ausente). **Ambos ítems son demasiado suaves para capturar autoritarismo político.**

#### `localismo` (i5_1, i5_2)

| Ítem | Evaluación | Riesgo | Fuente |
|---|---|---|---|
| i5_1: Construir mi vida donde crecí / mudarme donde haya oportunidades | Aceptable. Mide arraigo vs. movilidad. | Puede capturar ciclo vital o región más que valor localista (Brussino 2016, Quinto informe CS). | CS2025 Quinto informe |
| i5_2: La imagen de Argentina afuera no me preocupa / me importa cómo nos ven en el mundo | Aceptable. Mide sensibilidad reputacional. | No equivale a cosmopolitismo sino a orgullo/vergüenza nacional. | CS2025 Quinto informe |

**Diagnóstico:** Razonables pero con riesgo de cruce con variables sociodemográficas. Solo 2 ítems.

#### `derechos_autonomia` (d7_1, d7_2)

| Ítem | Evaluación | Riesgo | Fuente |
|---|---|---|---|
| d7_1: Defino mi identidad libremente / me guío por lo que mi comunidad considera correcto | Bueno. Autonomía vs. marco comunitario. | Bien balanceado. | Brussino 2011 (Factor Progresismo multiculturalista) |
| d7_2: Lo que hago en mi vida privada no le incumbe a nadie / vivir en sociedad implica ajustarse a normas comunes | Bueno. Autonomía privada vs. normas compartidas. | Bien balanceado. | Brussino 2011 |

**Diagnóstico:** Sólidos. Bien respaldados por literatura argentina y global.

#### `laicismo` (d8_1, d8_2)

| Ítem | Evaluación | Riesgo | Fuente |
|---|---|---|---|
| d8_1: Sin símbolos religiosos en espacios públicos / reflejan la cultura de la comunidad | Bueno. Laicismo vs. expresión cultural religiosa. | Bien formulado, no menciona Iglesia directamente. | Brussino 2011, Rabbia 2012 |
| d8_2: En temas de aborto/eutanasia la religión no debería pesar en la ley / los valores morales religiosos merecen lugar en el debate | Bueno pero con riesgo. Trade-off laicismo legal vs. moral religiosa. | Puede activar posición coyuntural sobre aborto (hiperpolitizado). | Rabbia 2012, Etchezahar 2015 |

**Diagnóstico:** Bien respaldados. d8_2 tiene riesgo de deseabilidad bipolar por mencionar aborto.

#### `migracion` (d9_1, d9_2)

| Ítem | Evaluación | Riesgo | Fuente |
|---|---|---|---|
| d9_1: Salud y educación para todos sin importar de dónde vienen / priorizar a quienes nacieron en el país | Bueno. Universalismo vs. preferencia nacional en servicios. | Bien formulado. | Brussino 2011 (conservadurismo represivo nacionalista, ítem 25 del banco original) |
| d9_2: Mantener sus costumbres / adaptarse a los valores del lugar | Bueno. Pluralismo cultural vs. asimilación. | Bien formulado. | Brussino 2011 |

**Diagnóstico:** Sólidos, respaldados por literatura empírica argentina.

---

### Eje institucional

#### `antiestablishment` (i6_1 a i6_5) — Dimensión más problemática

| Ítem | Evaluación | Riesgo | Fuente |
|---|---|---|---|
| i6_1: Las grandes empresas generan riqueza para todos / las corporaciones tienen demasiado poder | **Problema de ubicación.** En Brussino carga en Progresismo multiculturalista, no en institucional. Mide anti-corporativismo, no anti-establishment político. | Alto: sesga el eje hacia anti-establishment de izquierda. | Brussino 2011, Morresi, Stefanoni |
| i6_2: Si todos respetamos las reglas aunque sean imperfectas / seguir reglas injustas perpetúa un sistema que no nos representa | Bueno. El mejor ítem del eje institucional. Trade-off entre institucionalismo y desobediencia legítima. | Bien formulado. Puede unir a reformistas democráticos y anti-sistema bajo el mismo polo. | Alonso 2018, Levitsky |
| i6_3: Si hacés bien las cosas, el sistema te reconoce / las reglas terminan favoreciendo siempre a los mismos | **Carga cruzada.** Mezcla meritocracia del sistema con cinismo institucional. | Alto: puede estar en `meritocracia` o en `antiestablishment` según el perfil. | Kinder & Sears, Feldman 1988 |
| i6_4: El derecho a protestar termina donde empieza el de los demás a circular / cuando no te escuchan, cortar una calle puede ser necesario | **Mal ubicado.** En Brussino carga en Progresismo garantista (eje sociocultural), no en institucional. Mide legitimidad de táctica de protesta. | Alto: wording "cortar una calle" activa posición coyuntural sobre piquetes. | Brussino 2011, Sorribas 2017 |
| i6_5: Los partidos no son todos iguales: quién gobierna cambia cosas / los políticos terminan siendo todos lo mismo | Aceptable como cinismo político pero **coyuntural**. Mide desafección partidaria, no anti-establishment estructural. | Moderado: captura estado emocional, no predisposición estable. | Alonso 2020, Brussino & Alonso 2013 |

**Diagnóstico general:** 3 de 5 ítems de `antiestablishment` tienen problemas de ubicación, carga cruzada o miden constructos distintos. Esta es la dimensión que más requiere rediseño.

#### `fuentes_info` (d10_1, d10_2)

| Ítem | Evaluación | Riesgo | Fuente |
|---|---|---|---|
| d10_1: Valoro el rigor y la trayectoria de los medios / sigo comunicadores independientes que hablan de forma directa | Aceptable como proxy de institucionalismo mediático. | Puede capturar generación o estilo comunicacional (jóvenes prefieren directo independientemente de su ideología). | Brussino 2011 (consumo informativo), Informe Jóvenes 2025 |
| d10_2: Prefiero un medio que dice desde dónde habla / un buen medio informa los hechos sin tomar partido | **Problema de deseabilidad bipolar.** El polo "dice desde dónde habla" es valorado por progresistas críticos Y por anti-establishment de derecha (ambos valoran la honestidad sobre el partido). | Alto: ambos polos son razonables para posiciones ideológicamente opuestas. | Brussino 2011, CS Polarización 2025 |

**Diagnóstico:** Dimensión con baja validez de constructo confirmada. Requiere reformulación o redefinición de qué mide.

---

## 4. Hallazgos transversales del corpus

### 4.1 Confirmaciones

1. **La arquitectura de J1 está bien fundamentada.** Pares EFG + sin autoetiquetas + 3 ejes ortogonales + 4-point sin neutro: todo tiene respaldo teórico y empírico.

2. **Los ejes econ y social son ortogonales.** Feldman & Johnston (2014) confirma que sus determinantes cognitivos son distintos. Los ítems deben mantenerse separados.

3. **El perfil Centro requiere lectura matizada.** Brussino (2016) muestra que el centro no equivale a moderación: puede ser contradicción interna, baja información o rechazo de etiquetas. La decisión de bajar `CENTER_THRESHOLD` de 20 a 10 (ya implementada) va en la dirección correcta.

4. **La brecha 3 (deseabilidad bipolar) es real.** CS 2025 Polarización muestra satisfacción con la vida con diferencia de 0.76 puntos entre LLA y peronistas usando la misma escala. Los ítems que suenan neutrales pueden activar respuestas muy distintas según bando.

### 4.2 Brechas del instrumento actual

**Brecha 1 — Privatismo informal/cuentapropismo**  
El eje económico captura bien el privatismo de clase media formal (salud individual, mérito técnico) pero no al cuentapropista informal que quiere autonomía sin depender de ventanillas ni de corporaciones. Este perfil es central para entender el voto a Milei en sectores populares (Semán, Natanson, Morresi).

**Brecha 2 — Anti-establishment estructural vs. coyuntural**  
El eje institucional actual mezcla: (a) cinismo político coyuntural (`i6_5`), (b) legitimidad de la protesta (`i6_4`), (c) crítica estructural (`i6_2`), (d) anti-corporativismo de izquierda (`i6_1`). El corpus (Alonso 2018, 2020, Brussino & Alonso 2013) demuestra que son constructos distintos con correlatos empíricos diferentes.

**Brecha 3 — Autoritarismo político**  
`autoridad` mide preferencia por estructura, no autoritarismo. Falta un ítem que mida la disposición a aplicar el orden de forma dura cuando hay conflicto social.

**Brecha 4 — Eficacia política externa**  
Ningún ítem mide si el respondente cree que su participación puede cambiar algo. Este constructo (Brussino & Alonso 2013, Sorribas 2017, ANES) es clave para distinguir el anti-establishment activo del pasivo.

---

## 5. Resumen de diagnóstico por dimensión

| Dimensión | Estado | Problema principal | Acción sugerida |
|---|---|---|---|
| `individualismo` | Sólida | Brecha: privatismo informal | Agregar 1 ítem de cuentapropismo |
| `meritocracia` | Parcial | i2_3 mide estrategia laboral | Reemplazar i2_3 |
| `tradicion` | Sólida | Solo 2 ítems | Conservar, agregar post-piloto |
| `autoridad` | Débil | Demasiado suave, no captura autoritarismo político | Agregar ítem de orden/conflicto social |
| `localismo` | Aceptable | Riesgo de cruce con ciclo vital | Conservar, monitorear |
| `antiestablishment` | Crítica | 3/5 ítems mal ubicados o con carga cruzada | Rediseñar 3 ítems |
| `derechos_autonomia` | Sólida | Ninguno | Conservar |
| `laicismo` | Sólida | d8_2 menciona aborto (riesgo) | Conservar, monitorear deseabilidad |
| `migracion` | Sólida | Ninguno | Conservar |
| `fuentes_info` | Débil | d10_2 con deseabilidad bipolar, validez cuestionada | Reformular o separar de score principal |

---

## 6. Ítems candidatos a cambio

### A reemplazar
- **i2_3** (especialización vs. adaptación) → ítem de valor meritocrático nuclear
- **i6_1** (grandes empresas vs. corporaciones) → ítem de anti-establishment político sin sesgo de izquierda
- **i6_4** (protesta/circulación) → mover a sociocultural o reformular

### A reformular
- **d10_2** (medio que dice desde dónde habla) → separar confianza en mediadores de preferencia por neutralidad vs. posicionamiento explícito

### A agregar
- **Privatismo informal** (1 ítem) → eje económico
- **Eficacia política externa** (1 ítem) → eje institucional
- **Legitimidad democrática concreta** (1 ítem) → eje institucional
- **Punitivismo/orden en conflicto social** (1 ítem) → `autoridad`

### A conservar sin cambios
- i1_1, i1_2, i1_3, i2_1, i2_2, i3_1, i3_2, i4_2, i5_1, i5_2, i6_2, i6_5, d7_1, d7_2, d8_1, d8_2, d9_1, d9_2, d10_1

---

## 7. Fuentes consultadas

### Empíricas argentinas (peso máximo)
- Brussino, Rabbia, Imhoff & Paz García (2011). EIP original.
- Brussino, Imhoff, Rabbia & Paz García (2013). Issues y valores sociales.
- Brussino & Alonso 2013; Brussino et al. (2021) TRI.
- Imhoff & Brussino (2013). RWA en Córdoba.
- Alonso & Brussino (2018). Democratas insatisfechos.
- Alonso & Brussino (2020). Malestar y alienación política.
- Sorribas & Brussino (2017). Participación política.
- Creencias Sociales 2025 (5 informes UNSAM/IDAES).
- Informe Jóvenes 2025 (1ª y 2ª entrega).
- A 50 años del golpe (2025).

### Teóricas globales (marco)
- Feldman & Johnston (2014). Ortogonalidad de ejes.
- Jost et al. (2003). Conservadurismo como cognición motivada.
- Inglehart & Welzel (2005). Mapa de valores culturales.
- Converse (1964). Sistemas de creencia en masas.
- Feldman (1988). Valores nucleares y consistencia.
- Krosnick (2005). Diseño de escalas de actitud.
- Brown & Maydeu-Olivares (2011). IRT Thurstoniano.

### Políticas argentinas (contexto)
- Morresi (2015). Nueva derecha argentina.
- Stefanoni (2021). La rebeldía se volvió de derecha.
- Natanson (2012). La nueva izquierda.
- Levitsky & Murillo (2003). Instituciones débiles.
- Jorge (2016). Cultura política, caso argentino.
- Bobbio (1994). Derecha e izquierda.

### ANES (benchmark internacional)
- ANES 2020 y 2024 cuestionarios.
