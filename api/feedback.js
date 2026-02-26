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

  let body = {};
  try { body = req.body || {}; } catch {}

  const { topic, text, from } = body;
  if (!text) return res.status(400).json({ ok: false, error: "Missing text" });

  const header =
    topic === "collab"
      ? "🤝 СОТРУДНИЧЕСТВО  #collab"
      : "💡 ИДЕЯ / УЛУЧШЕНИЕ  #idea";

  await tg("sendMessage", token, {
    chat_id: ADMIN_ID,
    text:
      `${header}\n` +
      (from ? `От: ${from}\n` : "") +
      `\n${text}`,
  });

  return res.status(200).json({ ok: true });
}
