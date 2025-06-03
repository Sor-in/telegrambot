const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TELEGRAM_TOKEN;
const app = express();
const port = process.env.PORT || 3000;

// Creează botul în mod webhook
const bot = new TelegramBot(token, { webHook: { port: port } });

// Setează webhook-ul către Render
const url = process.env.RENDER_EXTERNAL_URL;
bot.setWebHook(`${url}/bot${token}`);

app.use(express.json());

// Endpoint unde Telegram trimite mesajele
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Răspunsuri bot
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.toLowerCase() ?? "";

  if (text.includes("salut")) {
    bot.sendMessage(chatId, "Salutare din webhook!");
  } else {
    bot.sendMessage(chatId, "Nu am înțeles. 😊");
  }
});

app.listen(port, () => {
  console.log(`Serverul rulează pe portul ${port}`);
});
