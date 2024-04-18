const Word = require("../models/wordModel");

exports.addWord = async (req, res) => {
  try {
    const { word, translation , randomMeanings } = req.body;

    const existingWord = await Word.findOne({ word });
    if (existingWord) {
      return res.status(400).send("Word already exists");
    }

    const newWord = new Word({ word, translation, randomMeanings });
    await newWord.save();

    res.status(201).json(newWord);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error during word adding");
  }
};
