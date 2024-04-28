const Word = require("../models/wordModel");
const Story = require("../models/storyModel");
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");



exports.addStory = async (req, res) => {
  try {
    // Extract the necessary information from the request body
    const { title, level, content, highlightedWords } = req.body;

    const existingStory = await Story.findOne({ title });
    if (existingStory) {
      return res
        .status(400)
        .json({ error: "A story with the same title already exists" });
    }

    // Find or create the highlighted words in the Word model
    const wordPromises = highlightedWords.map(async (word) => {
      const foundWord = await Word.findOne({ word });
      if (foundWord) {
        return foundWord._id;
      } else {
        console.log(word);
        const newWord = new Word({ word });
        const savedWord = await newWord.save();
        return savedWord._id;
      }
    });

    // Wait for all the word promises to resolve
    const wordIds = await Promise.all(wordPromises);

    // Create a new instance of the Story model
    const newStory = new Story({
      title,
      level,
      content,
      highlightedWords: wordIds,
    });

    // Save the new story to the database
    const savedStory = await newStory.save();

    // Populate the highlighted words in the saved story
    await savedStory.populate("highlightedWords");

    const openai = new OpenAI();

    // Generate the audio file using OpenAI API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: savedStory.content,
    });

    const speechFile = path.resolve(`./public/speech_${savedStory._id}.mp3`);
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);

    // Update the saved story with the audio URL
    savedStory.audioUrl = `/speech_${savedStory._id}.mp3`;
    await savedStory.save();

    // Send a success response to the client
    res.status(201).json(savedStory);
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error("Error adding story:", error);
    res.status(500).json({ error: "An error occurred while adding the story" });
  }
};

exports.getStoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findById(id).populate("highlightedWords");

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    res.json(story);
  } catch (error) {
    console.error("Error retrieving story:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the story" });
  }
};

exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.find({}).populate("highlightedWords");

    if (!stories) {
      return res.status(404).json({ error: "Stories not found!" });
    }
    res.json(stories);
  } catch (erorr) {
    console.log(error);
    res.status(500).json({ error: "An error on the server has occured" });
  }
};
