import { Context, Markup, Telegraf } from "telegraf";
import { fetchRecipes } from "../services/apiService.js";
import {
  handleIngredient,
  handleRecipe,
} from "./handlers/getIngredientsHandler.js";
import { handleReroll } from "./handlers/rerollHandler.js";

export async function recipe(bot: Telegraf): Promise<void> {
  try {
    bot.hears("🍣Подобрать блюдо", async (ctx) => {
      const message = ctx.message.text;
      if (message.includes("🍣Подобрать блюдо")) {
        await ctx.reply("Какие ингридиенты ты точно хочешь видеть💫", {
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
      const dishName = `Я хочу приготовить блюдо с этими ингредиентами: ${products}. Пожалуйста, предоставьте ТОЛЬКО название блюда и ничего больше(описание блюда НЕ НУЖНО). Если название обширное предложи что-то из этого названия, его подвидов. Если ты получил какое-то неразборчивое, некорректное или не по теме название, но если это название какой-то съедобный продукт, мясо и все что-то разрешено есть в современной мире, то можешь скинуть название блюда, но если название не подходит, то напиши сообщение в таком формате(Я немного не понял что у тебя есть, но могу предложить тебе приготовить ( простенькое 1 блюдо)). Если это какое-то какое-то обширное название продукт(к примеру мясо(говядина и так далее), то просто напиши название блюда которого можно из него приготовить. Если продукты перечислены через запятую(их несколько), то учитывай все продукты`;
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
              Markup.button.callback("Ингридиенты", "get_ingredients"),
            ])
          );
          await ctx.deleteMessage(messageID);
        }, 5000);
      }
      let getIngredients: string;
      bot.action("get_ingredients", async (ctx) => {
        getIngredients = await handleIngredient(dishNameResponse);
        ctx.reply(
          `Лови ингридиенты🏹\n\n${getIngredients}`,
          Markup.inlineKeyboard([Markup.button.callback("Рецепт", "recipe")])
        );
      });

      bot.action("reroll", async (ctx) => {
        if (
          ctx.callbackQuery &&
          ctx.callbackQuery.message &&
          "text" in ctx.callbackQuery.message
        ) {
          let reroll;
          const currentMessage = ctx.callbackQuery.message.text;
          let newMessage;

          do {
            reroll = await handleReroll(products, dishNameResponse);
            newMessage = `Что насчет этого?\n\n${reroll}`;
          } while (currentMessage === newMessage);

          await ctx.editMessageText(
            newMessage,
            Markup.inlineKeyboard([
              Markup.button.callback("Давай другое", "reroll"),
              Markup.button.callback("Ингридиенты", "get_ingredients"),
            ])
          );
        } else {
          await ctx.reply(
            "Не удалось получить информацию о предыдущем сообщении."
          );
        }
      });

      bot.action("recipe", async (ctx) => {
        const getRecipe = await handleRecipe(dishNameResponse, getIngredients);
        ctx.reply(`Я думаю этот рецепт поможет тебе🧶\n\n${getRecipe}`);
      });
    });
  } catch (err) {
    console.error(err);
  }
}
