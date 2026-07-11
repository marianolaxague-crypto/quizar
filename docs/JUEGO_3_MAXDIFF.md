# Juego 3 — MaxDiff de Candidatos

## Pregunta central
> "¿A quién preferís como figura política?"

## Qué ES
- MaxDiff (Best-Worst Scaling): el usuario elige el MEJOR y PEOR de cada set
- Evalúa personas, no ideas ni posiciones
- Output: ranking personal de preferencia entre 20 figuras políticas

## Qué NO ES
- No pregunta qué piensa el candidato sobre ningún tema
- No mide ideología ni valores
- No recomienda a quién votar
- No hace política comparada (no habla de propuestas)

## Diseño técnico

| Parámetro | Valor |
|-----------|-------|
| N candidatos | 20 |
| Tamaño del set | 4 |
| N tareas | 20 |
| Apariciones por candidato | ~4 |

## Algoritmo de scoring
Score = (veces elegido mejor - veces elegido peor) / apariciones totales
→ normalizado a [-100, 100]

## Banco de candidatos (20)
Milei, Bullrich, Macri, Larreta, Vidal, Morales, Lousteau, Frigerio,
Massa, Scioli, CFK, Kicillof, Grabois, Bregman, Del Caño,
Villarruel, Adorni, Caputo, Pichetto, Schiaretti

## Reward / Comparación
- Ranking personal de los 20 (score de cada uno)
- "El X% de los jugadores también puso a [candidato] en su top 3"
- Ranking agregado de todos los jugadores
- Ancla post-resultado: "¿A quién votarías hoy?" (partido o candidato)

## Archivos
- Candidatos: `backend/data/j3/candidates.json`
- Diseño del MaxDiff (sets): `backend/data/j3/design.json` (a generar)
- Scoring: `backend/scoring/j3_maxdiff.py`
- Frontend: `frontend/games/j3/`

## Estado
- [x] Lista de 20 candidatos
- [x] Engine de scoring (Thurstone Case V simplificado)
- [ ] Generar diseño experimental (sets balanceados)
- [ ] Frontend quiz flow (interfaz best-worst)
- [ ] Frontend pantalla de resultado con ranking
