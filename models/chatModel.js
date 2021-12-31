const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    users: [
        {type: mongoose.Types.ObjectId, ref: "user"}
    ],
    latest_message: {
        type: mongoose.Types.ObjectId, ref: "message"
    }, 
    name: {
        type: String, trim: true
    },
    group: {
        type: Boolean, default: false
    },    
    admin: {
        type: mongoose.Types.ObjectId, ref: "user"
    }
}, 
{
    timestamps: true,
}
);

const chat = mongoose.model("chat", chatSchema);

module.exports = chat;