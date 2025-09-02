// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const like = require("../models/likeModel.js");
const post = require("../models/postModel.js");
const restrict = require("../models/restrictModel.js");
const notification = require("../models/notificationModel.js");
const auth = require("../auth/auth.js");

router.post("/like/post", auth.verifyUser, (req, res)=> {
    post.findOne({_id: req.body.post_id}).then((postData)=> {    
        like.findOne({
            post_id: postData._id,
            user_id: req.userInfo._id
        })
        .then(function(likeData) {
            if(likeData!=null) {
                like.findByIdAndDelete({_id: likeData._id}).then().catch();
                post.updateOne({_id: postData._id}, {like_num: (postData.like_num-1)}).then(()=> {                    
                    res.json({message: "Post disliked."});
                });
                return;
            }
    
            const newLike = new like({
                post_id: postData._id,
                user_id: req.userInfo._id
            })
            newLike.save();
            post.updateOne({_id: postData._id}, {like_num: (postData.like_num+1)}).then(()=> {
                restrict.findOne({
                    restricted_user: req.userInfo._id,
                    restricting_user: postData.user_id
                }).then((restrictData)=> {
                    if(restrictData==null) {
                        notification.findOne({
                            notification_generator: req.userInfo._id,
                            notification_for: "Like",
                            target_post: postData._id,
                        }).then((notificationData)=>{
                            if(notificationData==null) {
                                const newNotification = new notification({
                                    notified_user: postData.user_id,
                                    notification: `${req.userInfo.username} liked your post.`,
                                    notification_for: "Like",
                                    notification_generator: req.userInfo._id,
                                    target_post: postData._id,
                                });
                                newNotification.save();
                            }
                        });     
                    }
                    res.json({message: "Post Liked."});
                });
            });
        });
    });
});

router.post("/likes/get", auth.verifyUser, async (req, res) => {
    var likedData = [];

    const userLike = await like.findOne({post_id: req.body.post_id, user_id: req.userInfo._id}).populate("user_id", "username profile_pic email");
    if(userLike!=null) {
        likedData.push(userLike);
    }

    const likers = await like.find({post_id: req.body.post_id})
    .find({user_id: {$ne: req.userInfo._id}})
    .populate("user_id", "username profile_pic email")
    .sort({createdAt: -1});

    likedData.push.apply(likedData, likers);
    
    res.send(likedData);
});

router.post("/like/find", auth.verifyUser, async (req, res) => {
    await like.findOne({post_id: req.body.post_id, user_id: req.userInfo._id}).then((likeData)=> {
        if(likeData!=null) {
            res.json({message: true});
        } else {
            res.json({message: false});            
        }
    });
});

module.exports = router;