# Banco de escenarios — J2 El Legislador

**Última actualización:** 2026-08-06
**Estado:** Set definitivo confirmado. Pendiente trazabilidad de actas (Fase 2).
**Documento de diseño:** `docs/JUEGO_2_VISION.md`
**Plan de implementación:** `tasks/J2_PLAN.md`

---

## Set definitivo

### Base fija — 8 escenarios inamovibles

| ID | Título | Tipo | Eje | LLA | PRO | UCR | UP | FIT |
|----|--------|------|-----|-----|-----|-----|----|-----|
| B1 | IVE — Aborto legal | Real 2020 (legado) | Social | − | D | D | + | + |
| B2 | Acuerdo con el FMI | Real 2022 (legado) | Ext/Económico | − | + | + | D | − |
| B3 | Eliminación de Ganancias 4ª | Real 2023 (legado) | Económico | + | − | − | + | + |
| B4 | Boleta Única de Papel | Real 2024 | Electoral | + | + | + | − | + |
| B5 | Ficha Limpia | Real 2025 | Inst/Electoral | + | + | + | − | D |
| B6 | Autonomía constitucional del BCRA | Ficticio | Económico-monetario | + | + | + | − | − |
| B7 | TLC bilateral con EE.UU. | Ficticio | Exterior | + | + | D | − | − |
| B8 | Baja de imputabilidad (con garantías) | Ficticio | Seguridad/Social | + | + | D | − | − |

Leyenda: `+` favor · `−` contra · `D` dividido · `N/O` no observable

**Restricción metodológica — escenarios legado (B1, B2, B3):**
LLA no existía como bloque parlamentario antes de diciembre de 2023. La columna LLA en esos
tres escenarios usa posición reconstruida desde plataforma y declaraciones públicas verificables.
El JSON del escenario marca `posicion_reconstruida: true` y `fuente_lla: [url]`.
La página de metodología del juego lo explicita al usuario.

**Patrones de coalición no-obvia (anti-predicción):**
- B2: LLA + FIT juntos — los extremos del espectro se unen contra el centro
- B3: LLA + UP + FIT — el gobierno vota con la izquierda y el peronismo contra PRO/UCR
- B6: LLA + PRO + UCR — gobierno y oposición moderada en el mismo bando

### Temporada fundacional — 4 escenarios rotativos (lanzamiento 2025–2026)

| ID | Título | Tipo | Eje | LLA | PRO | UCR | UP | FIT |
|----|--------|------|-----|-----|-----|-----|----|-----|
| T1 | Súper RIGI 2026 | Real 2026 | Económico/Exterior | + | + | + | − | − |
| T2 | Veto a financiamiento universitario (insistencia) | Real 2024 | Social/Cultural | − | D | + | + | + |
| T3 | Reducción de jornada laboral a 32hs | Ficticio | Económico/Laboral | − | − | − | + | + |
| T4 | Dietas a mano alzada sin registro | Procedural | Perfil de ejercicio | — | — | — | — | — |

T4 no entra al scoring de afinidad — alimenta el perfil de ejercicio legislativo.
T2: el escenario se plantea como "¿acompañás el veto o lo rechazás?" (favor = sostener el veto).

---

## Protocolo de trazabilidad (Fase 2)

Para cada escenario real, antes de pasar a producción:

1. Descargar el acta nominal desde HCDN (`votaciones.hcdn.gob.ar`) o Senado oficial.
2. Registrar en el JSON: `acta_id`, `fecha`, `camara`, `url_acta`, `hash_csv`.
3. Mapear bloque al momento del voto — no el bloque actual del legislador.
4. Calcular Rice Index: `100 × |afirmativos_b − negativos_b| / (afirmativos_b + negativos_b)`.
   Excluir presidencia, ausencias y abstenciones del denominador.
5. Si el bloque tiene menos de 3 votos emitidos: marcar `cobertura: insuficiente`.
6. Guardar `voto_observado`, `posicion_bloque`, `posicion_reconstruida` (para LLA en legado)
   y `confianza` por separado.

