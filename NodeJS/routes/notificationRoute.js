// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const notification = require("../models/notificationModel.js");
const auth = require("../auth/auth.js");

router.get("/notifications/getNum", auth.verifyUser, async (req, res)=> {
    const unSeenNotifications = await notification.countDocuments({notified_user: req.userInfo._id, seen: false});
    const seenNotifications = await notification.countDocuments({notified_user: req.userInfo._id, seen: true});
    res.json({unSeenNum: unSeenNotifications.toString(), seenNum: seenNotifications.toString()});
});

router.get("/notifications/get/unseen", auth.verifyUser, async (req, res)=> {
    const unSeenNotifications = await notification.find({notified_user: req.userInfo._id, seen: false})
    .populate("notification_generator", "_id profile_pic")
    .populate("target_post", "_id")
    .sort({createdAt: -1});

    res.send(unSeenNotifications);
});

router.put("/notifications/seen/unseen", auth.verifyUser, (req, res)=> {
    notification.updateMany({notified_user: req.userInfo._id, seen: false}, {seen: true}).then(()=> {
        res.json({message: "Notifications seen."})
    });
});

router.get("/notifications/get/seen", auth.verifyUser, async (req, res)=> {
    const seenNotifications = await notification.find({notified_user: req.userInfo._id, seen: true})
    .populate("notification_generator", "_id  profile_pic")
    .populate("target_post", "_id")
    .sort({createdAt: -1});

    res.send(seenNotifications);
});

router.delete("/notifications/delete/seen", auth.verifyUser, (req, res)=> {
    notification.deleteMany({notified_user: req.userInfo._id, seen: true}).then(()=> {        
        res.json({message: "Notifications deleted."})
    });
});

module.exports = router;