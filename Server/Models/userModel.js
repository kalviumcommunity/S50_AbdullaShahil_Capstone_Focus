const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: String,
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
