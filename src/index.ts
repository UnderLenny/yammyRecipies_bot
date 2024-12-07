import {session, Telegraf} from "telegraf";
import config from "./config.js";
import { setupBot } from "./bot.js";
import {initDB} from "./services/dbService.js";

const bot = new Telegraf(config.BOT_TOKEN);
bot.use(session());
// const localSession = new LocalSession({ database: "sessions.json" });
// bot.use(localSession.middleware());
(async () => {
  await initDB(); // Инициализация базы данных
  setupBot(bot);
  bot.launch()
      .then(() => console.log("Bot started"))
      .catch((err) => console.error("Error launching bot: ", err));
})();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

export default bot;
