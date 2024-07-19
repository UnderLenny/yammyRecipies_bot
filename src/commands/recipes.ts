import { Context } from "telegraf";
import { fetchRecipes } from "../services/apiService.js";

import { AxiosResponse } from "axios";
import { getRecipeMsgParams, translateText } from "../utils/helpers.js";

export async function recipes(ctx: Context): Promise<void> {
  try {
    const message = ctx.message as { text: string };
    const products = message.text.split("/recipes ")[1];

    console.log(products);

    const dishName = `Я хочу приготовить блюдо с этими ингредиентами: ${products}. Пожалуйста, предоставьте ТОЛЬКО название блюда и ничего больше. Если ты получил какое-то неразборчивое, некорректное или не по теме название. То напиши сообщение в таком формате(Хм, я не знаю таких ингридиентов, но могу предложить тебе приготовить ( простенькое блюдо)).`;
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
      const ingredients = `Я хочу приготовить блюдо: ${dishNameResponse}. Пожалуйста, предоставьте только ингридиенты которые потребуются для приготовления. Формат ответа: нумерованный список без дополнительного текста.`;
      const ingredientsResponse: any = await fetchRecipes(ingredients);
      const recipe = `Я хочу приготовить блюдо: ${dishNameResponse}, по этим ингридиентам ${ingredientsResponse}. Пожалуйста, предоставьте, только рецепт с помощью которого можно приготовить это блюдо. Формат ответа: нумерованный список без дополнительного текста.`;
      const recipeResponse: string = (await fetchRecipes(recipe)) ?? "";
      ctx.reply(
        `Я думаю тебе может понравиться:\n${dishNameResponse}😋\n\n Лови ингридиенты: \n${ingredientsResponse}\n\n Рецепт приготовления:\n${recipeResponse}`
      );
    }
  } catch (err) {
    console.error(err);
  }
}
