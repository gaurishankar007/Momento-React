// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const restrict = require("../models/restrictModel.js");
const user = require("../models/userModel.js");
const follow = require("../models/followModel.js");
const auth = require("../auth/auth.js");

router.post("/restrict", auth.verifyUser, (req, res)=> {
    var username = "";
    user.findOne({_id: req.body.user_id}).then((userData)=> {
        username = userData.username;
    });

    const newRestrict = new restrict({
        restricted_user: req.body.user_id,
        restricting_user: req.userInfo._id
    });
    newRestrict.save().then(()=> {
        res.json({message: `You have restricted ${username}.`});
    });
});

router.put("/unrestricted", auth.verifyUser, (req, res)=> {
    var username = "";
    user.findOne({_id: req.body.user_id}).then((userData)=> {
        username = userData.username;
    });

    restrict.deleteOne({
        restricted_user: req.body.user_id,
        restricting_user: req.userInfo._id
    }).then(()=> {
        res.json({message: `You have unrestricted ${username}.`});
    });
});

router.get("/restricts/get", auth.verifyAdminSuper, async (req, res)=> {
    const restricts = await restrict.find({})
    .populate("restricted_user", "username profile_pic")
    .populate("restricting_user", "username profile_pic")
    .sort({createdAt: -1});

    res.send(restricts);
});


module.exports = router;