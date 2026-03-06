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

/* ===== I18N ===== */
const LANG_STORAGE_KEY = "dozzaslab_lang";

const UI_RARITIES = [
  "Consumer",
  "Industrial",
  "Mil-Spec",
  "Restricted",
  "Classified",
  "Covert",
];

const translations = {
  ru: {
    loading_title: "Loading...",
    loading_text: "Loading website resources...",
    cancel: "Отмена",

    tab_tools: "🌐 Сайты для торговли",
    tab_catalog: "🎁 Кейсы и капсулы",
    tab_collections: "📦 Коллекции",
    tab_contracts: "🧪 Контракты",
    tab_invest: "💼 Другие проекты",
    tab_about: "🧑‍💻 О себе",
    tab_faq: "🧠 FAQ",
    tab_suggest: "📬 Предложка",

    contracts_title: "🧪 Контракты (Trade-Up)",
    search_skin: "🔎 Search skin...",
    any_rarity: "Любая редкость",
    any_collection: "Любая коллекция",
    contract_items: "Предметы контракта",
    calculate: "Рассчитать",
    clear: "Очистить",

    rarity_consumer: "Consumer / Ширпотреб",
    rarity_industrial: "Industrial / Промышленное",
    rarity_milspec: "Mil-Spec / Армейское",
    rarity_restricted: "Restricted / Запрещённое",
    rarity_classified: "Classified / Засекреченное",
    rarity_covert: "Covert / Тайное",

    skin: "Skin",
    collection: "Collection",
    rarity: "Rarity",
    float: "Float",

    nothing_found: "Ничего не найдено",
    need_rows: "Нужно",
    rows_now: "Сейчас",
    add_skin_hint: "Добавь скины кнопкой “+” из списка выше.",
    duplicate: "Дублировать",
    remove: "Удалить",

    input_rarity: "Входная редкость",
    output_rarity: "Выходная редкость",
    avg_float: "Средний float",
    covered_prob: "Покрытая вероятность",
    no_collection_data: "Нет данных по коллекциям",
    outcomes: "Результаты",
    empty_outcomes: "Пусто (для этих коллекций/редкости нет outcomes в базе).",

    msg_sent: "✅ Сообщение отправлено",
    webapp_unavailable: "WebApp API недоступен (открой внутри Telegram)",
    same_rarity_only: "Все предметы в контракте должны быть одной редкости.",
    limit_items: "Лимит: {count} предметов.",
    add_items_first: "Добавь предметы в контракт.",
    exact_items_needed: "Нужно ровно {count} предметов. Сейчас: {current}",
    same_rarity_required: "Все предметы должны быть одной редкости.",

    welcome_title: "🧠 Рынок любит тех, кто думает.",
    welcome_tip: "Совет: подпишись, чтобы не пропускать колы 🔥.",
    btn_channel: "1️⃣ 🔔 Подписаться на канал",
    btn_chat: "2️⃣ 💬 Перейти в чат",
    btn_menu: "3️⃣ 🚀 Войти в меню",
    welcome_text: `Я инвестирую в скины осознанно — анализирую рынок и выбираю сильные позиции.
Делюсь инструментами и площадками для торговли, помогаю не действовать на эмоциях.

Системный подход. Реальные ориентиры.
Иногда — розыгрыши для активных 🔥`,

    catalog_title: "🎁 Кейсы и капсулы",
    choose_section: "Выбери раздел:",
    cases_btn: "📦 Кейсы",
    capsules_btn: "💊 Капсулы",
    back: "⬅️ Назад",
    case_search: "🔎 Поиск кейса...",
    capsule_search: "🔎 Поиск капсулы...",
    cases_list_title: "📦 Список кейсов",
    capsules_list_title: "💊 Список капсул",

    collections_title: "📦 Коллекции",
    collections_text: "Здесь будет список коллекций.",

    tools_title: "🌐 Сайты для торговли",
    tools_marketplaces: "🛒 Маркетплейсы",
    tools_instruments: "🧰 Инструменты",
    tools_note: "🔒 Лично проверено — торговал на этих площадках",
    price_compare: "⚖️ Сравнение цен",

    faq_title: "🧠 FAQ",
    faq_text: `• Контракт = 10 скинов одной редкости → 1 скин следующей редкости.<br/>
• Шансы зависят от доли коллекций среди 10 входных.`,

    suggest_title: "📬 Предложка",
    suggest_choose_type: "Выбери тип:",
    suggest_idea: "💡 Идея / улучшение",
    suggest_collab: "🤝 Сотрудничество",
    suggest_topic_empty: "Тема: —",
    suggest_topic_idea: "Тема: 💡 Идея / улучшение",
    suggest_topic_collab: "Тема: 🤝 Сотрудничество",
    suggest_placeholder: "Напиши сообщение...",
    send: "Отправить",

    about_title: "🧑‍💻 О себе",
    about_closing: "Рынок любит тех, кто думает.",
    about_content: `👋 Привет. Я — аналитик и коллекционер цифровых активов в CS.

🎯 Начал инвестировать системно с выходом CS2.
До этого, как и многие, покупал скины хаотично — без стратегии и понимания рынка.

📦 Первый капитал сделал на перепродаже кейсов.
Изучал циклы спроса, поведение старых коллекций и влияние дефицита.

💎 Затем перешёл в нишу редких скинов с наклейками —
там, где важны детали: паттерн, флоат, история коллекции и редкость комбинации.

📊 Сейчас основа стратегии — анализ поведения старых коллекций,
которые уже доказали свою доходность во времени.

🧠 Я не гадаю — я анализирую.
Работаю от данных, логики рынка и психологии спроса.

🤝 Помогаю новичкам освоиться:
• понять, где ликвидность
• не терять деньги на эмоциях
• выбрать первые позиции осознанно

🔥 Здесь ты найдёшь системный подход, реальные ориентиры и разборы без воды.`,

    invest_title: "💼 Другие проекты инвестирования",
    choose_project: "Выбери проект:",
    deadlock_text: "Тут будут новости после официальных стартов продаж скинов и запуска маркета.",
    sbox_question: "Что тебя интересует?",
    sbox_get: "🎮 Как получить игру",
    sbox_market: "🛒 Маркет скинов",
    sbox_tracker: "📊 Трекинг портфелей",
    sbox_get_text: "Официальный сайт игры.",
    sbox_open: "🌐 Открыть s&box",
    sbox_market_text: "Официальный item store.",
    sbox_market_open: "🛍️ Открыть маркет",
    sbox_tracker_text: "Просмотр инвентаря и трекинг.",
    sbox_tracker_open: "📈 Открыть трекер",
  },

  en: {
    loading_title: "Loading...",
    loading_text: "Loading website resources...",
    cancel: "Cancel",

    tab_tools: "🌐 Trading websites",
    tab_catalog: "🎁 Cases and capsules",
    tab_collections: "📦 Collections",
    tab_contracts: "🧪 Contracts",
    tab_invest: "💼 Other projects",
    tab_about: "🧑‍💻 About me",
    tab_faq: "🧠 FAQ",
    tab_suggest: "📬 Suggestions",

    contracts_title: "🧪 Contracts (Trade-Up)",
    search_skin: "🔎 Search skin...",
    any_rarity: "Any Rarity",
    any_collection: "Any Collection",
    contract_items: "Contract Items",
    calculate: "Calculate",
    clear: "Clear",

    rarity_consumer: "Consumer / Ширпотреб",
    rarity_industrial: "Industrial / Промышленное",
    rarity_milspec: "Mil-Spec / Армейское",
    rarity_restricted: "Restricted / Запрещённое",
    rarity_classified: "Classified / Засекреченное",
    rarity_covert: "Covert / Тайное",

    skin: "Skin",
    collection: "Collection",
    rarity: "Rarity",
    float: "Float",

    nothing_found: "Nothing found",
    need_rows: "Need",
    rows_now: "Current",
    add_skin_hint: "Add skins using the “+” button from the list above.",
    duplicate: "Duplicate",
    remove: "Remove",

    input_rarity: "Input rarity",
    output_rarity: "Output rarity",
    avg_float: "Avg float",
    covered_prob: "Covered prob",
    no_collection_data: "No data for collections",
    outcomes: "Outcomes",
    empty_outcomes: "Empty (there are no outcomes in the database for these collections/rarity).",

    msg_sent: "✅ Message sent",
    webapp_unavailable: "WebApp API unavailable (open inside Telegram)",
    same_rarity_only: "All items in the contract must have the same rarity.",
    limit_items: "Limit: {count} items.",
    add_items_first: "Add items to the contract.",
    exact_items_needed: "You need exactly {count} items. Current: {current}",
    same_rarity_required: "All items must have the same rarity.",

    welcome_title: "🧠 The market favors those who think.",
    welcome_tip: "Tip: subscribe so you don’t miss calls 🔥.",
    btn_channel: "1️⃣ 🔔 Subscribe to the channel",
    btn_chat: "2️⃣ 💬 Open chat",
    btn_menu: "3️⃣ 🚀 Enter menu",
    welcome_text: `I invest in skins consciously — I analyze the market and pick strong positions.
I share tools and marketplaces for trading and help avoid emotional decisions.

A systematic approach. Real reference points.
Sometimes — giveaways for active members 🔥`,

    catalog_title: "🎁 Cases and capsules",
    choose_section: "Choose a section:",
    cases_btn: "📦 Cases",
    capsules_btn: "💊 Capsules",
    back: "⬅️ Back",
    case_search: "🔎 Search case...",
    capsule_search: "🔎 Search capsule...",
    cases_list_title: "📦 Case list",
    capsules_list_title: "💊 Capsule list",

    collections_title: "📦 Collections",
    collections_text: "A list of collections will appear here.",

    tools_title: "🌐 Trading websites",
    tools_marketplaces: "🛒 Marketplaces",
    tools_instruments: "🧰 Tools",
    tools_note: "🔒 Personally tested — I have traded on these platforms",
    price_compare: "⚖️ Price comparison",

    faq_title: "🧠 FAQ",
    faq_text: `• A contract = 10 skins of the same rarity → 1 skin of the next rarity.<br/>
• The odds depend on the collection share among the 10 inputs.`,

    suggest_title: "📬 Suggestions",
    suggest_choose_type: "Choose a type:",
    suggest_idea: "💡 Idea / improvement",
    suggest_collab: "🤝 Collaboration",
    suggest_topic_empty: "Topic: —",
    suggest_topic_idea: "Topic: 💡 Idea / improvement",
    suggest_topic_collab: "Topic: 🤝 Collaboration",
    suggest_placeholder: "Write a message...",
    send: "Send",

    about_title: "🧑‍💻 About me",
    about_closing: "The market favors those who think.",
    about_content: `👋 Hi. I’m an analyst and collector of digital CS assets.

🎯 I started investing systematically with the release of CS2.
Before that, like many others, I bought skins chaotically — without strategy or market understanding.

📦 I built my first capital by reselling cases.
I studied demand cycles, the behavior of old collections, and the impact of scarcity.

💎 Then I moved into the niche of rare stickered skins —
where details matter: pattern, float, collection history, and rarity of the combo.

📊 Now the core of my strategy is analyzing the behavior of old collections
that have already proven their profitability over time.

🧠 I don’t guess — I analyze.
I work from data, market logic, and demand psychology.

🤝 I help newcomers get comfortable:
• understand where liquidity is
• avoid losing money to emotions
• choose first positions consciously

🔥 Here you’ll find a systematic approach, real reference points, and breakdowns without fluff.`,

    invest_title: "💼 Other investment projects",
    choose_project: "Choose a project:",
    deadlock_text: "News will appear here after the official skin sales and market launch.",
    sbox_question: "What are you interested in?",
    sbox_get: "🎮 How to get the game",
    sbox_market: "🛒 Skin market",
    sbox_tracker: "📊 Portfolio tracking",
    sbox_get_text: "Official game website.",
    sbox_open: "🌐 Open s&box",
    sbox_market_text: "Official item store.",
    sbox_market_open: "🛍️ Open market",
    sbox_tracker_text: "Inventory view and tracking.",
    sbox_tracker_open: "📈 Open tracker",
  },
};

