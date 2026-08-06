# Investigación de diseño — J2: El Legislador

**Fecha:** 2026-08-06  
**Estado:** recomendaciones de producto; requieren validación metodológica antes de implementación.  
**Documento de implementación:** `tasks/J2_PLAN.md`.

---

## Tesis de diseño

J2 no debe intentar ser un *Suzerain* comprimido ni otro test ideológico. Su propuesta diferencial es un **simulador breve de bancada**: el usuario descubre qué clase de legislador sería cuando cada voto implica una tensión entre convicción, disciplina, representación territorial y visibilidad pública.

El resultado debe describir una selección de votaciones y reglas explícitas, no dictaminar la identidad política completa del usuario.

## Referentes y traducción al producto

| Referente | Aprendizaje transferible | Límite para J2 |
|---|---|---|
| Suzerain | Consecuencias legibles a través de prensa, informes y relaciones; decisiones sin respuesta correcta. | No hacer ramas narrativas masivas ni simulación nacional. |
| Reigns | Decisión rápida con estados visibles que se mueven en cada ronda. | Mantener cuatro opciones de voto; no reducir a binario. |
| Papers, Please | La presión humana vuelve concreto un problema institucional abstracto. | No usar temporizador duro ni castigar velocidad. |
| Disco Elysium | La ideología aparece como rastro de conducta y lenguaje, no como etiqueta previa. | Evitar tono autoral que parezca partidista. |
| Democracy 4 | Una política afecta grupos distintos y produce trade-offs. | No simular causalidad económica con falsa precisión. |
| 80 Days | Rejugabilidad por rutas/contenido alternativo, no sólo por finales. | Variantes acotadas; no multiplicar contenido narrativo. |
| This Is the Police | Presiones simultáneas de superiores, medios y actores informales. | No convertir problemas públicos en cinismo o caricatura. |

## Mecánicas recomendadas

Estas mecánicas deben ser narrativas y de perfil; **no deben cambiar las 12 mediciones ni la comparabilidad del matching**.

1. **Capital de negociación.** Cuatro contadores discretos (bloque, provincia, opinión pública, agenda propia), de 0 a 3. En rondas críticas se puede gastar un punto para pedir una modificación, justificar un voto o ausentarse con costo menor.
2. **Mensaje de presión en cinco rondas.** Un actor hipotético pide presencia, disciplina o una enmienda. El voto sigue siendo libre. Evitar presentarlo como jefe de un bloque real antes del resultado.
3. **Titular posterior condicional.** Una línea de prensa y una variación mínima de estado después de cada voto relevante. Debe recordar el costo público de la decisión, no premiar ni castigar ideología.
4. **Dos decisiones de procedimiento.** En dos casos, elegir entre comisión, negociación o recinto. Alimentan el perfil de ejercicio legislativo, no la afinidad partidaria.
5. **Rejuego por expediente alternativo.** Tras terminar, cambiar cuatro escenarios por equivalentes de otra legislatura. La ruta base de doce se conserva para comparabilidad.

### Mecánicas descartadas

- Temporizador en el modo principal: mide rapidez y frustración, no reflexión política.
- Lobby que cambie el voto automáticamente: sólo puede ofrecer presión, información o una enmienda.
- Voto secreto como mecánica central: no representa adecuadamente las votaciones nominales que sostienen el instrumento.
- Ramificación que cambie qué ítems responde cada usuario: invalida la comparación del resultado.

## Reglas metodológicas para el scoring

1. Separar tres salidas: **afinidad legislativa**, **perfil de ejercicio del cargo** y **participación/ausentismo**.
2. No llamar “lealtad” a la coincidencia ideológica. Usar `compatibilidad con la línea mayoritaria` o `disciplina de bancada simulada`.
3. Una ausencia o abstención no equivale automáticamente a desacuerdo ideológico. Debe conservarse y explicarse como conducta distinta.
4. Eliminar la regla `dividida = 0.5 para cualquier respuesta`: una división real debe guardar distribución de votos por bloque y expresar menor certeza, no borrar información.
5. Cada escenario real debe registrar fecha, cámara, acta nominal, cobertura, cohesión de cada bloque, regla de codificación y versión de datos.
6. El resultado debe decir: “esto describe esta selección de votos; no tu identidad política completa”.

## Contenido: criterio de selección

Un escenario entra sólo si cumple simultáneamente:

- posición documentable en una fuente primaria o conjunto de fuentes explícito;
- capacidad de distinguir al menos dos bloques;
- relevancia sustantiva distinta de los otros once;
- enunciado neutral y comprensible sin conocimiento parlamentario;
- posibilidad de explicar la decisión con un costo o trade-off real.

### Candidatos a incorporar o sustituir

