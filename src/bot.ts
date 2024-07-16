import { Telegraf } from "telegraf";
import { startCommand } from "./commands/start";

export function setupBot(bot: Telegraf) {
  bot.start(startCommand);
}
