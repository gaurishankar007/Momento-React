// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const follow = require("../models/followModel.js");
const post = require("../models/postModel.js");
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
            res.json({"message": "Followed."})
        });
    });
});

router.delete("/unFollow", auth.verifyUser, (req, res)=> {
    follow.deleteOne({
        followed_user: req.body.user_id,
        follower: req.userInfo._id,
    }).then(()=> {
        res.json({"message": "Stopped following."})
    });
});

router.post("/follow/check", auth.verifyUser, (req, res)=> {
    follow.findOne({
        followed_user: req.body.user_id,
        follower: req.userInfo._id,
    }).then((followData)=> {
        if(followData!=null) {
            res.json({"message": "Followed."})
        } else {
            res.json({"message": "Not followed."})            
        }
    });
});

router.delete("/removeFollower", auth.verifyUser, (req, res)=> {
    follow.deleteOne({
        follower: req.body.follower,
        followed_user: req.userInfo._id,
    }).then(()=> {
        res.json({"message": "Follower removed."})
    });
});

router.get("/followers/get", auth.verifyUser, async (req, res)=> {
    const follows = await follow.find({followed_user: req.userInfo._id})
    .populate("follower", "username profile_pic")
    .sort({createdAt: -1});

    res.send(follows);
});

router.get("/followedUsers/get", auth.verifyUser, async (req, res)=> {
    const follows = await follow.find({follower: req.userInfo._id})
    .populate("followed_user", "username profile_pic")
    .sort({createdAt: -1});

    res.send(follows);
});

router.post("/followers/get/other", auth.verifyUser, async (req, res)=> {
    const follows = await follow.find({followed_user: req.body.user_id})
    .populate("follower", "username profile_pic")
    .sort({createdAt: -1});

    res.send(follows);
});

router.post("/followedUsers/get/other", auth.verifyUser, async (req, res)=> {
    const follows = await follow.find({follower: req.body.user_id})
    .populate("followed_user", "username profile_pic")
    .sort({createdAt: -1});

    res.send(follows);
});

router.get("/number/user", auth.verifyUser, async (req, res)=> {
    const followers = await follow.countDocuments({followed_user: req.userInfo._id})
    const followings = await follow.countDocuments({follower: req.userInfo._id})
    const posts = await post.countDocuments({user_id: req.userInfo._id})    
    const taggedPosts = await post.countDocuments({tag_friend: req.userInfo._id});

    res.send({"followers": followers.toString(), "followed_users": followings.toString(), "postsNum": posts.toString(), "taggedPostsNum": taggedPosts.toString()});
});

router.post("/number/other", auth.verifyUser, async (req, res)=> {
    const followers = await follow.countDocuments({followed_user: req.body.user_id})
    const followings = await follow.countDocuments({follower: req.body.user_id})
    const posts = await post.countDocuments({user_id: req.body.user_id});
    const taggedPosts = await post.countDocuments({tag_friend: req.body.user_id});
    res.send({"followers": followers.toString(), "followed_users": followings.toString(), "postsNum": posts.toString(), "taggedPostsNum": taggedPosts.toString()});
});

router.get("/follows/get", auth.verifyAdminSuper, async (req, res)=> {
    const follows = await follow.find({})
    .populate("followed_user", "username profile_pic")
    .populate("follower", "username profile_pic")
    .sort({createdAt: -1});

    res.send(follows);
});

module.exports = router;