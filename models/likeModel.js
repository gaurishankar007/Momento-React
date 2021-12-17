const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Types.ObjectId, ref: "post" 
    },    
    user_id: {
        type: mongoose.Types.ObjectId, ref: "user" 
    },
    like: {
        type: Boolean
    },
    dislike: {
        type: Boolean
    },
}, 
{
    timestamps: true,
}
);

const like = mongoose.model("like", likeSchema);

module.exports = like;