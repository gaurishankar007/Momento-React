const mongoose = require("mongoose");
require("./userModel.js");

const address = mongoose.model("address", {
    user_id: {
        type: mongoose.Types.ObjectId, ref: "user" // Referring object_id from user module
    },
    permanent: {
        country: {
            type: String, default: null
        },
        state: {
            type: String, default: null
        },
        city: {
            type: String, default: null
        },
        street: {
            type: String, default: null
        },
    },
    temporary: {
        country: {
            type: String, default: null
        },
        state: {
            type: String, default: null
        },
        city: {
            type: String, default: null
        },
        street: {
            type: String, default: null
        },
    },
});

module.exports = address;