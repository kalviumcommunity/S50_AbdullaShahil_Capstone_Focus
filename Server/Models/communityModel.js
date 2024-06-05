const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile"
        }
    ],
    profileImg: {
        type: String,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    description: {
        type: String,
        required: true,

    },
});

const communityModel = mongoose.model('Community', communitySchema);

module.exports = communityModel;
