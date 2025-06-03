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

// ///////////////////////////////////////
// Aici incepe codul cu logica botului  
// //////////////////////////////////////

// Obiectue pentru stocarea datelor despre utilizatori
const users = {};
let alreadySetYourName = {};
let alreadyToldMyName = {};
let expectYourName = {};

// Răspunde la mesaje
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text.toLowerCase();
    const name = users[chatId] ? users[chatId].replace(/r/g, "l") : "";
    
    if (text.includes("/start")
        || text.includes("salut")
        || text.includes("salutare")
        || text.includes("buna ziua")
        || text.includes("buna")) {
        bot.sendMessage(chatId, "Salut! Se ma bucul ca am cu sine volbi!");
    }else if (expectYourName[chatId]) {
        users[chatId] = text.charAt(0).toUpperCase() + text.slice(1);
        alreadySetYourName = true;
        bot.sendMessage(chatId, "Ma bucul sa te cunosc " + users[chatId].replace(/r/g, "l") + " 😊");
        expectYourName[chatId] = false;
    } else if (text.includes("ce faci")) {
        bot.sendMessage(chatId, "Se clezi ca fac, volbesc cu tine. tu se fasi? 😊");
    } else if (text.includes("cum te cheama")
        || text.includes("cum te numesti")
        || text.includes("cine esti")
        || text.includes("cine vorbesc")
        || text.includes("care e numele tau")
        || text.includes("ce nume ai")) {
            if (!alreadyToldMyName[chatId]) {
                if(!name){
                    bot.sendMessage(chatId, "Pe mine ma cheama Uls. Pe tine cum te cheama? 😊");
                    alreadyToldMyName[chatId] = true;
                    expectYourName[chatId] = true;
                }else{
                    bot.sendMessage(chatId, "Pe mine ma cheama Uls 😊");
                    alreadyToldMyName[chatId] = true;
                }
            } else {
                bot.sendMessage(chatId, name + ", si-am spus deza, ma cheama Uls! 😊");
            }
    } else if (text.includes("ma cheama")
        || text.includes("care e numele meu")
        || text.includes("cine sunt eu")
        || text.includes("cine vorbesti")) {
        if(name){
            bot.sendMessage(chatId, "Numele tau este " + name + " 😊");
        }else{
            bot.sendMessage(chatId, "Nu stiu! Cum te numesti? 😊");
            expectYourName[chatId] = true;
        }
    } else if (text.includes("ce mai faci")
        || text.includes("cum te simti")
        || text.includes("cum esti")
        || text.includes("esti bine")) {
        bot.sendMessage(chatId, "Bine! Sunt un UlsBot si mi melsge eselent.😊 Sie cum isi melge?");
    } else if ((text.includes("bine") && text.length===4) 
        || text.includes("sunt bine") 
        || text.includes("foarte bine")) {
        bot.sendMessage(chatId, "Ma bucul ca fasi bine!");
    } else if (text.includes("povesteste ceva")
        || text.includes("de unde vii")
        || text.includes("cine te-a facut")
        || text.includes("cine te-a creat")
        || text.includes("cum ai aparut")
        || text.includes("care e povestea ta")) {
        bot.sendMessage(chatId, "Stii, am fost cleat de sineva pasionat de SavaSclipt... și iubesc să volbesc!");
    } else {
        bot.sendMessage(chatId, "Sunt doal un UlsBot si nu inseleg se zisi 🤖. Sau poate nu iseleg pentlu ca ai sclis glesit sau poate ai sclis cu diaclitise 😊");
    }
});

// Pornește serverul Express
app.listen(port, () => {
  console.log(`Server pornit pe portul ${port}`);
});
