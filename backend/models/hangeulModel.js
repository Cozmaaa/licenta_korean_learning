const { Schema, model } = require('mongoose');

const hangeulSchema = new Schema({
  letter: { type: String, required: true, unique: true },
  meaning: { type: String, required: true },
});

const Hangeul = model('Hangeul', hangeulSchema);

module.exports = Hangeul;
