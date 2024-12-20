// noinspection ES6MissingAwait
// @ts-nocheck
import { Markup, Telegraf } from "telegraf";
import { fetchRecipes } from "../services/apiService.js";
import {
  handleIngredient,
  handleRecipe,
} from "./handlers/getIngredientsHandler.js";
import { handleReroll } from "./handlers/rerollHandler.js";
import {
  addRecipeRating,
  getCachedResponse,
  getRecipeRating,
  getUserRatings,
  getUserSearchHistory,
  saveResponseToCache,
  saveSearchQuery,
  saveUser,
} from "../services/dbService.js";

export async function recipe(bot: Telegraf): Promise<void> {
  bot.use(async (ctx, next) => {
    ctx.session = ctx.session || {};
    await next();
  });

  try {
    bot.hears("🍣Подобрать блюдо", async (ctx) => {
      const message = ctx.message.text;
      if (message.includes("🍣Подобрать блюдо")) {
        if (ctx.session) {
          ctx.session.currentDish = null;
          ctx.session.currentIngredients = null;
        }

        await ctx.reply("Какие ингредиенты ты точно хочешь видеть💫", {
          reply_markup: {
            force_reply: true,
            input_field_placeholder: "Reply with your answer",
          },
        });
      }
    });

    bot.on("text", async (ctx) => {
      const userId = ctx.from?.id;
      const username = ctx.from?.username || null;
      const firstName = ctx.from?.first_name || null;
      const lastName = ctx.from?.last_name || null;
      const languageCode = ctx.from?.language_code || null;

      if (userId) {
        await saveUser(userId, username, firstName, lastName, languageCode);
      }

      const products = ctx.message.text;

      if (ctx.session) {
        ctx.session.currentDish = null;
        ctx.session.currentIngredients = null;
      }

      if (userId) {
        await saveSearchQuery(userId, products);
      }

      const cachedResponse = await getCachedResponse(products);
      let dishNameResponse;

      if (cachedResponse) {
        dishNameResponse = cachedResponse;
      } else {
        const dishName = `Я хочу приготовить блюдо с этими ингредиентами: ${products}. Пожалуйста, предоставьте ТОЛЬКО название блюда...`;

        dishNameResponse = await fetchRecipes(dishName);

        if (dishNameResponse && userId) {
          await saveResponseToCache(products, dishNameResponse);
        }
      }

      if (ctx.session) {
        ctx.session.currentDish = dishNameResponse;
      }

      if (
          [
            "Как у нейросетевой языковой модели у меня не может быть настроения...",
            "Не люблю менять тему разговора...",
            "Что-то в вашем вопросе меня смущает...",
          ].includes(dishNameResponse)
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
                Markup.button.callback("Ингредиенты", "get_ingredients"),
              ])
          );
          await ctx.deleteMessage(messageID);
        }, 5000);
      }

      bot.action("get_ingredients", async (actionCtx) => {
        if (ctx.session?.currentDish) {
          const ingredients = await handleIngredient(ctx.session.currentDish);

          if (actionCtx.session) {
            actionCtx.session.currentIngredients = ingredients;
          }

          actionCtx.reply(
              `Лови ингредиенты🏹\n\n${ingredients}`,
              Markup.inlineKeyboard([
                Markup.button.callback("Рецепт", "recipe"),
              ])
          );
        }
      });

      bot.action("reroll", async (actionCtx) => {
        const reroll = await handleReroll(products, dishNameResponse);

        if (actionCtx.session) {
          actionCtx.session.currentDish = reroll;
          actionCtx.session.currentIngredients = null;
        }

        actionCtx.reply(
            `Что насчет этого?\n\n${reroll}`,
            Markup.inlineKeyboard([
              Markup.button.callback("Давай другое", "reroll"),
              Markup.button.callback("Ингредиенты", "get_ingredients"),
            ])
        );
      });

      bot.action("recipe", async (actionCtx) => {
        if (ctx.session?.currentDish && ctx.session?.currentIngredients) {
          const getRecipe = await handleRecipe(
              ctx.session.currentDish,
              ctx.session.currentIngredients
          );
          actionCtx.reply(
              `Я думаю этот рецепт поможет тебе🧶\n\n${getRecipe}`,
              Markup.inlineKeyboard([
                Markup.button.callback("Оценить", "rate_recipe"),
              ])
          );
        }
      });

      bot.action("rate_recipe", async (ctx) => {
        if (userId) {
          await ctx.reply(
              "Пожалуйста, оцените рецепт от 1 до 5:",
              Markup.inlineKeyboard([
                Markup.button.callback("1️⃣", "rate_1"),
                Markup.button.callback("2️⃣", "rate_2"),
                Markup.button.callback("3️⃣", "rate_3"),
                Markup.button.callback("4️⃣", "rate_4"),
                Markup.button.callback("5️⃣", "rate_5"),
              ])
          );
        }
      });

      ["rate_1", "rate_2", "rate_3", "rate_4", "rate_5"].forEach(
          (action) => {
            bot.action(action, async (ctx) => {
              if (userId) {
                const rating = parseInt(action.split("_")[1]);
                const recipeId = 1; // Замените на реальный механизм получения ID рецепта
                await addRecipeRating(userId, recipeId, rating);

                const averageRating = await getRecipeRating(recipeId);

                ctx.answerCbQuery(
                    `Спасибо за оценку! Средний рейтинг: ${averageRating.toFixed(1)}`
                );
              }
            });
          }
      );

      bot.command("history", async (ctx) => {
        if (userId) {
          const searchHistory = await getUserSearchHistory(userId);
          const historyText = searchHistory
              .map(
                  (item, index) =>
                      `${index + 1}. ${item.query} (${new Date(
                          item.created_at
                      ).toLocaleString()})`
              )
              .join("\n");

          ctx.reply(
              `История ваших поисков:\n${historyText || "История пуста"}`
          );
        }
      });

      bot.command("ratings", async (ctx) => {
        if (userId) {
          const userRatings = await getUserRatings(userId);
          const ratingsText = userRatings
              .map(
                  (item, index) =>
                      `${index + 1}. Рецепт ID: ${item.recipe_id}, Оценка: ${
                          item.rating
                      } (${new Date(item.created_at).toLocaleString()})`
              )
              .join("\n");

          ctx.reply(
              `Ваши оценки рецептов:\n${
                  ratingsText || "Вы пока не оценили ни одного рецепта"
              }`
          );
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
}
