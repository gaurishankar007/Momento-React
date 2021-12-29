// Importing installed packages.....
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    reported_post: {
        type: mongoose.Types.ObjectId, ref: "post",
    },
    reporter: {
        type: mongoose.Types.ObjectId, ref: "user",
    },
    report_for: [
        {type: String}
    ]
},
{
    timestamps: true
}
);

const report = mongoose.model("report", reportSchema);

module.exports = report;
