import { Context, Telegraf } from "telegraf";
import translate from "translate";
import config from "../config.js";

export const getRecipeMsgParams = (ctx: Context) => {
  if (ctx.message && "text" in ctx.message) {
    const ctxMessage = ctx.message.text;
    const args = ctxMessage.split(" ", 2);
    const ingredient = args[1];
    console.log("Ингредиент:", ingredient);
    return ingredient;
  }
};

translate.engine = "deepl";
translate.key = config.DEEPL_KEY;

export const translateText = async (
  text: string,
  fromLang: string,
  toLang: string
) => {
  const translation = await translate(text, { from: fromLang, to: toLang });
  console.log(translation);
  return translation;
};
