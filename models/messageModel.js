const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Types.ObjectId, ref: "user" 
    },    
    content: {
        type: String
    },
    chat_id: {
        type: mongoose.Types.ObjectId, ref: "chat"
    }
}, 
{
    timestamps: true,
}
);

const message = mongoose.model("message", messageSchema);

module.exports = message;