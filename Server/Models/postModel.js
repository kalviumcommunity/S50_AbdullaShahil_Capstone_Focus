const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  name: String,
  title: String,
  description: String,
  image: Buffer,
  comments: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;
