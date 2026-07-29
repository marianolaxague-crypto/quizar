"""
Simulación masiva de respuestas — Brújula Ideológica v6.1

Genera respondentes sintéticos con distintos sesgos ideológicos,
corre cada set por el scoring engine y produce un reporte de validación.

Uso:
  python scripts/simulate.py
  python scripts/simulate.py --n 1000 --noise 0.2 --seed 99

Argumentos:
  --n      Respondentes por perfil ideológico (default: 500)
  --noise  Fracción de respuestas aleatorias 0=puro 1=caos (default: 0.3)
  --seed   Semilla para reproducibilidad (default: 42)
"""

import sys
import json
import random
import argparse
from pathlib import Path
from collections import Counter, defaultdict

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))

from backend.scoring.j1_brujula import score_brujula, CENTER_THRESHOLD, INST_THRESHOLD

with open(ROOT / "backend/data/j1/brujula.json", encoding="utf-8") as f:
    QUIZ_DATA = json.load(f)

QUESTIONS = QUIZ_DATA["questions"]


# ── Perfiles ideológicos de referencia ───────────────────────────────────────
# econ:  +1 = privatista,       -1 = estatista
# social: +1 = conservador,     -1 = progresista
# inst:  +1 = anti-establishment, -1 = institucionalista

IDEOLOGICAL_PROFILES = {
    "Aleatorio":              {"econ":  0.0, "social":  0.0, "inst":  0.0},
    "PP_Institucionalista":   {"econ": +1.0, "social": -1.0, "inst": -1.0},
    "PP_Anti-est":            {"econ": +1.0, "social": -1.0, "inst": +1.0},
    "PC_Institucionalista":   {"econ": +1.0, "social": +1.0, "inst": -1.0},
    "PC_Anti-est":            {"econ": +1.0, "social": +1.0, "inst": +1.0},
    "EP_Institucionalista":   {"econ": -1.0, "social": -1.0, "inst": -1.0},
    "EP_Anti-est":            {"econ": -1.0, "social": -1.0, "inst": +1.0},
    "EC_Institucionalista":   {"econ": -1.0, "social": +1.0, "inst": -1.0},
    "EC_Anti-est":            {"econ": -1.0, "social": +1.0, "inst": +1.0},
    "Centro_puro":            {"econ": +0.1, "social": +0.1, "inst":  0.0},
    "Solo_econ":              {"econ": +1.0, "social":  0.0, "inst":  0.0},
    "Solo_social":            {"econ":  0.0, "social": +1.0, "inst":  0.0},
    "Solo_inst":              {"econ":  0.0, "social":  0.0, "inst": +1.0},
}

# Arquetipos esperados para cada perfil ideológico
EXPECTED_ARCHETYPE = {
    "PP_Institucionalista":  "liberal_cosmopolita",
    "PP_Anti-est":           "libertario_de_autonomia",
    "PC_Institucionalista":  "republicano_de_orden",
    "PC_Anti-est":           "conservador_rebelde",
    "EP_Institucionalista":  "colectivista_transformador",
    "EP_Anti-est":           "colectivista_rebelde",
    "EC_Institucionalista":  "comunitarista_tradicional",
    "EC_Anti-est":           "soberanista_nacionalista",
}


# ── Generación de respuestas sintéticas ──────────────────────────────────────

def generate_responses(bias: dict, noise: float) -> dict:
    """
    Genera un set de respuestas para los 19 ítems según un sesgo ideológico.

    bias: {"econ": float, "social": float, "inst": float}  en [-1, +1]
    noise: fracción de respuestas completamente aleatorias

    NOTA sobre a_is_left: el scoring usa el valor EFECTIVO = value si a_is_left,
    5-value si no. Para expresar pole_a (centered positivo) se necesita
    effective value bajo (1-2), que se logra con:
      - a_is_left=True  → value 1-2
      - a_is_left=False → value 3-4  (porque effective = 5-3=2, 5-4=1)
    """
    responses = {}
    for q in QUESTIONS:
        a_is_left = random.random() > 0.5

        # Señal: positivo = quiero pole_a (centered positivo), negativo = pole_b
        signal = sum(bias.get(ax, 0) * w for ax, w in q["weights"].items() if w != 0)

        if random.random() > noise and signal != 0:
            want_pole_a = signal > 0
            # Para effective bajo (pole_a): value bajo si a_is_left, value alto si no
            if want_pole_a == a_is_left:
                value = random.choices([1, 2, 3, 4], weights=[4, 3, 1, 1])[0]
            else:
                value = random.choices([1, 2, 3, 4], weights=[1, 1, 3, 4])[0]
        else:
            value = random.randint(1, 4)

        responses[q["id"]] = {"value": value, "a_is_left": a_is_left}

    return responses


