# Plan de rediseño del banco de preguntas — J1 v5.0

**Fecha:** 03/07/2026  
**Versión base:** J1 v4.0 (25 ítems, 10 dimensiones, escala 4-point EFG)  
**Objetivo:** Instrumento válido para piloto (150-200 respondentes)

---

## Diagnóstico de partida

| Dimensión | Ítems | Estado | Problema |
|---|---|---|---|
| individualismo | 3 | Sólida | Brecha: privatismo informal ausente |
| meritocracia | 3 | Parcial | i2_3 débil conceptualmente |
| tradicion | 2 | Sólida | Solo 2 ítems (fragilidad) |
| autoridad | 2 | Débil | Demasiado suave, falta punitivismo político |
| localismo | 2 | Aceptable | Riesgo cruce con ciclo vital |
| antiestablishment | 5 | Crítica | 3/5 ítems mal ubicados o con carga cruzada |
| derechos_autonomia | 2 | Sólida | — |
| laicismo | 2 | Sólida | — |
| migracion | 2 | Sólida | — |
| fuentes_info | 2 | Débil | Validez cuestionada, deseabilidad bipolar |

---

## Mapa de cambios (versión final, validada 03/07/2026)

### Decisiones confirmadas

| Decisión | Resultado |
|---|---|
| `fuentes_info` | **Eliminada completamente** del quiz. d10_1 y d10_2 se van. Dimensión suprimida. |
| `antiestablishment` | Una sola dimensión para el piloto, con **sub-facetas auditables internamente**: `critica_reformista`, `cinismo`, `reglas_intermediacion`, `eficacia` |

### Ítems eliminados (6)

| Ítem | Tipo | Motivo |
|---|---|---|
| `d10_1` valoro el rigor de los medios / sigo comunicadores independientes | Eliminado sin reemplazo | fuentes_info → dimensión suprimida |
| `d10_2` medio que dice desde dónde habla / medio neutral | Eliminado sin reemplazo | fuentes_info → dimensión suprimida + deseabilidad bipolar |
| `i2_3` especializarme vs adaptarme | Reemplazado por N1 | Mide estrategia laboral, no meritocracia como valor |
| `i4_1` roles y estructuras claras / organizo mi trabajo libremente | Reemplazado por N8 | Mide organización laboral, no autoridad política |
| `i6_1` grandes empresas / corporaciones con demasiado poder | Reemplazado por N4 | Carga en progresismo multiculturalista (Brussino), no en inst |
| `i6_4` derecho a protestar / cortar una calle puede ser necesario | Reemplazado por N5 | Carga en progresismo garantista (Brussino), no en inst |

### Ítems nuevos (7)

| # | Dimensión | Eje | Qué mide | Fuente corpus |
|---|---|---|---|---|
| N1 | meritocracia | econ | Reemplaza i2_3: creencia nuclear en esfuerzo vs. condiciones de partida | Feldman 1988, Bobbio |
| N2 | individualismo | econ | Privatismo informal: autonomía cotidiana sin ventanillas ni dependencia | Semán, Natanson, Morresi, CS2025 |
| N3 | autoridad | social | Punitivismo: orden estricto vs. entender causas del conflicto social | Imhoff RWA 2013, Jost |
| N4 | antiestablishment | inst | Reemplaza i6_1: crítica al poder político como intermediario | Stefanoni, Alonso 2018 |
| N5 | antiestablishment | inst | Reemplaza i6_4: legitimidad democrática: reforma dentro vs. fuera de reglas | Alonso 2018 |
| N6 | antiestablishment | inst | Eficacia política externa: participar puede cambiar algo | Brussino & Alonso 2013, Sorribas, ANES |
| N8 | autoridad | social | Reemplaza i4_1: obediencia vs. criterio propio ante la autoridad | Imhoff RWA 2013, Jost |

### Banco final: 26 ítems (todos scored)

| Dimensión | Eje | Ítems | Cantidad |
|---|---|---|---|
| individualismo | econ | i1_1, i1_2, i1_3, N2 | 4 |
| meritocracia | econ | i2_1, i2_2, N1 | 3 |
| tradicion | social | i3_1, i3_2 | 2 |
| autoridad | social | i4_2, N3, N8 | 3 |
| localismo | social | i5_1, i5_2 | 2 |
| derechos_autonomia | social | d7_1, d7_2 | 2 |
| laicismo | social | d8_1, d8_2 | 2 |
| migracion | social | d9_1, d9_2 | 2 |
| antiestablishment | inst | i6_2, i6_3, i6_5, N4, N5, N6 | 6 |
| **TOTAL** | | | **26** |

