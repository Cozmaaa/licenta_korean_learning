const express = require("express");
const OpenAI = require("openai");
const mongoose = require("mongoose");
const connectDB = require("./dbConn");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require("cors");
app.use(cors()); // Enable CORS for all routes

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set your API key in your environment variables
});

app.use(express.json()); // Middleware to allow the server to parse JSON

const storeSellerPrompt =
  "Esti un vanzator la un magazin in coreea , tu trebuie sa vorbesti doar in coreeana si sa incerci sa folosesti termeni mai simpli, de asemenea nu ai voie sa foloseste 당신 niciodata ";

const conversations = {}; // Un obiect pentru a stoca istoricul conversațiilor; în producție, ai putea folosi o bază de date

app.post("/generate-response", async (req, res) => {
  const userId = req.body.userId; // Asumăm că fiecare solicitare include un identificator de utilizator
  if (!conversations[userId]) {
    conversations[userId] = [{ role: "system", content: storeSellerPrompt }];
  }

  conversations[userId].push({ role: "user", content: req.body.text }); // Adaugă mesajul curent la istoric

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: conversations[userId], // Trimite istoricul complet al conversației
    });

    const responseContent = stream.choices[0].message.content;
    console.log(responseContent);
    conversations[userId].push({ role: "assistant", content: responseContent }); // Adaugă răspunsul la istoric

    console.log(conversations);

    res.json({ response: responseContent });
  } catch (error) {
    console.error(error);
    res.status(500).send("Eroare la generarea răspunsului");
  }
});

connectDB();

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