let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || "ru";

function t(key, vars = {}) {
  let str =
    translations[currentLang]?.[key] ??
    translations.ru?.[key] ??
    key;

  Object.entries(vars).forEach(([k, v]) => {
    str = str.replaceAll(`{${k}}`, String(v));
  });

  return str;
}

function getLocalizedRarityLabel(rarity) {
  const r = normalizeRarityUI(rarity);
  if (r === "Consumer") return t("rarity_consumer");
  if (r === "Industrial") return t("rarity_industrial");
  if (r === "Mil-Spec") return t("rarity_milspec");
  if (r === "Restricted") return t("rarity_restricted");
  if (r === "Classified") return t("rarity_classified");
  if (r === "Covert") return t("rarity_covert");
  return r;
}

function getRarityOptionClass(rarity) {
  const r = normalizeRarityUI(rarity);
  if (r === "Consumer") return "rarity-option-consumer";
  if (r === "Industrial") return "rarity-option-industrial";
  if (r === "Mil-Spec") return "rarity-option-milspec";
  if (r === "Restricted") return "rarity-option-restricted";
  if (r === "Classified") return "rarity-option-classified";
  if (r === "Covert") return "rarity-option-covert";
  return "";
}

function applyTranslations() {
  document.documentElement.lang = currentLang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = t(key);
  });

  const langBtn = document.getElementById("langToggle");
  if (langBtn) langBtn.textContent = currentLang === "ru" ? "EN" : "RU";

  setText("welcomeTitle", t("welcome_title"));
  setText("welcomeTip", t("welcome_tip"));
  setText("btnChannel", t("btn_channel"));
  setText("btnChat", t("btn_chat"));
  setText("btnMenu", t("btn_menu"));
  const welcomeSource = document.getElementById("welcomeSource");
  if (welcomeSource) welcomeSource.innerText = t("welcome_text");

  setText("catalogTitle", t("catalog_title"));
  setText("catalogChooseText", t("choose_section"));
  setText("openCases", t("cases_btn"));
  setText("openCapsules", t("capsules_btn"));
  setText("backToCatalogHome1", t("back"));
  setText("backToCatalogHome2", t("back"));
  setPlaceholder("casesSearch", t("case_search"));
  setPlaceholder("capsulesSearch", t("capsule_search"));
  setText("casesListTitle", t("cases_list_title"));
  setText("capsulesListTitle", t("capsules_list_title"));

  setText("collectionsTitle", t("collections_title"));
  setText("collectionsText", t("collections_text"));

  setText("toolsTitle", t("tools_title"));
  setText("toolsChooseText", t("choose_section"));
  setText("toolsMarketBtn", t("tools_marketplaces"));
  setText("toolsInstrumentsBtn", t("tools_instruments"));
  setText("toolsBack1", t("back"));
  setText("toolsBack2", t("back"));
  setText("toolsMarketTitle", t("tools_marketplaces"));
  setText("toolsMarketNote", t("tools_note"));
  setText("toolsInstrumentsTitle", t("tools_instruments"));
  setText("priceCompareBtn", t("price_compare"));

  setText("faqTitle", t("faq_title"));

  setText("suggestPageTitle", t("suggest_title"));
  setText("suggestChooseType", t("suggest_choose_type"));
  setText("pickIdea", t("suggest_idea"));
  setText("pickCollab", t("suggest_collab"));
  setPlaceholder("suggestText", t("suggest_placeholder"));
  setText("sendSuggestFinal", t("send"));
  setText("clearSuggest", t("clear"));
  setText("backSuggest", t("back"));
  updateSuggestTitle();

  setText("aboutTitle", t("about_title"));
  setMultilineText("aboutContent", t("about_content"));
  setText("aboutClosing", t("about_closing"));

  setText("investTitle", t("invest_title"));
  setText("investChooseText", t("choose_project"));
  setText("investBack1", t("back"));
  setText("investBack2", t("back"));
  setText("investBack3", t("back"));
  setText("investBack4", t("back"));
  setText("investBack5", t("back"));
  setText("deadlockText", t("deadlock_text"));
  setText("sboxQuestion", t("sbox_question"));
  setText("sboxGetBtn", t("sbox_get"));
  setText("sboxMarketBtn", t("sbox_market"));
  setText("sboxTrackerBtn", t("sbox_tracker"));
  setText("sboxGetText", t("sbox_get_text"));
  setText("sboxOpenBtn", t("sbox_open"));
  setText("sboxMarketText", t("sbox_market_text"));
  setText("sboxMarketOpenBtn", t("sbox_market_open"));
  setText("sboxTrackerText", t("sbox_tracker_text"));
  setText("sboxTrackerOpenBtn", t("sbox_tracker_open"));

  renderRarityFilter();
  renderCollections();
  renderSkinsTable();
  renderContract();
  rerunWelcomeTyping();
}

