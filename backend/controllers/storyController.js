const Word = require("../models/wordModel");
const Story = require("../models/storyModel");

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


exports.getAllStories = async (req,res) =>{
    try{
        const stories = await Story.find({}).populate("highlightedWords");

        if(!stories){
            return res.status(404).json({error:"Stories not found!"});
        }
        res.json(stories);
    }catch(erorr){
        console.log(error);
        res.status(500).json({error:"An error on the server has occured"});
    }
}