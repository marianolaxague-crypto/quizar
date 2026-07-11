# Ajustes UX/UI — Referencia BlossomUp

**Fecha:** 11/07/2026  
**Fuente:** blossomup.co — quiz de brújula política visto en Instagram  
**Referencia visual:** `REFERENCIA/WhatsApp Image 2026-07-11 at 12.10.*.jpeg`

---

## Resumen

Dos tipos de ajuste identificados: uno funcional (pantallas intermedias, impacto directo en completion rate) y uno visual (estética del quiz y el reward). Se documentan por separado para poder implementarlos de forma independiente.

---

## 1. PANTALLAS INTERMEDIAS DE ENGAGEMENT

### Qué son

Pantallas que interrumpen el flujo de preguntas en momentos estratégicos para reforzar el engagement del usuario con un halago sobre sus respuestas. No son data real — son copy diseñado para que el usuario sienta que vale la pena terminar.

### Por qué funcionan

- Reducen el abandono mid-quiz con refuerzo positivo
- Generan curiosidad anticipatoria ("¿cómo termina siendo mi resultado?")
- Hacen sentir al usuario especial/único antes de ver el resultado final
- Quiebran la monotonía de 26 preguntas seguidas

### Diseño de las pantallas (BlossomUp)

- Ilustración flat grande centrada (clipboards, medallas, rompecabezas — vibrante)
- Título bold: frase corta con 1-2 palabras clave en el color de marca
- Párrafo breve explicativo (2-3 líneas)
- Botón "Continuar" full-width al fondo
- Sin barra de progreso visible en estas pantallas

### Propuesta para Brújula AR

**Cuándo insertarlas:** 2 pantallas en momentos calculados del flujo

| Pantalla | Después de pregunta | Trigger |
|----------|--------------------|---------| 
| Intermedia 1 | #9 (1/3 del quiz) | Siempre |
| Intermedia 2 | #19 (3/4 del quiz) | Siempre |

**Copy propuesto (3 variantes por pantalla, elegir 1 al azar):**

Intermedia 1 (~pregunta 9):
- "Tus respuestas ya revelan un patrón claro — más definido que el 70% de los participantes."
- "Estás respondiendo con más consistencia de lo habitual. Eso va a hacer tu resultado más preciso."
- "Tu perfil empieza a tomar forma. Seguí — lo que viene es lo más interesante."

Intermedia 2 (~pregunta 19):
- "Casi terminás. Tu perfil tiene una lógica interna que no encaja en los moldes habituales."
- "Pocas respuestas más. Lo que ya respondiste es suficiente para revelarte algo que no sabías de vos."
- "Tus posiciones no se alinean fácilmente con ningún partido. Eso hace tu resultado más interesante."

**Ilustraciones:** usar ilustraciones flat (SVGs) o emojis grandes como placeholder. Opciones:
- Intermedia 1: brújula / cerebro / lupa
- Intermedia 2: mapa / estrella / rompecabezas

### Estado de implementación

- [ ] Pendiente — primer ítem a trabajar

---

## 2. AJUSTES VISUALES

### 2A — Estética del quiz (quiz.html + quiz-light.css)

**Referencia:** BlossomUp usa fondo blanco puro, tipografía bold flotante sin card, botones con borde fino y mucho aire.

| Elemento | Estado actual | Ajuste propuesto | Prioridad |
|----------|--------------|-----------------|-----------|
| Fondo | Crema (`#F4F1EB`) | **Mantener crema — decisión tomada 11/07/2026** | ✅ Cerrado |
| Pregunta | Texto en card/recuadro | Texto bold flotante sin contenedor, más grande | Alta |
| Botones de respuesta | Borde y relleno actuales | Borde más fino, más padding vertical, texto más gris | Media |
| Barra de progreso | Progress ring coral visible | Barra finísima arriba (1-2px) — menos prominente | Baja |
| Tipografía pregunta | Tamaño actual | Aumentar size, bold más marcado | Alta |

**Nota sobre el fondo:** el crema es parte de la identidad del quiz. Evaluar si vale cambiar a blanco o solo limpiar el layout.

### 2B — Estética del reward (result.html + style.css)

**Referencia:** BlossomUp tiene el resultado ocupando todo el ancho desde arriba, social proof prominente, sin navegación visible.

| Elemento | Estado actual | Ajuste propuesto | Prioridad |
|----------|--------------|-----------------|-----------|
| Hero arquetipo | Imagen + nombre + color wash | Mantener — es el diferencial visual | No tocar |
| Social proof | % de participantes en fold | Moverlo más arriba, más visible antes del primer fold | Media |
| Gap superior | Hay padding/header visible | Reducir — el arquetipo debería impactar desde arriba | Media |
| Tema color | Oscuro (dark) | Evaluar si ir a claro — BlossomUp es blanco en reward | Baja |

### 2C — Loading screen

**Referencia:** BlossomUp usa barras de progreso individuales por dimensión en vez de mensajes rotativos.

| Elemento | Estado actual | Ajuste propuesto | Prioridad |
|----------|--------------|-----------------|-----------|
| Formato | 4 mensajes rotativos 600ms | Barras de progreso por eje (econ/social/inst) | Media |
| Copy | "Compilando...", "Estratificando..." | Mantener tono técnico, adaptar a barras | Media |

---

## Orden de implementación recomendado

1. **Pantallas intermedias** — mayor impacto en completion rate, funcionalidad nueva
2. **Ajustes de tipografía/layout del quiz** — mejora visual inmediata, bajo riesgo
3. **Ajuste de social proof en reward** — reordenamiento de elementos existentes
4. **Loading screen con barras** — mejora de percepción del cálculo
5. **Decisión fondo blanco vs crema** — decisión de identidad, evaluar con piloto

---

## Lo que NO tomamos de BlossomUp

- **Paywall:** modelo incompatible — nuestro resultado es siempre gratuito
- **Formato Likert unipolar:** tenemos EFG 4-point, más riguroso
- **Preguntas con carga política directa:** viola nuestra regla de diseño
- **Apertura de género:** genera fricción innecesaria en Argentina
- **Radar chart del resultado:** ya descartado — imagen del arquetipo es más impactante
