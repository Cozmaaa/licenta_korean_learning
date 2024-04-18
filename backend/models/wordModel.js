const { Schema, model } = require("mongoose");

const wordSchema = new Schema({
  word: { type: String, required: true },
  translation: { type: String, required: true },
  randomMeanings: [{type:String}],
});

const Word = model("Word", wordSchema);

module.exports = Word;
