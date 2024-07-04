const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
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
  postedTime: { 
    type: Date,
    default: Date.now 
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  }]
});

const articleModel = mongoose.model('Article', articleSchema);

module.exports = articleModel;