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
                        notification_for: "Comment",
                        target_post: postData._id,
                    }).then((notificationData)=>{
                        if(notificationData==null) {
                            const newNotification = new notification({
                                notified_user: postData.user_id,
                                notification: `${req.userInfo.username} commented on your post:- ${req.body.comment}.`,
                                notification_for: "Comment",
                                notification_generator: req.userInfo._id,
                                target_post: postData._id,
                            });
                            newNotification.save();
                        }
                    });
                } 
                res.send({"message": "commented."});  
            });      
        });
    });
});

router.post("/comment/find", auth.verifyUser, async (req, res) => {
    await comment.findOne({post_id: req.body.post_id, user_id: req.userInfo._id}).then((commentData)=> {
        if(commentData!=null) {
            res.json({message: true, commentData: commentData});
        } else {
            res.json({message: false});            
        }
    });
});

router.put("/comment/edit", auth.verifyUser, (req, res)=> {
    comment.updateOne(
        {post_id: req.body.post_id, user_id: req.userInfo._id},
        {comment: req.body.comment})
        .then(()=> {
            res.json({message: "Comment edited."});
        });
});

router.delete("/comment/delete", auth.verifyUser, (req, res)=> {
    post.findOne({_id: req.body.post_id}).then((postData)=> {  
        comment.deleteOne({post_id: postData._id, user_id: req.userInfo._id}).then(()=> {
            post.updateOne({_id: postData._id}, {comment_num: (postData.comment_num-1)}).then(()=> {
                res.json({message: "Comment deleted."});
            });
        });
    });
});

router.delete("/comment-delete/:post_id", auth.verifyUser, (req, res)=> {
    post.findOne({_id: req.params.post_id}).then((postData)=> {  
        comment.deleteOne({post_id: postData._id, user_id: req.userInfo._id}).then(()=> {
            post.updateOne({_id: postData._id}, {comment_num: (postData.comment_num-1)}).then(()=> {
                res.json({message: "Comment deleted."});
            });
        });
    });
});
 
router.post("/comments/get", auth.verifyUser, (req, res)=> {
    post.findOne({_id: req.body.post_id}).then(async (postData)=> {  
        var restrictedUsersString = [];
        var restrictedUsersObject = [];
        const restricts = await restrict.find({restricting_user: postData.user_id});
        
        for(i=0; i<restricts.length; i++) {
            restrictedUsersString.push(JSON.stringify(restricts[i].restricted_user)); 
            restrictedUsersObject.push(restricts[i].restricted_user); // Converting from objectId to string
        }

        var commentedData = [];

        if(restrictedUsersString.includes(JSON.stringify(req.userInfo._id))) {
            const userComment = await comment.findOne({post_id: req.body.post_id, user_id: req.userInfo._id}).populate("user_id", "username profile_pic");
            if(userComment!=null) {
                commentedData.push(userComment);
            }

            const postComments = await comment.find({post_id: req.body.post_id})
            .find({user_id: {$ne: req.userInfo._id}})
            .populate("user_id", "username profile_pic")
            .sort({createdAt: -1});

            commentedData.push.apply(commentedData, postComments);

            res.send(commentedData);
        }
        else {
            if(restrictedUsersObject.length!=0) {                
                const userComment = await comment.findOne({post_id: req.body.post_id, user_id: req.userInfo._id}).populate("user_id", "username profile_pic");
                if(userComment!=null) {
                    commentedData.push(userComment);
                }

                const postComments = await comment.find({post_id: req.body.post_id, user_id: {$ne: restrictedUsersObject}})
                .find({user_id: {$ne: req.userInfo._id}})
                .populate("user_id", "username profile_pic")
                .sort({createdAt: -1});

                commentedData.push.apply(commentedData, postComments);
    
                res.send(commentedData);
            } else {                
                const userComment = await comment.findOne({post_id: req.body.post_id, user_id: req.userInfo._id}).populate("user_id", "username profile_pic");
                if(userComment!=null) {
                    commentedData.push(userComment);
                }

                const postComments = await comment.find({post_id: req.body.post_id})
                .find({user_id: {$ne: req.userInfo._id}})
                .populate("user_id", "username profile_pic")
                .sort({createdAt: -1});

                commentedData.push.apply(commentedData, postComments);
    
                res.send(commentedData);
            }
        }
    });
});

module.exports = router;