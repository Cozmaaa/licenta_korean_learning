const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const storeSellerPrompt =
  "Esti un vanzator la un magazin in coreea , tu trebuie sa vorbesti doar in coreeana " +
  "si sa incerci sa folosesti termeni mai simpli, de asemenea nu ai voie sa foloseste 당신 niciodata"; // Your prompt

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
