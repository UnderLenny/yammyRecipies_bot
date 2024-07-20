import { Telegraf } from "telegraf";
import { startCommand } from "./commands/start.js";
import { recipe } from "./commands/recipes.js";
import { showBtnCommand } from "./commands/show.js";

export function setupBot(bot: Telegraf) {
  bot.start(startCommand);
  bot.command("show", showBtnCommand);
  recipe(bot);
}
