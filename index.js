import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api';
import app from './api/index.js';
import User from './models/User.js';


import mongoose from "mongoose";

const uri = "mongodb://alizaib:alizaib@ac-nguhhu6-shard-00-00.x6qjsa3.mongodb.net:27017,ac-nguhhu6-shard-00-01.x6qjsa3.mongodb.net:27017,ac-nguhhu6-shard-00-02.x6qjsa3.mongodb.net:27017/tapown?ssl=true&replicaSet=atlas-rynlfh-shard-0&authSource=admin&retryWrites=true&w=majority&appName=tapown";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(uri, clientOptions);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to Mongo :", error);
    console.log("Retrying connection in 5 seconds...");
   
  }
}

run()


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const server = express();
const port = process.env.PORT || 3000;


server.use(express.json());
server.use(express.static(path.join(__dirname + "/dist")));
server.use(express.urlencoded({ extended: true }));
server.use(cors());
server.use(app);

const token = '7099832076:AAFNhbAjIUcmGQ8kiui9rjm6qoYm271UwAk'; 
const bot = new TelegramBot(token);


const webhookUrl = `https://tapown-coinbackend.vercel.app/api/webhook`;
bot.setWebHook(webhookUrl);

server.post('/api/webhook', (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;
    const name = msg.from.username || msg.from.first_name || msg.from.id + Math.random().toString();

    try {
        await bot.sendMessage(chatId, `Welcome to my bot`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Play here', web_app: { url: `https://tapown.vercel.app/?id=${telegramId}` } }]
                ]
            }
        });
        console.log("Message sent to user.");
    } catch (e) {
        console.error('Error sending message:', e);
    }


    try {
        const isExit = await User.findOne({ user_id: telegramId });
        if (!isExit) {
            const newUser = new User({ username: name, user_id: telegramId, own_coins: 0 });
            await newUser.save();
            console.log("New user saved.");
        }
    } catch (e) {
        console.error('Error interacting with database:', e);
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


