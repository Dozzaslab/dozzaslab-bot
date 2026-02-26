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
  if (!token) return res.status(500).json({ ok: false, error: "Missing BOT_TOKEN" });

  const body = req.body || {};
  const { topic, text, user_id, username, first_name } = body;

  if (!text) return res.status(400).json({ ok: false, error: "Missing text" });

  const header =
    topic === "collab"
      ? "🤝 СОТРУДНИЧЕСТВО  #collab"
      : "💡 ИДЕЯ / УЛУЧШЕНИЕ  #idea";

  const who = username ? `@${username}` : (first_name ? first_name : "user");
  const replyHint = user_id ? `Reply chat_id: ${user_id}` : "Reply chat_id: (unknown)";

  await tg("sendMessage", token, {
    chat_id: ADMIN_ID,
    text:
      `${header}\n` +
      `От: ${who}\n` +
      (user_id ? `ID: ${user_id}\n` : "") +
      `${replyHint}\n\n` +
      `${text}`,
  });

  return res.status(200).json({ ok: true });
}
