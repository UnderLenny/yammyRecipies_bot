import { Context } from "telegraf";

export function startCommand(ctx: Context) {
  ctx.reply(
    "Привет, напиши название ингридиента, а попробую тебе предложить блюдо из него🍝"
  );
}
