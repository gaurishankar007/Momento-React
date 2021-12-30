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

router.put("/follow/restrict", auth.verifyUser, (req, res)=> {
    var username = "";
    user.findOne({_id: req.body.follower}).then((userData)=> {
        username = userData.username;
    });
    follow.updateOne({
        followed_user: req.userInfo._id,
        follower: req.body.follower},
        {restrict_follower: true}
        ).then(()=> {
            res.json({message: `You have restricted ${username}.`});
        }).catch();
});

router.put("/follow/unrestricted", auth.verifyUser, (req, res)=> {
    var username = "";
    user.findOne({_id: req.body.follower}).then((userData)=> {
        username = userData.username;
    });
    follow.updateOne({
        followed_user: req.userInfo._id,
        follower: req.body.follower},
        {restrict_follower: false}
        ).then(()=> {
            res.json({message: `You have unrestricted ${username}.`});
        }).catch();
});

router.put("/follow/block", auth.verifyUser, (req, res)=> {
    var username = "";
    user.findOne({_id: req.body.follower}).then((userData)=> {
        username = userData.username;
    });
    follow.updateOne({
        followed_user: req.userInfo._id,
        follower: req.body.follower},
        {block_follower: true}
        ).then(()=> {
            res.json({message: `You have blocked ${username}.`});
        }).catch();
});

router.put("/follow/unblock", auth.verifyUser, (req, res)=> {
    var username = "";
    user.findOne({_id: req.body.follower}).then((userData)=> {
        username = userData.username;
    });
    follow.updateOne({
        followed_user: req.userInfo._id,
        follower: req.body.follower},
        {block_follower: true}
        ).then(()=> {
            res.json({message: `You have unblocked ${username}.`});
        }).catch();
});

router.delete("/unFollow", auth.verifyUser, (req, res)=> {
    follow.deleteOne({
        followed_user: req.body.followed_user,
        follower: req.userInfo._id,
    }).then().catch();
});

module.exports = router;