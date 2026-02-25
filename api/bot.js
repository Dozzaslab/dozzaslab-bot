export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Bot is running");
  }

  const body = req.body;

  const message = body.message;
  if (!message) {
    return res.status(200).end();
  }

  const chatId = message.chat.id;

  const replyText = "🔥 DozzasLab Bot активен.\nМеню скоро подключим.";

  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: replyText
    })
  });

  return res.status(200).end();
}
