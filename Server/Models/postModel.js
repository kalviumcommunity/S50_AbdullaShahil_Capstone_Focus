const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  },
  title: String,
  description: String,
  image: String,
  comments: [String],
  category: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});


const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;
