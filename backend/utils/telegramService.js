const fetch = require('node-fetch');

const BOT_TOKEN = '7610793792:AAGLNlgNXu_hi4vGqU4PcwZs2i2ens1yHeE';

async function sendTelegramMessage(chatId, message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }),
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Telegram API error: ${data.description}`);
  }
  return data;
}

module.exports = { sendTelegramMessage };
