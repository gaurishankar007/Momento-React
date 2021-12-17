const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId, ref: "user" // Referring object_id from user module
    },
    caption: {
        type: String
    },
    description: {
        type: String
    },
    attach_file: [
        {
            type: String
        }
    ],
    tag_friend: [
        {
            type: mongoose.Types.ObjectId, ref: "user"
        },
    ],
}, 
{
    timestamps: true,
}
);

const post = mongoose.model("post", postSchema);

module.exports = post;