- Boleta Única Papel (2024): reforma electoral/institucional, distinta de PASO.
- RIGI y restitución de Ganancias (2024): separarlos de Ley Bases evita que una ley ómnibus sea un único ítem.
- Ficha Limpia (2025): tensión entre integridad pública, presunción de inocencia y posible uso estratégico de la justicia.
- Cannabis medicinal/autocultivo, alquileres, moratoria previsional, etiquetado frontal, bienes personales o privatizaciones: usar sólo tras medir cohesión real por bloque y cámara.

### Ficticios con mejor poder discriminante

- Federalismo fiscal: coparticipación condicionada o transferencia directa a municipios.
- Seguridad: baja de edad de imputabilidad con obligación de dispositivos socioeducativos.
- Ambiente y desarrollo: consulta vinculante provincial para megaproyectos con participación estatal.
- Plataformas: responsabilidad de redes ante campañas coordinadas y publicidad política.
- Política exterior: cooperación tecnológica con China o EE.UU. con cláusulas de transparencia y transferencia local.
- Representación: paridad o cupo en autoridades de comisión.

## Resultado y sharing

### Estructura recomendada

1. **Titular:** “Tu bancada más compatible: [bloque], con independencia alta.”
2. **Resumen:** coincidencias sobre 12, sin decimales ni promesa de precisión psicológica.
3. **Dos votos definitorios:** uno de máxima coincidencia y uno de mayor distancia.
4. **Perfil de ejercicio:** negociador, disciplinado, transversal u opositor sistemático.
5. **Oferta narrativa:** escena breve en segunda persona; no veredicto político.
6. **Explicación:** enlace “Cómo se calculó”, con fuentes y posiciones.

### Canvas compartible

- Nombre del juego.
- Bancada más compatible y perfil de ejercicio.
- “Tu voto más inesperado” (tema, no juicio de valor).
- Pregunta de invitación: “¿A qué bloque terminarías llegando?”.
- Sin logotipos partidarios dominantes, rostros de dirigentes ni colores que parezcan campaña.

No usar como reward principal frases del tipo “X dirigente te quiere en la lista”: envejecen, pueden parecer propaganda y personalizan innecesariamente el resultado.

## Tono narrativo

**Serio, cercano y observacional; irónico con el procedimiento, nunca con las personas afectadas.**

- Protagonista: “la banca [provincia]” o “diputado/a [apellido elegido]”; sin biografía fija.
- Léxico: recinto, dictamen, cuarto intermedio, sesión caída, pasillo, rosca, bloque, expediente.
- Apertura sugerida: “Entraste sin bloque. Eso te da libertad; también te deja sin teléfono cuando empieza la sesión.”
- El humor debe surgir de eufemismos, negociaciones y rituales parlamentarios; no de pobreza, derechos o violencia.

## Transparencia, actualización y validación

- Publicar un JSON versionado con fuentes, fecha, cámara, posiciones y reglas de codificación.
- Separar una **base histórica congelada** de una **temporada actual** con tres o cuatro casos nuevos.
- Mantener registro editorial y revisión por lectores con posiciones distintas.
- Preguntar después del resultado: “¿Te representa?” (sí / parcialmente / no) y medir abandono por escenario.
- Revisar cada cambio de ítem o fórmula con tests de regresión sobre perfiles simulados y una nota de versión visible.

## Prioridades de implementación

1. Corregir el contrato metodológico y el scoring antes de crear el JSON o el frontend.
2. Construir trazabilidad para R1–R7: acta, cámara, cobertura y cohesión por bloque.
3. Implementar capital de negociación, mensajes de presión y titular posterior como capa narrativa mínima.
4. Desagregar Ley Bases y reducir redundancia de vetos.
5. Rediseñar el resultado como afinidad + discrepancias + perfil de ejercicio.
6. Mantener la misma ruta de medición; ramificar sólo narrativa y rejuego.
7. Versionar contenido y metodología desde el primer release.

## Fuentes de investigación

- [Torpor Games — Suzerain press kit](https://www.torporgames.com/presskit)
- [Positech — Democracy 4](https://www.positech.co.uk/democracy4/)
- [Inkle — 80 Days](https://www.inklestudios.com/80days/)
- [Vox Pop Labs — Vote Compass methodology](https://www.voxpoplabs.com/votecompass/methodology.pdf)
- [Bundeszentrale für politische Bildung — Wahl-O-Mat](https://www.bpb.de/themen/wahl-o-mat/45292/die-entstehung-eines-wahl-o-mat/)
- [Cámara de Diputados — votación financiamiento universitario](https://votaciones.hcdn.gob.ar/pdf/acta/5319)
- [Senado — Ley de Bases](https://www.senado.gob.ar/prensa/21755/noticias)
- [APSR — selección de votaciones nominales](https://www.cambridge.org/core/journals/american-political-science-review/article/rollcall-vote-selection-implications-for-the-study-of-legislative-politics/FFAD60FB9CA9BBD54F02DE44A1FF0264)
