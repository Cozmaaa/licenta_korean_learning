const { Schema, model } = require("mongoose");

const wordSchema = new Schema({
  word: { type: String, required: true },
  translation: { type: String, required: true },
});

const Word = model("Word", wordSchema);

module.exports = Word;
