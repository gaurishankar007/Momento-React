const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Types.ObjectId, ref: "post" 
    },    
    user_id: {
        type: mongoose.Types.ObjectId, ref: "user" 
    },
}, 
{
    timestamps: true,
}
);

const save = mongoose.model("save", saveSchema);

module.exports = save;