# ── Estadísticas ─────────────────────────────────────────────────────────────

def mean(values):
    return sum(values) / len(values) if values else 0.0

def std(values):
    if len(values) < 2:
        return 0.0
    m = mean(values)
    return (sum((x - m) ** 2 for x in values) / len(values)) ** 0.5


# ── Simulación ────────────────────────────────────────────────────────────────

def run_simulation(n_per_profile: int, noise: float, seed: int):
    random.seed(seed)
    all_results = []
    profile_results = defaultdict(list)

    for profile_name, bias in IDEOLOGICAL_PROFILES.items():
        for _ in range(n_per_profile):
            responses = generate_responses(bias, noise)
            result = score_brujula(responses)
            result["_sim_profile"] = profile_name
            all_results.append(result)
            profile_results[profile_name].append(result)

    return all_results, profile_results


# ── Reporte ───────────────────────────────────────────────────────────────────

def report(all_results, profile_results, n_per_profile, noise):
    total = len(all_results)
    sep = "─" * 70

    print("=" * 70)
    print("SIMULACIÓN — BRÚJULA IDEOLÓGICA v6.1")
    print(f"{total:,} respondentes · {n_per_profile:,} por perfil · noise={noise}")
    print(f"CENTER_THRESHOLD={CENTER_THRESHOLD} · INST_THRESHOLD={INST_THRESHOLD}")
    print("=" * 70)

    # ── 1. Distribución global de perfiles ───────────────────────────────────
    print(f"\n{'── 1. DISTRIBUCIÓN GLOBAL DE PERFILES ':─<70}")
    profile_counts = Counter(r["profile"] for r in all_results)
    for profile, count in sorted(profile_counts.items(), key=lambda x: -x[1]):
        pct = count / total * 100
        bar = "█" * int(pct / 2)
        print(f"  {profile:6}  {count:6,} ({pct:5.1f}%)  {bar}")

    # ── 2. Distribución de arquetipos ────────────────────────────────────────
    print(f"\n{'── 2. DISTRIBUCIÓN DE ARQUETIPOS ':─<70}")
    arch_counts = Counter(r["archetype"] for r in all_results)
    all_archetypes = set(QUIZ_DATA["archetypes"].keys())
    missing = all_archetypes - set(arch_counts.keys())

    for arch, count in sorted(arch_counts.items(), key=lambda x: -x[1]):
        pct = count / total * 100
        bar = "█" * int(pct / 2)
        print(f"  {arch:40} {count:6,} ({pct:5.1f}%)  {bar}")

    if missing:
        print(f"\n  ⚠️  ARQUETIPOS NO ALCANZADOS: {', '.join(missing)}")
    else:
        print("\n  ✅ Todos los arquetipos fueron alcanzados al menos una vez")

    # ── 3. Scores por eje (muestra aleatoria) ────────────────────────────────
    print(f"\n{'── 3. SCORES POR EJE — MUESTRA ALEATORIA ':─<70}")
    random_results = profile_results["Aleatorio"]
    for axis in ["econ", "social", "inst"]:
        scores = [r[axis] for r in random_results]
        print(f"  {axis:8}  media={mean(scores):+6.1f}  σ={std(scores):5.1f}  "
              f"min={min(scores):+6.1f}  max={max(scores):+6.1f}")

    # ── 4. Reachability por perfil ────────────────────────────────────────────
    print(f"\n{'── 4. REACHABILITY — PERFIL ASIGNADO VS. ESPERADO ':─<70}")
    print(f"  {'Perfil simulado':25} {'econ':>7} {'social':>7} {'inst':>7}  "
          f"{'Más freq':30}  {'Éxito':>6}")
    print(f"  {'─'*25} {'─'*7} {'─'*7} {'─'*7}  {'─'*30}  {'─'*6}")

    hits = 0
    total_expected = 0
    for name, results in profile_results.items():
        econ_m = mean([r["econ"] for r in results])
        soc_m = mean([r["social"] for r in results])
        inst_m = mean([r["inst"] for r in results])
        arch_c = Counter(r["archetype"] for r in results)
        most_freq = arch_c.most_common(1)[0][0] if arch_c else "N/A"
        freq_pct = arch_c.most_common(1)[0][1] / len(results) * 100 if arch_c else 0

        expected = EXPECTED_ARCHETYPE.get(name)
        if expected:
            total_expected += 1
            ok = "✅" if most_freq == expected else f"❌ (esp: {expected[:20]})"
            if most_freq == expected:
                hits += 1
        else:
            ok = "─"

        print(f"  {name:25} {econ_m:+7.1f} {soc_m:+7.1f} {inst_m:+7.1f}  "
              f"{most_freq[:28]:30}  {ok}")

    if total_expected > 0:
        print(f"\n  Arquetipos correctos: {hits}/{total_expected} "
              f"({hits/total_expected*100:.0f}%)")

    # ── 5. Análisis de thresholds ────────────────────────────────────────────
    print(f"\n{'── 5. VALIDACIÓN DE THRESHOLDS ':─<70}")

    centro_n = sum(1 for r in random_results if r["profile"] == "C")
    pct_centro = centro_n / len(random_results) * 100
    inst_mod_n = sum(1 for r in random_results if r.get("inst_moderate", False))
    pct_inst_mod = inst_mod_n / len(random_results) * 100

    print(f"  CENTER_THRESHOLD = {CENTER_THRESHOLD}")
    print(f"    Aleatorios en Centro: {centro_n}/{len(random_results)} ({pct_centro:.1f}%)")
    if pct_centro > 35:
        print(f"    ⚠️  Muy amplio — más del 35% aleatorio cae en Centro")
    elif pct_centro < 5:
        print(f"    ⚠️  Muy estrecho — menos del 5% aleatorio cae en Centro")
    else:
        print(f"    ✅ Rango razonable")

    print(f"\n  INST_THRESHOLD = {INST_THRESHOLD}")
    print(f"    Aleatorios con inst_moderate: {inst_mod_n}/{len(random_results)} ({pct_inst_mod:.1f}%)")
    if pct_inst_mod > 60:
        print(f"    ⚠️  Muy amplio — más del 60% aleatorio cae en inst_moderate")
    elif pct_inst_mod < 20:
        print(f"    ⚠️  Muy estrecho — menos del 20% aleatorio cae en inst_moderate")
    else:
        print(f"    ✅ Rango razonable")

    # ── 6. Dispersión de scores con máximo sesgo ─────────────────────────────
    print(f"\n{'── 6. RANGO DE SCORES CON SESGO MÁXIMO (noise=0) ':─<70}")
    random.seed(0)
    for name, bias in [
        ("PP puro", {"econ": +1.0, "social": -1.0, "inst": -1.0}),
        ("EC puro", {"econ": -1.0, "social": +1.0, "inst": -1.0}),
    ]:
        scores_e, scores_s, scores_i = [], [], []
        for _ in range(200):
            r = score_brujula(generate_responses(bias, noise=0.0))
            scores_e.append(r["econ"])
            scores_s.append(r["social"])
            scores_i.append(r["inst"])
        print(f"  {name}: econ={mean(scores_e):+.1f} social={mean(scores_s):+.1f} "
              f"inst={mean(scores_i):+.1f}  "
              f"(econ σ={std(scores_e):.1f})")

    print("\n" + "=" * 70)
    print("FIN")
    print("=" * 70)


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Simula respuestas masivas para validar el scoring engine.")
    parser.add_argument("--n",     type=int,   default=500, help="Respondentes por perfil (default: 500)")
    parser.add_argument("--noise", type=float, default=0.3, help="Fracción aleatoria 0=puro 1=caos (default: 0.3)")
    parser.add_argument("--seed",  type=int,   default=42,  help="Semilla (default: 42)")
    args = parser.parse_args()

    print(f"Simulando {args.n * len(IDEOLOGICAL_PROFILES):,} respondentes...")
    all_results, profile_results = run_simulation(args.n, args.noise, args.seed)
    report(all_results, profile_results, args.n, args.noise)
