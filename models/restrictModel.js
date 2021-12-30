// Importing installed packages.....
const mongoose = require("mongoose");

const restrictSchema = new mongoose.Schema({
    restricted_user: {
        type: mongoose.Types.ObjectId, ref: "user",
    },
    restricting_user: {
        type: mongoose.Types.ObjectId, ref: "user",
    },
},
{
    timestamps: true
}
);

const restrict = mongoose.model("restrict", restrictSchema);

module.exports = restrict;