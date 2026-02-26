import crypto from "crypto";

const ADMIN_ID = 8347406600;

async function tg(method, token, payload) {
  const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return r.json();
}

function parseInitData(initData) {
  const params = new URLSearchParams(initData);
  const obj = {};
  for (const [k, v] of params.entries()) obj[k] = v;
  if (obj.user) {
    try { obj.user = JSON.parse(obj.user); } catch {}
  }
  return obj;
}

function validateInitData(initData, botToken) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return false;

  params.delete("hash");

  // data_check_string
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const hmac = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  return hmac === hash;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(200).send("OK");

  const token = process.env.BOT_TOKEN;
  if (!token) return res.status(500).json({ ok: false, error: "Missing BOT_TOKEN" });

  let body = req.body || {};
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { topic, text, initData } = body;
  if (!text) return res.status(400).json({ ok: false, error: "Missing text" });
  if (!initData) return res.status(400).json({ ok: false, error: "Missing initData" });

  // проверяем что это реально из Telegram WebApp
  const ok = validateInitData(initData, token);
  if (!ok) return res.status(403).json({ ok: false, error: "Bad initData" });

  const parsed = parseInitData(initData);
  const user = parsed.user || {};
  const user_id = user.id || null;
  const username = user.username || null;
  const first_name = user.first_name || null;

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
