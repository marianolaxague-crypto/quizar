const params = new URLSearchParams(location.search);
const QUIZ_TYPE = params.get("type") || "j1";

// ── Intro config por tipo de juego ────────────────────────────────────
const INTRO_CONFIG = {
  j1: {
    icon: "🧭",
    title: "Brújula Ideológica",
    steps: [
      "Vas a ver <strong>19 situaciones cotidianas</strong>, una por vez.",
      "En cada una aparecen <strong>dos posturas posibles</strong>. Elegí cuál te representa más — y con qué intensidad.",
      "Si ninguna aplica, podés indicar que no tenés postura."
    ],
    reward: "Tu posición en el mapa político argentino + tu arquetipo ideológico",
    cta: "Empezar · 4 min"
  }
};

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

// ── Intro screen ─────────────────────────────────────────────────────
function showIntro() {
  const cfg = INTRO_CONFIG[QUIZ_TYPE] || INTRO_CONFIG.j1;
  const area = document.getElementById("question-area");

  const wrap = document.createElement("div");
  wrap.className = "qp-intro";
  wrap.innerHTML = `
    <div class="qp-intro-icon">${cfg.icon}</div>
    <h1 class="qp-intro-title">${cfg.title}</h1>
    <div class="qp-intro-steps">
      ${cfg.steps.map(s => `<div class="qp-intro-step">${s}</div>`).join("")}
    </div>
    <div class="qp-intro-reward">
      <span class="qp-intro-reward-label">Al final recibís</span>
      <span class="qp-intro-reward-text">${cfg.reward}</span>
    </div>
    <button class="qp-intro-btn" id="intro-start-btn">${cfg.cta}</button>
  `;
  area.appendChild(wrap);

  document.getElementById("intro-start-btn").addEventListener("click", () => {
    const ringRow = document.getElementById("ring-row");
    if (ringRow) ringRow.style.visibility = "visible";
    area.classList.add("fading");
    setTimeout(() => { area.classList.remove("fading"); init(); }, 220);
  });
}

// ── Back button ───────────────────────────────────────────────────────
function updateBackBtn() {
  const btn = document.getElementById("back-btn");
  if (!btn) return;
  btn.style.visibility = current > 0 ? "visible" : "hidden";
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
const INTERMEDIATE_AT = [6, 13]; // mostrar cuando current llega a este índice (19 preguntas)

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
  const q = questions[current];

  updateFingerprint(Object.keys(responses).length);
  updateBackBtn();

  const wrap = document.createElement("div");
  wrap.style.width = "100%";

  if (q.text_a !== undefined) {
    wrap.appendChild(buildFiveButtons(q));
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

// ── 5-Button layout — Muy / Algo / No tengo postura / Algo / Muy ──────
function buildFiveButtons(q) {
  const aIsFirst = q.id in efgPositions
    ? efgPositions[q.id]
    : (efgPositions[q.id] = Math.random() < 0.5);

  const firstText  = aIsFirst ? q.text_a : q.text_b;
  const secondText = aIsFirst ? q.text_b : q.text_a;

  const el = document.createElement("div");
  el.className = "qp-5btn-question";

  if (q.scenario) {
    const sc = document.createElement("p");
    sc.className = "qp-scenario";
    sc.textContent = q.scenario;
    el.appendChild(sc);
  }

  const sep = document.createElement("div");
  sep.className = "qp-5btn-separator";
  sep.textContent = "¿Con cuál te identificás más?";
  el.appendChild(sep);

  const layout = document.createElement("div");
  layout.className = "qp-5btn-layout";
  layout.innerHTML = `
    <div class="qp-5btn-card">${firstText}</div>
    <button class="qp-5btn qp-5btn-strong" data-v="1">Muy identificado</button>
    <button class="qp-5btn qp-5btn-soft"   data-v="2">Algo identificado</button>
    <button class="qp-5btn qp-5btn-neutral" data-v="0">· No tengo postura ·</button>
    <button class="qp-5btn qp-5btn-soft"   data-v="3">Algo identificado</button>
    <button class="qp-5btn qp-5btn-strong" data-v="4">Muy identificado</button>
    <div class="qp-5btn-card">${secondText}</div>
  `;
  el.appendChild(layout);

  layout.querySelectorAll(".qp-5btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (advancing) return;
      const v = parseInt(btn.dataset.v);
      layout.querySelectorAll(".qp-5btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      setTimeout(() => selectAndAdvance(q, v, aIsFirst, el), 300);
    });
  });

  return el;
}

function selectAndAdvance(q, v, aIsLeft, container) {
  if (advancing) return;
  advancing = true;
  responses[q.id] = { value: v, a_is_left: aIsLeft };
  try { localStorage.setItem("quiz_responses", JSON.stringify(responses)); } catch (_) {}

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
  const backBtn = document.getElementById("back-btn");
  if (backBtn) backBtn.style.visibility = "hidden";

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

showIntro();
