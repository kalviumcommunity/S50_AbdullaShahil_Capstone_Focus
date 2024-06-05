const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  id: String,  
  name: String,
  email: String,
  picture: String,
  posts: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
],
  articles: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  },
],
communities: [
  {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Community'
},
],
});

const profileModel = mongoose.model('Profile', profileSchema);

module.exports = profileModel;
