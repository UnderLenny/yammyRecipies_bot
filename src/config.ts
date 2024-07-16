import dotenv from "dotenv";
dotenv.config();

export default {
  BOT_TOKEN: process.env.BOT_TOKEN || "",
  RECIPES_TOKEN: process.env.RECIPES_TOKEN || "",
  API_URL: process.env.API_URL || "",
};
