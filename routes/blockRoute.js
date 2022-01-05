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
        follow.deleteOne({
            followed_user: req.userInfo._id,
            follower: req.body.user_id}
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
        res.json({message: `You have unblocked ${username}.`});
    });
});

router.get("/blocks/get", auth.verifyAdminSuper, async (req, res)=> {
    const blocks = await block.find({})
    .populate("blocked_user", "username profile_pic")
    .populate("blocker", "username profile_pic")
    .sort({createdAt: -1});

    res.send(blocks);
});

module.exports = router;