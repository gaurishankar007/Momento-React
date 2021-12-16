const express = require("express");
const router = new express.Router();

const profile = require("../models/profileModel.js");
const user = require("../models/userModel.js");

router.post("/profile/add/:user_id", (req, res)=> {
    var username;
    user.findOne({_id: req.params.user_id}).then(function(userData) {
        username=userData.username;
    });

    const newProfile = new profile({
        user_id: req.params.user_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        birthday: req.body.birthday,
        hobbies: req.body.hobbies,
        biography: req.body.biography,
    });
    newProfile.save().then(function(){
        res.json({message: "Profile successfully added for the user '"+username+"'."})
    });
});

router.get("/user/get/:profile_id", function(req, res){
    profile.findOne({_id: req.params.profile_id}).then((profileData)=>{
        if(profileData==null) {
            return res.json({message: "Profile does not exist."});
        }
        user.findOne({_id: profileData.user_id}).then(function(userData){
            return res.json({message: "This profile be longs to user '"+userData.username+"'."})
        });
    });
});

module.exports = router;