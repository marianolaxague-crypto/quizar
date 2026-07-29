"""
Scoring engine para J1 — Brújula Ideológica v4.0

Modelo de 3 factores:
  econ  [-100, +100]  Estatista ↔ Privatista
  social[-100, +100]  Progresista ↔ Conservador
  inst  [-100, +100]  Institucionalista ↔ Anti-est. (ortogonal)

Cambios v4 (escala 4-point):
  - Escala de respuesta: 1=Claramente A, 2=Más bien A, 3=Más bien B, 4=Claramente B
  - value=0 = escape "No tengo postura" — único valor neutral, excluido del cálculo
  - _compute_centered para scale=4: valores en [-2, +2] con paso de 2/3
  - Sin neutro en escala principal: fuerza posición sin forzar extremos
"""
import json
from pathlib import Path

DATA_FILE = Path(__file__).parent.parent / "data" / "j1" / "brujula.json"

_data = None

NEUTRAL_VALUES   = {0}      # 0=escape "No tengo postura" — único valor excluido (escala 4-point)
CENTER_THRESHOLD = 10.0     # calibrar con σ empírico de muestra piloto (bajado de 20 pre-piloto)
INST_THRESHOLD   = 15.0     # umbral para clasificación ordinal de inst
EVASION_THRESHOLD = 0.5     # fracción de neutros que activa UNDETERMINED


def _load():
    global _data
    if _data is None:
        with open(DATA_FILE, encoding="utf-8") as f:
            _data = json.load(f)
        _validate_weights(_data)
    return _data


def _validate_weights(data: dict) -> None:
    """Falla en startup si ítems de la misma dimensión tienen pesos distintos."""
    seen: dict[str, dict] = {}
    for q in data.get("questions", []):
        dim = q.get("dimension", "")
        w   = q.get("weights", {})
        if not dim:
            continue
        if dim in seen:
            if seen[dim] != w:
                raise ValueError(
                    f"Dimensión '{dim}': ítems con pesos inconsistentes "
                    f"{seen[dim]} vs {w} (id={q['id']})"
                )
        else:
            seen[dim] = w


def _compute_centered(value: int, a_is_left: bool, scale: int) -> float:
    """Convierte value + posición a valor centrado en [-2, +2] desde perspectiva de A."""
    if scale == 4:
        # 1→+2, 2→+2/3, 3→-2/3, 4→-2  (paso de 4/3, rango [-2,+2])
        effective = value if a_is_left else (5 - value)
        return (2.5 - float(effective)) * (4.0 / 3.0)
    elif scale == 3:
        effective = value if a_is_left else (4 - value)
        return (2.0 - float(effective)) * 2.0
    else:  # scale == 5 (legacy)
        effective = value if a_is_left else (6 - value)
        return 3.0 - float(effective)


