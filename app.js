import { ensureTradeupReady, simulateTradeup } from "./tradeup.js";

const loading = document.getElementById("loading");
const app = document.getElementById("app");
const bar = document.getElementById("bar");

/* ===== LINKS ===== */
const CHANNEL_URL = "https://t.me/dozza_8";
const CHAT_URL = "https://t.me/+YmGqLAkSQU0yYmUy";

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

const scrollBox = document.querySelector("#app .hl-body");
function scrollToTop() {
  if (scrollBox) scrollBox.scrollTop = 0;
}

/* ===== Навигация по вкладкам ===== */
function showPage(page) {
  const root = document.querySelector("#app .hl-body");
  if (!root) return;

  root.querySelectorAll(":scope > .page").forEach((p) => {
    p.classList.toggle("hidden", p.dataset.page !== page);
  });

  document.querySelectorAll(".hl-tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.page === page);
  });

  scrollToTop();

  if (page === "catalog" && window.__catalogShowHome) {
    window.__catalogShowHome();
  }

  if (window.__resetSubnav?.[page]) {
    window.__resetSubnav[page]();
  }
}

document.addEventListener("click", (e) => {
  const tab = e.target.closest(".hl-tab[data-page]");
  if (!tab) return;
  showPage(tab.dataset.page);
});

/* ===== Делегирование кликов по data-open (работает и для новых кнопок) ===== */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-open]");
  if (!btn) return;

  const url = btn.dataset.open;
  if (!url) return;

  if (window.Telegram?.WebApp?.openLink) Telegram.WebApp.openLink(url);
  else window.open(url, "_blank");
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

    const current = [...screens].find((s) => !s.classList.contains("hidden"));
    const currentId = current?.dataset?.screen;

    if (push && currentId && currentId !== screenId) stack.push(currentId);

    screens.forEach((s) =>
      s.classList.toggle("hidden", s.dataset.screen !== screenId)
    );
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

const step1 = document.getElementById("suggestStep1");
const step2 = document.getElementById("suggestStep2");
const title = document.getElementById("suggestTitle");

const pickIdea = document.getElementById("pickIdea");
const pickCollab = document.getElementById("pickCollab");

const sendFinal = document.getElementById("sendSuggestFinal");
const backBtn = document.getElementById("backSuggest");
const clearBtn = document.getElementById("clearSuggest");

function openSuggestStep2(topic) {
  suggestTopic = topic;

  if (title) {
    title.textContent =
      topic === "collab" ? "Тема: 🤝 Сотрудничество" : "Тема: 💡 Идея / улучшение";
  }

  step1?.classList.add("hidden");
  step2?.classList.remove("hidden");
  document.getElementById("suggestText")?.focus();
}

function openSuggestStep1() {
  suggestTopic = null;
  step2?.classList.add("hidden");
  step1?.classList.remove("hidden");
  const ta = document.getElementById("suggestText");
  if (ta) ta.value = "";
}

pickIdea?.addEventListener("click", () => openSuggestStep2("idea"));
pickCollab?.addEventListener("click", () => openSuggestStep2("collab"));

sendFinal?.addEventListener("click", () => {
  const ta = document.getElementById("suggestText");
  const text = ta?.value.trim();
  if (!text || !suggestTopic) return;

  tgSend({ type: "suggestion", topic: suggestTopic, text });

  if (ta) ta.value = "";
  alert("✅ Сообщение отправлено");
});

clearBtn?.addEventListener("click", () => {
  const ta = document.getElementById("suggestText");
  if (ta) ta.value = "";
});

backBtn?.addEventListener("click", () => openSuggestStep1());

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
    listEl.querySelectorAll(".catalog-item").forEach((btn) => {
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
    loading?.classList.add("hidden");
    app?.classList.remove("hidden");

    app?.classList.remove("menu-mode");

    showPage("welcome");
    setTimeout(typeWelcomeText, 200);

    if (window.Telegram?.WebApp) Telegram.WebApp.expand();
  }
  if (bar) bar.style.width = p + "%";
}, 120);

/* ===== закрытие окон ===== */
const x1 = document.getElementById("x1");
const x2 = document.getElementById("x2");
const cancelLoad = document.getElementById("cancelLoad");

x1 && (x1.onclick = () => loading?.classList.add("hidden"));
x2 && (x2.onclick = () => app?.classList.add("hidden"));
cancelLoad && (cancelLoad.onclick = () => loading?.classList.add("hidden"));

/* ===== Welcome buttons ===== */
document
  .getElementById("btnChannel")
  ?.addEventListener("click", () => openTgLink(CHANNEL_URL));