**Ejes:**
- Econ: 7 ítems
- Social: 13 ítems
- Inst: 6 ítems

### Ítems a monitorear en el piloto (conservados, en observación)

| Ítem | Riesgo | Umbral de alarma |
|---|---|---|
| i6_3 reglas favorecen siempre a los mismos | Mezcla meritocracia con cinismo | item-total < .20 con inst |
| i6_5 todos lo mismo | Captura estado emocional coyuntural | Correlación con fecha/contexto político |
| i1_1 salud propia / sistema de salud | Puede medir preferencia por servicio concreto | item-total < .20 con econ |
| i1_2 lo que tengo lo construí yo | Deseabilidad social | Tasa de escape > 30% |
| d8_2 aborto/eutanasia y religión en la ley | Activa posición coyuntural | Distribución extrema (>70% en un polo) |
| i5_1 construir mi vida donde crecí | Cruce con ciclo vital y región | Diferencias por edad > 20 puntos |

---

## Decisiones de arquitectura (a confirmar antes de escribir ítems)

### Decisión A — ¿Cómo reestructurar `antiestablishment`?

**Opción 1 — Una sola dimensión mejorada (recomendada para piloto)**  
Mantener `antiestablishment` con 5 ítems mejorados. Eliminar i6_1 e i6_4, reemplazarlos por ítems que midan anti-establishment político estructural (N4 y N5). Agregar N6 de eficacia externa. Resultado: 6 ítems en una sola dimensión, pero más coherente.

*Pro:* No rompe la arquitectura de arquetipos.  
*Contra:* La dimensión sigue mezclando cinismo (i6_5) con crítica estructural (i6_2) y eficacia (N6).

**Opción 2 — Dividir en dos subdimensiones**  
- `antiestablishment_critico`: i6_2, N4, N5 → crítica del sistema, reforma dentro/fuera de reglas
- `cinismo_eficacia`: i6_5, N6, + 1 ítem nuevo → desconfianza en dirigentes, eficacia política externa

*Pro:* Mayor precision analítica, permite arquetipos más matizados.  
*Contra:* Requiere recalibrar el scoring y los arquetipos actuales.

**→ Decisión recomendada: Opción 1 para el piloto, con subpuntajes auditables. Opción 2 en post-piloto si los datos lo justifican.**

### Decisión B — ¿`fuentes_info` permanece en el score `inst`?

**Opción 1 — Permanece pero reformulada (recomendada)**  
d10_1 se conserva. d10_2 se reformula con N7. La dimensión mide relación con mediadores de información, que tiene correlación empírica con confianza institucional.

**Opción 2 — Se separa del score principal**  
`fuentes_info` pasa a ser variable auxiliar de caracterización (visible en el resultado, no en el score del eje inst). Permite ver el patrón de consumo informativo sin contaminar el eje institucional.

**→ Decisión recomendada: Opción 1 para el piloto. Separar en post-piloto si item-total con inst resulta bajo.**

---

## Fases del rediseño

### Fase 1 — Rediseño del banco (próxima sesión)

**Entregables:**
1. Los 7 ítems nuevos escritos en formato EFG (par A/B + validación contra checklist de 16 reglas + regla de autopercepción positiva)
2. Reformulación de d10_2
3. `brujula.json` actualizado: 29 ítems, dimensiones ajustadas, pesos revisados
4. Scoring engine actualizado si hay cambios de pesos o subpuntajes
5. Documentación de cambios en lessons.md

**Criterios para aprobar un ítem nuevo:**
- Ambos polos cumplen la regla de autopercepción positiva (lessons.md)
- Pasa el checklist de 16 reglas (L1-L5, E1-E5, D1-D4, P1-P3)
- Trade-off genuino: existe una porción real de la población que elegiría cada polo
- No revela el eje que mide
- No activa posición coyuntural (sin mencionar personas, partidos o leyes vigentes)
- El polo B no es la negación del polo A

**Proceso de escritura por ítem:**
1. Definir el constructo exacto (qué predisposición estable quiero medir)
2. Identificar la situación cotidiana que lo activa
3. Redactar A y B como afirmaciones positivas
4. Validar contra checklist
5. Revisar deseabilidad: ¿algún polo suena a respuesta incorrecta?