function setLang(lang) {
  currentLang = lang === "en" ? "en" : "ru";
  localStorage.setItem(LANG_STORAGE_KEY, currentLang);
  applyTranslations();
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setHtml(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}

function setPlaceholder(id, value) {
  const el = document.getElementById(id);
  if (el) el.placeholder = value;
}

function setMultilineText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = String(value)
    .split("\n")
    .map((line) => escapeHtml(line))
    .join("<br/>");
}

/* ===== Навигация по вкладкам ===== */
function showPage(page) {
  const root = document.querySelector("#app .hl-body");
  if (!root) return;

  const pages = root.querySelectorAll(".page[data-page]");
  pages.forEach((p) => {
    p.classList.toggle("hidden", p.dataset.page !== page);
  });

  document.querySelectorAll(".hl-tab[data-page]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.page === page);
  });

  scrollToTop();

  if (page === "catalog" && typeof window.__catalogShowHome === "function") {
    window.__catalogShowHome();
  }

  if (window.__resetSubnav && typeof window.__resetSubnav[page] === "function") {
    window.__resetSubnav[page]();
  }

  if (page === "welcome") {
    setTimeout(typeWelcomeText, 50);
  }
}

/* ===== Клики по вкладкам ===== */
document.addEventListener("click", (e) => {
  const tab = e.target.closest(".hl-tab[data-page]");
  if (!tab) return;

  e.preventDefault();
  e.stopPropagation();

  showPage(tab.dataset.page);
});

