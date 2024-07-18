import { Context } from "telegraf";
import { fetchRecipes } from "../services/apiService.js";
import { AxiosResponse } from "axios";
import { getRecipeMsgParams, translateText } from "../utils/helpers.js";

export async function recipes(ctx: Context): Promise<void> {
  let title;
  let image;
  try {
    const ingredient = getRecipeMsgParams(ctx);
    if (!ingredient) {
      ctx.reply("Пожалуйста, укажите ингредиент после команды.");
      return;
    }
    const recipes: AxiosResponse<any> | undefined = await fetchRecipes(
      ingredient
    );
    if (recipes) {
      const recipeTitle = recipes.data.results[0].title;
      console.log(recipeTitle);
      title = await translateText(recipeTitle, "en", "ru");
      image = recipes.data.results[0].image;
      ctx.replyWithPhoto(image, {
        caption: `Я думаю тебе может понравиться:\n*${title}*🍽`,
        parse_mode: "Markdown",
      });

      // console.log(JSON.stringify(recipes.data));
    } else {
      ctx.reply("По данному продукту рецептов не найдено😕");
    }
  } catch (err) {
    console.error(err);
    ctx.reply("Не удалось загрузить рецепты, попробуйте позже🎲");
  }
}