**Umbrales de Rice para el scoring:**
- Rice ≥ 85 → `coeficiente = rice / 100` (Alta cohesión)
- Rice 55–84 → `coeficiente = rice / 100` (Media cohesión)
- Rice < 55 o posición "Dividida" → `coeficiente = 0.5` (No otorgar punto entero)

**Reglas de publicación:**
- No publicar "posición de bloque" si Rice < 55 o cobertura insuficiente → mostrar "bloque dividido".
- Ficticios: publicar `fuentes`, `fecha de revisión` y `confianza` (alta / media / baja).
- Auditar dos perfiles teóricos por bloque y un perfil transversal con tests deterministas
  antes del lanzamiento.

**Fuentes primarias de acceso:**
- HCDN buscador: `votaciones.hcdn.gob.ar`
- Actas específicas: IVE 2020 #4077 · Aporte Solidario #4046 · BUP #5383 · Ficha Limpia #5585
- Senado: DNU 70 rechazo · Ley Bases
- Dataset procesado: `comovoto.dev.ar/data/` (legislators.json + votaciones.json)

---

## Candidatos evaluados — escenarios reales

### Directamente comparables (2024–2026)

| ID | Título | Año/Cámara | Eje | LLA | PRO | UCR | UP | FIT | Dictamen |
|----|--------|-----------|-----|-----|-----|-----|----|-----|----------|
| R01 | Ley Bases (votación general) | 2024/ambas | Multi | + | + | + | − | − | No — ley ómnibus mezcla constructos |
| R02 | Privatizaciones (título Ley Bases) | 2024/ambas | Económico | + | + | D | − | − | Banco — Estado vs. mercado más limpio que el general |
| R03 | RIGI (original Ley Bases) | 2024/ambas | Econ/Exterior | + | + | D | − | − | Banco — reemplazado por T1 Súper RIGI que es más actual |
| R04 | Restitución de Ganancias | 2024/ambas | Econ/Fiscal | + | + | D | − | − | Banco — se solapa con B3; usar solo si se saca B3 |
| R05 | Bienes Personales | 2024/ambas | Econ/Fiscal | + | + | D | − | − | Banco — no junto a R04 por unicidad |
| R06 | Rechazo DNU 70/2023 | 2024/Senado | Institucional | + | + | D | − | N/O | Banco — FIT sin base senatorial; bueno para Diputados |
| R07 | Boleta Única de Papel | 2024/ambas | Electoral | + | + | + | − | + | **BASE FIJA → B4** |
| R08 | Veto movilidad jubilatoria (insistencia) | 2024/Diputados | Social/Dist | − | D | + | + | + | Banco — alta coyuntura fiscal, puede rotar con T2 |
| R09 | Veto financiamiento universitario (insistencia) | 2024/Diputados | Social/Inst | − | D | + | + | + | **TEMPORADA FUNDACIONAL → T2** |
| R10 | Ficha Limpia | 2025/Diputados | Inst/Electoral | + | + | + | − | D | **BASE FIJA → B5** |
| R11 | Juicio en ausencia | 2025/Diputados | Inst/Seguridad | + | + | + | D | − | Banco — aporta justicia penal; revisar cohesión UP |
| R12 | Reincidencia y reiterancia | 2025/Diputados | Seguridad | + | + | + | D | − | Banco — usar solo si no hay otro punitivo |
| R13 | Tenencia/registro de armas | 2024/Diputados | Seguridad | + | + | D | − | − | Banco — validar que sea reforma sustantiva |
| R14 | Súper RIGI 2026 | 2026/Diputados | Econ/Exterior | + | + | + | − | − | **TEMPORADA FUNDACIONAL → T1** |
| R15 | Convenio impositivo con China | 2024/Diputados | Exterior | + | + | + | + | D | No — baja discriminación observada |
| R16 | Presupuesto 2026 | 2025/Diputados | Econ/Inst | + | D | D | − | − | Banco — bueno para temporada de debates fiscales |

### Legado (2018–2023) — LLA no observable, posición reconstruida

