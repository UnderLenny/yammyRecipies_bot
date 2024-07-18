import { Telegraf } from "telegraf";
import { startCommand } from "./commands/start.js";
import { recipes } from "./commands/recipes.js";

export function setupBot(bot: Telegraf) {
  bot.start(startCommand);
  bot.command("recipes", recipes);
}
