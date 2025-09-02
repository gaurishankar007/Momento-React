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
            type: mongoose.Types.ObjectId, ref: "user", default: null
        },
    ],
    like_num: {
        type: Number, default: 0
    },
    comment_num: {
        type: Number, default: 0
    },
    report_num: {
        type: Number, default: 0
    }
}, 
{
    timestamps: true,
}
);

const post = mongoose.model("post", postSchema);

module.exports = post;