import { Context } from "telegraf";

const keyboard = [[{ text: "🍣Подобрать блюдо" }]];

export function showBtnCommand(ctx: Context) {
  ctx.replyWithSticker(
    "CAACAgIAAxkBAAEHCMxmmo0_ztwQ3yU9MfXgudEIib50SQACcwIAAladvQqoc6WsC0Ee0TUE",
    {
      reply_markup: {
        keyboard: keyboard,
        resize_keyboard: true,
        one_time_keyboard: false,
      },
    }
  );
}