window.addEventListener("error", (e) => {
  console.error("APP ERROR:", e.error || e.message || e);
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("PROMISE ERROR:", e.reason || e);
});

document.getElementById("langToggle")?.addEventListener("click", () => {
  setLang(currentLang === "ru" ? "en" : "ru");
});

/* ===== Делегирование кликов по data-open ===== */
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
    alert(t("webapp_unavailable"));
  }
}

/* ===== Навигация внутри одной вкладки ===== */
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

/* ===== Предложка ===== */
let suggestTopic = null;

const step1 = document.getElementById("suggestStep1");
const step2 = document.getElementById("suggestStep2");
const title = document.getElementById("suggestTitle");

const pickIdea = document.getElementById("pickIdea");
const pickCollab = document.getElementById("pickCollab");

const sendFinal = document.getElementById("sendSuggestFinal");
const backBtn = document.getElementById("backSuggest");
const clearBtn = document.getElementById("clearSuggest");

function updateSuggestTitle() {
  if (!title) return;

  if (suggestTopic === "collab") {
    title.textContent = t("suggest_topic_collab");
  } else if (suggestTopic === "idea") {
    title.textContent = t("suggest_topic_idea");
  } else {
    title.textContent = t("suggest_topic_empty");
  }
}

function openSuggestStep2(topic) {
  suggestTopic = topic;
  updateSuggestTitle();

  step1?.classList.add("hidden");
  step2?.classList.remove("hidden");
  document.getElementById("suggestText")?.focus();
}

