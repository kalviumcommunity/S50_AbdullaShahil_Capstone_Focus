const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    messages: [
        {
            name: {
                type: String,  // Assuming you want to store the user's name as a string
                required: true
            },
            message: {
                type: String,
                required: true
            },
            postedTime: {
                type: Date,
                default: Date.now
            }
        }
    ],
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        required: true
    }
});

const messageModel = mongoose.model('Message', messageSchema);

module.exports = messageModel;
