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
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  }],
});

postSchema.virtual('count').get(function() {
  return this.likes.length;
});
postSchema.set('toJSON', { virtuals: true });

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;