function openSuggestStep1() {
  suggestTopic = null;
  updateSuggestTitle();
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
  alert(t("msg_sent"));
});

clearBtn?.addEventListener("click", () => {
  const ta = document.getElementById("suggestText");
  if (ta) ta.value = "";
});

backBtn?.addEventListener("click", () => openSuggestStep1());

/* ===== Кейсы/Капсулы ===== */
(function initCatalog() {
  const home = document.getElementById("catalogHome");
  const cases = document.getElementById("catalogCases");
  const caps = document.getElementById("catalogCapsules");

  const openCases = document.getElementById("openCases");
  const openCaps = document.getElementById("openCapsules");

  const back1 = document.getElementById("backToCatalogHome1");
  const back2 = document.getElementById("backToCatalogHome2");

  const casesSearch = document.getElementById("casesSearch");
  const casesList = document.getElementById("casesList");

  const capsulesHome = document.getElementById("capsulesHome");
  const capsulesMajor = document.getElementById("capsulesMajor");
  const capsulesAutograph = document.getElementById("capsulesAutograph");
  const capsulesSpecial = document.getElementById("capsulesSpecial");

  const openMajorCapsules = document.getElementById("openMajorCapsules");
  const openAutographCapsules = document.getElementById("openAutographCapsules");
  const openSpecialCapsules = document.getElementById("openSpecialCapsules");

  const backToCapsulesHome1 = document.getElementById("backToCapsulesHome1");
  const backToCapsulesHome2 = document.getElementById("backToCapsulesHome2");
  const backToCapsulesHome3 = document.getElementById("backToCapsulesHome3");

  const capsulesMajorSearch = document.getElementById("capsulesMajorSearch");
  const capsulesAutographSearch = document.getElementById("capsulesAutographSearch");
  const capsulesSpecialSearch = document.getElementById("capsulesSpecialSearch");

  const capsulesMajorList = document.getElementById("capsulesMajorList");
  const capsulesAutographList = document.getElementById("capsulesAutographList");
  const capsulesSpecialList = document.getElementById("capsulesSpecialList");

  if (!home || !cases || !caps) {
    console.warn("Catalog init skipped: required root elements not found");
    return;
  }

  function filterList(listEl, query) {
    if (!listEl) return;
    const q = String(query || "").trim().toLowerCase();

    listEl.querySelectorAll(".catalog-item").forEach((btn) => {
      const text = (btn.textContent || "").toLowerCase();
      btn.style.display = text.includes(q) ? "" : "none";
    });
  }

  function resetCapsuleSearches() {
    if (capsulesMajorSearch) capsulesMajorSearch.value = "";
    if (capsulesAutographSearch) capsulesAutographSearch.value = "";
    if (capsulesSpecialSearch) capsulesSpecialSearch.value = "";

    filterList(capsulesMajorList, "");
    filterList(capsulesAutographList, "");
    filterList(capsulesSpecialList, "");
  }

  function showHome() {
    home.classList.remove("hidden");
    cases.classList.add("hidden");
    caps.classList.add("hidden");

    if (casesSearch) casesSearch.value = "";
    filterList(casesList, "");
    resetCapsuleSearches();
    scrollToTop();
  }

  function showCases() {
    home.classList.add("hidden");
    cases.classList.remove("hidden");
    caps.classList.add("hidden");

    scrollToTop();
    if (casesSearch) casesSearch.focus();
  }

  function showCapsulesHome() {
    home.classList.add("hidden");
    cases.classList.add("hidden");
    caps.classList.remove("hidden");

    if (capsulesHome) capsulesHome.classList.remove("hidden");
    if (capsulesMajor) capsulesMajor.classList.add("hidden");
    if (capsulesAutograph) capsulesAutograph.classList.add("hidden");
    if (capsulesSpecial) capsulesSpecial.classList.add("hidden");

    resetCapsuleSearches();
    scrollToTop();
  }

  function showMajorCapsules() {
    if (capsulesHome) capsulesHome.classList.add("hidden");
    if (capsulesMajor) capsulesMajor.classList.remove("hidden");
    if (capsulesAutograph) capsulesAutograph.classList.add("hidden");
    if (capsulesSpecial) capsulesSpecial.classList.add("hidden");

    scrollToTop();
    if (capsulesMajorSearch) capsulesMajorSearch.focus();
  }

  function showAutographCapsules() {
    if (capsulesHome) capsulesHome.classList.add("hidden");
    if (capsulesMajor) capsulesMajor.classList.add("hidden");
    if (capsulesAutograph) capsulesAutograph.classList.remove("hidden");
    if (capsulesSpecial) capsulesSpecial.classList.add("hidden");

    scrollToTop();
    if (capsulesAutographSearch) capsulesAutographSearch.focus();
  }

  function showSpecialCapsules() {
    if (capsulesHome) capsulesHome.classList.add("hidden");
    if (capsulesMajor) capsulesMajor.classList.add("hidden");
    if (capsulesAutograph) capsulesAutograph.classList.add("hidden");
    if (capsulesSpecial) capsulesSpecial.classList.remove("hidden");

    scrollToTop();
    if (capsulesSpecialSearch) capsulesSpecialSearch.focus();
  }

  openCases?.addEventListener("click", showCases);
  openCaps?.addEventListener("click", showCapsulesHome);

  back1?.addEventListener("click", showHome);
  back2?.addEventListener("click", showHome);

  openMajorCapsules?.addEventListener("click", showMajorCapsules);
  openAutographCapsules?.addEventListener("click", showAutographCapsules);
  openSpecialCapsules?.addEventListener("click", showSpecialCapsules);

  backToCapsulesHome1?.addEventListener("click", showCapsulesHome);
  backToCapsulesHome2?.addEventListener("click", showCapsulesHome);
  backToCapsulesHome3?.addEventListener("click", showCapsulesHome);

  casesSearch?.addEventListener("input", (e) => {
    filterList(casesList, e.target.value);
    scrollToTop();
  });

  capsulesMajorSearch?.addEventListener("input", (e) => {
    filterList(capsulesMajorList, e.target.value);
    scrollToTop();
  });

  capsulesAutographSearch?.addEventListener("input", (e) => {
    filterList(capsulesAutographList, e.target.value);
    scrollToTop();
  });

  capsulesSpecialSearch?.addEventListener("input", (e) => {
    filterList(capsulesSpecialList, e.target.value);
    scrollToTop();
  });

  window.__catalogShowHome = showHome;
  showHome();
})();

