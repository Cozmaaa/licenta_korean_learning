const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: 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, // Set your API key in environment variables
});
const openai = new OpenAIApi(configuration);

app.post('/generate-response', async (req, res) => {
  try {
    const prompt = `You are a seller at a shopping center. ${req.body.userInput}`;
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo-0125", // Choose the model you prefer
      prompt: prompt,
      max_tokens: 150,
    });

    res.json({ data: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating response');
  }
});