| ID | Título | Año/Cámara | Eje | LLA (rec.) | PRO | UCR | UP/FdT | FIT | Dictamen |
|----|--------|-----------|-----|-----------|-----|-----|--------|-----|----------|
| H01 | IVE 2018 | 2018/Diputados | Social | − | D | D | + | + | No — preferir H02; media sanción solo |
| H02 | IVE 2020 | 2020/ambas | Social | − | D | D | + | + | **BASE FIJA → B1** |
| H03 | Aporte Solidario y Extraordinario | 2020/Diputados | Económico | − | − | − | + | D/Abst | Banco legado — excelente eje fiscal, acta disponible |
| H04 | Etiquetado frontal | 2021/ambas | Social | − | D | + | + | + | No — apoyo amplio, baja discriminación |
| H05 | Acuerdo con el FMI | 2022/Diputados | Ext/Económico | − | + | + | D | − | **BASE FIJA → B2** |
| H06 | Cannabis medicinal/autocultivo | 2022/ambas | Social | − | D | D | + | + | Banco — probable baja discriminación contemporánea |
| H07 | Ley de Alquileres | 2023/Diputados | Econ/Social | + | + | D | − | − | Banco — envejecido; solo si hay crisis habitacional |
| H08 | Eliminación Ganancias 4ª | 2023/Diputados | Económico | + | − | − | + | + | **BASE FIJA → B3** |
| H09 | Moratoria previsional | 2023/Diputados | Social/Dist | − | − | D | + | + | Banco — no junto a veto jubilaciones T2 |
| H10 | Compre Argentino | 2023/Diputados | Econ/Industrial | D | − | D | + | + | Banco — solo con acta nominal inequívoca |

---

## Candidatos evaluados — escenarios ficticios

Posiciones son hipótesis de diseño. Requieren dossier con plataforma, proyectos y declaraciones
verificadas antes de publicarse. Confianza: alta / media / baja.

| ID | Título (enunciado resumido) | Eje | LLA | PRO | UCR | UP | FIT | Dictamen |
|----|----------------------------|-----|-----|-----|-----|----|-----|----------|
| F01 | Autonomía constitucional del BCRA | Econ/Monetario | + | + | + | − | − | **BASE FIJA → B6** |
| F02 | Empresa federal del litio | Econ/Federal | − | − | D | + | + | Banco — recursos estratégicos, bueno para debates mineros |
| F03 | Elección popular de la Corte | Institucional | − | − | − | D | + | Banco — bueno para crisis judiciales |
| F04 | TLC bilateral con EE.UU. | Exterior | + | + | D | − | − | **BASE FIJA → B7** |
| F05 | Eliminación de las PASO | Electoral | + | − | − | − | − | Banco — bueno para campaña 2027; PRO en contra |
| F06 | Coparticipación directa municipal | Federal/Inst | + | + | + | − | D | Banco — federalismo y gobernadores |
| F07 | Baja de imputabilidad (con garantías) | Seguridad/Social | + | + | D | − | − | **BASE FIJA → B8** |
| F08 | Consulta vinculante minera | Ambiente/Federal | − | D | + | + | + | Banco — ambiente y extractivismo |
| F09 | Responsabilidad de redes sociales | Inst/Digital | D | + | + | + | + | Banco — libertad de expresión vs. regulación |
| F10 | Convenio tecnológico con China | Exterior/Tecno | − | D | D | + | D | Banco — geopolítica multipolar |
| F11 | Paridad en presidencias de comisión | Inst/Social | D | − | + | + | + | Banco — género e institucionalismo |
| F12 | Impuesto al carbono con devolución | Ambiente/Econ | − | D | + | + | + | Banco — transición climática |
| F13 | Renta básica de transición laboral | Econ/Social | − | D | + | + | + | Banco — automatización y protección social |
| F14 | Sobretasa a inmuebles vacíos | Econ/Urbano | − | − | D | + | + | Banco — vivienda y propiedad |
| F15 | Servicio cívico voluntario remunerado | Social/Inst | + | + | + | + | + | Descartar — probable consenso, no discrimina |
| F16 | Aranceles diferenciados en universidades | Social/Econ | + | D | − | − | − | Banco — universidad pública y focalización |
| F17 | Propiedad comunitaria indígena | Social/Federal | − | D | + | + | + | Banco — derechos colectivos y extractivismo |
| F18 | Acuerdo Mercosur-UE con salvaguardas | Exterior/Econ | + | + | D | D | − | Banco — apertura con protecciones |
| F19 | Reducción de jornada laboral a 32hs | Econ/Laboral | − | − | − | + | + | **TEMPORADA FUNDACIONAL → T3** |
| F20 | Jornada de 4 días (sin reducción salarial) | Econ/Laboral | − | − | − | + | + | Banco — variante de F19; no usar juntos |

