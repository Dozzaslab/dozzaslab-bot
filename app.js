import { ensureTradeupReady, simulateTradeup } from "./tradeup.js";

const loading = document.getElementById('loading');
const app = document.getElementById('app');
const bar = document.getElementById('bar');

/* ===== LINKS ===== */
const CHANNEL_URL = "https://t.me/dozza_8";
const CHAT_URL    = "https://t.me/+YmGqLAkSQU0yYmUy";

function openTgLink(url) {
  if (!url) return;

  if (window.Telegram?.WebApp?.openTelegramLink) {
    Telegram.WebApp.openTelegramLink(url);
    return;
  }
  if (window.Telegram?.WebApp?.openLink) {
    Telegram.WebApp.openLink(url);
    return;
  }
  window.open(url, "_blank");
}

if (window.Telegram?.WebApp) {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}

const scrollBox = document.querySelector('#app .hl-body');
function scrollToTop() {
  if (scrollBox) scrollBox.scrollTop = 0;
}

/* ===== Навигация по вкладкам ===== */
function showPage(page) {
  const root = document.querySelector('#app .hl-body');
  if (!root) return;

  root.querySelectorAll(':scope > .page').forEach(p => {
    p.classList.toggle('hidden', p.dataset.page !== page);
  });

  document.querySelectorAll('.hl-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.page === page);
  });

  scrollToTop();

  if (page === 'catalog' && window.__catalogShowHome) {
    window.__catalogShowHome();
  }

  if (window.__resetSubnav?.[page]) {
    window.__resetSubnav[page]();
  }
}

document.addEventListener('click', (e) => {
  const tab = e.target.closest('.hl-tab[data-page]');
  if (!tab) return;
  showPage(tab.dataset.page);
});

/* ===== Делегирование кликов по data-open (работает и для новых кнопок) ===== */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-open]');
  if (!btn) return;

  const url = btn.dataset.open;
  if (!url) return;

  if (window.Telegram?.WebApp?.openLink) Telegram.WebApp.openLink(url);
  else window.open(url, '_blank');
});

function tgSend(payload) {
  if (window.Telegram?.WebApp?.sendData) {
    Telegram.WebApp.sendData(JSON.stringify(payload));
  } else {
    alert("WebApp API недоступен (открой внутри Telegram)");
  }
}

/* ===== Навигация внутри одной вкладки (провалился / назад) ===== */
function initSubnav(pageName, initialScreenId) {
  const page = document.querySelector(`.page[data-page="${pageName}"]`);
  if (!page) return;

  const stack = [];

  function show(screenId, { push = true } = {}) {
    const screens = page.querySelectorAll("[data-screen]");
    const target = page.querySelector(`[data-screen="${screenId}"]`);
    if (!target) return;

    const current = [...screens].find(s => !s.classList.contains("hidden"));
    const currentId = current?.dataset?.screen;

    if (push && currentId && currentId !== screenId) stack.push(currentId);

    screens.forEach(s => s.classList.toggle("hidden", s.dataset.screen !== screenId));
    scrollToTop();
  }

  function back() {
    const prev = stack.pop();
    if (prev) show(prev, { push: false });
    else show(initialScreenId, { push: false });
  }

  page.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (go) return show(go.dataset.go);

    const b = e.target.closest("[data-back]");
    if (b) return back();
  });

  window.__resetSubnav = window.__resetSubnav || {};
  window.__resetSubnav[pageName] = () => {
    stack.length = 0;
    show(initialScreenId, { push: false });
  };

  show(initialScreenId, { push: false });
}

/* ===== Предложка: 2 шага ===== */
let suggestTopic = null;

const step1 = document.getElementById('suggestStep1');
const step2 = document.getElementById('suggestStep2');
const title = document.getElementById('suggestTitle');

const pickIdea = document.getElementById('pickIdea');
const pickCollab = document.getElementById('pickCollab');

const sendFinal = document.getElementById('sendSuggestFinal');
const backBtn = document.getElementById('backSuggest');
const clearBtn = document.getElementById('clearSuggest');

function openSuggestStep2(topic) {
  suggestTopic = topic;

  if (title) {
    title.textContent =
      topic === "collab"
        ? "Тема: 🤝 Сотрудничество"
        : "Тема: 💡 Идея / улучшение";
  }

  step1?.classList.add('hidden');
  step2?.classList.remove('hidden');
  document.getElementById('suggestText')?.focus();
}

function openSuggestStep1() {
  suggestTopic = null;
  step2?.classList.add('hidden');
  step1?.classList.remove('hidden');
  const ta = document.getElementById('suggestText');
  if (ta) ta.value = "";
}

