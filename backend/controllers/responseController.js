const openAiService = require("../services/openAiService");

const conversations = {};

const generateResponse = async (req, res) => {
  const { userId, text } = req.body;

  try {
    const responseContent = await openAiService.handleOpenAiRequest(userId, text, conversations);
    res.json({ response: responseContent });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating response");
  }
};

module.exports = { generateResponse };
