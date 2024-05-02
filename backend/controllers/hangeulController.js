// controllers/hangeulController.js
const Hangeul = require("../models/hangeulModel"); // Adjust the path as per your project structure

exports.getHangeulLetter = async (req, res) => {
  try {
    const { id } = req.params; // Assuming you're using the letter itself as an ID for fetching
    const hangeulLetter = await Hangeul.findOne({ _id: id });

    if (!hangeulLetter) {
      return res.status(404).send("Hangeul letter not found");
    }

    res.json(hangeulLetter);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

exports.getAllHangeulLetters = async (req, res) => {
  try {
    const hangeulLetters = await Hangeul.find({});
    res.json(hangeulLetters);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

exports.getNextHangeulLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const hangeulLetters = await Hangeul.find({});

    // Find the index of the current letter
    const currentIndex = hangeulLetters.findIndex(
      (letter) => letter._id.toString() === id
    );

    if (currentIndex === -1) {
      return res.status(404).send("Current Hangeul letter not found");
    }

    // Determine the next letter; if the current one is the last, circle back to the first letter
    const nextIndex = (currentIndex + 1) % hangeulLetters.length;
    const nextHangeulLetter = hangeulLetters[nextIndex];

    res.json({ nextId: nextHangeulLetter._id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.addHangeulLetter = async (req, res) => {
  try {
    const { letter, meaning } = req.body;

    // Check if the letter already exists
    const existingLetter = await Hangeul.findOne({ letter });
    if (existingLetter) {
      return res.status(400).send("This Hangeul letter already exists");
    }

    // Create a new Hangeul letter
    const newHangeulLetter = new Hangeul({ letter, meaning });
    await newHangeulLetter.save();

    res.status(201).json(newHangeulLetter);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error during Hangeul letter creation");
  }
};

exports.getAllHangeulLetters = async (req, res) => {
  try {
    const hangeulLetters = await Hangeul.find({});

    if (!hangeulLetters) {
      return res.status(404).send("There are no hangeul letters");
    }
    res.status(200).json(hangeulLetters);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error during gettingHangeul letters ");
  }
};
