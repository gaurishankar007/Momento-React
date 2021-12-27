// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const like = require("../models/likeModel.js");
const post = require("../models/postModel.js");
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
            post.updateOne({_id: postData._id}, {like_num: (postData.like_num+1)}).then().catch();
        });
    });
});

module.exports = router;