document
  .getElementById("btnChat")
  ?.addEventListener("click", () => openTgLink(CHAT_URL));
document.getElementById("btnMenu")?.addEventListener("click", () => {
  app?.classList.add("menu-mode");
  showPage("tools");
});

/* ===========================================================
   TRADE-UP (TABLE UI) — только новая версия
   =========================================================== */

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function getRarityName(s) {
  const r = s?.rarity;
  if (!r) return "";
  if (typeof r === "string") return r.trim();
  if (typeof r === "object" && r.name) return String(r.name).trim();
  return "";
}

function getCollectionName(s) {
  // ByMykel skins.json: коллекции лежат в массиве "collections"
  // Нам для trade-up нужна 1 основная коллекция (обычно первая)
  const arr = s?.collections;
  if (Array.isArray(arr) && arr.length) {
    const c0 = arr[0];
    if (typeof c0 === "string") return c0.trim();
    if (typeof c0 === "object" && c0.name) return String(c0.name).trim();
  }

  // fallback на старые версии (если вдруг попадётся поле collection)
  const c = s?.collection;
  if (!c) return "";
  if (typeof c === "string") return c.trim();
  if (typeof c === "object" && c.name) return String(c.name).trim();
  return "";
}

function getMinFloat(s) {
  const v = s?.min_float ?? s?.minFloat ?? s?.float_min ?? s?.floatMin;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function getMaxFloat(s) {
  const v = s?.max_float ?? s?.maxFloat ?? s?.float_max ?? s?.floatMax;
  const n = Number(v);
  return Number.isFinite(n) ? n : 1;
}

function normalizeRarityUI(r) {
  const x = String(r || "").trim().toLowerCase();
  if (x.includes("consumer")) return "Consumer";
  if (x.includes("industrial")) return "Industrial";
  if (x.includes("mil-spec") || x.includes("milspec")) return "Mil-Spec";
  if (x.includes("restricted")) return "Restricted";
  if (x.includes("classified")) return "Classified";
  if (x.includes("covert")) return "Covert";
  return r || "";
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
  html += `<div><b>Avg float:</b> ${escapeHtml(result.avg_float)}</div>`;

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
    const p = (Number(o.prob) * 100).toFixed(2);

   const stashBtn = o.links?.stash
  ? `<button class="hl-btn" style="margin-right:6px;" data-open="${escapeHtml(o.links.stash)}">Stash</button>`
  : "";

const csfloatBtn = o.links?.csfloat
  ? `<button class="hl-btn" style="margin-right:6px;" data-open="${escapeHtml(o.links.csfloat)}">CSFloat</button>`
  : "";

const clashBtn = o.links?.clash
  ? `<button class="hl-btn" style="margin-right:6px;" data-open="${escapeHtml(o.links.clash)}">Clash</button>`
  : "";

const steamBtn = o.links?.steam
  ? `<button class="hl-btn" data-open="${escapeHtml(o.links.steam)}">Steam</button>`
  : "";

    html += `<div style="margin-top:10px;">
      • <b>${p}%</b> — ${escapeHtml(o.name)}
      <span class="hl-muted">(${escapeHtml(o.collection)})</span>
      — float≈${escapeHtml(o.float_out)}
     <div style="margin-top:6px; display:flex; gap:6px; flex-wrap:wrap;">
  ${stashBtn}${csfloatBtn}${clashBtn}${steamBtn}
</div>
    </div>`;
  }

  out.innerHTML = html;
}

/* ===== NEW TRADEUP UI (TABLE) ===== */
let skinsDB = [];          // нормализованная база для UI
let contractItems = [];    // [{name, collection, rarity, float}]

async function loadTradeupSkins() {
  // прогреваем индекс (tradeup.js) — нужен simulateTradeup
  await ensureTradeupReady();

  const res = await fetch("/data/skins.json", { cache: "force-cache" });
  if (!res.ok) throw new Error(`Не удалось загрузить /data/skins.json (HTTP ${res.status})`);
  const data = await res.json();

  // Нормализуем, чтобы UI был стабильным
  skinsDB = (Array.isArray(data) ? data : [])
    .map((s, idx) => {
      const name = (s?.name || s?.market_hash_name || s?.marketHashName || "").trim();
      const collection = getCollectionName(s);
      const rarity = normalizeRarityUI(getRarityName(s));
      const min = getMinFloat(s);
      const max = getMaxFloat(s);

      if (!name || !collection || !rarity) return null;

      // Если вдруг есть мусорные сущности — можешь расширить фильтр позже
      if (s?.souvenir === true) return null;

      return {
        id: idx, // стабильный id
        name,
        nameLower: name.toLowerCase(),
        collection,
        rarity,
        min,
        max,
      };
    })
    .filter(Boolean);

  renderCollections();
  renderSkinsTable();
  renderContract();
}

