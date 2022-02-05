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
                post.updateOne({_id: postData._id}, {like_num: (postData.like_num-1)}).then().catch();
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
                            liked_post: postData._id,
                        }).then((notificationData)=>{
                            if(notificationData==null) {
                                const newNotification = new notification({
                                    notified_user: postData.user_id,
                                    notification: `Your post got a like from ${req.userInfo.username}.`,
                                    notification_for: "Like",
                                    notification_generator: req.userInfo._id,
                                    target_post: postData._id,
                                });
                                newNotification.save();
                            }
                        });     
                    }
                });
            });
        });
    });
});

router.post("/likes/get", auth.verifyUser, async (req, res) => {
    const likers = await like.find({post_id: req.body.post_id})
    .populate("user_id", "username profile_pic")
    .sort({createdAt: -1});
    
    res.send(likers);
});

module.exports = router;