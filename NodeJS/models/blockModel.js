// Importing installed packages.....
const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
    blocked_user: {
        type: mongoose.Types.ObjectId, ref: "user",
    },
    blocker: {
        type: mongoose.Types.ObjectId, ref: "user",
    },
},
{
    timestamps: true
}
);

const block = mongoose.model("block", blockSchema);

module.exports = block;