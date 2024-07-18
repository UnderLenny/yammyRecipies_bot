import axios from "axios";
import config from "../config.js";
import { v4 as uuidv4 } from "uuid";
import { translateText } from "../utils/helpers.js";
import fs from "fs";
import https from "https";

const cert = fs.readFileSync("./chain.pem");

const agent = new https.Agent({
  ca: cert,
});

export const fetchRecipes = async (prompt: string) => {
  try {
    const headers = {
      Authorization: `Basic ${config.GIGACHAT_TOKEN}`,
      RqUID: uuidv4(),
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    };

    const access_token = await axios
      .post(
        "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
        encodeURI(`scope=${process.env.SCOPE}`),
        {
          headers: headers,
          httpsAgent: agent,
        }
      )
      .then((response) => {
        return response.data.access_token;
      });

    const textAI = await axios.post(
      "https://gigachat.devices.sberbank.ru/api/v1/chat/completions",
      JSON.stringify({
        model: "GigaChat:latest",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        profanity_check: true,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        httpsAgent: agent,
      }
    );
    const result = textAI.data.choices[0].message.content;
    return result;
  } catch (err) {
    console.error(err);
  }
};
