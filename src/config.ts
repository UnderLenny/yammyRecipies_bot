import dotenv from "dotenv";
dotenv.config();

export default {
  BOT_TOKEN: process.env.BOT_TOKEN || "",
  RECIPES_TOKEN: process.env.RECIPES_TOKEN || "",
  API_URL: process.env.API_URL || "",
  DEEPL_KEY: process.env.DEEPL_KEY || "",
};
