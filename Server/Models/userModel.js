const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  repeatPassword: String
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
