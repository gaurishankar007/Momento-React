const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Types.ObjectId, ref: "post" 
    },    
    user_id: {
        type: mongoose.Types.ObjectId, ref: "user" 
    },
    comment: {
        type: String
    },
}, 
{
    timestamps: true,
}
);

const comment = mongoose.model("comment", commentSchema);

module.exports = comment;