---

## Escenarios procedurales

No entran al scoring de afinidad. Alimentan el perfil de ejercicio legislativo.

| ID | Situación | Opciones | Qué mide |
|----|-----------|---------|----------|
| P01 | Aumento de dietas a mano alzada sin registro | Acompañar / retirarse / pedir votación nominal | Transparencia, costo personal y confrontación procedimental |
| P02 | Quórum como arma + oferta de fondos para provincia | Bajar al recinto / no bajar / exigir compromiso público | Representación territorial vs. responsabilidad institucional |
| P03 | Interpelación ministerial como show mediático | Firmar / no firmar / proponer pedido de informes | Control legislativo, exposición y negociación |

P01 entra en temporada fundacional (T4). P02 y P03 van al banco de temporadas futuras.

---

## Banco para temporadas futuras

| Candidato | Ventana de uso sugerida |
|-----------|------------------------|
| Aporte Solidario 2020 (H03) | Debates tributarios o elección histórica |
| Moratoria previsional 2023 (H09) | Debates previsionales; no junto a T2 |
| DNU 70 rechazo en Diputados (R06) | Agenda de hiperpresidencialismo |
| Veto movilidad jubilatoria (R08) | Alternativa a T2 para rotar vetos |
| Privatizaciones Ley Bases (R02) | Cuando se reactiven debates de empresas públicas |
| Reforma Ley DNU — límites al Ejecutivo (R16) | Agenda de división de poderes |
| Juicio en ausencia (R11) | Agenda de seguridad/justicia |
| Empresa federal del litio (F02) | Debates mineros o de recursos estratégicos |
| Elección popular de la Corte (F03) | Crisis judiciales profundas |
| Eliminación de las PASO (F05) | Ciclo electoral 2027 |
| Convenio tecnológico China (F10) | Debates de geopolítica o infraestructura |
| Impuesto al carbono (F12) | Eventos climáticos, COP |
| Propiedad comunitaria indígena (F17) | Conflictos territoriales o minería |
| Quórum como arma (P02) | Reemplazar P01 cuando pierda efecto sorpresa |
| Interpelación ministerial (P03) | Reemplazar P02 en agenda de control político |

---

## Validación del set base fija + temporada (12 escenarios)

| Criterio | Estado | Nota |
|----------|--------|------|
| Cada bloque tiene ≥4 escenarios con Rice estimado >70 | Parcial — pendiente cálculo real | LLA, UP y FIT sí. PRO y UCR presentan más D; verificar con actas |
| Los 5 ejes están cubiertos | Sí | Económico: B2/B3/B6/T3 · Social: B1/B8/T2 · Electoral: B4/B5 · Exterior: B2/B7/T1 · Institucional: B5/B6 |
| Al menos 1 fractura no sigue línea gobierno/oposición | Sí, tres casos | B2 (herradura LLA+FIT), B3 (inversión LLA+UP+FIT), B6 (LLA+PRO+UCR) |
| Al menos 1 escenario extra-legislativo | Sí | T4 Dietas — perfil de ejercicio |
| Comparabilidad entre todos los usuarios | Sí, si base fija se conserva | Cada temporada debe pasar esta matriz antes de publicarse |
