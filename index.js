const TelegramBot = require("node-telegram-bot-api");
const { TELEGRAM_API_KEY } = require("./config");
const handleVoiceCommand = require("./voiceCommandHandler");

const bot = new TelegramBot(TELEGRAM_API_KEY, { polling: true });

bot.on("voice", (msg) => {
  handleVoiceCommand(bot, msg);
});