def score_brujula(responses: dict) -> dict:
    """
    responses: {question_id: {"value": int, "a_is_left": bool}}
      value ∈ {0, 1, 2, 3, 4}  — 0=escape, 1=Claramente A, 2=Más bien A, 3=Más bien B, 4=Claramente B
      a_is_left                 — True si text_a fue mostrado a la izquierda

    Retorna:
      econ, social, inst:    float [-100, 100]
      profile:               EP | EC | PC | PP | C | UNDETERMINED
      profile_data, archetype, archetype_data, dimensions, ...
    """
    data = _load()
    questions = {q["id"]: q for q in data["questions"]}

    # ── Detección de evasión sistemática ─────────────────────────────────
    total = len(responses)
    neutral_count = sum(
        1 for resp in responses.values()
        if (isinstance(resp, dict) and resp.get("value") in NEUTRAL_VALUES)
        or (not isinstance(resp, dict) and resp in NEUTRAL_VALUES)
    )
    neutral_fraction = neutral_count / total if total > 0 else 0

    if neutral_fraction > EVASION_THRESHOLD:
        return {
            "undetermined":    True,
            "reason":          "neutral_evasion",
            "neutral_fraction": round(neutral_fraction, 2),
            "profile":         "UNDETERMINED",
            "profile_data":    {},
            "archetype":       None,
            "archetype_data":  {},
            "econ":  0.0, "social": 0.0, "inst": 0.0,
            "dimensions":           {},
            "top_dimension":        None,
            "top_dimension_score":  0,
            "top_dimension_label":  None,
            "axes_meta": {ax: data["axes"][ax] for ax in data["axes"]},
        }

    # ── Paso 1: agrupar respuestas válidas por dimensión ──────────────────
    dim_centered: dict[str, list[float]] = {}

    for qid, resp in responses.items():
        if qid not in questions:
            continue
        q = questions[qid]

        if isinstance(resp, dict):
            value     = resp["value"]
            a_is_left = resp.get("a_is_left", True)
        else:
            value     = resp
            a_is_left = True

        if value in NEUTRAL_VALUES:
            continue  # excluir del numerador y denominador

        scale = q.get("scale", 4)
        if scale == 4:
            valid_range = {1, 2, 3, 4}
        elif scale == 3:
            valid_range = {1, 2, 3}
        else:
            valid_range = {1, 2, 3, 4, 5}
        if value not in valid_range:
            continue  # I1: rechazar valores fuera del rango válido

        centered = _compute_centered(value, a_is_left, scale)
        dim      = q.get("dimension", "")
        if dim:
            dim_centered.setdefault(dim, []).append(centered)

    # ── Paso 2: promedio dimensional D̄ⱼ ∈ [-2, +2] ───────────────────────
    dim_avg = {d: sum(v) / len(v) for d, v in dim_centered.items() if v}

    # ── Paso 3: pesos por dimensión (del primer ítem de cada dimensión) ───
    dim_weights: dict[str, dict] = {}
    for q in data["questions"]:
        dim = q.get("dimension", "")
        if dim and dim not in dim_weights:
            dim_weights[dim] = q["weights"]

    # ── Paso 4: score por eje — scoring en 2 niveles ──────────────────────
    # score_k = 100 × Σ(D̄ⱼ × Wⱼₖ) / Σ(|Wⱼₖ| × 2)
    # El denominador solo incluye dimensiones con respuestas no-neutras.
    axis_sums = {"econ": 0.0, "social": 0.0, "inst": 0.0}
    axis_max  = {"econ": 0.0, "social": 0.0, "inst": 0.0}

    for dim, avg in dim_avg.items():
        if dim not in dim_weights:
            continue
        for axis, weight in dim_weights[dim].items():
            if axis in axis_sums and weight != 0:
                axis_sums[axis] += avg * weight
                axis_max[axis]  += 2.0 * abs(weight)

    def normalize(s, m):
        if m == 0:
            return 0.0
        return round((s / m) * 100, 1)

    normalized = {ax: normalize(axis_sums[ax], axis_max[ax]) for ax in axis_sums}

    # ── Scores dimensionales para visualización [-100, +100] ──────────────
    dim_scores = {dim: round((avg / 2.0) * 100, 1) for dim, avg in dim_avg.items()}

    # ── Perfil y arquetipo ────────────────────────────────────────────────
    profile = _assign_profile(normalized["econ"], normalized["social"])
    archetype_id, archetype_data = _assign_archetype(
        profile, normalized["inst"], data.get("archetypes", {})
    )

    top_dim       = max(dim_scores, key=lambda d: abs(dim_scores[d])) if dim_scores else None
    top_dim_score = dim_scores.get(top_dim, 0) if top_dim else 0

    dim_labels = {
        "individualismo":          "Individualismo",
        "meritocracia":            "Meritocracia",
        "modelo_economico":        "Modelo económico",
        "tradicion":               "Tradición / Orden",
        "autoridad":               "Autoridad",
        "localismo":               "Localismo",
        "antiestablishment":       "Anti-establishment",
        "confianza_institucional": "Confianza institucional",
        "derechos_autonomia":      "Autonomía personal",
        "laicismo":                "Laicismo",
        "migracion":               "Apertura migratoria",
    }

    inst_moderate = abs(normalized["inst"]) < INST_THRESHOLD  # I3: true cuando inst no alcanza umbral

    return {
        "undetermined":     False,
        "neutral_fraction": round(neutral_fraction, 2),
        "econ":   normalized["econ"],
        "social": normalized["social"],
        "inst":   normalized["inst"],
        "inst_moderate": inst_moderate,
        "profile":       profile,
        "profile_data":  data["profiles"].get(profile, {}),
        "archetype":     archetype_id,
        "archetype_data": archetype_data,
        "top_dimension":       top_dim,
        "top_dimension_score": round(top_dim_score, 1),
        "top_dimension_label": dim_labels.get(top_dim, top_dim) if top_dim else None,
        "dimensions":  dim_scores,
        "axes_meta":   {ax: data["axes"][ax] for ax in data["axes"]},
    }


def _assign_profile(econ: float, social: float) -> str:
    econ_pos  = econ   >  CENTER_THRESHOLD
    econ_neg  = econ   < -CENTER_THRESHOLD
    social_pos = social >  CENTER_THRESHOLD
    social_neg = social < -CENTER_THRESHOLD

    if not econ_pos and not econ_neg and not social_pos and not social_neg:
        return "C"  # Centro Pragmático

    if econ_pos and social_pos:  return "PC"
    if econ_pos and social_neg:  return "PP"
    if econ_neg and social_pos:  return "EC"
    if econ_neg and social_neg:  return "EP"

    # Un eje en centro — usar el eje con mayor señal
    if abs(econ) >= abs(social):
        return "PC" if econ >= 0 else "EP"
    else:
        return "EC" if social >= 0 else "PP"


def _assign_archetype(profile: str, inst: float, archetypes: dict) -> tuple[str, dict]:
    """Clasificación ordinal de inst: anti si >= INST_THRESHOLD, institucionalista si no."""
    anti = inst >= INST_THRESHOLD  # I3: inst_moderate se expone en el resultado, no cambia el arquetipo

    for key, arch in archetypes.items():
        if arch.get("profile") == profile and arch.get("anti_establishment") == anti:
            return key, arch

    # Fallback: primer arquetipo del perfil
    for key, arch in archetypes.items():
        if arch.get("profile") == profile:
            return key, arch

    return profile.lower(), {}
