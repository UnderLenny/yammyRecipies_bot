import dotenv from "dotenv";
dotenv.config();

export default {
  BOT_TOKEN: process.env.BOT_TOKEN || "",
  API_URL: process.env.API_URL || "",
  DEEPL_KEY: process.env.DEEPL_KEY || "",
  GIGACHAT_URL: process.env.GIGACHAT_URL || "",
  GIGACHAT_TOKEN: `${process.env.GIGACHAT_TOKEN}==` || "",
  GIGACHAT_CLIENT_TOKEN: process.env.GIGACHAT_CLIENT_TOKEN || "",
  SCOPE: process.env.SCOPE || "",
};
