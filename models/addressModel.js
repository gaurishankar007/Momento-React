const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId, ref: "user" 
    },
    permanent: {
        country: {
            type: String, default: null, trim: true
        },
        state: {
            type: String, default: null, trim: true
        },
        city: {
            type: String, default: null, trim: true
        },
        street: {
            type: String, default: null, trim: true
        },
    },
    temporary: {
        country: {
            type: String, default: null, trim: true
        },
        state: {
            type: String, default: null, trim: true
        },
        city: {
            type: String, default: null, trim: true
        },
        street: {
            type: String, default: null, trim: true
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