def build_question_specs(data: dict) -> dict:
    return {
        q["id"]: {
            "scale": q.get("scale", 4),
            "weights": q.get("weights", {}),
        }
        for q in data.get("questions", [])
    }


def validate_j1_responses(responses: dict, question_specs: dict) -> int:
    valid_count = 0
    answered_axes = set()

    for qid, resp in responses.items():
        if qid not in question_specs:
            raise ValueError(f"Pregunta invalida: {qid}")
        if not isinstance(resp, dict):
            raise ValueError(f"Respuesta invalida para {qid}")
        if "value" not in resp:
            raise ValueError(f"Falta value en {qid}")

        value = resp["value"]
        if not isinstance(value, int) or isinstance(value, bool):
            raise ValueError(f"Value invalido en {qid}")

        a_is_left = resp.get("a_is_left", True)
        if not isinstance(a_is_left, bool):
            raise ValueError(f"a_is_left invalido en {qid}")

        scale = question_specs[qid]["scale"]
        if scale == 4:
            valid_values = {0, 1, 2, 3, 4}
        elif scale == 3:
            valid_values = {0, 1, 2, 3}
        else:
            valid_values = {0, 1, 2, 3, 4, 5}
        if value not in valid_values:
            raise ValueError(f"Value fuera de rango en {qid}")

        if value != 0:
            valid_count += 1
            for axis, weight in question_specs[qid]["weights"].items():
                if weight != 0:
                    answered_axes.add(axis)

    missing_axes = {"econ", "social", "inst"} - answered_axes
    if missing_axes:
        axes = ", ".join(sorted(missing_axes))
        raise ValueError(f"Faltan respuestas validas para eje(s): {axes}")

    return valid_count
