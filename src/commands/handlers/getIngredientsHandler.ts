import { Context, Telegraf } from "telegraf";
import { fetchRecipes } from "../../services/apiService.js";

export const handleIngredient = async (dishName: string) => {
  const ingredients = `Я хочу приготовить блюдо: ${dishName}. Пожалуйста, предоставьте только ингридиенты которые потребуются для приготовления. Формат ответа: нумерованный список без дополнительного текста и с отступам строки после каждого номера. Не каких предложений писать не нужно, просто название блюда."`;
  const ingredientsResponse: any = await fetchRecipes(ingredients);

  return ingredientsResponse;
};

export const handleRecipe = async (
  dishName: string,
  ingredientsResponse: string
) => {
  const recipe = `Я хочу приготовить блюдо: ${dishName}, по этим ингридиентам ${ingredientsResponse}. Пожалуйста, предоставьте, только рецепт с помощью которого можно приготовить это блюдо. Формат ответа: нумерованный список без дополнительного текста. `;
  const recipeResponse: string = (await fetchRecipes(recipe)) ?? "";

  return recipeResponse;
};
