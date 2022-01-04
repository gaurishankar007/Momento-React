// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const notification = require("../models/notificationModel.js");
const auth = require("../auth/auth.js");

router.put("/notification/seen", auth.verifyUser, (req, res)=> {
    notification.updateOne({_id: req.body.notification_id}, {seen: true}).then().catch();
});

router.put("/notification/seen/all", auth.verifyUser, (req, res)=> {
    notification.updateOne({notified_user: req.userInfo._id, seen: false}, {seen: true}).then().catch();
});

router.get("/notification/get", auth.verifyUser, async (req, res)=> {
    const userNotifications = await notification.find({notified_user: req.userInfo._id})
    .populate("notification_generator", "username")
    .sort({createdAt: -1});

    res.send(userNotifications);
});

module.exports = router;