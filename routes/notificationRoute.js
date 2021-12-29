// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const notification = require("../models/notificationModel.js");
const auth = require("../auth/auth.js");

router.put("/notification/seen", auth.verifyUser, (req, res)=> {
    notification.updateOne({_id: req.body.notification_id}, {seen: true}).then().catch();
});

module.exports = router;