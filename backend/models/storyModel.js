const { Schema, model } = require("mongoose");

const storySchema = new Schema({
  title: { type: String, required: true },
  level: { type: Number, required: true },
  content: { type: String, required: true },
  highlightedWords: [{ type: Schema.Types.ObjectId, ref: "Word" }],
  createdAt: { type: Date, default: Date.now },
  audioUrl: { type: String },
});

const Story = model("Story", storySchema);

module.exports = Story;
