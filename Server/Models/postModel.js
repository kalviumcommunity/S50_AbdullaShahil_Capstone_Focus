const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile', // Reference to the Profile model
    // autopopulate: true // Automatically populate the name field with the name of the associated profile
  },
  title: String,
  description: String,
  image: Buffer,
  comments: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

// Add autopopulate middleware
// postSchema.plugin(require('mongoose-autopopulate'));

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;
