const params = new URLSearchParams(location.search);
const QUIZ_TYPE = params.get("type") || "j1";

const PROFILE_COLORS = { EP: "#E53935", EC: "#1565C0", PC: "#F9A825", PP: "#7B1FA2", C: "#78909C" };

// F3: cuadrantes en tono crema desaturado — sin carga política
const COMPASS_QUADRANT_COLORS = {
  NE: "#EDEAE2",  // privatista + conservador
  NW: "#E7EDEA",  // estatista + conservador
  SE: "#EBE6DF",  // privatista + progresista
  SW: "#E4E9E6"   // estatista + progresista
};

const DIM_LABELS = {
  individualismo:          "Individualismo",
  meritocracia:            "Meritocracia",
  modelo_economico:        "Modelo económico",
  tradicion:               "Tradición / Orden",
  autoridad:               "Autoridad",
  localismo:               "Localismo",
  derechos_autonomia:      "Autonomía personal",
  laicismo:                "Laicismo",
  migracion:               "Apertura migratoria",
  antiestablishment:       "Anti-establishment",
  confianza_institucional: "Confianza institucional"
};

const DIM_POLES = {
  individualismo:          { neg: "Comunitario",       pos: "Individualista" },
  meritocracia:            { neg: "Estructuralista",   pos: "Meritocrático" },
  modelo_economico:        { neg: "Redistributivo",    pos: "Liberal" },
  tradicion:               { neg: "Aperturista",       pos: "Tradicional" },
  autoridad:               { neg: "Horizontal",        pos: "Jerárquico" },
  localismo:               { neg: "Cosmopolita",       pos: "Localista" },
  derechos_autonomia:      { pos: "Autonomía",         neg: "Marco comunitario" },
  laicismo:                { pos: "Laico",             neg: "Religioso" },
  migracion:               { pos: "Apertura",          neg: "Prioridad nacional" },
  antiestablishment:       { pos: "Institucionalista", neg: "Anti-establishment" },
  confianza_institucional: { pos: "Institucionalista", neg: "Anti-establishment" }
};

const PARTY_LABELS = {
  LLA: "La Libertad Avanza", PRO: "PRO / Juntos", UCR: "UCR / Radicalismo",
  UxP: "Unión por la Patria", PJ: "Peronismo / PJ", FIT: "FIT-Unidad",
  otro: "Otro partido", blanco: "Voto en blanco / No voto"
};

// ── Módulo demográfico ────────────────────────────────────────────────

const PROVINCES = [
  "Buenos Aires (provincia)", "CABA", "Catamarca", "Chaco", "Chubut",
  "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa",
  "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta",
  "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
  "Tierra del Fuego", "Tucumán"
];

const DEMO_QUESTIONS = [
  {
    key: "sexo",
    label: "¿Con cuál de estas opciones te identificás?",
    options: ["Hombre", "Mujer", "No binario", "Prefiero no responder"]
  },
  {
    key: "edad_rango",
    label: "¿Qué rango de edad te corresponde?",
    options: ["16-24", "25-34", "35-44", "45-59", "60+", "Prefiero no responder"]
  },
  {
    key: "provincia",
    label: "¿En qué provincia o distrito vivís?",
    type: "select",
    options: PROVINCES
  },
  {
    key: "nivel_educativo",
    label: "¿Cuál es tu nivel educativo?",
    options: ["Educación primaria", "Educación secundaria", "Educación superior", "Prefiero no responder"]
  },
  {
    key: "ingreso_familiar",
    label: "¿Cuál es el ingreso mensual de tu hogar?",
    options: [
      "Menos de $630.000",
      "$630.000–$1.000.000",
      "$1.000.000–$1.500.000",
      "$1.500.000–$2.200.000",
      "$2.200.000–$3.000.000",
      "Más de $3.000.000",
      "Prefiero no responder"
    ]
  }
];

const _demoAnswers = {};

function _demoAllAnswered() {
  return DEMO_QUESTIONS.every(q => _demoAnswers[q.key]);
}

function _demoUpdateBtn() {
  const btn = document.getElementById("demo-submit-btn");
  if (btn) btn.disabled = !_demoAllAnswered();
}

function _buildDemoQuestionHTML(q, idx) {
  if (q.type === "select") {
    const opts = q.options.map(p =>
      `<option value="${p}">${p}</option>`
    ).join("");
    return `
      <div class="demo-q" data-key="${q.key}">
        <div class="demo-q-label">${idx + 1}. ${q.label}</div>
        <select class="demo-select" onchange="
          _demoAnswers['${q.key}'] = this.value || null;
          _demoUpdateBtn();
        ">
          <option value="">Seleccioná una opción</option>
          ${opts}
          <option value="Prefiero no responder">Prefiero no responder</option>
        </select>
      </div>`;
  }
  const chips = q.options.map(opt => `
    <button class="demo-chip" onclick="
      _demoAnswers['${q.key}'] = '${opt}';
      this.closest('.demo-chips').querySelectorAll('.demo-chip').forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      _demoUpdateBtn();
    ">${opt}</button>`).join("");
  return `
    <div class="demo-q" data-key="${q.key}">
      <div class="demo-q-label">${idx + 1}. ${q.label}</div>
      <div class="demo-chips">${chips}</div>
    </div>`;
}

async function _submitDemographics() {
  const sessionId = localStorage.getItem("quiz_session_id");
  if (!sessionId) { _closeDemoOverlay(); return; }
  const btn = document.getElementById("demo-submit-btn");
  if (btn) { btn.disabled = true; btn.textContent = "Guardando..."; }
  try {
    await fetch("/api/demographics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, ..._demoAnswers })
    });
  } catch (_) { /* silencioso — no bloquear al usuario */ }
  _closeDemoOverlay();
}

