import axios from "axios";
import config from "../config.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import https from "https";
import { GigaChat } from "gigachat-node";

const clientSecretKey = config.GIGACHAT_TOKEN;
const isIgnoreTSL = true;
const isPersonal = true;
const autoRefreshToken = true;

const client = new GigaChat(
  clientSecretKey,
  isIgnoreTSL,
  isPersonal,
  autoRefreshToken
);
await client.createToken();

export const fetchRecipes = async (prompt: string) => {
  try {
    const response = await client.completion({
      model: "GigaChat:latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = response.choices[0].message.content;
    return result;
  } catch (err) {
    console.error(err);
  }
};
