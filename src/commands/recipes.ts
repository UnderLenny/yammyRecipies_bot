import { Context } from "telegraf";
import { fetchRecipes } from "../services/apiService.js";

import { AxiosResponse } from "axios";
import { getRecipeMsgParams, translateText } from "../utils/helpers.js";

export async function recipes(ctx: Context): Promise<void> {
  try {
    const message = ctx.message as { text: string };
    const ingredients = message.text.split("/recipes ")[1];

    console.log(ingredients);

    const messages = `Я хочу приготовить блюдо с этими ингредиентами: ${ingredients}. Пожалуйста, предоставьте ТОЛЬКО название блюда и рецепт приготовления.`;

    const response: any = await fetchRecipes(messages);

    ctx.reply(response);
  } catch (err) {
    console.error(err);
  }
}
