const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: [
        {
            name: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile'
            },
            profilePic: String,
            message: String,
            postedTime: {
                type: Date,
                default: Date.now
            }
        }
    ],
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    }
});

const messageModel = mongoose.model('Message', messageSchema);

module.exports = messageModel;
