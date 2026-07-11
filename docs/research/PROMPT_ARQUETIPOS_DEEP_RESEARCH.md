# Deep Research Prompt — Arquetipos Brújula Política AR

## Propósito

Estoy construyendo **Brújula Política AR**, un quiz de posicionamiento ideológico para Argentina. Los usuarios responden 25 preguntas actitudinales (sin mencionar partidos ni candidatos) y obtienen un perfil en un plano de 3 ejes:

- **Eje económico**: Estatista ↔ Privatista
- **Eje sociocultural**: Progresista ↔ Conservador
- **Eje institucional** (ortogonal): Institucionalista ↔ Anti-establishment

El resultado es uno de **10 arquetipos**. Cada arquetipo tiene nombre, descripción y tensión central ya definidos.

Necesito que para cada arquetipo generes **3 outputs** que se mostrarán en la pantalla de resultado del usuario.

---

## Criterios de calidad (críticos — no negociables)

### Para el TAGLINE
- Formato: "El que..." (tercera persona, como un espejo en el que el usuario se reconoce)
- Máximo 18 palabras
- **Debe generar orgullo e identificación**, no burla ni condescendencia
- Captura la tensión o paradoja central del arquetipo de forma que el usuario la reivindique como propia
- Puede tener ironía suave, pero siempre desde el respeto
- Evitar: clichés políticos, nombres de partidos, referencias coyunturales que envejezcan
- Test: ¿Un usuario con este perfil lo compartiría en redes con orgullo? Si sí, sirve.

### Para el SÍMBOLO CULTURAL
- 1 objeto, lugar, escena o práctica cultural concreta
- Reconocible en Argentina (o universal con carga simbólica clara)
- Que el propio usuario con ese perfil lo elegiría como representativo de sí mismo
- No debe ser una figura política real ni un símbolo partidario explícito
- Puede ser un objeto cotidiano, una práctica social, un espacio, un momento

