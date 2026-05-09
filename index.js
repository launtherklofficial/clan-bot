const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;
const ownerId = process.env.OWNER_ID;

const bot = new TelegramBot(token, { polling: true });

let data = {};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🏰 Напиши /apply чтобы подать заявку");
});

bot.onText(/\/apply/, (msg) => {

  data[msg.chat.id] = {};

  bot.sendMessage(msg.chat.id, "🎮 Ник в Minecraft?");

  bot.once("message", (m1) => {

    data[msg.chat.id].nick = m1.text;

    bot.sendMessage(msg.chat.id, "📅 Возраст?");

    bot.once("message", (m2) => {

      data[msg.chat.id].age = m2.text;

      const d = data[msg.chat.id];

      bot.sendMessage(ownerId,
        `📨 ЗАЯВКА\n\n👤 Ник: ${d.nick}\n📅 Возраст: ${d.age}`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: "✅ Принять", callback_data: `accept_${msg.chat.id}` }
            ]]
          }
        }
      );

      bot.sendMessage(msg.chat.id, "✅ Отправлено!");
    });
  });
});

bot.on("callback_query", (query) => {
  if (query.data.startsWith("accept_")) {

    const id = query.data.split("_")[1];

    bot.sendMessage(id,
      "✅ Тебя приняли в клан! напиши в лс @launtherkl со скринами то что тебя приняли!"
    );
  }
});
