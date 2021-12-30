// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const block = require("../models/blockModel.js");
const user = require("../models/userModel.js");
const follow = require("../models/followModel.js");
const auth = require("../auth/auth.js");

router.post("/block", auth.verifyUser, (req, res)=> {
    var username = "";
    user.findOne({_id: req.body.user_id}).then((userData)=> {
        username = userData.username;
    });

    const newBlock = new block({
        blocked_user: req.body.user_id,
        blocker: req.userInfo._id
    });
    newBlock.save().then(()=> {
        follow.updateOne({
            followed_user: req.userInfo._id,
            follower: req.body.user_id},
            {block_follower: true}
        ).then().catch();   
        res.json({message: `You have blocked ${username}.`});
    });
});

router.put("/unblock", auth.verifyUser, (req, res)=> {
    var username = "";
    user.findOne({_id: req.body.user_id}).then((userData)=> {
        username = userData.username;
    });

    block.deleteOne({
        blocked_user: req.body.user_id,
        blocker: req.userInfo._id
    }).then(()=> {
        follow.updateOne({
            followed_user: req.userInfo._id,
            follower: req.body.user_id},
            {block_follower: false}
        ).then().catch();
        res.json({message: `You have unblocked ${username}.`});
    });
});

module.exports = router;