### Para el PROMPT DE IMAGEN
- Objetivo: generar una ilustración editorial para la pantalla de resultado del quiz
- Estilo visual: **ilustración editorial minimalista**, líneas limpias, composición centrada
- Paleta: **tonos crema cálidos** (#F4F1EB base) con un color de acento que refleje la identidad del arquetipo
- Sin rostros reconocibles ni figuras políticas reales
- Capturar la atmósfera y valores del arquetipo a través de **objetos, escenas y símbolos**
- La imagen debe funcionar como una ilustración de portada de ensayo político, no como propaganda
- Idioma del prompt: inglés
- Formato: prompt estilo Midjourney / Stable Diffusion (descriptivo, con referencias de estilo artístico)
- Incluir al final: `--ar 1:1 --style editorial illustration`

---

## Los 10 arquetipos — contexto completo

---

### 1. Colectivista Transformador
**Cuadrante:** Estatista Progresista · Institucionalista
**Descripción:** Priorizás la equidad y los cambios estructurales, y confiás en que las instituciones pueden ser el canal para lograrlos. No te reconocés en el solucionismo individual: los problemas más importantes son colectivos y necesitan respuestas colectivas. Tu confianza en el sistema convive, a veces, con la frustración de sus tiempos y sus resistencias.
**Tensión central:** Querés transformar la sociedad y creés que el camino son las instituciones — aunque muchas veces decepcionen.

---

### 2. Colectivista Rebelde
**Cuadrante:** Estatista Progresista · Anti-establishment
**Descripción:** Valorás la acción colectiva y la construcción comunitaria, pero desconfiás profundamente de las instituciones actuales para materializarlas. Creés que los cambios reales vienen desde abajo, no desde arriba. Esa combinación —querer transformar la sociedad y no fiarte del sistema para hacerlo— define tu postura más que cualquier etiqueta.
**Tensión central:** Querés cambios colectivos profundos pero no confiás en las estructuras que teóricamente deberían hacerlos posibles.

---

### 3. Comunitarista Tradicional
**Cuadrante:** Estatista Conservador · Institucionalista
**Descripción:** Valorás el orden, las tradiciones y el rol del Estado como garante de la cohesión social. Creés que la estabilidad no es un freno al progreso sino su condición. Las instituciones te merecen respeto no por inercia, sino porque entendés que sin marcos colectivos estables el tejido social se deshace.
**Tensión central:** Querés un Estado que proteja y ordene, pero también sabés que ese mismo Estado puede volverse burocrático o clientelar.

---

### 4. Soberanista Nacionalista
**Cuadrante:** Estatista Conservador · Anti-establishment
**Descripción:** Tenés una fuerte identidad local y desconfiás de los modelos y las recetas que vienen de afuera. Querés un Estado que proteja a los suyos, pero no confiás en la clase política actual para manejarlo. Esa combinación —Estado protector + rechazo al establishment— es menos contradictoria de lo que parece: querés la función, no a quienes la ejercen.
**Tensión central:** Confiás en el Estado como institución pero no en quienes lo conducen hoy.

---

### 5. Republicano de Orden
**Cuadrante:** Privatista Conservador · Institucionalista
**Descripción:** Creés que los mercados libres y las instituciones republicanas son complementarios, no opuestos. Para vos, la estabilidad de las reglas y el cumplimiento de los contratos son la base de cualquier progreso duradero. No confiás en los atajos ni en los liderazgos que prometen saltarse los procedimientos para llegar antes.
**Tensión central:** Querés libertad económica con instituciones fuertes, una combinación que Argentina históricamente no logró sostener.

---

### 6. Conservador Rebelde
**Cuadrante:** Privatista Conservador · Anti-establishment
**Descripción:** Querés menos Estado en la economía y más libertad individual, pero el sistema político actual no te representa. Lo percibís capturado por intereses que no son los de la gente común. Tu rechazo al establishment no viene del resentimiento sino de la convicción de que las reglas actuales protegen a quienes ya tienen todo.
**Tensión central:** Combinás la fe en el mercado libre con la desconfianza en quienes lo regulan — y esa tensión define mucho de tu política.

---

### 7. Liberal Cosmopolita
**Cuadrante:** Privatista Progresista · Institucionalista
**Descripción:** Defendés la libertad individual tanto en lo económico como en lo personal, y confiás en que las instituciones y los acuerdos internacionales son el mejor marco para garantizarla. Tenés una visión del mundo abierta y conectada: no creés que lo local tenga que defenderse del afuera, sino integrarse con criterio.
**Tensión central:** Querés libertad sin fronteras y confiás en el sistema para sostenerla — aunque el sistema muchas veces defraude esa confianza.

---

### 8. Libertario de Autonomía
**Cuadrante:** Privatista Progresista · Anti-establishment
**Descripción:** Priorizás la autonomía individual por encima de casi cualquier colectivo, y desconfiás de toda forma de autoridad que no sea elegida libremente. Para vos, el mayor riesgo no es el caos sino la coerción — sea estatal, corporativa o social. Esa postura tiene una coherencia interna que pocos arquetipos tienen: la libertad como principio ordenador, sin excepciones.
**Tensión central:** Llevás la coherencia libertaria hasta el final, lo que muchas veces te deja solo frente a un mundo que pide compromisos.

---

### 9. Pragmático Institucional
**Cuadrante:** Centro · Institucionalista
**Descripción:** No te ubicás claramente en ningún cuadrante del espectro. Tu posición es moderada tanto en lo económico como en lo social, y confiás en que las instituciones son el mejor marco para resolver los conflictos. Esa combinación es difícil de encasillar — y probablemente sea así a propósito.
**Tensión central:** Tu apertura y tu fe en el sistema te ubican en un lugar que pocos partidos argentinos realmente representan.

---

### 10. Pragmático Crítico
**Cuadrante:** Centro · Anti-establishment
**Descripción:** No te ubicás claramente en ningún cuadrante del espectro. Tu posición es moderada tanto en lo económico como en lo social, pero desconfiás del sistema político y sus actores. No tenés una ideología fija, pero sí una mirada crítica sobre cómo funciona el poder.
**Tensión central:** Tenés escepticismo sin dirección ideológica clara — ni izquierda ni derecha, pero tampoco confianza en lo que hay.

---

## Output esperado

Para cada arquetipo, devolver un bloque con esta estructura exacta:

```
### [Nombre del arquetipo]

**Tagline:** [El que...]

**Símbolo cultural:** [Objeto/escena/práctica]

**Prompt de imagen:**
[prompt en inglés, estilo Midjourney/SD]
```

Asegurate de que:
- Los 10 taglines tengan registro similar entre sí (misma longitud aproximada, mismo tono)
- Los 10 símbolos sean cohesivos como sistema (no mezclar objetos muy abstractos con muy concretos)
- Los 10 prompts de imagen tengan coherencia estilística (misma paleta base, mismo estilo de ilustración) pero identidad visual distinta por arquetipo
- Ninguno suene como propaganda de ningún partido, movimiento o figura política real de Argentina

Tomá el tiempo que necesites. La calidad importa más que la velocidad.
