const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  id: String,  
  name: String,
  email: String,
  picture: String,
});

const profileModel = mongoose.model('Profile', profileSchema);

module.exports = profileModel;
