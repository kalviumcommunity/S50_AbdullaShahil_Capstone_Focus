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
  postedTime: { // Add postedTime field to the schema
    type: Date,
    default: Date.now // Set default value to current date/time
  }
});

const articleModel = mongoose.model('Article', articleSchema);

module.exports = articleModel;
