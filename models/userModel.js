const mongoose = require("mongoose");

const user = mongoose.model("User", {
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
        type: Number,
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
    registration_date: {
        type: Date, default: Date.now
    }
});

module.exports = user;