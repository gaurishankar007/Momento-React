// Importing installed packages.....
const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
    followed_user: {
        type: mongoose.Types.ObjectId, ref: "user",
    },
    follower: {
        type: mongoose.Types.ObjectId, ref: "user",
    }
},
{
    timestamps: true
}
);

const follow = mongoose.model("follow", followSchema);

module.exports = follow;