### Fase 2 — Expansión del banco (Issue E, post-Fase 1)

**Objetivo:** Alcanzar cobertura mínima por eje para Cronbach ≥ .70

Estado post-Fase 1:
- Eje econ: 7 ítems (3 individualismo + 3 meritocracia + 1 nuevo privatismo informal)
- Eje social: 12 ítems (tradicion + autoridad + localismo + derechos_autonomia + laicismo + migracion)
- Eje inst: 10 ítems (6 antiestablishment + 4 fuentes_info/nuevos)

Target según deep research: al menos 8-9 por eje.

**Ítems adicionales a redactar en Fase 2:**
- 1-2 ítems económicos adicionales: igualdad formal vs. sustantiva (Bobbio), tecnocracia vs. deliberación política (Morresi)
- 1 ítem social adicional: pluralismo afectivo / tolerancia al desacuerdo cotidiano (CS2025 Polarización)

**Resultado esperado:** 31-32 ítems totales, distribución más equilibrada entre ejes.

### Fase 3 — Piloto

**Muestra objetivo:** 150-200 respondentes, diversidad ideológica, selección por círculo cerrado.

**Criterios de validación del piloto:**
- Alpha de Cronbach ≥ .70 por eje
- Correlación ítem-total ≥ .20 por ítem
- Tasa de completion > 80%
- PCA: varianza explicada > 50% con estructura de 3 factores
- Tasa de uso del escape "No tengo postura" < 30% por ítem (si > 30% → revisar ítem)
- Distribución de perfiles: Centro < 20% (si > 20% → recalibrar CENTER_THRESHOLD)

**Post-piloto:**
- Calcular Alpha real por dimensión
- PCA confirmatorio
- Calibrar CENTER_THRESHOLD e INST_THRESHOLD con datos reales
- Evaluar si `antiestablishment` necesita subdimensionarse (Decisión A)
- Evaluar si `fuentes_info` debe salir del score principal (Decisión B)
- Publicar dataset anonimizado (Kaggle / Hugging Face)

---

## Orden de trabajo para la próxima sesión

1. **Confirmar Decisión A y B** (5 min)
2. **Escribir N2 — privatismo informal** (10 min) → el más importante por la brecha con sectores populares
3. **Escribir N3 — punitivismo/orden** (10 min) → fortalecer `autoridad`
4. **Escribir N4 — anti-establishment político sin sesgo de corporaciones** (10 min) → reemplaza i6_1
5. **Escribir N5 — legitimidad democrática concreta** (10 min) → reemplaza i6_4
6. **Escribir N6 — eficacia política externa** (10 min)
7. **Escribir N1 — meritocracia nuclear** (10 min) → reemplaza i2_3
8. **Reformular d10_2** (5 min) → genera N7
9. **Actualizar brujula.json** con los 29 ítems finales
10. **Ajustar pesos y scorer si es necesario**

---

## Impacto esperado sobre los arquetipos

| Arquetipo | Impacto esperado |
|---|---|
| Colectivista Transformador (EP·inst) | Más estable: N5 y N6 refuerzan la dimensión institucional sin sesgo de corporaciones |
| Colectivista Rebelde (EP·anti) | Más preciso: N4 captura mejor el anti-establishment de izquierda estructural |
| Conservador Rebelde (PC·anti) | Más preciso: N4 captura anti-establishment de derecha (anti-burocracia/anti-intermediarios) |
| Todos los arquetipos | N2 (privatismo informal) puede redistribuir perfiles PC/PP en sectores que hoy quedan mal clasificados |
| Centro Pragmático | Menos inflado: CENTER_THRESHOLD ya bajó a 10; cambios en inst pueden reducir el escape al centro |

---

## Restricciones de diseño que se mantienen

1. El formato EFG (par A/B, 4-point, sin neutro + botón de escape externo) no cambia
2. El lenguaje cotidiano sin etiquetas ideológicas no cambia
3. La randomización de posiciones A/B no cambia
4. Los 10 nombres de dimensión se conservan (los cambios son de contenido, no de arquitectura)
5. Los 10 arquetipos y sus nombres no cambian en esta fase
6. El score en 2 niveles (promedio dimensional → agregación al eje) no cambia
