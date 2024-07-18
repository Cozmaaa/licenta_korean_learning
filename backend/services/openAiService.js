const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const storeSellerPrompt =
  "You are a korean seller at a shop , you must only speak in korean " +
  "try to use simple words, also never use 당신 "; 

const handleOpenAiRequest = async (userId, text, conversations) => {
  if (!conversations[userId]) {
    conversations[userId] = [{ role: "system", content: storeSellerPrompt }];
  }

  conversations[userId].push({ role: "user", content: text });

  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: conversations[userId],
  });

  const responseContent = stream.choices[0].message.content;
  conversations[userId].push({ role: "assistant", content: responseContent });

  return responseContent;
};

module.exports = { handleOpenAiRequest };
