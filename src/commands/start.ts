import { Context } from "telegraf";

export function startCommand(ctx: Context) {
  const username = ctx.message?.from?.first_name;
  ctx.reply(
    `👋 Привет ${username}!\n\n👨‍🍳 Я Yummy и я помогу тебе приготовить вкусное блюдо.\n\n 🍕 Начнем?`
  );
}
