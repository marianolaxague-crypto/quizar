const params = new URLSearchParams(location.search);
const QUIZ_TYPE = params.get("type") || "j1";

let quizData  = null;
let questions = [];
let current   = 0;
let responses = {};
let sessionId = null;
let advancing = false;

// Posición A/B por pregunta (persiste al navegar hacia atrás)
const efgPositions = {};

// ── Selección estratificada ───────────────────────────────────────────
function selectStratified(pool, n) {
  // Agrupar por dimensión y mezclar dentro de cada una
  const byDim = {};
  pool.forEach(q => {
    if (!byDim[q.dimension]) byDim[q.dimension] = [];
    byDim[q.dimension].push(q);
  });
  Object.values(byDim).forEach(arr => arr.sort(() => Math.random() - 0.5));

  const selected = [];
  const dims = Object.keys(byDim);

  // 1 obligatoria por dimensión (hasta n)
  dims.forEach(d => {
    if (selected.length < n && byDim[d].length > 0) {
      selected.push(byDim[d].shift());
    }
  });

  // Rellenar restantes aleatoriamente del pool no usado
  const remaining = Object.values(byDim).flat().sort(() => Math.random() - 0.5);
  while (selected.length < n && remaining.length > 0) {
    selected.push(remaining.shift());
  }

  // Mezclar el orden final
  return selected.sort(() => Math.random() - 0.5);
}

// ── Progress ring ─────────────────────────────────────────────────────
const RING_R    = 42;
const RING_CIRC = +(2 * Math.PI * RING_R).toFixed(2);

function initFingerprint() {
  const svg = document.getElementById("fingerprint");
  if (!svg) return;
  const total = questions.length;
  svg.innerHTML = `
    <circle cx="50" cy="50" r="${RING_R}" fill="none"
      stroke="#E2DDD5" stroke-width="5"/>
    <circle id="ring-arc" cx="50" cy="50" r="${RING_R}" fill="none"
      stroke="#E8651A" stroke-width="5" stroke-linecap="round"
      stroke-dasharray="${RING_CIRC}" stroke-dashoffset="${RING_CIRC}"
      transform="rotate(-90 50 50)"
      style="transition:stroke-dashoffset 0.4s ease"/>
    <text id="ring-num" x="50" y="46" text-anchor="middle"
      font-size="22" font-weight="700" fill="#1C1916"
      font-family="'Segoe UI',system-ui,sans-serif">0</text>
    <text x="50" y="62" text-anchor="middle"
      font-size="11" fill="#9A9187"
      font-family="'Segoe UI',system-ui,sans-serif">/ ${total}</text>
  `;
}

function updateFingerprint(answeredCount) {
  const arc = document.getElementById("ring-arc");
  const num = document.getElementById("ring-num");
  if (!arc || !num) return;
  const progress  = answeredCount / questions.length;
  arc.style.strokeDashoffset = (RING_CIRC * (1 - progress)).toFixed(2);
  num.textContent = answeredCount;
}

// ── Init ──────────────────────────────────────────────────────────────
async function init() {
  const area = document.getElementById("question-area");
  area.innerHTML = `<div class="qp-loading">Cargando...</div>`;

  try {
    sessionId = localStorage.getItem("quiz_session_id");
    if (!sessionId) {
      const r = await fetch("/api/sessions", { method: "POST" });
      if (!r.ok) throw new Error("No se pudo crear sesión");
      sessionId = (await r.json()).session_id;
      localStorage.setItem("quiz_session_id", sessionId);
    }

    const r = await fetch(`/api/quizzes/${QUIZ_TYPE}/questions`);
    if (!r.ok) throw new Error("No se pudieron cargar las preguntas");
    quizData  = await r.json();
    questions = selectStratified(quizData.questions, quizData.total_questions ?? quizData.questions.length);

    initFingerprint();
    renderQuestion();
  } catch (e) {
    document.getElementById("question-area").innerHTML =
      `<div class="qp-error">Error al cargar: ${e.message}. Recargá la página.</div>`;
  }
}

