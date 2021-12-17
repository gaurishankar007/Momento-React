const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId, ref: "user" 
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
    hide: {
        type: Boolean, default: false
    },
}, 
{
    timestamps: true,
}
);

const address = mongoose.model("address", addressSchema);

module.exports = address;