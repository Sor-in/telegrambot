const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TELEGRAM_TOKEN;
const url = process.env.RENDER_EXTERNAL_URL;
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Creează botul fără polling și fără webhook intern
const bot = new TelegramBot(token);

// Setează webhook către URL-ul aplicației tale pe Render
bot.setWebHook(`${url}/bot${token}`);

// Rutează cererile Telegram către bot
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Răspunde la mesaje
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.toLowerCase() || "";

  if (text.includes("salut")) {
    bot.sendMessage(chatId, "Salutare de pe Render! 😊");
  } else {
    bot.sendMessage(chatId, "Nu am înțeles, dar încerc să învăț! 🤖");
  }
});

// Pornește serverul Express
app.listen(port, () => {
  console.log(`Server pornit pe portul ${port}`);
});