// ── Intermediate engagement screens ──────────────────────────────────
const INTERMEDIATE_AT = [9, 19]; // mostrar cuando current llega a este índice

const INTERMEDIATE_SCREENS = [
  {
    icon: "🧭",
    html: "Tu perfil empieza a <span class=\"qp-intermediate-accent\">tomar forma</span>",
    body: "La mayoría de las personas es más predecible. Tus respuestas muestran más matices de lo que parece."
  },
  {
    icon: "⚡",
    html: "Ya <span class=\"qp-intermediate-accent\">casi</span> está",
    body: "Con lo que respondiste, el sistema puede calcular tu posición. Las últimas preguntas van a afinar el resultado."
  }
];

function showIntermediate(screenIdx) {
  const s    = INTERMEDIATE_SCREENS[screenIdx];
  const area = document.getElementById("question-area");

  const wrap = document.createElement("div");
  wrap.className = "qp-intermediate";
  wrap.innerHTML = `
    <div class="qp-intermediate-icon">${s.icon}</div>
    <h2 class="qp-intermediate-heading">${s.html}</h2>
    <p class="qp-intermediate-body">${s.body}</p>
    <button class="qp-intermediate-btn">Continuar</button>
  `;

  area.classList.add("fading");
  setTimeout(() => {
    area.innerHTML = "";
    area.appendChild(wrap);
    area.classList.remove("fading");
    advancing = false;

    wrap.querySelector(".qp-intermediate-btn").addEventListener("click", () => {
      if (advancing) return;
      advancing = true;
      area.classList.add("fading");
      setTimeout(() => {
        area.classList.remove("fading");
        renderQuestion();
      }, 220);
    });
  }, 220);
}

// ── Render ────────────────────────────────────────────────────────────
function renderQuestion() {
  const q   = questions[current];
  const tot = questions.length;

  updateFingerprint(Object.keys(responses).length);

  // Build content
  const wrap = document.createElement("div");
  wrap.style.width = "100%";

  if (q.text_a !== undefined) {
    wrap.appendChild(buildEFG(q));
  } else if (q.options !== undefined) {
    wrap.appendChild(buildOptions(q));
  } else {
    wrap.appendChild(buildLikert(q));
  }

  // Swap con fade — advancing se resetea SOLO cuando el nuevo contenido está en el DOM
  const area = document.getElementById("question-area");
  area.classList.add("fading");
  setTimeout(() => {
    area.innerHTML = "";
    area.appendChild(wrap);
    area.classList.remove("fading");
    advancing = false;  // recién acá se habilitan los clicks
  }, 220);
}