function renderCollections() {
  const select = document.getElementById("collectionFilter");
  if (!select) return;

  const current = select.value;

  const set = new Set();
  skinsDB.forEach((s) => {
    if (s.collection) set.add(s.collection);
  });

  const arr = [...set].sort((a, b) => a.localeCompare(b));

  select.innerHTML = `<option value="">Any Collection</option>`;
  arr.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });

  select.value = current || "";
}

function renderSkinsTable() {
  const table = document.getElementById("skinsTable");
  if (!table) return;

  const searchEl = document.getElementById("skinSearch");
  const rarityEl = document.getElementById("rarityFilter");
  const collEl = document.getElementById("collectionFilter");

  const search = (searchEl?.value || "").trim().toLowerCase();
  const rarity = (rarityEl?.value || "").trim();
  const collection = (collEl?.value || "").trim();

  let list = skinsDB.filter((s) => {
    if (search && !s.nameLower.includes(search)) return false;
    if (rarity && s.rarity !== rarity) return false;
    if (collection && s.collection !== collection) return false;
    return true;
  });

  list = list.slice(0, 40);

  if (!list.length) {
    table.innerHTML = `<div class="hl-muted">Ничего не найдено</div>`;
    return;
  }

  let html = `
<table style="width:100%;font-size:12px;border-collapse:collapse">
  <tr style="opacity:.9">
    <th align="left" style="padding:6px 4px;">Skin</th>
    <th align="left" style="padding:6px 4px;">Collection</th>
    <th align="left" style="padding:6px 4px;">Rarity</th>
    <th align="left" style="padding:6px 4px;">Float</th>
    <th style="padding:6px 4px;"></th>
  </tr>
`;

  list.forEach((s) => {
    html += `
  <tr>
    <td style="padding:6px 4px;">${escapeHtml(s.name)}</td>
    <td style="padding:6px 4px;opacity:.9;">${escapeHtml(s.collection)}</td>
    <td style="padding:6px 4px;">${escapeHtml(s.rarity)}</td>
    <td style="padding:6px 4px;opacity:.9;">${s.min.toFixed(2)}-${s.max.toFixed(2)}</td>
    <td style="padding:6px 4px;text-align:right;">
      <button class="hl-btn addSkin" data-id="${s.id}">+</button>
    </td>
  </tr>`;
  });

  html += `</table>`;
  table.innerHTML = html;
}

function renderContract() {
  const el = document.getElementById("contractList");
  if (!el) return;

  const rarity = contractItems[0]?.rarity || "";
  const need = 10;

  let html = `<div class="hl-muted">Нужно <b>${need}</b> строк. Сейчас: <b>${contractItems.length}</b>${rarity ? ` • Rarity: <b>${escapeHtml(rarity)}</b>` : ""}</div>`;

  if (!contractItems.length) {
    html += `<div class="hl-text" style="opacity:.9;">Добавь скины кнопкой “+” из списка выше.</div>`;
    el.innerHTML = html;
    return;
  }

  contractItems.forEach((s, i) => {
    html += `
<div style="margin-top:6px; padding:6px; border:1px solid rgba(0,0,0,.35); background:rgba(0,0,0,.10);">
  <div>
    <b>${i + 1}.</b> ${escapeHtml(s.name)} 
    <span class="hl-muted">(${escapeHtml(s.collection)})</span>
  </div>
 <div class="hl-muted">
float:
<input
  type="number"
  step="0.0000001"
  min="${s.min}"
  max="${s.max}"
  value="${Number(s.float).toFixed(6)}"
  class="hl-input floatInput"
  data-i="${i}"
  style="width:110px;"
>
<span style="opacity:.6;font-size:11px;">
(${s.min.toFixed(2)} – ${s.max.toFixed(2)})
</span>
</div>
  <div style="margin-top:6px; display:flex; gap:6px; flex-wrap:wrap;">
    <button class="hl-btn dup" data-i="${i}">Duplicate</button>
    <button class="hl-btn rem" data-i="${i}">Remove</button>
  </div>
</div>`;
  });

  el.innerHTML = html;
}

function clearTradeup() {
  contractItems = [];
  renderContract();
  const out = document.getElementById("tradeupResult");
  if (out) out.innerHTML = "";
}

