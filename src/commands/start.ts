import { Context } from "telegraf";

export function startCommand(ctx: Context) {
  const username = ctx.message?.from?.first_name;
  const keyboard = [[{ text: "🍣Подобрать блюдо" }]];
  ctx.reply(
    `👋 Привет ${username}!\n\n👨‍🍳 Я Yummy и я помогу тебе приготовить вкусное блюдо.\n\n 🍕 Начнем?`,
    {
      reply_markup: {
        keyboard: keyboard,
        resize_keyboard: true,
        one_time_keyboard: false,
      },
    }
  );
}