// ── EFG — Elección Forzada Graduada (4-point) ────────────────────────
function buildEFG(q) {
  const aIsLeft  = q.id in efgPositions
    ? efgPositions[q.id]
    : (efgPositions[q.id] = Math.random() < 0.5);

  const textA = q.stem ? `${q.stem} ${q.text_a}` : q.text_a;
  const textB = q.stem ? `${q.stem} ${q.text_b}` : q.text_b;
  // Texto de cada polo según posición randomizada
  const topText = aIsLeft ? textA : textB;    // valores 1 y 2
  const botText = aIsLeft ? textB : textA;    // valores 3 y 4
  const saved   = responses[q.id]?.value ?? null;

  // value: 1=Claramente A, 2=Más bien A, 3=Más bien B, 4=Claramente B
  // Si A está a la izquierda: top=A (1,2), bot=B (3,4)
  // Si A está a la derecha:   top=B (1,2 también mapeados como strong/soft top)
  // → el backend recibe {value, a_is_left} y normaliza

  const el = document.createElement("div");
  el.className = "qp-efg";
  el.innerHTML = `
    <p class="qp-instruction">¿Con cuál de estas afirmaciones te identificás más?</p>
    <div class="qp-4btn-stack">
      <button class="qp-4btn qp-4btn-strong${saved === 1 ? ' selected' : ''}" data-v="1">
        <span class="qp-4btn-chip">Claramente</span>
        <span class="qp-4btn-text">${topText}</span>
      </button>
      <button class="qp-4btn qp-4btn-soft${saved === 2 ? ' selected' : ''}" data-v="2">
        <span class="qp-4btn-chip">Más bien</span>
        <span class="qp-4btn-text">${topText}</span>
      </button>
      <div class="qp-4btn-divider"></div>
      <button class="qp-4btn qp-4btn-soft${saved === 3 ? ' selected' : ''}" data-v="3">
        <span class="qp-4btn-chip">Más bien</span>
        <span class="qp-4btn-text">${botText}</span>
      </button>
      <button class="qp-4btn qp-4btn-strong${saved === 4 ? ' selected' : ''}" data-v="4">
        <span class="qp-4btn-chip">Claramente</span>
        <span class="qp-4btn-text">${botText}</span>
      </button>
    </div>
    <button class="qp-escape${saved === 0 ? ' selected' : ''}" data-v="0">
      No tengo postura sobre este dilema
    </button>
  `;

  el.querySelectorAll("[data-v]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (advancing) return;
      selectAndAdvance(q, parseInt(btn.dataset.v), aIsLeft, el);
    });
  });

  return el;
}

function selectAndAdvance(q, v, aIsLeft, container) {
  if (advancing) return;
  advancing = true;
  responses[q.id] = { value: v, a_is_left: aIsLeft };
  try { localStorage.setItem("quiz_responses", JSON.stringify(responses)); } catch (_) {}

  // Highlight visualmente el botón seleccionado
  container.querySelectorAll(".qp-choice").forEach(b => {
    b.classList.toggle("selected", parseInt(b.dataset.v) === v);
  });

  // Avance automático
  const delay = 380;
  setTimeout(() => {
    if (current < questions.length - 1) {
      current++;
      const interIdx = INTERMEDIATE_AT.indexOf(current);
      if (interIdx !== -1) {
        showIntermediate(interIdx);
      } else {
        renderQuestion();
      }
    } else {
      submitQuiz();
    }
  }, delay);
}

// ── Likert legacy ─────────────────────────────────────────────────────
function buildLikert(q) {
  const saved = responses[q.id];
  const wrap = document.createElement("div");
  wrap.className = "qp-efg";
  wrap.innerHTML = `
    <p class="qp-instruction">${q.text || ""}</p>
    <div class="qp-scale-wrap">
      <div class="qp-scale-track">
        ${[1,2,3,4,5].map(v =>
          `<div class="qp-dot${saved === v ? ' selected' : ''}" data-v="${v}"></div>`
        ).join("")}
      </div>
      <div class="qp-scale-labels">
        <span>Desacuerdo</span><span>Neutral</span><span>Acuerdo</span>
      </div>
    </div>
  `;
  wrap.querySelectorAll(".qp-dot").forEach(dot => {
    dot.addEventListener("click", () => {
      if (advancing) return;
      const v = parseInt(dot.dataset.v);
      advancing = true;
      responses[q.id] = v;
      wrap.querySelectorAll(".qp-dot").forEach(d =>
        d.classList.toggle("selected", parseInt(d.dataset.v) === v)
      );
      setTimeout(() => {
        advancing = false;
        if (current < questions.length - 1) { current++; renderQuestion(); }
        else submitQuiz();
      }, 420);
    });
  });
  return wrap;
}