/* ===== Инициализация subnav ===== */
initSubnav("invest", "investHome");
initSubnav("tools", "toolsHome");
initSubnav("faq", "faqHome");

/* ===== Typewriter ===== */
let welcomeTypingTimer = null;

function typeWelcomeText() {
  const sourceEl = document.getElementById("welcomeSource");
  const targetEl = document.getElementById("welcomeTyped");
  if (!sourceEl || !targetEl) return;

  if (welcomeTypingTimer) {
    clearTimeout(welcomeTypingTimer);
    welcomeTypingTimer = null;
  }

  const text = sourceEl.innerText.trim();
  targetEl.innerHTML = "";
  let i = 0;
  const speed = 18;

  function type() {
    if (i < text.length) {
      const char = text[i];
      if (char === "\n") targetEl.innerHTML += "<br/>";
      else targetEl.innerHTML += escapeHtml(char);

      i++;
      welcomeTypingTimer = setTimeout(type, speed);
    }
  }

  type();
}

function rerunWelcomeTyping() {
  const welcomePage = document.querySelector('.page[data-page="welcome"]');
  if (!welcomePage || welcomePage.classList.contains("hidden")) return;
  setTimeout(typeWelcomeText, 50);
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

    applyTranslations();
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
   TRADE-UP
   =========================================================== */

const RARITY_COLOR = {
  Consumer: "#b0b0b0",
  Industrial: "#5e98d9",
  "Mil-Spec": "#4b69ff",
  Restricted: "#8847ff",
  Classified: "#d32ce6",
  Covert: "#eb4b4b",
  Extraordinary: "#ffd700",
};

function rarityDot(rarity) {
  const c = RARITY_COLOR[rarity] || "#888";
  return `<span style="
    display:inline-block;
    width:10px;height:10px;border-radius:999px;
    margin-right:6px; vertical-align:middle;
    background:${c}; box-shadow:0 0 0 1px rgba(0,0,0,.35);
  "></span>`;
}

function needCountByRarity(r) {
  return r === "Covert" ? 5 : 10;
}

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
  const arr = s?.collections;
  if (Array.isArray(arr) && arr.length) {
    const c0 = arr[0];
    if (typeof c0 === "string") return c0.trim();
    if (typeof c0 === "object" && c0.name) return String(c0.name).trim();
  }

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

function renderRarityFilter() {
  const select = document.getElementById("rarityFilter");
  if (!select) return;

  const current = select.value || "";

  select.innerHTML = "";

  const first = document.createElement("option");
  first.value = "";
  first.textContent = t("any_rarity");
  select.appendChild(first);

  UI_RARITIES.forEach((rarity) => {
    const opt = document.createElement("option");
    opt.value = rarity;
    opt.textContent = getLocalizedRarityLabel(rarity);
    opt.className = getRarityOptionClass(rarity);
    select.appendChild(opt);
  });

  select.value = current;
}

function renderTradeupResult(result) {
  const out = document.getElementById("tradeupResult");
  if (!out) return;

  if (result?.error) {
    out.innerHTML = `❌ ${escapeHtml(result.error)}`;
    return;
  }

  let html = "";
  html += `<div><b>${escapeHtml(t("input_rarity"))}:</b> ${escapeHtml(getLocalizedRarityLabel(result.input_rarity))}</div>`;
  html += `<div><b>${escapeHtml(t("output_rarity"))}:</b> ${escapeHtml(getLocalizedRarityLabel(result.output_rarity))}</div>`;
  html += `<div><b>${escapeHtml(t("avg_float"))}:</b> ${escapeHtml(result.avg_float)}</div>`;

  if (typeof result.total_prob_covered === "number") {
    html += `<div><b>${escapeHtml(t("covered_prob"))}:</b> ${(result.total_prob_covered * 100).toFixed(2)}%</div>`;
  }

  if (result.missing_collections?.length) {
    html += `<div style="margin-top:6px;">⚠️ ${escapeHtml(t("no_collection_data"))}: <b>${result.missing_collections.map(escapeHtml).join(", ")}</b></div>`;
  }

  html += `<div style="margin-top:10px;"><b>${escapeHtml(t("outcomes"))}:</b></div>`;

  if (!result.outcomes?.length) {
    html += `<div>${escapeHtml(t("empty_outcomes"))}</div>`;
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
      • <b>${p}%</b> — ${rarityDot(result.output_rarity)}${escapeHtml(o.name)}
      <span class="hl-muted">(${escapeHtml(o.collection)})</span>
      — float≈${escapeHtml(o.float_out)}
      <div style="margin-top:6px; display:flex; gap:6px; flex-wrap:wrap;">
        ${stashBtn}${csfloatBtn}${clashBtn}${steamBtn}
      </div>
    </div>`;
  }

  out.innerHTML = html;
}

let skinsDB = [];
let contractItems = [];

async function loadTradeupSkins() {
  await ensureTradeupReady();

  const res = await fetch("/data/skins.json", { cache: "force-cache" });
  if (!res.ok) {
    throw new Error(`Не удалось загрузить /data/skins.json (HTTP ${res.status})`);
  }
  const data = await res.json();

  skinsDB = (Array.isArray(data) ? data : [])
    .map((s, idx) => {
      const name = (s?.name || s?.market_hash_name || s?.marketHashName || "").trim();
      const collection = getCollectionName(s);
      const rarity = normalizeRarityUI(getRarityName(s));
      const min = getMinFloat(s);
      const max = getMaxFloat(s);

      if (!name || !collection || !rarity) return null;
      if (s?.souvenir === true) return null;

      return {
        id: idx,
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

  select.innerHTML = `<option value="">${escapeHtml(t("any_collection"))}</option>`;
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
    table.innerHTML = `<div class="hl-muted">${escapeHtml(t("nothing_found"))}</div>`;
    return;
  }

  let html = `
<table style="width:100%;font-size:12px;border-collapse:collapse">
  <tr style="opacity:.9">
    <th align="left" style="padding:6px 4px;">${escapeHtml(t("skin"))}</th>
    <th align="left" style="padding:6px 4px;">${escapeHtml(t("collection"))}</th>
    <th align="left" style="padding:6px 4px;">${escapeHtml(t("rarity"))}</th>
    <th align="left" style="padding:6px 4px;">${escapeHtml(t("float"))}</th>
    <th style="padding:6px 4px;"></th>
  </tr>
`;

  list.forEach((s) => {
    html += `
  <tr>
    <td style="padding:6px 4px;">${rarityDot(s.rarity)}${escapeHtml(s.name)}</td>
    <td style="padding:6px 4px;opacity:.9;">${escapeHtml(s.collection)}</td>
    <td style="padding:6px 4px;">${escapeHtml(getLocalizedRarityLabel(s.rarity))}</td>
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
  const need = needCountByRarity(rarity);

  let html = `<div class="hl-muted">${escapeHtml(t("need_rows"))} <b>${need}</b>. ${escapeHtml(t("rows_now"))}: <b>${contractItems.length}</b>${rarity ? ` • ${escapeHtml(t("rarity"))}: <b>${escapeHtml(getLocalizedRarityLabel(rarity))}</b>` : ""}</div>`;

  if (!contractItems.length) {
    html += `<div class="hl-text" style="opacity:.9;">${escapeHtml(t("add_skin_hint"))}</div>`;
    el.innerHTML = html;
    return;
  }

  contractItems.forEach((s, i) => {
    html += `
<div style="margin-top:6px; padding:6px; border:1px solid rgba(0,0,0,.35); background:rgba(0,0,0,.10);">
  <div>
    <b>${i + 1}.</b> ${rarityDot(s.rarity)}${escapeHtml(s.name)}
    <span class="hl-muted">(${escapeHtml(s.collection)})</span>
  </div>

  <div class="hl-muted" style="margin-top:6px; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
    <span>${escapeHtml(t("float"))}:</span>
    <input
      type="number"
      inputmode="decimal"
      step="0.000001"
      min="${Number(s.min)}"
      max="${Number(s.max)}"
      value="${Number(s.float).toFixed(6)}"
      class="floatInputSmall floatInput"
      data-i="${i}"
    />
    <span style="opacity:.6;font-size:11px;">
      (${Number(s.min).toFixed(2)} – ${Number(s.max).toFixed(2)})
    </span>
  </div>

  <div style="margin-top:6px; display:flex; gap:6px; flex-wrap:wrap;">
    <button class="hl-btn dup" data-i="${i}">${escapeHtml(t("duplicate"))}</button>
    <button class="hl-btn rem" data-i="${i}">${escapeHtml(t("remove"))}</button>
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

document.addEventListener("click", (e) => {
  const add = e.target.closest(".addSkin");
  if (add) {
    const id = Number(add.dataset.id);
    const s = skinsDB.find((x) => x.id === id);
    if (!s) return;

    const currentRarity = contractItems[0]?.rarity;
    if (currentRarity && s.rarity !== currentRarity) {
      alert(t("same_rarity_only"));
      return;
    }

    const contractRarity = currentRarity || s.rarity;
    const need = needCountByRarity(contractRarity);

    if (contractItems.length >= need) {
      alert(t("limit_items", { count: need }));
      return;
    }

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

    const need = needCountByRarity(contractItems[0]?.rarity);

    if (contractItems.length >= need) {
      alert(t("limit_items", { count: need }));
      return;
    }

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

function clamp(v, a, b) {
  return Math.min(b, Math.max(a, v));
}

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

  item.float = clamp(Number(item.float), min, max);
  f.value = Number(item.float).toFixed(6);
});

document.getElementById("tradeupCalc")?.addEventListener("click", async () => {
  const r = contractItems[0]?.rarity;
  if (!r) {
    renderTradeupResult({ error: t("add_items_first") });
    return;
  }

  const need = needCountByRarity(r);
  if (contractItems.length !== need) {
    renderTradeupResult({
      error: t("exact_items_needed", { count: need, current: contractItems.length }),
    });
    return;
  }

  if (contractItems.some((x) => x.rarity !== r)) {
    renderTradeupResult({ error: t("same_rarity_required") });
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

loadTradeupSkins().catch((e) => {
  const out = document.getElementById("tradeupResult");
  if (out) out.innerHTML = `❌ ${escapeHtml(String(e?.message || e))}`;
});
