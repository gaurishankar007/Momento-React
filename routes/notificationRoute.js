// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const notification = require("../models/notificationModel.js");
const auth = require("../auth/auth.js");

router.get("/notification/get", auth.verifyUser, async (req, res)=> {
    const userNotifications = []

    const userLikeNotifications = await notification.find({notified_user: req.userInfo._id, notification_for: "Like", seen: false})
    .populate("notification_generator", "username")
    .sort({createdAt: -1});    

    const userCommentNotifications = await notification.find({notified_user: req.userInfo._id, notification_for: "Comment", seen: false})
    .populate("notification_generator", "username")
    .sort({createdAt: -1});

    const userPostNotifications = await notification.find({notified_user: req.userInfo._id, notification_for: "Post", seen: false})
    .populate("notification_generator", "username")
    .sort({createdAt: -1});

    const userFollowNotifications = await notification.find({notified_user: req.userInfo._id, notification_for: "Follow", seen: false})
    .populate("notification_generator", "username")
    .sort({createdAt: -1});

    const userReportNotifications = await notification.find({notified_user: req.userInfo._id, notification_for: "Report", seen: false})
    .populate("notification_generator", "username")
    .sort({createdAt: -1});

    var index = 0;
    while(userNotifications.length<5) {
        if(userLikeNotifications.length>index && userNotifications.length<5) {
            userNotifications.push(userLikeNotifications[index]);            
        }
        if(userCommentNotifications.length>index && userNotifications.length<5) {
            userNotifications.push(userCommentNotifications[index]);            
        }
        if(userPostNotifications.length>index && userNotifications.length<5) {
            userNotifications.push(userPostNotifications[index]);            
        }
        if(userFollowNotifications.length>index && userNotifications.length<5) {
            userNotifications.push(userFollowNotifications[index]);            
        }
        if(userReportNotifications.length>index && userNotifications.length<5) {
            userNotifications.push(userReportNotifications[index]);            
        }
        index=index+1;
    }

    res.send(userNotifications);
});

router.get("/notification/get/unseen", auth.verifyUser, async (req, res)=> {
    const userNotifications = []

    const userLikeNotifications = await notification.find({notified_user: req.userInfo._id, notification_for: "Like", seen: false})
    .populate("notification_generator", "username")
    userNotifications.push(userLikeNotifications);

    const userCommentNotifications = await notification.find({notified_user: req.userInfo._id, notification_for: "Comment", seen: false})
    .populate("notification_generator", "username")
    .sort({createdAt: -1});
    userNotifications.push(userCommentNotifications);

    const userPostNotifications = await notification.find({notified_user: req.userInfo._id, notification_for: "Post", seen: false})
    .populate("notification_generator", "username")
    .sort({createdAt: -1});
    userNotifications.push(userPostNotifications);

    const userFollowNotifications = await notification.find({notified_user: req.userInfo._id, notification_for: "Follow", seen: false})
    .populate("notification_generator", "username")
    .sort({createdAt: -1});
    userNotifications.push(userFollowNotifications);

    const userReportNotifications = await notification.find({notified_user: req.userInfo._id, notification_for: "Report", seen: false})
    .populate("notification_generator", "username")
    .sort({createdAt: -1});
    userNotifications.push(userReportNotifications);

    res.send(userNotifications);
});

router.put("/notification/seen/all", auth.verifyUser, (req, res)=> {
    notification.updateOne({notified_user: req.userInfo._id, seen: false}, {seen: true}).then().catch();
});

router.get("/notification/get/all", auth.verifyUser, async (req, res)=> {
    const userNotifications = await notification.find({notified_user: req.userInfo._id})
    .populate("notification_generator", "username")
    .sort({createdAt: -1});

    res.send(userNotifications);
});

module.exports = router;