// Importing installed packages.....
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    notified_user: {
        type: mongoose.Types.ObjectId, ref: "user",
    },
    notification: {
        type: String,
    },
    notification_for: {
        type: String
    },
    notification_generator: {
        type: mongoose.Types.ObjectId, default: null,
    },
    liked_post: {
        type: mongoose.Types.ObjectId, default: null,
    },    
    commented_post: {
        type: mongoose.Types.ObjectId, default: null,
    },
    reported_post: {
        type: mongoose.Types.ObjectId, default: null,
    },
    seen: {
        type: Boolean, default: false,
    }
},
{
    timestamps: true
}
);

const notification = mongoose.model("notification", notificationSchema);

module.exports = notification;