const { Schema, model } = require('mongoose');

const sessionSchema = new Schema({
  sessionToken: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true },
});

const Session = model('Session', sessionSchema);

module.exports = Session;
