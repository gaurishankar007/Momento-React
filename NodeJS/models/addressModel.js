const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId, ref: "user" 
    },
    permanent: {
        country: {
            type: String
        },
        state: {
            type: String
        },
        city: {
            type: String
        },
        street: {
            type: String
        },
    },
    temporary: {
        country: {
            type: String
        },
        state: {
            type: String
        },
        city: {
            type: String
        },
        street: {
            type: String
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