function _closeDemoOverlay() {
  const overlay = document.getElementById("demo-overlay");
  if (overlay) {
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 300);
  }
}

function showDemographicsOverlay() {
  const questionsHTML = DEMO_QUESTIONS.map((q, i) => _buildDemoQuestionHTML(q, i)).join("");
  const overlay = document.createElement("div");
  overlay.id = "demo-overlay";
  overlay.className = "demo-overlay";
  overlay.innerHTML = `
    <div class="demo-card">
      <div class="demo-header">
        <div class="demo-title">Un último paso</div>
        <div class="demo-subtitle">Ayudanos a que los datos representen a todos los argentinos.</div>
      </div>
      <div class="demo-questions">${questionsHTML}</div>
      <button id="demo-submit-btn" class="demo-btn" disabled onclick="_submitDemographics()">
        Continuar
      </button>
    </div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => { overlay.style.opacity = "1"; });
}

async function maybeShowDemographics() {
  if (!location.pathname.startsWith("/result")) return;
  const sessionId = localStorage.getItem("quiz_session_id");
  if (!sessionId) return;
  try {
    const r = await fetch(`/api/demographics/${sessionId}/exists`);
    const { exists } = await r.json();
    if (!exists) showDemographicsOverlay();
  } catch (_) { /* silencioso */ }
}

// ── F4: Loading screen ────────────────────────────────────────────────
const LOADING_STEPS = [
  "Analizando eje Económico",
  "Mapeando valores socioculturales",
  "Midiendo posición institucional",
  "Determinando tu arquetipo"
];

function runLoadingScreen(wrapper) {
  return new Promise(resolve => {
    wrapper.innerHTML = `
      <div class="result-loading">
        <p class="result-loading-title">Calculando tu resultado</p>
        <div class="result-loading-steps">
          ${LOADING_STEPS.map((label, i) => `
            <div class="rls-step" id="rls-${i}">
              <div class="rls-label">${label}</div>
              <div class="rls-track"><div class="rls-fill" id="rls-fill-${i}"></div></div>
            </div>`).join("")}
        </div>
      </div>`;

    function runStep(idx) {
      if (idx >= LOADING_STEPS.length) { setTimeout(resolve, 300); return; }
      const step = document.getElementById(`rls-${idx}`);
      const fill = document.getElementById(`rls-fill-${idx}`);
      if (step) step.classList.add("active");
      setTimeout(() => {
        if (fill) fill.style.width = "100%";
        setTimeout(() => {
          if (step) step.classList.remove("active");
          runStep(idx + 1);
        }, 560);
      }, 60);
    }

    runStep(0);
  });
}

// ── Init ──────────────────────────────────────────────────────────────
async function init() {
  const raw = window.__QUIZ_RESULT__
    ? JSON.stringify(window.__QUIZ_RESULT__)
    : sessionStorage.getItem("quiz_result");
  if (!raw) { location.href = "/quiz?type=" + QUIZ_TYPE; return; }
  const result = JSON.parse(raw);
  const nearbyStats = JSON.parse(sessionStorage.getItem("nearby_vote_stats") || "null");
  const wrapper = document.getElementById("result-wrapper");

  // F4: loading screen y stats fetch en paralelo
  const [, stats] = await Promise.all([
    runLoadingScreen(wrapper),
    fetch(`/api/stats/${QUIZ_TYPE}`).then(r => r.json()).catch(() => null)
  ]);

  wrapper.innerHTML = "";

  if (QUIZ_TYPE === "j1" || QUIZ_TYPE === "ideological") {
    renderJ1(wrapper, result, stats, nearbyStats);
  } else if (QUIZ_TYPE === "party") {
    renderParty(wrapper, result, stats);
  } else {
    renderCandidate(wrapper, result, stats);
  }

  setTimeout(maybeShowDemographics, 1500);
}

// ── J1 — Story state ─────────────────────────────────────────────────
let _sTotal = 5, _sCurrent = 0, _sData = {};

// ── J1 — Brújula Ideológica (Wrapped-style slides) ────────────────────
function renderJ1(wrapper, result, stats, nearbyStats) {
  if (result.undetermined || result.profile === "UNDETERMINED") {
    wrapper.innerHTML = `
      <div class="result-hero" style="text-align:center;padding:40px 24px">
        <div style="font-size:3rem;margin-bottom:16px">🤔</div>
        <h2 style="margin-bottom:12px">No pudimos calcular tu perfil</h2>
        <p style="color:var(--text-muted);max-width:400px;margin:0 auto 24px">
          Más del 50% de tus respuestas fueron neutras o sin postura definida.
          Para obtener un perfil más fiel, intentá tomar partido en los dilemas —
          incluso cuando la decisión sea difícil.
        </p>
        <a href="/quiz?type=j1" class="btn btn-accent">Volver a intentarlo</a>
      </div>`;
    return;
  }

  const { profile, profile_data, archetype_data, archetype: archId } = result;
  const econ   = result.econ   ?? result.axes?.econ   ?? 0;
  const social = result.social ?? result.axes?.social ?? 0;
  const inst   = result.inst   ?? 0;
  const arch         = archetype_data || {};
  const archColor    = arch.color    || PROFILE_COLORS[profile] || "#888";
  const archName     = arch.name     || profile_data?.name || profile;
  const archSub      = arch.subtitle || profile_data?.short || "";
  const taglineShort = arch.tagline_short || "";
  const archImageUrl = arch.image_url || "";

  _sData = { result, stats, nearbyStats, arch, archColor, archName, archSub,
             taglineShort, archImageUrl, econ, social, inst, profile, archId };

  // Hide existing page chrome
  wrapper.style.display = "none";
  document.querySelector("header")?.style.setProperty("display", "none");

  // Mount story container
  _sCurrent = 0;
  const slides = [_sSlide1(), _sSlide2(), _sSlide3(), _sSlide4(), _sSlide5()];
  _sTotal = slides.length;

  const container = document.createElement("div");
  container.id = "story-container";
  container.innerHTML = `
    <div id="story-progress">
      ${slides.map((_, i) => `<div class="sp-bar" id="sp-${i}"><div class="sp-fill" id="spf-${i}"></div></div>`).join("")}
    </div>
    <button id="story-share" onclick="storyShare()">↑ Compartir</button>
    <div id="story-slides">
      ${slides.map((html, i) => `<div class="story-slide${i === 0 ? " active" : ""}" id="ss-${i}">${html}</div>`).join("")}
    </div>
    <div id="tap-prev" onclick="storyPrev()"></div>
    <div id="tap-next" onclick="storyNext()"></div>
  `;
  document.body.appendChild(container);
  _sUpdateProgress();

  // Adjust share button for light slide (slide 5)
  setupShare(archName, archSub, econ, social, archColor,
    result.top_dimension_label, result.top_dimension_score,
    stats, profile, taglineShort, archImageUrl, archId);
}

function _sSlide1() {
  const { archColor, archName, archSub, taglineShort, archImageUrl } = _sData;
  const bgStyle = archImageUrl
    ? `background-image:url(${archImageUrl});background-color:${archColor}`
    : `background-color:${archColor}`;
  return `
    <div class="slide-hero">
      <div class="slide-hero-bg" style="${bgStyle}"></div>
      <div class="slide-hero-overlay"></div>
      <div class="slide-hero-content">
        <div class="slide-hero-branding">Brújula Política AR</div>
        <div class="slide-hero-name">${archName}</div>
        ${taglineShort ? `<div class="slide-hero-tagline">"${taglineShort}"</div>` : ""}
        <div class="slide-hero-sub">${archSub}</div>
      </div>
    </div>`;
}

function _sSlide2() {
  const { econ, social, inst, archColor } = _sData;
  const axes = [
    { name: "ECONÓMICO",     score: econ,   neg: "Estatista",        pos: "Privatista" },
    { name: "SOCIOCULTURAL", score: social, neg: "Progresista",       pos: "Conservador" },
    { name: "INSTITUCIONAL", score: inst,   neg: "Institucionalista", pos: "Anti-est." }
  ];
  const axisHTML = axes.map(ax => {
    const side  = ax.score < -15 ? ax.neg : ax.score > 15 ? ax.pos : "Centro";
    const pct   = Math.min(Math.abs(ax.score), 100) / 2;
    const style = ax.score <= 0
      ? `right:50%;width:${pct}%;background:${archColor}`
      : `left:50%;width:${pct}%;background:${archColor}`;
    return `
      <div class="axis-story-item">
        <div class="axis-story-header">
          <span class="axis-story-name">${ax.name}</span>
          <span class="axis-story-value">${side}</span>
        </div>
        <div class="axis-story-track">
          <div class="axis-story-fill" style="${style}"></div>
        </div>
      </div>`;
  }).join("");
  return `
    <div class="slide-dark">
      <div class="slide-label">Tu resultado</div>
      <div class="slide-title">Tu mapa ideológico</div>
      <div class="axis-story-row">${axisHTML}</div>
    </div>`;
}

function _sSlide3() {
  const { result, archColor } = _sData;
  const dims = result.dimensions || {};
  const topDim = result.top_dimension;
  const visible = Object.entries(dims)
    .filter(([, v]) => Math.abs(v) > 15)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 4);
  if (!visible.length) return _sSlide4();
  const dimHTML = visible.map(([dim, score]) => {
    const poles = DIM_POLES[dim] || {};
    const label = score > 0 ? (poles.pos || DIM_LABELS[dim] || dim) : (poles.neg || DIM_LABELS[dim] || dim);
    const isTop = dim === topDim;
    return `
      <div class="dim-story-item">
        <div class="dim-story-label" style="${isTop ? `color:${archColor}` : ""}">${label}</div>
        <div class="dim-story-track">
          <div class="dim-story-fill" style="width:${Math.abs(score)}%;background:${isTop ? archColor : "rgba(255,255,255,0.35)"}"></div>
        </div>
      </div>`;
  }).join("");
  return `
    <div class="slide-dark">
      <div class="slide-label">Tu perfil</div>
      <div class="slide-title">Lo que más te define</div>
      <div class="dim-story-list">${dimHTML}</div>
    </div>`;
}

function _sSlide4() {
  const { stats, nearbyStats, profile, archId, archColor } = _sData;
  const total   = stats?.total || 0;
  const archPct = stats?.archetypes_pct?.[archId] ?? stats?.profiles_pct?.[profile] ?? null;
  let bigNum = archPct !== null
    ? `<div class="community-big" style="color:${archColor}">${archPct}%</div>
       <div class="community-desc">comparte tu arquetipo<br>
         <span style="font-size:0.78rem;color:rgba(255,255,255,0.35)">de ${total.toLocaleString("es-AR")} jugadores</span>
       </div>`
    : `<div class="community-desc" style="padding-top:8px">Todavía no hay datos suficientes.<br>Volvé cuando haya más jugadores.</div>`;
  let voteHTML = "";
  if (nearbyStats && !nearbyStats.insufficient_data && nearbyStats.distribution?.length) {
    const rows = nearbyStats.distribution.slice(0, 4).map(d => `
      <div class="community-vote-row">
        <div class="community-vote-party">${PARTY_LABELS[d.party] || d.party}</div>
        <div class="community-vote-track"><div class="community-vote-fill" style="width:${d.pct}%;background:${archColor}"></div></div>
        <div class="community-vote-pct">${d.pct}%</div>
      </div>`).join("");
    voteHTML = `<div class="community-vote-section">
      <div class="community-vote-label-head">Intención de voto en tu arquetipo</div>
      ${rows}
    </div>`;
  }
  return `
    <div class="slide-dark">
      <div class="slide-label">Tu comunidad</div>
      <div class="slide-title">Quiénes piensan como vos</div>
      ${bigNum}${voteHTML}
    </div>`;
}

function _sSlide5() {
  const { archName, archSub, taglineShort, archImageUrl, archColor } = _sData;
  return `
    <div class="slide-cta">
      <div class="slide-cta-eyebrow">Brújula Política AR</div>
      ${archImageUrl ? `<img src="${archImageUrl}" alt="${archName}" class="slide-cta-img" onerror="this.style.display='none'">` : ""}
      <div class="slide-cta-name" style="color:${archColor}">${archName}</div>
      ${taglineShort ? `<div class="slide-cta-tagline">"${taglineShort}"</div>` : ""}
      <div class="slide-cta-url">${location.hostname}</div>
      <div class="slide-cta-btns">
        <button class="slide-cta-btn-primary" onclick="storyShare()">Compartir mi resultado</button>
        <a href="/" class="slide-cta-btn-ghost">Volver al inicio</a>
      </div>
    </div>`;
}

// ── Story navigation ──────────────────────────────────────────────────
function storyNext() { if (_sCurrent < _sTotal - 1) _sGoTo(_sCurrent + 1); }
function storyPrev() { if (_sCurrent > 0) _sGoTo(_sCurrent - 1); }

function _sGoTo(n) {
  document.querySelectorAll(".story-slide").forEach((s, i) => {
    s.classList.remove("active", "prev");
    if (i < n)      s.classList.add("prev");
    else if (i === n) s.classList.add("active");
  });
  _sCurrent = n;
  _sUpdateProgress();
  // Light share button on last slide (light background)
  const btn = document.getElementById("story-share");
  if (btn) btn.className = n === _sTotal - 1 ? "light" : "";
}

function _sUpdateProgress() {
  for (let i = 0; i < _sTotal; i++) {
    const bar = document.getElementById(`sp-${i}`);
    if (!bar) continue;
    bar.classList.toggle("done",   i < _sCurrent);
    bar.classList.toggle("active", i === _sCurrent);
  }
}

function storyShare() { nativeShare(); }

// ── F5: Animación del punto del compass ───────────────────────────────
function animateCompassDot(econ, social) {
  const dot = document.getElementById("compass-user-dot");
  if (!dot) return;
  const r = 110;
  const tx = (econ / 100) * r;
  const ty = -(social / 100) * r;
  dot.style.transform = `translate(${tx}px, ${ty}px)`;
}

// ── Helpers de visualización ──────────────────────────────────────────
function toggleFold(id) {
  const fold = document.getElementById(id);
  if (!fold) return;
  const isOpen = fold.style.display !== "none";
  fold.style.display = isOpen ? "none" : "block";
  const chevron = fold.querySelector(".fold-chevron");
  if (chevron) chevron.textContent = isOpen ? "▼" : "▲";
}

function buildAxisCard(label, value, leftLabel, rightLabel) {
  const side = value < -20 ? leftLabel : (value > 20 ? rightLabel : "Centro");
  const color = value < -20 ? "#E53935" : value > 20 ? "#7B1FA2" : "#888";
  return `
    <div class="axis-card">
      <div class="axis-label">${label}</div>
      <div class="axis-value" style="color:${color}">${value >= 0 ? "+" : ""}${value}</div>
      <div class="axis-side">${side}</div>
    </div>`;
}

function buildDimensionGroups(dimensions, topDim) {
  if (!dimensions || Object.keys(dimensions).length === 0) return "";

  const AXIS_GROUPS = [
    { label: "Económico",    dims: ["individualismo", "meritocracia", "modelo_economico"] },
    { label: "Sociocultural",dims: ["tradicion", "autoridad", "localismo", "derechos_autonomia", "laicismo", "migracion"] },
    { label: "Institucional",dims: ["antiestablishment", "confianza_institucional"] },
  ];
  const THRESHOLD = 20;

  let html = `<div class="dim-groups">`;
  for (const group of AXIS_GROUPS) {
    const visible = group.dims.filter(d => d in dimensions && Math.abs(dimensions[d]) > THRESHOLD);
    if (!visible.length) continue;
    html += `<div class="dim-group"><div class="dim-group-label">${group.label}</div><div class="dim-items">`;
    for (const dim of visible) {
      const score  = dimensions[dim];
      const poles  = DIM_POLES[dim] || {};
      const label  = score > 0 ? (poles.pos || dim) : (poles.neg || dim);
      const isTop  = dim === topDim;
      html += `
        <div class="dim-item${isTop ? " dim-item-top" : ""}">
          <div class="dim-pole">${label}</div>
          <div class="dim-bar-wrap"><div class="dim-bar-fill" style="width:${Math.abs(score)}%"></div></div>
        </div>`;
    }
    html += `</div></div>`;
  }
  html += `</div>`;
  return html;
}

function buildSocialProofLine(stats, profile, archId) {
  if (!stats || stats.total < 10) return "";
  const total  = stats.total.toLocaleString("es-AR");
  const archPct = stats.archetypes_pct?.[archId] ?? null;
  const profilePct = stats.profiles_pct?.[profile] ?? null;
  const pctPart = archPct !== null
    ? ` · El <strong>${archPct}%</strong> tiene tu mismo arquetipo`
    : profilePct !== null
      ? ` · El <strong>${profilePct}%</strong> comparte tu perfil base`
    : "";
  return `<p class="result-social-proof"><span class="rsp-count">${total} jugadores</span>${pctPart}</p>`;
}

function buildComparison(profile, archId, stats, archName) {
  const archetypePct = stats.archetypes_pct?.[archId] ?? null;
  const profilePct = stats.profiles_pct?.[profile] ?? null;
  const statLabel = archetypePct !== null ? "Jugadores con tu arquetipo" : "Jugadores con tu perfil base";
  const statValue = archetypePct !== null ? archetypePct : (profilePct ?? 0);
  const total = stats.total;
  return `
    <div class="comparison-section">
      <p class="sample-note">Muestra autoseleccionada · no representa al electorado general · ${total.toLocaleString()} jugadores</p>
      <div class="stat-row">
        <div><div class="stat-label">${statLabel}</div><div style="font-size:0.8rem;color:var(--text-muted)">${archName}</div></div>
        <div class="stat-value">${statValue}%</div>
      </div>
    </div>`;
}

function buildNearbyVote(nearbyStats) {
  if (!nearbyStats) return `
    <div class="vote-section">
      <h3>¿Qué votan los que se parecen a vos?</h3>
      <p class="sample-note">Respondé la pregunta de intención de voto para ver esta sección.</p>
    </div>`;
  if (nearbyStats.insufficient_data) return `
    <div class="vote-section">
      <h3>¿Qué votan los que se parecen a vos?</h3>
      <p class="sample-note">Todavía hay pocos jugadores en tu arquetipo (${nearbyStats.n || 0}) para mostrar una distribución confiable. Volvé cuando haya más datos.</p>
    </div>`;
  const bars = (nearbyStats.distribution || []).slice(0, 6).map(d => `
    <div class="vote-row">
      <div class="vote-party">${PARTY_LABELS[d.party] || d.party}</div>
      <div class="vote-bar-wrap"><div class="vote-bar-fill" style="width:${d.pct}%"></div></div>
      <div class="vote-pct">${d.pct}%</div>
    </div>`).join("");
  return `
    <div class="vote-section">
      <h3>¿Qué votan los que se parecen a vos?</h3>
      <p class="sample-note">Entre ${nearbyStats.n} jugadores de tu arquetipo que declararon su voto:</p>
      <div class="vote-bars">${bars}</div>
    </div>`;
}

// ── F3: Compass SVG con cuadrantes desaturados + F5: punto animado ────
function buildCompassSVG(econ, social, color) {
  const size = 340, cx = 170, cy = 170, r = 110;
  const Q = COMPASS_QUADRANT_COLORS;
  return `<svg viewBox="0 0 ${size} ${size}" class="compass-svg">
    <!-- Cuadrantes desaturados -->
    <rect x="${cx}"   y="${cy-r}" width="${r}" height="${r}" fill="${Q.NE}" rx="4"/>
    <rect x="${cx-r}" y="${cy-r}" width="${r}" height="${r}" fill="${Q.NW}" rx="4"/>
    <rect x="${cx}"   y="${cy}"   width="${r}" height="${r}" fill="${Q.SE}" rx="4"/>
    <rect x="${cx-r}" y="${cy}"   width="${r}" height="${r}" fill="${Q.SW}" rx="4"/>
    <!-- Ejes -->
    <line x1="${cx-r}" y1="${cy}" x2="${cx+r}" y2="${cy}" stroke="rgba(0,0,0,0.12)" stroke-width="1"/>
    <line x1="${cx}" y1="${cy-r}" x2="${cx}" y2="${cy+r}" stroke="rgba(0,0,0,0.12)" stroke-width="1"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(0,0,0,0.05)" stroke-width="1"/>
    <!-- Etiquetas -->
    <text x="${cx}" y="${cy-r-10}" text-anchor="middle" fill="#9A9187" font-size="8" font-weight="600" letter-spacing="0.5">CONSERVADOR</text>
    <text x="${cx}" y="${cy+r+16}" text-anchor="middle" fill="#9A9187" font-size="8" font-weight="600" letter-spacing="0.5">PROGRESISTA</text>
    <text x="${cx+r+8}" y="${cy+3}" text-anchor="start" fill="#9A9187" font-size="8" font-weight="600">PRIVATISTA</text>
    <text x="${cx-r-8}" y="${cy+3}" text-anchor="end" fill="#9A9187" font-size="8" font-weight="600">ESTATISTA</text>
    <!-- Punto del usuario: parte del centro, se anima a posición final (F5) -->
    <g id="compass-user-dot" style="transition:transform 1.2s cubic-bezier(0.25,1,0.5,1)">
      <circle cx="${cx}" cy="${cy}" r="16" fill="${color}" opacity="0.18"/>
      <circle cx="${cx}" cy="${cy}" r="10" fill="${color}" opacity="0.4"/>
      <circle cx="${cx}" cy="${cy}" r="6"  fill="${color}"/>
      <circle cx="${cx}" cy="${cy}" r="3"  fill="white"/>
    </g>
  </svg>`;
}

// ── F6 + F7: Share ────────────────────────────────────────────────────
let _shareState = {};

function setupShare(archName, archSub, econ, social, color, topDimLabel, topDimScore, stats, profile, taglineShort, archImageUrl, archId) {
  const profilePct = stats?.archetypes_pct?.[archId] ?? stats?.profiles_pct?.[profile] ?? null;
  _shareState = { archName, archSub, econ, social, color, topDimLabel, topDimScore, profilePct, taglineShort, archImageUrl };
}

function loadImage(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function showShareCard() {
  const overlay = document.getElementById("share-overlay");
  const wrap    = document.getElementById("share-card-wrap");
  const s = _shareState;
  const imgSection = s.archImageUrl
    ? `<img src="${s.archImageUrl}" alt="${s.archName}" style="width:100%;height:200px;object-fit:cover;display:block">`
    : `<div style="width:100%;height:200px;background:color-mix(in srgb,${s.color} 15%,#F4F1EB)"></div>`;

  wrap.innerHTML = `
    <div id="share-card" style="width:300px;background:#F4F1EB;border-radius:16px;overflow:hidden;font-family:'Segoe UI',system-ui,sans-serif;box-shadow:0 8px 32px rgba(0,0,0,0.18)">
      <div style="padding:22px 20px 14px;text-align:center">
        <div style="font-size:1.45rem;font-weight:800;color:${s.color};line-height:1.1;letter-spacing:-0.3px">${s.archName}</div>
      </div>
      ${imgSection}
      <div style="padding:14px 20px 0;text-align:center">
        ${s.taglineShort ? `<div style="font-size:0.9rem;color:${s.color};font-style:italic;line-height:1.45">"${s.taglineShort}"</div>` : ""}
      </div>
      <div style="padding:12px 20px 18px;text-align:center;border-top:1px solid #E2DDD5;margin-top:14px">
        <div style="font-size:0.7rem;color:#9A9187;letter-spacing:0.3px">${s.archSub}</div>
        ${s.profilePct != null ? `<div style="font-size:0.8rem;color:#9A9187;margin-top:6px">${s.profilePct}% comparten este perfil</div>` : ""}
        <div style="font-size:0.58rem;color:#C0BAB2;margin-top:10px;letter-spacing:1.5px">BRÚJULA POLÍTICA AR</div>
      </div>
    </div>`;

  const tweetCopy = `Hice el test de la Brújula Política AR y soy: ${s.archName} 🧭 ¿Y vos? Hacelo en 3 minutos: ${buildShareUrl("x")} #BrujulaPoliticaAR`;
  document.getElementById("tw-share").href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetCopy)}`;
  overlay.style.display = "flex";
}

function closeShare() {
  document.getElementById("share-overlay").style.display = "none";
}

// F6: Canvas API — genera PNG de alta resolución
// format: 'portrait' (4:5, para IG) | 'landscape' (16:9, para X)
async function generateSharePNG(format = 'portrait') {
  const s = _shareState;
  const archImg = s.archImageUrl ? await loadImage(s.archImageUrl) : null;
  const dpr = Math.min(window.devicePixelRatio || 2, 3);
  const canvas = document.createElement("canvas");

  if (format === 'landscape') {
    return _renderLandscape(canvas, dpr, s, archImg);
  }
  return _renderPortrait(canvas, dpr, s, archImg);
}

function _renderPortrait(canvas, dpr, s, archImg) {
  // 4:5 — 630×788
  const W = 630, H = 788;
  canvas.width = W * dpr; canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  // Fondo crema
  ctx.fillStyle = "#F4F1EB";
  ctx.fillRect(0, 0, W, H);

  // Franja de color en la parte inferior (~27% del canvas)
  const footerY = Math.round(H * 0.73);
  ctx.fillStyle = s.color;
  ctx.fillRect(0, footerY, W, H - footerY);

  // Hook
  ctx.fillStyle = "#9A9187";
  ctx.textAlign = "center";
  ctx.font = `600 12px -apple-system, system-ui, sans-serif`;
  ctx.fillText("MI PERFIL IDEOLÓGICO · BRÚJULA POLÍTICA AR", W / 2, 28);

  // Nombre
  ctx.fillStyle = s.color;
  ctx.font = `bold 40px -apple-system, system-ui, sans-serif`;
  ctx.fillText(s.archName, W / 2, 68);

  // Imagen (ocupa desde debajo del nombre hasta la franja de color)
  const imgY = 84, imgH = footerY - imgY - 90;
  if (archImg) ctx.drawImage(archImg, 0, imgY, W, imgH);
  else { ctx.fillStyle = s.color + "22"; ctx.fillRect(0, imgY, W, imgH); }

  // Tagline sobre el fondo crema justo encima de la franja
  if (s.taglineShort) {
    ctx.fillStyle = s.color;
    ctx.font = `italic 18px -apple-system, system-ui, sans-serif`;
    ctx.fillText(`"${s.taglineShort}"`, W / 2, footerY - 52);
  }

  // Subtitle
  ctx.fillStyle = "#9A9187";
  ctx.font = `15px -apple-system, system-ui, sans-serif`;
  ctx.fillText(s.archSub, W / 2, footerY - 26);

  // Contenido de la franja de color (texto blanco)
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = `600 18px -apple-system, system-ui, sans-serif`;
  ctx.fillText(s.profilePct != null ? `${s.profilePct}% comparten este perfil` : "Brújula Política AR", W / 2, footerY + 48);

  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = `14px -apple-system, system-ui, sans-serif`;
  ctx.fillText("¿Y vos? → " + location.hostname, W / 2, footerY + 78);

  ctx.textAlign = "left";
  return canvas.toDataURL("image/png", 0.95);
}

function _renderLandscape(canvas, dpr, s, archImg) {
  // 16:9 — 1200×675
  const W = 1200, H = 675;
  const imgW = 520; // columna derecha: imagen
  const textW = W - imgW; // columna izquierda: texto
  const pad = 56;

  canvas.width = W * dpr; canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  // Fondo crema
  ctx.fillStyle = "#F4F1EB";
  ctx.fillRect(0, 0, W, H);

  // Imagen (columna derecha, full height)
  if (archImg) ctx.drawImage(archImg, textW, 0, imgW, H);
  else { ctx.fillStyle = s.color + "20"; ctx.fillRect(textW, 0, imgW, H); }

  // Franja de color sobre el borde izquierdo de la imagen (transición suave)
  const grad = ctx.createLinearGradient(textW - 60, 0, textW + 60, 0);
  grad.addColorStop(0, "#F4F1EB");
  grad.addColorStop(1, "rgba(244,241,235,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(textW - 60, 0, 120, H);

  // Hook
  ctx.fillStyle = "#9A9187";
  ctx.textAlign = "left";
  ctx.font = `600 14px -apple-system, system-ui, sans-serif`;
  ctx.fillText("MI PERFIL IDEOLÓGICO · BRÚJULA POLÍTICA AR", pad, 72);

  // Nombre
  ctx.fillStyle = s.color;
  ctx.font = `bold 48px -apple-system, system-ui, sans-serif`;
  ctx.fillText(s.archName, pad, 128);

  // Tagline
  if (s.taglineShort) {
    ctx.fillStyle = s.color;
    ctx.font = `italic 26px -apple-system, system-ui, sans-serif`;
    ctx.fillText(`"${s.taglineShort}"`, pad, 174);
  }

  // Separador
  ctx.strokeStyle = "#E2DDD5"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(pad, 210); ctx.lineTo(textW - pad, 210); ctx.stroke();

  // Subtitle
  ctx.fillStyle = "#9A9187";
  ctx.font = `22px -apple-system, system-ui, sans-serif`;
  ctx.fillText(s.archSub, pad, 250);

  // Stat
  if (s.profilePct != null) {
    ctx.fillStyle = "#1C1916";
    ctx.font = `22px -apple-system, system-ui, sans-serif`;
    ctx.fillText(`${s.profilePct}% comparten este perfil`, pad, 310);
  }

  // Branding
  ctx.fillStyle = "#C0BAB2";
  ctx.font = `bold 16px -apple-system, system-ui, sans-serif`;
  ctx.fillText("BRÚJULA POLÍTICA AR", pad, H - 40);
  ctx.font = `14px -apple-system, system-ui, sans-serif`;
  ctx.fillText(location.hostname, pad, H - 20);

  return canvas.toDataURL("image/png", 0.95);
}

function _drawCompassOnCanvas(ctx, econ, social, color, ox, oy, size) {
  const cx = ox + size / 2;
  const cy = oy + size / 2;
  const r  = size * 0.42;
  const Q  = COMPASS_QUADRANT_COLORS;

  // Cuadrantes
  const drawQuad = (x, y, fill) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.rect(x, y, r, r);
    ctx.fill();
  };
  drawQuad(cx,   cy - r, Q.NE);
  drawQuad(cx-r, cy - r, Q.NW);
  drawQuad(cx,   cy,     Q.SE);
  drawQuad(cx-r, cy,     Q.SW);

  // Ejes
  ctx.strokeStyle = "rgba(0,0,0,0.14)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy);
  ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r);
  ctx.stroke();

  // Etiquetas
  ctx.fillStyle = "#9A9187";
  ctx.font = "600 16px -apple-system, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("CONSERVADOR", cx, cy - r - 10);
  ctx.fillText("PROGRESISTA", cx, cy + r + 22);
  ctx.textAlign = "left";
  ctx.fillText("ESTATISTA",  cx - r,     cy + 5);
  ctx.textAlign = "right";
  ctx.fillText("PRIVATISTA", cx + r,     cy + 5);
  ctx.textAlign = "left";

  // Punto del usuario
  const dotX = cx + (econ  / 100) * r;
  const dotY = cy - (social / 100) * r;

  ctx.beginPath(); ctx.arc(dotX, dotY, 22, 0, Math.PI * 2);
  ctx.fillStyle = color + "30"; ctx.fill();
  ctx.beginPath(); ctx.arc(dotX, dotY, 13, 0, Math.PI * 2);
  ctx.fillStyle = color + "80"; ctx.fill();
  ctx.beginPath(); ctx.arc(dotX, dotY, 7, 0, Math.PI * 2);
  ctx.fillStyle = color; ctx.fill();
  ctx.beginPath(); ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
  ctx.fillStyle = "white"; ctx.fill();
}

// F6: Descarga PNG via Canvas
async function downloadSharePNG(format = 'portrait') {
  try {
    const dataUrl = await generateSharePNG(format);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = format === 'landscape' ? "brujula-resultado-x.png" : "brujula-resultado-ig.png";
    a.click();
  } catch (e) {
    console.error("Error generando imagen:", e);
  }
}

// F7: Web Share API nativa (mobile)
async function nativeShare() {
  const s = _shareState;
  const shareText = `Hice el test de la Brújula Política AR y soy: ${s.archName} 🧭 ¿Y vos? Hacelo gratis: ${buildShareUrl("mobile_share")}`;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  try {
    const dataUrl = await generateSharePNG();
    const res  = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], "brujula-resultado.png", { type: "image/png" });

    if (!navigator.canShare || !navigator.canShare({ files: [file] })) {
      await downloadSharePNG();
      return;
    }

    if (isIOS) {
      // iOS Safari descarta texto/URL al compartir con archivo — copiamos el texto primero
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        showToast("Texto copiado al portapapeles. Pegalo en tu historia o mensaje.");
      }
      await navigator.share({ files: [file] });
    } else {
      await navigator.share({ files: [file], title: `Mi resultado: ${s.archName}`, text: shareText });
    }
  } catch (e) {
    if (e.name !== "AbortError") await downloadSharePNG();
  }
}

function showToast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText = "position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1C1916;color:#F4F1EB;padding:10px 18px;border-radius:10px;font-size:0.82rem;z-index:200;max-width:280px;text-align:center;line-height:1.4";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

function shareTweet() {
  const s = _shareState;
  const text = `Hice el test de la Brújula Política AR y soy: ${s.archName} 🧭 ¿Y vos? Hacelo gratis: ${buildShareUrl("x")} #BrujulaPoliticaAR`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
}

