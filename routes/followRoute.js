// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const follow = require("../models/followModel.js");
const notification = require("../models/notificationModel.js");
const auth = require("../auth/auth.js");

router.post("/follow", auth.verifyUser, async (req, res)=> {
    const newFollow = new follow({
        followed_user: req.body.user_id,
        follower: req.userInfo._id,
    });
    newFollow.save().then(()=> {
        notification.findOne({
            notified_user: req.body.user_id,
            notification_generator: req.userInfo._id,
            notification_for: "Follow",
        }).then((notificationData)=> {
            if(notificationData==null) {
                const newNotification = new notification({
                    notified_user: req.body.user_id,
                    notification: `You have been followed by ${req.userInfo.username}.`,
                    notification_for: "Follow",
                    notification_generator: req.userInfo._id,
                });
                newNotification.save();
            }
        }).catch();
    }).catch();
});

router.delete("/unFollow", auth.verifyUser, (req, res)=> {
    follow.deleteOne({
        followed_user: req.body.followed_user,
        follower: req.userInfo._id,
    }).then().catch();
});

router.get("/followers/get", auth.verifyAdminSuper, async (req, res)=> {
    const follows = await follow.find({followed_user: req.userInfo._id})
    .populate("follower", "username profile_pic")
    .sort({createdAt: -1});

    res.send(follows);
});

router.get("/followedUsers/get", auth.verifyAdminSuper, async (req, res)=> {
    const follows = await follow.find({follower: req.userInfo._id})
    .populate("followed_user", "username profile_pic")
    .sort({createdAt: -1});

    res.send(follows);
});

router.get("/follows/get", auth.verifyAdminSuper, async (req, res)=> {
    const follows = await follow.find({})
    .populate("followed_user", "username profile_pic")
    .populate("follower", "username profile_pic")
    .sort({createdAt: -1});

    res.send(follows);
});

module.exports = router;