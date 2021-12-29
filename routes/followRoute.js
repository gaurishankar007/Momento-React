// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const follow = require("../models/followModel.js");
const notification = require("../models/notificationModel.js");
const auth = require("../auth/auth.js");

router.post("/follow", auth.verifyUser, async (req, res)=> {
    const newFollow = new follow({
        followed_user: req.body.followed_user,
        follower: req.userInfo._id,
    });
    newFollow.save().then(()=> {
        notification.findOne({
            notified_user: req.body.followed_user,
            notification_generator: req.userInfo._id,
        }).then((notificationData)=> {
            if(notificationData==null) {
                const newNotification = new notification({
                    notified_user: req.body.followed_user,
                    notification: `You have been followed by ${req.userInfo.username}. Follow back.`,
                    notification_for: "Follow",
                    notification_generator: req.userInfo._id,
                });
                newNotification.save();
            }
        }).catch();
    }).catch();
});

router.delete("/unfollow", auth.verifyUser, (req, res)=> {
    follow.deleteOne({
        followed_user: req.body.followed_user,
        follower: req.userInfo._id,
    }).then().catch();
});

module.exports = router;