pickIdea?.addEventListener('click', () => openSuggestStep2("idea"));
pickCollab?.addEventListener('click', () => openSuggestStep2("collab"));

sendFinal?.addEventListener('click', () => {
  const ta = document.getElementById('suggestText');
  const text = ta?.value.trim();
  if (!text || !suggestTopic) return;

  tgSend({ type: "suggestion", topic: suggestTopic, text });

  if (ta) ta.value = "";
  alert("✅ Сообщение отправлено");
});

clearBtn?.addEventListener('click', () => {
  const ta = document.getElementById('suggestText');
  if (ta) ta.value = "";
});

backBtn?.addEventListener('click', () => openSuggestStep1());

/* ===== Кейсы/Капсулы: 2 уровня + поиск ===== */
(function initCatalog() {
  const home = document.getElementById("catalogHome");
  const cases = document.getElementById("catalogCases");
  const caps = document.getElementById("catalogCapsules");

  const openCases = document.getElementById("openCases");
  const openCaps = document.getElementById("openCapsules");

  const back1 = document.getElementById("backToCatalogHome1");
  const back2 = document.getElementById("backToCatalogHome2");

  const casesSearch = document.getElementById("casesSearch");
  const capsSearch = document.getElementById("capsulesSearch");

  const casesList = document.getElementById("casesList");
  const capsList = document.getElementById("capsulesList");

  if (!home || !cases || !caps) return;

  function filterList(listEl, query) {
    if (!listEl) return;
    const q = (query || "").trim().toLowerCase();
    listEl.querySelectorAll(".catalog-item").forEach(btn => {
      const t = (btn.textContent || "").toLowerCase();
      btn.style.display = t.includes(q) ? "" : "none";
    });
  }

  function showHome() {
    home.classList.remove("hidden");
    cases.classList.add("hidden");
    caps.classList.add("hidden");

    if (casesSearch) casesSearch.value = "";
    if (capsSearch) capsSearch.value = "";

    filterList(casesList, "");
    filterList(capsList, "");

    scrollToTop();
  }

  function showCases() {
    home.classList.add("hidden");
    cases.classList.remove("hidden");
    caps.classList.add("hidden");
    scrollToTop();
    casesSearch?.focus();
  }

  function showCaps() {
    home.classList.add("hidden");
    cases.classList.add("hidden");
    caps.classList.remove("hidden");
    scrollToTop();
    capsSearch?.focus();
  }

  openCases?.addEventListener("click", showCases);
  openCaps?.addEventListener("click", showCaps);
  back1?.addEventListener("click", showHome);
  back2?.addEventListener("click", showHome);

  casesSearch?.addEventListener("input", (e) => {
    filterList(casesList, e.target.value);
    scrollToTop();
  });

  capsSearch?.addEventListener("input", (e) => {
    filterList(capsList, e.target.value);
    scrollToTop();
  });

  window.__catalogShowHome = showHome;
  showHome();
})();

/* ===== Инициализация subnav для вкладки INVEST + TOOLS ===== */
initSubnav("invest", "investHome");
initSubnav("tools", "toolsHome");

