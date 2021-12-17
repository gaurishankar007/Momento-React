const mongoose = require("mongoose");
require("./userModel.js");

const profileSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId, ref: "user" // Referring object_id from user module
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    gender: {
        type: String
    },
    birthday: {
        type: Date
    },
    hobbies:[ 
        {type: String}
    ],
    biography: {
        type: String
    }
}, 
{
    timestamps: true,
}
);

const profile = mongoose.model("Profile", profileSchema);

module.exports = profile;