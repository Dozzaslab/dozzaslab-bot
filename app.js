const loading = document.getElementById('loading');
const app = document.getElementById('app');
const bar = document.getElementById('bar');

/* ===== LINKS ===== */
const CHANNEL_URL = "https://t.me/dozza_8";
const CHAT_URL    = "https://t.me/+YmGqLAkSQU0yYmUy";

function openTgLink(url) {
  if (!url) return;

  // Внутри Telegram лучше открывать tg-ссылки так:
  if (window.Telegram?.WebApp?.openTelegramLink) {
    Telegram.WebApp.openTelegramLink(url);
    return;
  }

  // fallback (иногда полезен для внешних url)
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

  // показываем только страницы верхнего уровня
  root.querySelectorAll(':scope > .page').forEach(p => {
    p.classList.toggle('hidden', p.dataset.page !== page);
  });

  // активная таб-кнопка
  document.querySelectorAll('.hl-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.page === page);
  });

  scrollToTop();

  // при входе в каталог всегда показываем 2 кнопки
  if (page === 'catalog' && window.__catalogShowHome) {
    window.__catalogShowHome();
  }

  // ✅ при входе в любую вкладку сбрасываем вложенные экраны (если есть)
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

  // Делегирование кликов внутри этой вкладки
  page.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (go) return show(go.dataset.go);

    const b = e.target.closest("[data-back]");
    if (b) return back();
  });

  // экспортируем reset на вкладку (чтобы при входе сбрасывать в корень)
  window.__resetSubnav = window.__resetSubnav || {};
  window.__resetSubnav[pageName] = () => {
    stack.length = 0;
    show(initialScreenId, { push: false });
  };

  // стартовое состояние
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

  // ✅ экспортируем showHome, чтобы showPage('catalog') мог вызвать
  window.__catalogShowHome = showHome;

  // стартовое состояние каталога
  showHome();
})();

/* ===== Инициализация subnav для вкладки INVEST + TOOLS ===== */
initSubnav("invest", "investHome");
initSubnav("tools", "toolsHome");

/* ===== загрузка ===== */
let p = 0;
const timer = setInterval(() => {
  p += Math.floor(Math.random() * 12) + 6;
  if (p >= 100) {
    p = 100;
    clearInterval(timer);
    loading?.classList.add('hidden');
    app?.classList.remove('hidden');

    // ✅ стартуем без вкладок
    app?.classList.remove('menu-mode');

    showPage('welcome'); // стартуем с приветственного экрана
    if (window.Telegram?.WebApp) Telegram.WebApp.expand();
  }
  if (bar) bar.style.width = p + '%';
}, 120);

/* ===== закрытие окон (без падений если элемента нет) ===== */
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
  app?.classList.add("menu-mode");   // включаем вкладки (всё меню)
  showPage("contracts");             // стартовая вкладка меню
});
