const WEBAPP_URL = "https://dozzaslab-bot.vercel.app"; // если домен другой — замени
const ADMIN_ID = 8347406600;
async function tg(method, token, payload) {
  const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return r.json();
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(200).send("OK");

  const token = process.env.BOT_TOKEN;
  if (!token) return res.status(500).send("Missing BOT_TOKEN");

  const update = req.body;
  const msg = update?.message;
  if (!msg) return res.status(200).end();

  const chatId = msg.chat?.id;
  const text = (msg.text || "").trim();
// показать chat_id
if (text === "/id") {
  await tg("sendMessage", token, {
    chat_id: chatId,
    text: `Ваш chat_id: ${chatId}`,
  });
  return res.status(200).end();
}
  // /start или /menu
  if (text === "/start" || text === "/menu") {
    await tg("sendMessage", token, {
      chat_id: chatId,
      text: "🧪 DozzasLab: открой меню 👇",
      reply_markup: {
        keyboard: [[{ text: "Open Menu", web_app: { url: WEBAPP_URL } }]],
        resize_keyboard: true,
      },
    });
    return res.status(200).end();
  }

  // данные из WebApp
  const webData = msg.web_app_data?.data;
  if (webData) {
    let payload;
    try { payload = JSON.parse(webData); } catch { payload = { type: "raw", data: webData }; }

if (payload.type === "suggestion") {
  const topic = payload.topic || "idea";

  // подтверждение пользователю
  const userAck =
    topic === "collab"
      ? "✅ Запрос на сотрудничество отправлен! Я отвечу скоро."
      : "✅ Идея/улучшение принято! Спасибо.";

  await tg("sendMessage", token, {
    chat_id: chatId,
    text: userAck,
  });

  // сообщение админу
  const from =
    msg.from?.username ? "@" + msg.from.username : (msg.from?.first_name || "user");

  const header =
    topic === "collab"
      ? "🤝 СОТРУДНИЧЕСТВО  #collab"
      : "💡 ИДЕЯ / УЛУЧШЕНИЕ  #idea";

  await tg("sendMessage", token, {
    chat_id: ADMIN_ID,
    text:
      `${header}\n` +
      `От: ${from}\n` +
      `ID: ${chatId}\n\n` +
      `${payload.text}`,
  });

  return res.status(200).end();
}

    await tg("sendMessage", token, {
      chat_id: chatId,
      text: "✅ Данные получены.",
    });
    return res.status(200).end();
  }

  await tg("sendMessage", token, {
    chat_id: chatId,
    text: "Напиши /menu чтобы открыть меню.",
  });

  return res.status(200).end();
}
