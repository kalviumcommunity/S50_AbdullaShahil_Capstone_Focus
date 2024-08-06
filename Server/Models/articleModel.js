const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  name: String,
  message: String,
  profilepic: {
    type: String,
    ref: "Profile"
  },
  postedTime: {
    type: Date,
    default: Date.now
  }
});


const articleSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  },
  title: String,
  description: String,
  image: String,
  comments: [commentSchema],
  category: String,
  profile_img: String,
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