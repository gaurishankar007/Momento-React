// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const comment = require("../models/commentModel.js");
const post = require("../models/postModel.js");
const restrict = require("../models/restrictModel.js");
const notification = require("../models/notificationModel.js");
const auth = require("../auth/auth.js");

router.post("/comment/post", auth.verifyUser, (req, res)=> {
    post.findOne({_id: req.body.post_id}).then((postData)=> {    
        const newComment = new comment({
            post_id: postData._id,
            user_id: req.userInfo._id,
            comment: req.body.comment,
        });
        newComment.save();
        post.updateOne({_id: postData._id}, {comment_num: (postData.comment_num+1)}).then(()=> {
            restrict.findOne({
                restricted_user: req.userInfo._id,
                restricting_user: postData.user_id
            }).then((restrictData)=> {
                if(restrictData==null) {
                    notification.findOne({
                        notification_generator: req.userInfo._id,
                        commented_post: postData._id,
                    }).then((notificationData)=>{
                        if(notificationData==null) {
                            const newNotification = new notification({
                                notified_user: postData.user_id,
                                notification: `Your post got a comment from ${req.userInfo.username}.`,
                                notification_for: "Comment",
                                notification_generator: req.userInfo._id,
                                commented_post: postData._id,
                            });
                            newNotification.save();
                        }
                    });
                }   
            });      
        });
    });
});

router.put("/comment/edit ", auth.verifyUser, (req, res)=> {
    comment.updateOne(
        {post_id: req.body.post_id, user_id: req.userInfo._id},
        {comment: req.body.comment})
        .then().catch();
});

router.delete("/comment/delete", auth.verifyUser, (req, res)=> {
    post.findOne({_id: req.body.post_id}).then((postData)=> {  
        comment.deleteOne({post_id: postData._id, user_id: req.userInfo._id}).then().catch();
        post.updateOne({_id: postData._id}, {comment_num: (postData.comment_num-1)}).then().catch();
    });
});

module.exports = router;