const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String, unique: true, trim: true
    },
    password: {
        type: String
    },
    profile_pic: {
        type: String, default: "defaultProfile.png"
    },
    cover_pic: {
        type: String, default: "defaultCover.png"
    },
    email: {
        type: String, unique: true, trim: true,
    },
    phone: {
        type: Number, unique: true
    },
    admin: {
        type: Boolean, default: false
    },
    superuser: {
        type: Boolean, default: false
    },
    private: {
        type: Boolean, default: false
    },
    verified: {
        type: Boolean, default: false
    },
    is_active: {
        type: Boolean, default: true
    },
},
{
    timestamps: true,
}
);

const user = mongoose.model("user", userSchema);

module.exports = user;