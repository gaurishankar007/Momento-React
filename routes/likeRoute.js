// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const like = require("../models/likeModel.js");
const auth = require("../auth/auth.js");

router.post("/like/:post_id", auth.verifyUser, (req, res)=> {
    like.findOne({
        post_id: req.params.post_id,
        user_id: req.userInfo._id
    })
    .then(function(likeData) {
        if(likeData!=null) {
            like.findByIdAndDelete({_id: likeData._id});
            return;
        }
        const newLike = new like({
            post_id: req.params.post_id,
            user_id: req.userInfo._id
        })
        newLike.save();
    });
});

module.exports = router;