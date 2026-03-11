import { ensureTradeupReady, simulateTradeup } from "./tradeup.js";

const loading = document.getElementById("loading");
const app = document.getElementById("app");
const bar = document.getElementById("bar");
const uiClickSound = document.getElementById("uiClickSound");
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
function playUiClick() {
  if (!uiClickSound) return;

  try {
    uiClickSound.currentTime = 0;
    uiClickSound.play().catch(() => {});
  } catch (_) {}
}

document.addEventListener("click", (e) => {
  const clickable = e.target.closest(
    ".hl-btn, .hl-tab, .hl-x, .filter-dropdown-toggle, .filter-dropdown-option, .collection-item-open"
  );
  if (!clickable) return;

  playUiClick();
});
/* ===== I18N ===== */
const LANG_STORAGE_KEY = "dozzaslab_lang";

const UI_RARITIES = [
  "Consumer",
  "Industrial",
  "Mil-Spec",
  "Restricted",
  "Classified",
];

const translations = {
  ru: {
    loading_title: "Loading...",
    loading_text: "Loading website resources...",
    cancel: "Отмена",

   tab_tools: "🌐 Сайты для торговли",
tab_catalog: "📦 Кейсы и капсулы",
tab_collections: "🗂️ Коллекции",
tab_contracts: "🧪 Контракты",
tab_invest: "📁 Другие проекты",
tab_about: "😎 О себе",
tab_faq: "🧠 FAQ",
tab_suggest: "📨 Предложка",

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
tab_catalog: "📦 Cases and capsules",
tab_collections: "🗂️ Collections",
tab_contracts: "🧪 Contracts",
tab_invest: "📁 Other projects",
tab_about: "😎 About me",
tab_faq: "🧠 FAQ",
tab_suggest: "📨 Suggestions",

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
  const text = t(key);

  const icon = el.querySelector(".icon-emoji");
  if (icon) {
    const iconHtml = icon.outerHTML;
    const cleanText = String(text).replace(/^[^\p{L}\p{N}]+/u, "").trim();
    el.innerHTML = `${iconHtml}${cleanText}`;
  } else {
    el.textContent = text;
  }
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
/* ===== Emoji animation ===== */
const EMOJI_REGEX =
  /(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*|[0-9#*]\uFE0F?\u20E3)/gu;

let emojiWrapQueued = false;
let emojiObserverStarted = false;

/* ===== Навигация по вкладкам ===== */
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
let loadingStage = 0;

function getLoadingLine(n){
  return document.getElementById("loadingLine"+n);
}

function updateLoadingTerminal(progress){

  if(progress >= 10 && loadingStage < 1){
    loadingStage = 1;
    const line = getLoadingLine(1);
    if(line){
      line.textContent = "[OK] Initializing interface...";
      line.classList.add("done");
    }
  }

  if(progress >= 35 && loadingStage < 2){
    loadingStage = 2;
    const line = getLoadingLine(2);
    if(line){
      line.textContent = "Loading skins database...";
      line.classList.add("done");
    }
  }

  if(progress >= 60 && loadingStage < 3){
    loadingStage = 3;
    const line = getLoadingLine(3);
    if(line){
      line.textContent = "Loading collections...";
      line.classList.add("done");
    }
  }

  if(progress >= 85 && loadingStage < 4){
    loadingStage = 4;
    const line = getLoadingLine(4);
    if(line){
      line.textContent = "Trade-up module ready";
      line.classList.add("ready");
    }
  }

}

const timer = setInterval(()=>{

  p += Math.floor(Math.random()*10)+5;

  if(p>100)p=100;

  updateLoadingTerminal(p);

  if(bar) bar.style.width = p + "%";

  if(p >= 100){

    clearInterval(timer);

    setTimeout(()=>{

      loading?.classList.add("hidden");
      app?.classList.remove("hidden");

      app?.classList.remove("menu-mode");

      applyTranslations();
      showPage("welcome");

      setTimeout(typeWelcomeText,200);

      if(window.Telegram?.WebApp){
        Telegram.WebApp.expand();
      }

    },300);

  }

},120);
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
    width:12px;
    height:12px;
    border-radius:999px;
    margin-right:6px;
    vertical-align:middle;
    background:${c};
 box-shadow:
  inset 0 1px 1px rgba(255,255,255,.15),
  inset 0 -1px 1px rgba(0,0,0,.45),
  0 0 6px ${c}66;
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
function buildSkinLinks(name) {
  const encoded = encodeURIComponent(String(name || "").trim());

return {
  csfloat: `https://csfloat.com/search?name=${encoded}`,
  steam: `https://steamcommunity.com/market/search?q=${encoded}`,
};
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
function clamp01(v) {
  if (!Number.isFinite(v)) return 0;
  return Math.min(1, Math.max(0, v));
}

function formatFloatShort(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
}

function buildFloatRangeBar(min, max) {
  const safeMin = clamp01(Number(min));
  const safeMax = clamp01(Number(max));

  return `
    <div class="float-range-wrap">
      <div class="float-range-bar">
        <span class="float-range-segment fn"></span>
        <span class="float-range-segment mw"></span>
        <span class="float-range-segment ft"></span>
        <span class="float-range-segment ww"></span>
        <span class="float-range-segment bs"></span>
      </div>

      <div class="float-range-text">${formatFloatShort(safeMin)}-${formatFloatShort(safeMax)}</div>
    </div>
  `;
}
function buildOutcomeFloatBar(floatValue) {
  const safeFloat = clamp01(Number(floatValue));
  const markerPct = safeFloat * 100;

  return `
    <div class="float-range-wrap" style="margin-top:4px;">
      <div class="float-range-bar">
        <span class="float-range-segment fn"></span>
        <span class="float-range-segment mw"></span>
        <span class="float-range-segment ft"></span>
        <span class="float-range-segment ww"></span>
        <span class="float-range-segment bs"></span>

        <span style="
          position:absolute;
          left:${markerPct}%;
          top:0;
          bottom:0;
          width:2px;
          background:#e7f0d8;
          box-shadow:0 0 0 1px rgba(0,0,0,.35);
          transform:translateX(-50%);
        "></span>
      </div>

      <div class="float-range-text">float≈${formatFloatShort(safeFloat)}</div>
    </div>
  `;
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
function getWeaponName(s) {
  if (typeof s?.weapon === "string") return s.weapon.trim();
  if (typeof s?.weapon === "object" && s.weapon?.name) return String(s.weapon.name).trim();
  return "";
}

function getCategoryName(s) {
  if (typeof s?.category === "string") return s.category.trim();
  if (typeof s?.category === "object" && s.category?.name) return String(s.category.name).trim();
  return "";
}

function detectSkinSubtype(s) {
  const weapon = getWeaponName(s).toLowerCase();
  const category = getCategoryName(s).toLowerCase();
  const name = String(s?.name || "").toLowerCase();

  if (
    weapon.includes("knife") ||
    category.includes("knife") ||
    name.includes("bayonet") ||
    name.includes("karambit") ||
    name.includes("flip knife") ||
    name.includes("butterfly knife") ||
    name.includes("m9 bayonet") ||
    name.includes("talon knife") ||
    name.includes("stiletto") ||
    name.includes("ursus knife") ||
    name.includes("navaja knife") ||
    name.includes("falchion knife") ||
    name.includes("bowie knife") ||
    name.includes("daggers")
  ) {
    return "knives";
  }

  if (
    weapon.includes("gloves") ||
    weapon.includes("wraps") ||
    category.includes("gloves") ||
    name.includes("gloves") ||
    name.includes("hand wraps") ||
    name.includes("sport gloves") ||
    name.includes("moto gloves") ||
    name.includes("specialist gloves") ||
    name.includes("hydra gloves") ||
    name.includes("driver gloves") ||
    name.includes("bloodhound gloves")
  ) {
    return "gloves";
  }

  const rifles = [
    "ak-47",
    "m4a4",
    "m4a1-s",
    "m4a1",
    "famas",
    "galil",
    "galil ar",
    "sg 553",
    "aug"
  ];

  const snipers = [
    "awp",
    "ssg 08",
    "scar-20",
    "g3sg1"
  ];

  const smgs = [
    "mac-10",
    "mp9",
    "mp7",
    "ump-45",
    "pp-bizon",
    "p90",
    "mp5-sd"
  ];

  const pistols = [
    "glock-18",
    "usp-s",
    "usp",
    "p2000",
    "dual berettas",
    "five-seven",
    "cz75-auto",
    "desert eagle",
    "tec-9",
    "p250",
    "r8 revolver"
  ];

  const shotguns = [
    "nova",
    "xm1014",
    "mag-7",
    "sawed-off"
  ];

  const heavy = [
    "negev",
    "m249"
  ];

  if (
    category.includes("machinegun") ||
    category.includes("machine gun") ||
    heavy.some((x) => weapon.includes(x)) ||
    heavy.some((x) => name.includes(x))
  ) {
    return "heavy";
  }

  if (rifles.some((x) => weapon.includes(x)) || rifles.some((x) => name.includes(x))) {
    return "rifles";
  }

  if (snipers.some((x) => weapon.includes(x)) || snipers.some((x) => name.includes(x))) {
    return "snipers";
  }

  if (smgs.some((x) => weapon.includes(x)) || smgs.some((x) => name.includes(x))) {
    return "smgs";
  }

  if (pistols.some((x) => weapon.includes(x)) || pistols.some((x) => name.includes(x))) {
    return "pistols";
  }

  if (shotguns.some((x) => weapon.includes(x)) || shotguns.some((x) => name.includes(x))) {
    return "shotguns";
  }

  return "other";
}
function isGoldInputItem(s) {
  const rarity = normalizeRarityUI(getRarityName(s));
  const subtype = detectSkinSubtype(s);
  const category = getCategoryName(s).toLowerCase();
  const weapon = getWeaponName(s).toLowerCase();
  const name = String(s?.name || "").toLowerCase();

  if (rarity === "Extraordinary") return true;
  if (subtype === "knives" || subtype === "gloves") return true;
  if (category.includes("agent") || name.includes("agent")) return true;
  if (weapon.includes("knife") || weapon.includes("glove")) return true;

  return false;
}

function getAllWeaponCollections() {
  const set = new Set();

  skinsDB.forEach((skin) => {
    if (!skin) return;

    const collection = String(skin.collection || "").trim();
    if (!collection) return;

    /* в контракт нельзя:
       - золотые предметы
       - брелки / агенты / ножи / перчатки
       - covert как входной предмет
    */
    if (isGoldInputItem(skin)) return;
    if (normalizeRarityUI(skin.rarity) === "Covert") return;

    set.add(collection);
  });

  return [...set].sort((a, b) => a.localeCompare(b));
}

function renderContractCollectionDropdown() {
  const options = document.getElementById("collectionFilterOptions");
  const toggle = document.getElementById("collectionFilterToggle");
  if (!options || !toggle) return;

  const q = contractCollectionSearch.trim().toLowerCase();
  const allCollections = getAllWeaponCollections();

  const filtered = allCollections.filter((name) =>
    !q || name.toLowerCase().includes(q)
  );

  let html = `
    <button
      type="button"
      class="filter-dropdown-option ${!selectedContractCollection ? "active" : ""}"
      data-contract-collection-value=""
    >
      ${escapeHtml(t("any_collection"))}
    </button>
  `;

  filtered.forEach((name) => {
    html += `
      <button
        type="button"
        class="filter-dropdown-option ${selectedContractCollection === name ? "active" : ""}"
        data-contract-collection-value="${escapeHtml(name)}"
      >
        ${escapeHtml(name)}
      </button>
    `;
  });

  options.innerHTML = html;
  toggle.textContent = selectedContractCollection || t("any_collection");
  toggle.classList.toggle("active-filter", Boolean(selectedContractCollection));
}

function openContractCollectionDropdown() {
  const menu = document.getElementById("collectionFilterMenu");
  const search = document.getElementById("collectionFilterSearch");
  if (!menu) return;

  menu.classList.remove("hidden");
  renderContractCollectionDropdown();

  if (search) {
    search.value = contractCollectionSearch;
    setTimeout(() => search.focus(), 0);
  }
}

function closeContractCollectionDropdown() {
  const menu = document.getElementById("collectionFilterMenu");
  if (!menu) return;
  menu.classList.add("hidden");
}

function renderCollectionsPageDropdown() {
  const options = document.getElementById("collectionsFilterOptions");
  const toggle = document.getElementById("collectionsFilterToggle");
  if (!options || !toggle) return;

  const q = collectionsState.dropdownSearch.trim().toLowerCase();

  const groups = collectionsCatalog
    .filter((group) => group.type === collectionsState.main)
    .map((group) => group.name)
    .filter(Boolean);

  const unique = [...new Set(groups)].sort((a, b) => a.localeCompare(b));

  const filtered = unique.filter((name) =>
    !q || name.toLowerCase().includes(q)
  );

  let html = `
    <button
      type="button"
      class="filter-dropdown-option ${!collectionsState.selectedCollection ? "active" : ""}"
      data-collections-collection-value=""
    >
      Любая коллекция
    </button>
  `;

  filtered.forEach((name) => {
    html += `
      <button
        type="button"
        class="filter-dropdown-option ${collectionsState.selectedCollection === name ? "active" : ""}"
        data-collections-collection-value="${escapeHtml(name)}"
      >
        ${escapeHtml(name)}
      </button>
    `;
  });

  options.innerHTML = html;
  toggle.textContent = collectionsState.selectedCollection || "Любая коллекция";
  toggle.classList.toggle("active-filter", Boolean(collectionsState.selectedCollection));
}

function openCollectionsDropdown() {
  const menu = document.getElementById("collectionsFilterMenu");
  const search = document.getElementById("collectionsFilterSearch");
  if (!menu) return;

  menu.classList.remove("hidden");
  renderCollectionsPageDropdown();

  if (search) {
    search.value = collectionsState.dropdownSearch;
    setTimeout(() => search.focus(), 0);
  }
}

function closeCollectionsDropdown() {
  const menu = document.getElementById("collectionsFilterMenu");
  if (!menu) return;
  menu.classList.add("hidden");
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

    const csfloatBtn = o.links?.csfloat
      ? `<button class="hl-btn" style="margin-right:6px;" data-open="${escapeHtml(o.links.csfloat)}">CSFloat</button>`
      : "";

   const clashQuery = encodeURIComponent(`${o.name} ${o.collection} clash.gg`);
const clashGoogleUrl = `https://www.google.com/search?q=${clashQuery}`;

const clashBtn = `
  <button class="hl-btn" style="margin-right:6px;" data-open="${escapeHtml(clashGoogleUrl)}">Clash</button>
`;

    const steamBtn = o.links?.steam
      ? `<button class="hl-btn" data-open="${escapeHtml(o.links.steam)}">Steam</button>`
      : "";

  const outcomeSkin = findSkinInDBByName(o.name);
const outcomeImage = outcomeSkin?.image || "";

html += `
<div style="margin-top:10px; padding:8px; border:1px solid rgba(0,0,0,.35); background:rgba(0,0,0,.08);">
  <div style="display:flex; gap:8px; align-items:center;">
    ${
      outcomeImage
        ? `
          <img
            src="${escapeHtml(outcomeImage)}"
            class="outcome-skin-img"
            data-img="${escapeHtml(outcomeImage)}"
            alt="${escapeHtml(o.name)}"
          />
        `
        : ""
    }

    <div>
      <div>
        <b>${p}%</b> — ${rarityDot(result.output_rarity)}${escapeHtml(o.name)}
      </div>
         <div class="hl-muted">
        (${escapeHtml(o.collection)})
      </div>
      ${buildOutcomeFloatBar(o.float_out)}
    </div>
  </div>

  <div style="margin-top:6px; display:flex; gap:6px; flex-wrap:wrap;">
    ${csfloatBtn}${clashBtn}${steamBtn}
  </div>
</div>`;
  }

  out.innerHTML = html;
}

let skinsDB = [];
let contractItems = [];
let collectionsRawDB = [];
let agentsDB = [];
let keychainsDB = [];

let collectionsCatalog = [];

let selectedContractCollection = "";
let contractCollectionSearch = "";

let collectionsState = {
  main: "weapons",
  sub: null,
  search: "",
  selectedCollection: "",
  dropdownSearch: "",
  openedGroupId: null,
  openedItemName: null,
};
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

      if (!name || !rarity) return null;
      if (s?.souvenir === true) return null;

      return {
        ...s,
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
  renderContractCollectionDropdown();
  renderCollectionsPageDropdown();
}
function findSkinInDBByName(name) {
  const needle = String(name || "").trim().toLowerCase();
  if (!needle) return null;

  return skinsDB.find((skin) => String(skin.name || "").trim().toLowerCase() === needle) || null;
}
function renderSkinsTable() {
  const table = document.getElementById("skinsTable");
  if (!table) return;

  const searchEl = document.getElementById("skinSearch");
  const rarityEl = document.getElementById("rarityFilter");

  const search = (searchEl?.value || "").trim().toLowerCase();
  const rarity = (rarityEl?.value || "").trim();
  const collection = selectedContractCollection.trim();

  let list = skinsDB.filter((s) => {
    if (isGoldInputItem(s)) return false;
    if (s.rarity === "Covert") return false;
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
    <th align="left" style="padding:6px 4px;">Img</th>
    <th align="left" style="padding:6px 4px;">${escapeHtml(t("skin"))}</th>
    <th align="left" style="padding:6px 4px;">${escapeHtml(t("collection"))}</th>
    <th align="left" style="padding:6px 4px;">${escapeHtml(t("float"))}</th>
    <th style="padding:6px 4px;"></th>
  </tr>
`;

  list.forEach((s) => {
html += `
  <tr>
    <td style="padding:6px 4px; width:58px;">
      ${
        s.image
          ? `
            <img
              src="${escapeHtml(s.image)}"
              class="table-skin-img"
              data-img="${escapeHtml(s.image)}"
              alt="${escapeHtml(s.name)}"
            />
          `
          : ""
      }
    </td>
    <td style="padding:6px 4px;">${rarityDot(s.rarity)}${escapeHtml(s.name)}</td>
    <td style="padding:6px 4px;opacity:.9;">${escapeHtml(s.collection)}</td>
    <td style="padding:6px 4px;opacity:.9;">${buildFloatRangeBar(s.min, s.max)}</td>
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
  const skinData = findSkinInDBByName(s.name);
  const skinImage = skinData?.image || "";

  html += `
<div style="margin-top:6px; padding:6px; border:1px solid rgba(0,0,0,.35); background:rgba(0,0,0,.10);">
  <div style="display:flex; gap:8px; align-items:center;">
    ${
      skinImage
        ? `
          <img
            src="${escapeHtml(skinImage)}"
            class="contract-skin-img"
            data-img="${escapeHtml(skinImage)}"
            alt="${escapeHtml(s.name)}"
          />
        `
        : ""
    }

    <div>
      <div>
        <b>${i + 1}.</b> ${rarityDot(s.rarity)}${escapeHtml(s.name)}
      </div>
      <div class="hl-muted">(${escapeHtml(s.collection)})</div>
    </div>
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
      class="floatInputSmall floatInput ${getFloatQualityClass(Number(s.float), Number(s.min), Number(s.max))}"
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
    e.target.id === "rarityFilter"
  ) {
    renderSkinsTable();
  }

  if (e.target.id === "collectionFilterSearch") {
    contractCollectionSearch = e.target.value || "";
    renderContractCollectionDropdown();
  }

   if (e.target.id === "collectionsSearch") {
    collectionsState.search = e.target.value || "";
    collectionsState.openedGroupId = null;
    collectionsState.openedItemName = null;
    renderCollectionsCatalog();
  }
  if (e.target.id === "collectionsFilterSearch") {
    collectionsState.dropdownSearch = e.target.value || "";
    renderCollectionsPageDropdown();
  }
});

document.addEventListener("click", (e) => {
  const contractToggle = e.target.closest("#collectionFilterToggle");
  if (contractToggle) {
    const menu = document.getElementById("collectionFilterMenu");
    if (menu?.classList.contains("hidden")) openContractCollectionDropdown();
    else closeContractCollectionDropdown();
    return;
  }

  const contractOption = e.target.closest("[data-contract-collection-value]");
  if (contractOption) {
    selectedContractCollection = contractOption.dataset.contractCollectionValue || "";
    contractCollectionSearch = "";
    closeContractCollectionDropdown();
    renderCollections();
    renderSkinsTable();
    return;
  }

  const collectionsToggle = e.target.closest("#collectionsFilterToggle");
  if (collectionsToggle) {
    const menu = document.getElementById("collectionsFilterMenu");
    if (menu?.classList.contains("hidden")) openCollectionsDropdown();
    else closeCollectionsDropdown();
    return;
  }

  const collectionsOption = e.target.closest("[data-collections-collection-value]");
  if (collectionsOption) {
    collectionsState.selectedCollection = collectionsOption.dataset.collectionsCollectionValue || "";
    collectionsState.dropdownSearch = "";
    closeCollectionsDropdown();
    renderCollections();
    renderCollectionsCatalog();
    return;
  }

  if (
    !e.target.closest("#contractCollectionDropdown") &&
    !e.target.closest("#collectionsDropdown")
  ) {
    closeContractCollectionDropdown();
    closeCollectionsDropdown();
  }

  const mainBtn = e.target.closest(".collections-main-filter");
  if (mainBtn) {
    const next = mainBtn.dataset.mainFilter;
    if (!next) return;

    collectionsState.main = next;
    collectionsState.sub = null;
    collectionsState.selectedCollection = "";
    collectionsState.dropdownSearch = "";
    collectionsState.openedGroupId = null;
    collectionsState.openedItemName = null;

    document.querySelectorAll(".collections-main-filter").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mainFilter === next);
    });

    renderCollectionsSubfilters();
    renderCollectionsCatalog();
    return;
  }

  const subBtn = e.target.closest(".collections-sub-filter");
  if (subBtn) {
    const next = subBtn.dataset.subFilter;
    if (!next) return;

    collectionsState.sub = next;
    collectionsState.openedGroupId = null;
    collectionsState.openedItemName = null;

    renderCollectionsSubfilters();
    renderCollectionsCatalog();
    return;
  }

  const openItemBtn = e.target.closest("[data-open-collection-item]");
  if (openItemBtn) {
    const groupId = openItemBtn.dataset.openCollectionItem;
    const itemName = openItemBtn.dataset.openCollectionItemName;

    if (!groupId || !itemName) return;

    openCollectionItemCard(groupId, itemName);
    return;
  }

  const backToCollectionsListBtn = e.target.closest("#backToCollectionsList");
  if (backToCollectionsListBtn) {
    closeCollectionItemCard();
    return;
  }

  const addFromCardBtn = e.target.closest("[data-add-from-card]");
  if (addFromCardBtn) {
    const itemName = addFromCardBtn.dataset.addFromCard;
    const s = findSkinInDBByName(itemName);
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

function getFloatQualityClass(value, min, max) {
  const span = max - min;
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max) || span <= 0) {
    return "";
  }

  const ratio = (value - min) / span;

  if (ratio <= 0.2) return "float-good";
  if (ratio <= 0.55) return "float-mid";
  return "float-bad";
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

  f.classList.remove("float-good", "float-mid", "float-bad");
  const qualityClass = getFloatQualityClass(item.float, min, max);
  if (qualityClass) {
    f.classList.add(qualityClass);
  }
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
  renderContract();
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

document.getElementById("tradeupFill")?.addEventListener("click", () => {
  if (!contractItems.length) {
    alert("Сначала добавь хотя бы 1 скин в контракт.");
    return;
  }

  const first = contractItems[0];
  const need = needCountByRarity(first.rarity);

  while (contractItems.length < need) {
    contractItems.push({
      name: first.name,
      collection: first.collection,
      rarity: first.rarity,
      float: Number(first.float),
      min: Number(first.min),
      max: Number(first.max),
    });
  }

  renderContract();
});
function buildCollectionsCatalog() {
  const catalog = [];

  const skinsMap = new Map();
  skinsDB.forEach((skin) => {
    skinsMap.set(String(skin.name || "").trim().toLowerCase(), skin);
  });

  (Array.isArray(collectionsRawDB) ? collectionsRawDB : []).forEach((col, idx) => {
    const items = Array.isArray(col.contains) ? col.contains : [];

   const normalizedItems = items.map((item) => {
  const linkedSkin = skinsMap.get(String(item?.name || "").trim().toLowerCase());

  const subtype = linkedSkin
    ? detectSkinSubtype(linkedSkin)
    : detectSkinSubtype({
        name: item?.name || "",
        weapon: item?.name || "",
        category: "",
      });

  return {
    id: item?.id || "",
    name: item?.name || "Unknown item",
    image: item?.image || "",
    rarity: item?.rarity?.name || item?.rarity || "",
    subtype,
  };
});

    catalog.push({
      id: col?.id || `weapon-collection-${idx}`,
      name: col?.name || "Unknown Collection",
      type: "weapons",
      items: normalizedItems,
    });
  });

  const goldGroups = {
    knives: [],
    gloves: [],
  };

  skinsDB.forEach((skin) => {
    const subtype = detectSkinSubtype(skin);

    if (subtype === "knives" || subtype === "gloves") {
      goldGroups[subtype].push({
        id: skin?.id || "",
        name: skin?.name || "Unknown item",
        image: skin?.image || "",
        rarity: getRarityName(skin),
        subtype,
      });
    }
  });

  catalog.push({
    id: "gold-knives",
    name: "Ножи",
    type: "gold",
    subtype: "knives",
    items: goldGroups.knives,
  });

  catalog.push({
    id: "gold-gloves",
    name: "Перчатки",
    type: "gold",
    subtype: "gloves",
    items: goldGroups.gloves,
  });

  const keychainGroups = new Map();

  (Array.isArray(keychainsDB) ? keychainsDB : []).forEach((item) => {
    const collectionName = item?.collections?.[0]?.name || "Other Keychains";

    if (!keychainGroups.has(collectionName)) {
      keychainGroups.set(collectionName, []);
    }

    keychainGroups.get(collectionName).push({
      id: item?.id || "",
      name: item?.name || "Unknown keychain",
      image: item?.image || "",
      rarity: item?.rarity?.name || item?.rarity || "",
      subtype: "keychain",
    });
  });

  [...keychainGroups.entries()].forEach(([name, items], idx) => {
    catalog.push({
      id: `keychains-${idx}`,
      name,
      type: "keychains",
      items,
    });
  });

  const agentGroups = new Map();

  (Array.isArray(agentsDB) ? agentsDB : []).forEach((item) => {
    const collectionName = item?.collections?.[0]?.name || "Other Agents";

    if (!agentGroups.has(collectionName)) {
      agentGroups.set(collectionName, []);
    }

    agentGroups.get(collectionName).push({
      id: item?.id || "",
      name: item?.name || "Unknown agent",
      image: item?.image || "",
      rarity: item?.rarity?.name || item?.rarity || "",
      subtype: "agent",
    });
  });

  [...agentGroups.entries()].forEach(([name, items], idx) => {
    catalog.push({
      id: `agents-${idx}`,
      name,
      type: "agents",
      items,
    });
  });

  collectionsCatalog = catalog;
}

function getCollectionsSubfilters() {
  if (collectionsState.main === "weapons") {
       return [
      { id: "all", label: "Все" },
      { id: "rifles", label: "Винтовки" },
      { id: "snipers", label: "Снайперки" },
      { id: "smgs", label: "ПП" },
      { id: "pistols", label: "Пистолеты" },
      { id: "shotguns", label: "Дробовики" },
      { id: "heavy", label: "Тяжёлое" },
    ];
  }

  if (collectionsState.main === "gold") {
    return [
      { id: "all", label: "Все" },
      { id: "knives", label: "Ножи" },
      { id: "gloves", label: "Перчатки" },
    ];
  }

  if (collectionsState.main === "keychains") {
    return [
      { id: "all", label: "Все" },
    ];
  }

  if (collectionsState.main === "agents") {
    return [
      { id: "all", label: "Все" },
    ];
  }

  return [];
}

function renderCollectionsSubfilters() {
  const wrap = document.getElementById("collectionsSubfilters");
  if (!wrap) return;

  const subfilters = getCollectionsSubfilters();

  if (!subfilters.length) {
    wrap.innerHTML = "";
    return;
  }

  wrap.innerHTML = subfilters.map((f) => `
    <button
      class="hl-btn collections-sub-filter ${collectionsState.sub === f.id ? "active" : ""}"
      data-sub-filter="${escapeHtml(f.id)}"
    >
      ${escapeHtml(f.label)}
    </button>
  `).join("");
}

function getFilteredCollectionsCatalog() {
  const q = collectionsState.search.trim().toLowerCase();
  const selectedCollection = collectionsState.selectedCollection.trim();

  const hasSubfilter = Boolean(collectionsState.sub);
  const hasSearch = Boolean(q);

  if (!hasSubfilter && !hasSearch) return [];

  return collectionsCatalog.filter((group) => {
    if (group.type !== collectionsState.main) return false;

    if (selectedCollection && group.name !== selectedCollection) return false;

    if (collectionsState.main === "weapons") {
      if (hasSubfilter && collectionsState.sub !== "all") {
        const hasMatchingWeapon = group.items.some(
          (item) => item.subtype === collectionsState.sub
        );
        if (!hasMatchingWeapon) return false;
      }
    }

    if (collectionsState.main === "gold") {
      if (hasSubfilter && collectionsState.sub !== "all") {
        if (group.subtype !== collectionsState.sub) return false;
      }
    }

    if (q) {
      const byCollection = group.name.toLowerCase().includes(q);
      const byItem = group.items.some((item) =>
        String(item.name || "").toLowerCase().includes(q)
      );

      if (!byCollection && !byItem) return false;
    }

    return true;
  });
}

function renderCollectionsCatalog() {
  const details = document.getElementById("collectionsDetails");
  if (!details) return;

  const q = collectionsState.search.trim().toLowerCase();

  if (!collectionsState.sub && !q) {
    details.innerHTML = `<div class="hl-muted">Выбери подвкладку или начни вводить название предмета</div>`;
    return;
  }

  const groups = getFilteredCollectionsCatalog();

  if (!groups.length) {
    details.innerHTML = `<div class="hl-muted">Ничего не найдено</div>`;
    return;
  }

  let html = "";

  groups.forEach((group) => {
    let items = [...group.items];

    if (
      group.type === "weapons" &&
      collectionsState.sub &&
      collectionsState.sub !== "all"
    ) {
      items = items.filter((item) => item.subtype === collectionsState.sub);
    }

    if (q) {
      items = items.filter((item) => {
        const itemName = String(item.name || "").toLowerCase();
        const collectionName = String(group.name || "").toLowerCase();
        return itemName.includes(q) || collectionName.includes(q);
      });
    }

    if (!items.length) return;

    html += `
      <div style="margin-top:10px;">
        <b>${escapeHtml(group.name)}</b>
        <div class="hl-muted" style="margin-top:6px;">Предметов: ${items.length}</div>
      </div>
      <div style="margin-top:10px;">
    `;

   items.forEach((item) => {
  html += `
    <button
      type="button"
      class="collection-detail-card collection-item-open"
      data-open-collection-item="${escapeHtml(group.id)}"
      data-open-collection-item-name="${escapeHtml(item.name)}"
      style="width:100%; text-align:left; cursor:pointer; display:block; border:1px solid rgba(0,0,0,.35); background:rgba(0,0,0,.08); padding:8px; margin-bottom:6px;"
    >
      <div><b>${escapeHtml(item.name)}</b></div>
      ${item.rarity ? `<div class="hl-muted" style="margin-top:4px;">${escapeHtml(item.rarity)}</div>` : ""}
    </button>
  `;
});

    html += `</div>`;
  });

  details.innerHTML = html || `<div class="hl-muted">Ничего не найдено</div>`;
}
function openCollectionItemCard(groupId, itemName) {
  collectionsState.openedGroupId = groupId;
  collectionsState.openedItemName = itemName;

  renderCollectionItemCard();
}

function closeCollectionItemCard() {
  collectionsState.openedGroupId = null;
  collectionsState.openedItemName = null;
  renderCollectionsCatalog();
}

function renderCollectionItemCard() {
  const box = document.getElementById("collectionsDetails");
  if (!box) return;

  const group = collectionsCatalog.find((x) => x.id === collectionsState.openedGroupId);
  if (!group) {
    box.innerHTML = `<div class="hl-muted">Предмет не найден</div>`;
    return;
  }

  const item = group.items.find(
    (x) => String(x.name || "").trim().toLowerCase() === String(collectionsState.openedItemName || "").trim().toLowerCase()
  );

  if (!item) {
    box.innerHTML = `<div class="hl-muted">Предмет не найден</div>`;
    return;
  }

  const linkedSkin = findSkinInDBByName(item.name);
  const rarity = linkedSkin?.rarity || normalizeRarityUI(item.rarity || "");
  const collection = linkedSkin?.collection || group.name || "";
  const min = Number.isFinite(linkedSkin?.min) ? linkedSkin.min : null;
  const max = Number.isFinite(linkedSkin?.max) ? linkedSkin.max : null;
  const links = buildSkinLinks(item.name);
  const clashQuery = encodeURIComponent(`CS2 ${item.name} ${collection} site:clash.gg`);
  const clashGoogleUrl = `https://www.google.com/search?q=${clashQuery}`;

  const imageHtml = item.image
    ? `
      <div style="margin-top:10px;">
        <img
          src="${escapeHtml(item.image)}"
          alt="${escapeHtml(item.name)}"
          style="width:100%; max-width:320px; display:block; border:1px solid rgba(0,0,0,.35); background:rgba(0,0,0,.12);"
        />
      </div>
    `
    : "";

  const floatHtml =
    min !== null && max !== null
      ? `
        <div style="margin-top:8px;">
          <b>${escapeHtml(t("float"))}:</b>
          ${escapeHtml(min.toFixed(2))} – ${escapeHtml(max.toFixed(2))}
        </div>
      `
      : "";

  const addBtnHtml =
    linkedSkin && !isGoldInputItem(linkedSkin) && linkedSkin.rarity !== "Covert"
      ? `
        <button class="hl-btn" data-add-from-card="${escapeHtml(item.name)}">
          Добавить в контракт
        </button>
      `
      : "";

  box.innerHTML = `
    <div style="margin-top:10px;">
      <button class="hl-btn" id="backToCollectionsList">⬅️ Назад к списку</button>
    </div>

    ${imageHtml}

    <div style="margin-top:12px;">
      <div style="font-size:18px; font-weight:700;">
        ${rarityDot(rarity)}${escapeHtml(item.name)}
      </div>

      <div class="hl-muted" style="margin-top:6px;">
        ${item.rarity ? escapeHtml(item.rarity) : ""}
      </div>

      <div style="margin-top:8px;">
        <b>${escapeHtml(t("collection"))}:</b> ${escapeHtml(collection)}
      </div>

      ${floatHtml}
    </div>

  <div style="margin-top:12px; display:flex; gap:6px; flex-wrap:wrap;">
  <button class="hl-btn" data-open="${escapeHtml(links.csfloat)}">CSFloat</button>

  <button class="hl-btn" data-open="${escapeHtml(clashGoogleUrl)}">Clash</button>

  <button class="hl-btn" data-open="${escapeHtml(links.steam)}">Steam</button>

  ${addBtnHtml}
</div>
  `;
}
function renderCollectionsDetails(groupId) {
  const box = document.getElementById("collectionsDetails");
  if (!box) return;

  const group = collectionsCatalog.find((x) => x.id === groupId);
  if (!group) {
    box.innerHTML = `<div class="hl-muted">Раздел не найден</div>`;
    return;
  }

  let items = [...group.items];

if (
  group.type === "weapons" &&
  collectionsState.sub &&
  collectionsState.sub !== "all"
) {
  items = items.filter((item) => item.subtype === collectionsState.sub);
}

  const q = collectionsState.search.trim().toLowerCase();
  if (q) {
    items = items.filter((item) =>
      String(item.name || "").toLowerCase().includes(q)
    );
  }

  if (!items.length) {
    box.innerHTML = `
      <div style="margin-top:10px;">
        <b>${escapeHtml(group.name)}</b>
        <div class="hl-muted" style="margin-top:6px;">Внутри нет подходящих предметов</div>
      </div>
    `;
    return;
  }

  let html = `
    <div style="margin-top:10px;">
      <b>${escapeHtml(group.name)}</b>
      <div class="hl-muted" style="margin-top:6px;">Предметов: ${items.length}</div>
    </div>
    <div style="margin-top:10px;">
  `;

  items.forEach((item) => {
  html += `
    <button
      type="button"
      class="collection-detail-card collection-item-open"
      data-open-collection-item="${escapeHtml(group.id)}"
      data-open-collection-item-name="${escapeHtml(item.name)}"
      style="width:100%; text-align:left; cursor:pointer;"
    >
      <div><b>${escapeHtml(item.name)}</b></div>
      ${item.rarity ? `<div class="hl-muted" style="margin-top:4px;">${escapeHtml(item.rarity)}</div>` : ""}
    </button>
  `;
});

  html += `</div>`;
  box.innerHTML = html;
}
async function loadCollectionsPageData() {
  const [collectionsRes, agentsRes, keychainsRes] = await Promise.all([
    fetch("/data/collections.json", { cache: "force-cache" }),
    fetch("/data/agents.json", { cache: "force-cache" }),
    fetch("/data/keychains.json", { cache: "force-cache" }),
  ]);

  if (!collectionsRes.ok) {
    throw new Error(`Не удалось загрузить /data/collections.json (HTTP ${collectionsRes.status})`);
  }

  if (!agentsRes.ok) {
    throw new Error(`Не удалось загрузить /data/agents.json (HTTP ${agentsRes.status})`);
  }

  if (!keychainsRes.ok) {
    throw new Error(`Не удалось загрузить /data/keychains.json (HTTP ${keychainsRes.status})`);
  }

  collectionsRawDB = await collectionsRes.json();
  agentsDB = await agentsRes.json();
  keychainsDB = await keychainsRes.json();

  buildCollectionsCatalog();
  renderCollectionsSubfilters();
  renderCollectionsCatalog();
}

loadTradeupSkins()
  .then(() => loadCollectionsPageData())
  .catch((e) => {
    const msg = `❌ ${escapeHtml(String(e?.message || e))}`;

    const out = document.getElementById("tradeupResult");
    if (out) out.innerHTML = msg;

    const collectionsList = document.getElementById("collectionsList");
    if (collectionsList) collectionsList.innerHTML = msg;
  });
document.addEventListener("click", (e) => {
  const img = e.target.closest(".contract-skin-img, .table-skin-img, .outcome-skin-img");
  if (!img) return;

  const src = img.dataset.img;
  if (!src) return;

  const modal = document.createElement("div");
  modal.style = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.85);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:9999;
    cursor:zoom-out;
  `;

  modal.innerHTML = `
    <img src="${src}" style="max-width:90%; max-height:90%;">
  `;

  modal.onclick = () => modal.remove();

  document.body.appendChild(modal);
});

