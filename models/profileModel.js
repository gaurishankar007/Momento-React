const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId, ref: "user"
    },
    first_name: {
        type: String, trim: true
    },
    last_name: {
        type: String, trim: true
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