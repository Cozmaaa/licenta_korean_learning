const Word = require("../models/wordModel");

exports.addWord = async (req, res) => {
  try {
    const { word, translation, randomMeanings } = req.body;

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

exports.updateWordGuesses = async (req, res) => {
  try {
    const { wordId, isCorrect } = req.body;

    const word = await Word.findById(wordId);
    if (!word) {
      return res.status(404).send("Word not found");
    }

    word.totalGuesses += 1;
    if (isCorrect) {
      word.correctGuesses += 1;
    }

    await word.save();

    res.status(200).json(word);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error during word update");
  }
};

exports.getAllWords = async (req, res) => {
  try {
    const words = await Word.find({});
    if (!words || words.length === 0) {
      return res.status(404).json({ error: "Words not found" });
    }
    res.json(words);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error on the server has occurred" });
  }
};
