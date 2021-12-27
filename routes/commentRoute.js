// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const comment = require("../models/commentModel.js");
const post = require("../models/postModel.js");
const auth = require("../auth/auth.js");

router.post("/comment/post", auth.verifyUser, (req, res)=> {
    post.findOne({_id: req.body.post_id}).then((postData)=> {    
        const newComment = new comment({
            post_id: postData._id,
            user_id: req.userInfo._id,
            comment: req.body.comment,
        });
        newComment.save();
        post.updateOne({_id: postData._id}, {comment_num: (postData.comment_num+1)}).then().catch();
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