// ── Options (party/candidate) ─────────────────────────────────────────
function buildOptions(q) {
  const saved = responses[q.id];
  const wrap = document.createElement("div");
  wrap.className = "qp-efg";
  wrap.innerHTML = `
    <p class="qp-instruction">${q.text || ""}</p>
    <div class="qp-options">
      ${q.options.map(opt =>
        `<button class="qp-option-btn${saved === opt.id ? ' selected' : ''}" data-id="${opt.id}">${opt.text}</button>`
      ).join("")}
    </div>`;
  wrap.querySelectorAll(".qp-option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (advancing) return;
      advancing = true;
      responses[q.id] = btn.dataset.id;
      wrap.querySelectorAll(".qp-option-btn").forEach(b =>
        b.classList.toggle("selected", b.dataset.id === btn.dataset.id)
      );
      setTimeout(() => {
        advancing = false;
        if (current < questions.length - 1) { current++; renderQuestion(); }
        else submitQuiz();
      }, 420);
    });
  });
  return wrap;
}

// ── Navegación manual ─────────────────────────────────────────────────
function prevQuestion() {
  if (advancing || current === 0) return;
  current--;
  renderQuestion();
}

// ── Submit ────────────────────────────────────────────────────────────
async function submitQuiz() {
  const area = document.getElementById("question-area");
  area.innerHTML = `<div class="qp-loading">Calculando tu resultado...</div>`;

  try {
    const r = await fetch(`/api/quiz/${QUIZ_TYPE}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, responses })
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      throw new Error(err.detail || "Error al enviar");
    }
    const result = await r.json();
    sessionStorage.setItem("quiz_result", JSON.stringify(result));
    showVotingIntention();
  } catch (e) {
    area.innerHTML = `<div class="qp-error">${e.message} — <button onclick="submitQuiz()" style="text-decoration:underline;background:none;border:none;cursor:pointer;color:inherit">Reintentar</button></div>`;
    advancing = false;
  }
}

// ── Intención de voto ─────────────────────────────────────────────────
const PARTIES = [
  { id: "LLA",    label: "La Libertad Avanza" },
  { id: "PRO",    label: "PRO / Juntos" },
  { id: "UCR",    label: "UCR / Radicalismo" },
  { id: "UxP",    label: "Unión por la Patria" },
  { id: "PJ",     label: "Peronismo / PJ" },
  { id: "FIT",    label: "FIT-Unidad / Izquierda" },
  { id: "otro",   label: "Otro partido" },
  { id: "blanco", label: "Voto en blanco / No voto" },
];

function showVotingIntention() {

  const area = document.getElementById("question-area");
  const wrap = document.createElement("div");
  wrap.className = "qp-vote-screen";
  wrap.innerHTML = `
    <p class="qp-instruction">Una pregunta más</p>
    <h2 class="qp-vote-title">¿A quién votarías hoy si hubiera elecciones?</h2>
    <p class="qp-vote-sub">Opcional · Nos ayuda a comparar perfiles con intenciones reales</p>
    <div class="qp-vote-grid">
      ${PARTIES.map(p => `<button class="qp-vote-btn" data-party="${p.id}">${p.label}</button>`).join("")}
    </div>
    <button class="qp-skip-btn" onclick="goToResult(null)">Prefiero no responder →</button>
  `;

  area.classList.add("fading");
  setTimeout(() => {
    area.innerHTML = "";
    area.appendChild(wrap);
    area.classList.remove("fading");
    wrap.querySelectorAll(".qp-vote-btn").forEach(btn => {
      btn.addEventListener("click", () => goToResult(btn.dataset.party));
    });
  }, 220);
}

async function goToResult(party) {
  if (party) {
    sessionStorage.setItem("voting_intention", party);
    try {
      const r = await fetch(`/api/quiz/${QUIZ_TYPE}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, voting_intention: party })
      });
      if (r.ok) {
        const data = await r.json();
        if (data.nearby_stats) sessionStorage.setItem("nearby_vote_stats", JSON.stringify(data.nearby_stats));
      }
    } catch (e) { /* no bloquear */ }
  } else {
    sessionStorage.removeItem("voting_intention");
    sessionStorage.removeItem("nearby_vote_stats");
  }
  location.href = `/result?type=${QUIZ_TYPE}`;
}

init();
