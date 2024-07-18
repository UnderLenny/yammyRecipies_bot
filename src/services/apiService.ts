import axios from "axios";
import config from "../config.js";
import { translateText } from "../utils/helpers.js";

export const fetchRecipes = async (ingredient: string) => {
  try {
    const getRecipes = await axios.get(
      `${config.API_URL}/recipes/complexSearch`,
      {
        params: {
          apiKey: config.RECIPES_TOKEN,
          query: await translateText(ingredient, "ru", "en"),
        },
      }
    );
    return getRecipes;
  } catch (err) {
    console.error(err);
  }
};