/* ===== Typewriter for welcome ===== */
function typeWelcomeText() {
  const sourceEl = document.getElementById("welcomeSource");
  const targetEl = document.getElementById("welcomeTyped");
  if (!sourceEl || !targetEl) return;

  const text = sourceEl.innerText.trim();
  targetEl.innerHTML = "";
  let i = 0;

  const speed = 18;

  function type() {
    if (i < text.length) {
      const char = text[i];
      if (char === "\n") targetEl.innerHTML += "<br/>";
      else targetEl.innerHTML += char;

      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

/* ===== загрузка ===== */
let p = 0;
const timer = setInterval(() => {
  p += Math.floor(Math.random() * 12) + 6;
  if (p >= 100) {
    p = 100;
    clearInterval(timer);
    loading?.classList.add('hidden');
    app?.classList.remove('hidden');

    app?.classList.remove('menu-mode');

    showPage('welcome');
    setTimeout(typeWelcomeText, 200);

    if (window.Telegram?.WebApp) Telegram.WebApp.expand();
  }
  if (bar) bar.style.width = p + '%';
}, 120);

/* ===== закрытие окон ===== */
const x1 = document.getElementById('x1');
const x2 = document.getElementById('x2');
const cancelLoad = document.getElementById('cancelLoad');

x1 && (x1.onclick = () => loading?.classList.add('hidden'));
x2 && (x2.onclick = () => app?.classList.add('hidden'));
cancelLoad && (cancelLoad.onclick = () => loading?.classList.add('hidden'));

/* ===== Welcome buttons ===== */
document.getElementById("btnChannel")?.addEventListener("click", () => openTgLink(CHANNEL_URL));
document.getElementById("btnChat")?.addEventListener("click", () => openTgLink(CHAT_URL));
document.getElementById("btnMenu")?.addEventListener("click", () => {
  app?.classList.add("menu-mode");
  showPage("tools");
});

/* ===== TRADE-UP UI ===== */

function parseTradeupInput(text) {
  const lines = (text || "").split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length !== 10) return { error: `Нужно 10 строк. Сейчас: ${lines.length}` };

  const items = [];
  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split("|").map(s => s.trim());
    if (parts.length !== 3) return { error: `Строка ${i + 1}: формат "Collection | Rarity | Float"` };

    const [collection, rarity, floatStr] = parts;
    const f = Number(floatStr);

    if (!collection || !rarity || Number.isNaN(f) || f < 0 || f > 1) {
      return { error: `Строка ${i + 1}: проверь collection/rarity/float (float 0..1)` };
    }

    items.push({ collection, rarity, float: f });
  }
  return { items };
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function renderTradeupResult(result) {
  const out = document.getElementById("tradeupResult");
  if (!out) return;

  if (result?.error) {
    out.innerHTML = `❌ ${escapeHtml(result.error)}`;
    return;
  }

  let html = "";
  html += `<div><b>Input rarity:</b> ${escapeHtml(result.input_rarity)}</div>`;
  html += `<div><b>Output rarity:</b> ${escapeHtml(result.output_rarity)}</div>`;
  html += `<div><b>Avg float:</b> ${result.avg_float}</div>`;

  if (typeof result.total_prob_covered === "number") {
    html += `<div><b>Covered prob:</b> ${(result.total_prob_covered * 100).toFixed(2)}%</div>`;
  }

  if (result.missing_collections?.length) {
    html += `<div style="margin-top:6px;">⚠️ Нет данных по коллекциям: <b>${result.missing_collections.map(escapeHtml).join(", ")}</b></div>`;
  }

  html += `<div style="margin-top:10px;"><b>Outcomes:</b></div>`;

  if (!result.outcomes?.length) {
    html += `<div>Пусто (для этих коллекций/редкости нет outcomes в базе).</div>`;
    out.innerHTML = html;
    return;
  }

  for (const o of result.outcomes.slice(0, 60)) {
    const p = (o.prob * 100).toFixed(2);

    const stashBtn = o.links?.stash
      ? `<button class="hl-btn" style="margin-right:6px;" data-open="${o.links.stash}">Stash</button>`
      : "";

    const csfloatBtn = o.links?.csfloat
      ? `<button class="hl-btn" style="margin-right:6px;" data-open="${o.links.csfloat}">CSFloat</button>`
      : "";

    const steamBtn = o.links?.steam
      ? `<button class="hl-btn" data-open="${o.links.steam}">Steam</button>`
      : "";

    html += `<div style="margin-top:10px;">
      • <b>${p}%</b> — ${escapeHtml(o.name)}
      <span class="hl-muted">(${escapeHtml(o.collection)})</span>
      — float≈${o.float_out}
      <div style="margin-top:6px; display:flex; gap:6px; flex-wrap:wrap;">
        ${stashBtn}${csfloatBtn}${steamBtn}
      </div>
    </div>`;
  }

  out.innerHTML = html;
}

document.getElementById("tradeupCalc")?.addEventListener("click", async () => {
  const ta = document.getElementById("tradeupInput");
  const parsed = parseTradeupInput(ta?.value || "");
  if (parsed.error) return renderTradeupResult({ error: parsed.error });

  const out = document.getElementById("tradeupResult");
  if (out) out.innerHTML = "⏳ Загружаю базу скинов…";

  try {
    await ensureTradeupReady();
  } catch (e) {
    return renderTradeupResult({ error: String(e?.message || e) });
  }

  const result = simulateTradeup(parsed.items);
  renderTradeupResult(result);
});

document.getElementById("tradeupClear")?.addEventListener("click", () => {
  const ta = document.getElementById("tradeupInput");
  const out = document.getElementById("tradeupResult");
  if (ta) ta.value = "";
  if (out) out.innerHTML = "";
});

document.getElementById("tradeupFillDemo")?.addEventListener("click", () => {
  const ta = document.getElementById("tradeupInput");
  if (!ta) return;

  ta.value = [
    "Anubis | Mil-Spec | 0.12",
    "Anubis | Mil-Spec | 0.11",
    "Anubis | Mil-Spec | 0.13",
    "Anubis | Mil-Spec | 0.10",
    "Anubis | Mil-Spec | 0.09",
    "Anubis | Mil-Spec | 0.15",
    "Anubis | Mil-Spec | 0.08",
    "Anubis | Mil-Spec | 0.14",
    "Anubis | Mil-Spec | 0.07",
    "Anubis | Mil-Spec | 0.12",
  ].join("\n");
});
/* ===== NEW TRADEUP UI ===== */

let skinsDB = []
let contractItems = []

async function loadTradeupSkins(){

 await ensureTradeupReady()

 const res = await fetch("/data/skins.json")
 const data = await res.json()

 skinsDB = data.filter(s =>
  s.rarity &&
  s.collection &&
  !s.souvenir
 )
 
 renderCollections()
 renderSkinsTable()
}

function renderCollections(){

 const select = document.getElementById("collectionFilter")
 if(!select) return

 const set = new Set()

 skinsDB.forEach(s=>{
  const c = typeof s.collection === "string"
   ? s.collection
   : s.collection?.name

  if(c) set.add(c)
 })

 const arr = [...set].sort()

 arr.forEach(c=>{
  const opt = document.createElement("option")
  opt.textContent = c
  select.appendChild(opt)
 })
}

function renderSkinsTable(){

 const table = document.getElementById("skinsTable")
 if(!table) return

 const search = document.getElementById("skinSearch").value.toLowerCase()
 const rarity = document.getElementById("rarityFilter").value
 const collection = document.getElementById("collectionFilter").value

 let list = skinsDB.filter(s=>{

  const name = (s.name||"").toLowerCase()

  const coll = typeof s.collection==="string"
   ? s.collection
   : s.collection?.name

  if(search && !name.includes(search)) return false
  if(rarity && s.rarity.name !== rarity) return false
  if(collection && coll !== collection) return false

  return true
 })

 list = list.slice(0,40)

 let html = `
<table style="width:100%;font-size:12px">
<tr>
<th align="left">Skin</th>
<th>Collection</th>
<th>Rarity</th>
<th>Float</th>
<th></th>
</tr>
`

 list.forEach((s,i)=>{

 const coll = typeof s.collection==="string"
  ? s.collection
  : s.collection?.name

 const r = s.rarity.name

 html += `
<tr>
<td>${escapeHtml(s.name)}</td>
<td>${escapeHtml(coll)}</td>
<td>${escapeHtml(r)}</td>
<td>${s.min_float}-${s.max_float}</td>
<td>
<button class="hl-btn addSkin" data-id="${i}">+</button>
</td>
</tr>`
 })

 html += "</table>"

 table.innerHTML = html
}

document.addEventListener("input",(e)=>{

 if(
  e.target.id==="skinSearch" ||
  e.target.id==="rarityFilter" ||
  e.target.id==="collectionFilter"
 ){
  renderSkinsTable()
 }
})

document.addEventListener("click",(e)=>{

 const add = e.target.closest(".addSkin")
 if(add){

  const id = add.dataset.id
  const s = skinsDB[id]

  const float = (s.min_float+s.max_float)/2

  const coll = typeof s.collection==="string"
   ? s.collection
   : s.collection?.name

  contractItems.push({
   name:s.name,
   collection:coll,
   rarity:s.rarity.name,
   float:float
  })

  renderContract()
 }

})

function renderContract(){

 const el = document.getElementById("contractList")

 if(!el) return

 let html = ""

 contractItems.forEach((s,i)=>{

 html += `
<div style="margin-top:6px">
${i+1}. ${escapeHtml(s.name)} 
float ${s.float.toFixed(3)}

<button class="hl-btn dup" data-i="${i}">Duplicate</button>
<button class="hl-btn rem" data-i="${i}">Remove</button>
</div>
`
 })

 el.innerHTML = html
}

document.addEventListener("click",(e)=>{

 const dup = e.target.closest(".dup")
 if(dup){

  const i = dup.dataset.i
  contractItems.push({...contractItems[i]})
  renderContract()
 }

 const rem = e.target.closest(".rem")
 if(rem){

  const i = rem.dataset.i
  contractItems.splice(i,1)
  renderContract()
 }

})

document.getElementById("tradeupCalc")?.addEventListener("click",()=>{

 if(contractItems.length !== 10){

  alert("Need 10 skins")
  return
 }

 const result = simulateTradeup(contractItems)
 renderTradeupResult(result)

})

document.getElementById("tradeupClear")?.addEventListener("click",()=>{

 contractItems=[]
 renderContract()

})

loadTradeupSkins()