function shareWhatsApp() {
  const s = _shareState;
  const text = `Hice el test de la Brújula Política AR y soy: *${s.archName}* 🧭\n"${s.taglineShort}"\n\n¿Y vos? Hacelo gratis en: ${buildShareUrl("whatsapp")}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

function buildShareUrl(medium) {
  const sessionId = localStorage.getItem("quiz_session_id");
  const base = sessionId
    ? `${location.origin}/share/${sessionId}`
    : `${location.origin}/quiz?type=j1`;
  return `${base}?utm_source=share&utm_medium=${medium}`;
}

function copyShareLink() {
  navigator.clipboard.writeText(buildShareUrl("copiar_link")).then(() => {
    showToast("Link copiado al portapapeles.");
  });
}

// ── Party y Candidate (legacy) ────────────────────────────────────────
const PARTY_COLORS = { LLA: "#7B1FA2", PRO: "#F9A825", UCR: "#E53935", PJ: "#1565C0", "PJ/UxP": "#1565C0", FIT: "#B71C1C" };
const CANDIDATE_COLORS = { milei: "#7B1FA2", bullrich: "#FF8F00", macri: "#F9A825", morales: "#E53935", massa: "#1565C0", kirchner: "#0D47A1", bregman: "#B71C1C" };

function renderParty(wrapper, result, stats) {
  const { ranked, top_party, top_party_data } = result;
  const color = PARTY_COLORS[top_party] || "#e8c547";
  wrapper.innerHTML = `
    <div class="result-header">
      <div class="quiz-label">¿A qué partido me parezco?</div>
      <h1>${top_party_data?.icon || "🗳️"} ${top_party_data?.name || top_party}</h1>
    </div>
    <div style="background:var(--bg2);border:2px solid ${color};border-radius:var(--radius);padding:24px;margin:20px 0">
      <h3 style="margin-bottom:16px">Tu ranking de afinidad</h3>
      ${(ranked || []).map((item, i) => buildRankBar(item.party, item.score, PARTY_COLORS[item.party] || "#888", i === 0)).join("")}
    </div>
    ${buildOtherQuizzes(QUIZ_TYPE)}`;
}

function renderCandidate(wrapper, result, stats) {
  const { ranked, top_candidate, top_candidate_data } = result;
  const color = CANDIDATE_COLORS[top_candidate] || "#e8c547";
  wrapper.innerHTML = `
    <div class="result-header">
      <div class="quiz-label">¿Mi candidato?</div>
      <h1>${top_candidate_data?.icon || "🎯"} ${top_candidate_data?.name || top_candidate}</h1>
    </div>
    <div style="background:var(--bg2);border:2px solid ${color};border-radius:var(--radius);padding:24px;margin:20px 0">
      <h3 style="margin-bottom:16px">Tu ranking de afinidad</h3>
      ${(ranked || []).map((item, i) => buildRankBar(item.candidate, item.score, CANDIDATE_COLORS[item.candidate] || "#888", i === 0)).join("")}
    </div>
    ${buildOtherQuizzes(QUIZ_TYPE)}`;
}

function buildRankBar(name, score, color, isTop) {
  return `<div style="margin-bottom:12px">
    <div style="display:flex;justify-content:space-between;margin-bottom:4px">
      <span style="${isTop ? `color:${color};font-weight:700` : ""}">${isTop ? "🥇 " : ""}${name}</span>
      <span style="color:var(--text-muted);font-size:0.875rem">${Math.round(score)}%</span>
    </div>
    <div style="height:8px;background:var(--bg3);border-radius:99px;overflow:hidden">
      <div style="width:${score}%;height:100%;background:${color};border-radius:99px"></div>
    </div>
  </div>`;
}

function buildOtherQuizzes(currentType) {
  const others = [
    { id: "j1", icon: "🧭", title: "Brújula Ideológica" },
    { id: "party", icon: "🗳️", title: "¿A qué partido?" },
    { id: "candidate", icon: "🎯", title: "¿Mi candidato?" }
  ].filter(q => q.id !== currentType);
  return `<div style="margin:32px 0 0">
    <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:12px">Probá los otros quizzes</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      ${others.map(q => `<a href="/quiz?type=${q.id}" class="btn btn-ghost" style="font-size:0.875rem">${q.icon} ${q.title}</a>`).join("")}
    </div>
  </div>`;
}

init();
