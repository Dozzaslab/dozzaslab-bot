const loading = document.getElementById('loading');
const app = document.getElementById('app');
const bar = document.getElementById('bar');

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
    if (window.Telegram?.WebApp?.openLink) {
      Telegram.WebApp.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  });
});

function tgSend(payload) {
  if (window.Telegram?.WebApp?.sendData) {
    Telegram.WebApp.sendData(JSON.stringify(payload));
  }
}
function getSuggestText() {
  return document.getElementById('suggestText').value.trim();
}

const sendIdeaBtn = document.getElementById('sendIdea');
if (sendIdeaBtn) {
  sendIdeaBtn.addEventListener('click', () => {
    const text = getSuggestText();
    if (!text) return;
    tgSend({ type: "suggestion", topic: "idea", text });
    document.getElementById('suggestText').value = "";
  });
}

const sendCollabBtn = document.getElementById('sendCollab');
if (sendCollabBtn) {
  sendCollabBtn.addEventListener('click', () => {
    const text = getSuggestText();
    if (!text) return;
    tgSend({ type: "suggestion", topic: "collab", text });
    document.getElementById('suggestText').value = "";
  });
}

document.getElementById('clearSuggest').addEventListener('click', () => {
  document.getElementById('suggestText').value = "";
});

let p = 0;
const t = setInterval(() => {
  p += Math.floor(Math.random() * 12) + 6;
  if (p >= 100) {
    p = 100;
    clearInterval(t);
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