/* --- фильтры --- */
document.addEventListener("input", (e) => {
  if (!e.target) return;
  if (
    e.target.id === "skinSearch" ||
    e.target.id === "rarityFilter" ||
    e.target.id === "collectionFilter"
  ) {
    renderSkinsTable();
  }
});

/* --- add/dup/rem --- */
document.addEventListener("click", (e) => {
  const add = e.target.closest(".addSkin");
  if (add) {
    const id = Number(add.dataset.id);
    const s = skinsDB.find((x) => x.id === id);
    if (!s) return;

    // правило: один контракт = одна редкость
    const currentRarity = contractItems[0]?.rarity;
    if (currentRarity && s.rarity !== currentRarity) {
      alert("Все предметы в контракте должны быть одной редкости.");
      return;
    }

    if (contractItems.length >= 10) {
      alert("Лимит: 10 предметов.");
      return;
    }

    // default float: 0.01 если min=0, иначе min
    let float = s.min <= 0.01 ? 0.01 : s.min;
    float = Math.min(float, s.max);

    contractItems.push({
      name: s.name,
      collection: s.collection,
      rarity: s.rarity,
      float,
      min: s.min,
      max: s.max,
    });

    renderContract();
    return;
  }

  const dup = e.target.closest(".dup");
  if (dup) {
    const i = Number(dup.dataset.i);
    const it = contractItems[i];
    if (!it) return;

    if (contractItems.length >= 10) {
      alert("Лимит: 10 предметов.");
      return;
    }

    // гарантируем min/max
    const min = Number.isFinite(it.min) ? it.min : 0;
    const max = Number.isFinite(it.max) ? it.max : 1;
    let float = Number.isFinite(it.float) ? it.float : (min <= 0.01 ? 0.01 : min);
    if (float < min) float = min;
    if (float > max) float = max;

    contractItems.push({ ...it, min, max, float });
    renderContract();
    return;
  }

  const rem = e.target.closest(".rem");
  if (rem) {
    const i = Number(rem.dataset.i);
    if (!Number.isFinite(i)) return;
    contractItems.splice(i, 1);
    renderContract();
    return;
  }
});

/* --- float input (clamp to skin range) --- */
function clamp(v, a, b) {
  return Math.min(b, Math.max(a, v));
}

// обновляем значение без “прыжков” курсора: форматируем на blur/change
document.addEventListener("input", (e) => {
  const f = e.target.closest(".floatInput");
  if (!f) return;

  const i = Number(f.dataset.i);
  const item = contractItems[i];
  if (!item) return;

  let val = Number(f.value);
  if (!Number.isFinite(val)) return;

  const min = Number.isFinite(item.min) ? item.min : 0;
  const max = Number.isFinite(item.max) ? item.max : 1;

  item.float = clamp(val, min, max);
});

document.addEventListener("change", (e) => {
  const f = e.target.closest(".floatInput");
  if (!f) return;

  const i = Number(f.dataset.i);
  const item = contractItems[i];
  if (!item) return;

  const min = Number.isFinite(item.min) ? item.min : 0;
  const max = Number.isFinite(item.max) ? item.max : 1;

  // приводим к диапазону и красиво форматируем
  item.float = clamp(Number(item.float), min, max);
  f.value = Number(item.float).toFixed(6);
});
/* --- calc/clear --- */
document.getElementById("tradeupCalc")?.addEventListener("click", async () => {
  if (contractItems.length !== 10) {
    renderTradeupResult({ error: `Нужно ровно 10 предметов. Сейчас: ${contractItems.length}` });
    return;
  }

  // правило: одна редкость
  const r = contractItems[0]?.rarity;
  if (!r || contractItems.some((x) => x.rarity !== r)) {
    renderTradeupResult({ error: "Все 10 предметов должны быть одной редкости." });
    return;
  }

  try {
    await ensureTradeupReady();
  } catch (e) {
    renderTradeupResult({ error: String(e?.message || e) });
    return;
  }

  const result = simulateTradeup(
    contractItems.map((x) => ({
      collection: x.collection,
      rarity: x.rarity,
      float: x.float,
    }))
  );

  renderTradeupResult(result);
});

document.getElementById("tradeupClear")?.addEventListener("click", () => {
  clearTradeup();
});

/* ===== старт загрузки таблицы trade-up ===== */
loadTradeupSkins().catch((e) => {
  const out = document.getElementById("tradeupResult");
  if (out) out.innerHTML = `❌ ${escapeHtml(String(e?.message || e))}`;
});
