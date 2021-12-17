const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String, unique: true
    },
    password: {
        type: String
    },
    profile_pic: {
        type: String
    },
    cover_pic: {
        type: String
    },
    email: {
        type: String, unique: true
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

const user = mongoose.model("User", userSchema);

module.exports = user;