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
  const q   = questions[current];
  const tot = questions.length;

  updateFingerprint(Object.keys(responses).length);

  // Build content
  const wrap = document.createElement("div");
  wrap.style.width = "100%";

  if (q.text_a !== undefined) {
    wrap.appendChild(buildDragSlider(q));
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

// ── Drag Slider — snap a 5 posiciones, responsive ────────────────────
function buildDragSlider(q) {
  const BREAKPOINT = 640;
  const HALF_D = 160; // desktop: px desde centro al extremo
  const HALF_M = 80;  // mobile

  // 5 posiciones de snap (norm: -1 a +1)
  const SNAPS = [
    { norm: -1,   value: 1,    label: "Totalmente", dir: "first",  dot: "snap-t1" },
    { norm: -0.5, value: 2,    label: "Bastante",   dir: "first",  dot: "snap-b1" },
    { norm:  0,   value: null, label: null,          dir: null,     dot: "snap-c"  },
    { norm:  0.5, value: 3,    label: "Bastante",   dir: "second", dot: "snap-b2" },
    { norm:  1,   value: 4,    label: "Totalmente", dir: "second", dot: "snap-t2" },
  ];

  const aIsFirst = q.id in efgPositions
    ? efgPositions[q.id]
    : (efgPositions[q.id] = Math.random() < 0.5);

  const firstText  = aIsFirst ? q.text_a : q.text_b;
  const secondText = aIsFirst ? q.text_b : q.text_a;

  const el = document.createElement("div");
  el.className = "qp-drag-question";
  el.innerHTML = `
    <p class="qp-scenario">${q.scenario || ""}</p>
    <div class="qp-drag-layout">
      <div class="qp-cards-area">
        <div class="qp-drag-card qp-card-first">${firstText}</div>
        <div class="qp-drag-card qp-card-second">${secondText}</div>
      </div>
      <div class="qp-track-wrap">
        <div class="qp-track-line">
          <div class="qp-snap-dot snap-t1"></div>
          <div class="qp-snap-dot snap-b1"></div>
          <div class="qp-snap-dot snap-c"></div>
          <div class="qp-snap-dot snap-b2"></div>
          <div class="qp-snap-dot snap-t2"></div>
        </div>
        <div class="qp-puck">
          <span class="qp-puck-arrow">↔</span>
          <span class="qp-puck-label"></span>
        </div>
      </div>
    </div>
    <button class="qp-escape">No tengo postura sobre este dilema</button>
  `;

  const puck       = el.querySelector(".qp-puck");
  const puckArrow  = el.querySelector(".qp-puck-arrow");
  const puckLabel  = el.querySelector(".qp-puck-label");
  const cardFirst  = el.querySelector(".qp-card-first");
  const cardSecond = el.querySelector(".qp-card-second");
  const dots       = el.querySelectorAll(".qp-snap-dot");

  let isDragging = false;
  let startX = 0, startY = 0;
  let currentSnap = SNAPS[2]; // centro

  function isDesktop() { return window.innerWidth >= BREAKPOINT; }
  function half()      { return isDesktop() ? HALF_D : HALF_M; }

  function nearestSnap(rawOffset) {
    const norm = Math.max(-1, Math.min(1, rawOffset / half()));
    return SNAPS.reduce((best, s) =>
      Math.abs(s.norm - norm) < Math.abs(best.norm - norm) ? s : best
    );
  }

  function applySnap(snap, animate) {
    currentSnap = snap;
    const px = snap.norm * half();
    puck.style.transition = animate ? "transform 0.12s ease" : "none";
    if (isDesktop()) {
      puck.style.transform = `translate(calc(-50% + ${px}px), -50%)`;
    } else {
      puck.style.transform = `translate(-50%, calc(-50% + ${px}px))`;
    }

    dots.forEach((d, i) => d.classList.toggle("active", SNAPS[i] === snap));

    cardFirst.classList.toggle("active", snap.dir === "first");
    cardFirst.classList.toggle("dim",    snap.dir === "second");
    cardSecond.classList.toggle("active", snap.dir === "second");
    cardSecond.classList.toggle("dim",    snap.dir === "first");
    puck.classList.toggle("toward-first",  snap.dir === "first");
    puck.classList.toggle("toward-second", snap.dir === "second");
    puck.classList.toggle("strong", snap.label === "Totalmente");

    if (snap.label) {
      puckLabel.textContent = snap.label;
      puckArrow.style.display = "none";
    } else {
      puckLabel.textContent = "";
      puckArrow.style.display = "";
      puckArrow.textContent = isDesktop() ? "↔" : "↕";
    }
  }

  function onMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const rawOffset = isDesktop()
      ? (e.touches ? e.touches[0].clientX : e.clientX) - startX
      : (e.touches ? e.touches[0].clientY : e.clientY) - startY;
    const snap = nearestSnap(rawOffset);
    if (snap !== currentSnap) applySnap(snap, true);
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup",   onEnd);
    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend",  onEnd);

    if (!currentSnap.value) {
      applySnap(SNAPS[2], true); // snap back to center
      return;
    }
    setTimeout(() => selectAndAdvance(q, currentSnap.value, aIsFirst, el), 220);
  }

  function onStart(e) {
    if (advancing) return;
    isDragging = true;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    startY = e.touches ? e.touches[0].clientY : e.clientY;
    puck.style.transition = "none";
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup",   onEnd);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend",  onEnd);
  }

  puck.addEventListener("mousedown",  onStart);
  puck.addEventListener("touchstart", onStart, { passive: true });

  el.querySelector(".qp-escape").addEventListener("click", () => {
    if (advancing) return;
    selectAndAdvance(q, 0, aIsFirst, el);
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
