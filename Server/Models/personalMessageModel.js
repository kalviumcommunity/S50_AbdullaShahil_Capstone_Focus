const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  postedTime: {
    type: Date,
    default: Date.now,
  }
});

const personalMessageSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  messages: [messageSchema],
});

 const personalMessageModel = mongoose.model("PersonalMessage", personalMessageSchema);
 module.exports = personalMessageModel;