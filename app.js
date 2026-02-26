const loading = document.getElementById('loading');
const app = document.getElementById('app');
const bar = document.getElementById('bar');

if (window.Telegram?.WebApp) {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}

function showPage(page) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.toggle('hidden', p.dataset.page !== page);
  });
  document.querySelectorAll('.hl-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.page === page);
  });
}

document.querySelectorAll('.hl-tab').forEach(btn => {
  btn.addEventListener('click', () => showPage(btn.dataset.page));
});

document.querySelectorAll('[data-open]').forEach(btn => {
  btn.addEventListener('click', () => {
    const url = btn.dataset.open;
    if (window.Telegram?.WebApp?.openLink) Telegram.WebApp.openLink(url);
    else window.open(url, '_blank');
  });
});

function tgSend(payload) {
  if (window.Telegram?.WebApp?.sendData) {
    Telegram.WebApp.sendData(JSON.stringify(payload));
  } else {
    alert("WebApp API недоступен (открой внутри Telegram)");
  }
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

/* ===== загрузка ===== */
let p = 0;
const timer = setInterval(() => {
  p += Math.floor(Math.random() * 12) + 6;
  if (p >= 100) {
    p = 100;
    clearInterval(timer);
    loading.classList.add('hidden');
    app.classList.remove('hidden');
    showPage('contracts');
    if (window.Telegram?.WebApp) Telegram.WebApp.expand();
  }
  bar.style.width = p + '%';
}, 120);

document.getElementById('x1').onclick = () => loading.classList.add('hidden');
document.getElementById('x2').onclick = () => app.classList.add('hidden');
document.getElementById('cancelLoad').onclick = () => loading.classList.add('hidden');
