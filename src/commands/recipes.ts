import { Context, Markup, Telegraf } from "telegraf";
import { fetchRecipes } from "../services/apiService.js";
import { handleReceiptIngredient } from "./handlers/getIngredientsHandler.js";

export async function recipe(bot: Telegraf): Promise<void> {
  try {
    bot.hears("🍣Подобрать блюдо", async (ctx) => {
      const message = ctx.message.text;
      if (message.includes("🍣Подобрать блюдо")) {
        await ctx.reply("Какие продукты которые ты точно хочешь видеть💫", {
          reply_markup: {
            force_reply: true,
            input_field_placeholder: "Reply with your answer",
          },
        });
      }
      console.log(ctx.message.text);
    });

    bot.on("text", async (ctx) => {
      const products = ctx.message.text;
      console.log("User response:", products);
      const dishName = `Я хочу приготовить блюдо с этими ингредиентами: ${products}. Пожалуйста, предоставьте ТОЛЬКО название блюда и ничего больше(описание блюда НЕ НУЖНО). Если название обширное предложи что-то из этого названия, его подвидов. Если ты получил какое-то неразборчивое, некорректное или не по теме название, но если это название какой-то съедобный продукт, мясо и все что-то разрешено есть в современной мире, то можешь скинуть название блюда, но если название не подходит, то напиши сообщение в таком формате(Я немного не понял что у тебя есть, но могу предложить тебе приготовить ( простенькое 1 блюдо)). Если это какое-то какое-то обширное название продукт(к примеру мясо(говядина и так далее), то просто напиши название блюда которого можно из него приготовить`;
      const dishNameResponse: any = await fetchRecipes(dishName);
      console.log(dishNameResponse);

      if (
        dishNameResponse ===
          "Как у нейросетевой языковой модели у меня не может быть настроения, но почему-то я совсем не хочу говорить на эту тему." ||
        dishNameResponse ===
          "Не люблю менять тему разговора, но вот сейчас тот самый случай." ||
        dishNameResponse ===
          "Что-то в вашем вопросе меня смущает. Может, поговорим на другую тему?"
      ) {
        ctx.reply("Мне кажется такое нельзя есть");
      } else {
        const stickerMessage = await ctx.replyWithSticker(
          "CAACAgIAAxkBAAEHB5hmmnNwCvp_ToISqpwa0Ozgdplr9AACeAIAAladvQr8ugi1kX0cDDUE"
        );
        const messageID = stickerMessage.message_id;

        setTimeout(async () => {
          await ctx.reply(
            `Я думаю тебе может понравиться:\n${dishNameResponse}`,
            Markup.inlineKeyboard([
              Markup.button.callback("Давай другое", "reroll"),
              Markup.button.callback("Получить ингридиенты", "get_ingredients"),
            ])
          );
          await ctx.deleteMessage(messageID);
        }, 10000);

        // console.log(ctx.message);
      }

      bot.action("get_ingredients", async (ctx) => {
        await handleReceiptIngredient(ctx, dishNameResponse);
      });
    });
  } catch (err) {
    console.error(err);
  }
}
