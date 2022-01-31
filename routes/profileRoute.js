// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const profile = require("../models/profileModel.js");
const user = require("../models/userModel.js");
const auth = require("../auth/auth.js");

router.put("/profile/update", auth.verifyUser, (req, res)=> {
    profile.updateOne({user_id: req.userInfo._id}, {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        birthday: req.body.birthday,
        biography: req.body.biography,
        }
    )
    .then(function(){
        res.json({message: "Profile updated."})
    }) 
    .catch(function(e) {
        res.json(e);
    });
});

router.get("/profile/get/my", auth.verifyUser, async (req, res)=> {
    const userProfile = await profile.findOne({user_id: req.userInfo._id});
    if(userProfile!=null) {
        res.json({userProfile: userProfile});
    }
});

router.get("/profile/get", auth.verifyUser, async (req, res)=> {
    const userProfile = await profile.findOne({user_id: req.body.user_id});
    if(userProfile!=null) {
        res.json({userProfile: userProfile});
    }
});

module.exports = router;