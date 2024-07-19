import { Telegraf } from "telegraf";
import config from "./config.js";
import { setupBot } from "./bot.js";
import LocalSession from "telegraf-session-local";

const bot = new Telegraf(config.BOT_TOKEN);
// const localSession = new LocalSession({ database: "sessions.json" });
// bot.use(localSession.middleware());
setupBot(bot);

bot
  .launch()
  .then(() => console.log("Bot started"))
  .catch((err) => console.error("Error launching bot: ", err));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

export default bot;
