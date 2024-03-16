const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  userType: {
    type: String,
    required: false,
    enum: ['normal', 'admin'], // Restrict userType to only 'normal' or 'admin'
    default: 'normal' // Set default userType to 'normal'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


//TODO : readStories , savedWords, HashCookie 

const User = mongoose.model('User', userSchema);

module.exports = User;
