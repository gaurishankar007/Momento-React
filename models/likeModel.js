const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Types.ObjectId, ref: "post" 
    },    
    user_id: {
        type: mongoose.Types.ObjectId, ref: "user" 
    }
}, 
{
    timestamps: true,
}
);

const like = mongoose.model("like", likeSchema);

module.exports = like;