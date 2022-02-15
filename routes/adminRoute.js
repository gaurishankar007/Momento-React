// Importing installed packages.....
const express = require("express");
const router = new express.Router();
const bcryptjs = require("bcryptjs");

// Importing self made js files....
const user = require("../models/userModel.js");
const auth = require("../auth/auth.js");
const profileUpload = require("../uploadSettings/profile.js");
const fs = require("fs");

router.put("/admin/changePassword", auth.verifyAdmin, (req, res)=> {
    const currPassword = req.body.currPassword;
    const newPassword = req.body.newPassword;

    user.findOne({_id: req.adminInfo._id}).then((userData)=> {
        bcryptjs.compare(currPassword, userData.password, function(e, result) {
            if(!result) {
                return res.json({message: "Current Password did not match."});
            }
            bcryptjs.hash(newPassword, 10, (e, hashed_pass)=> {
                user.updateOne({_id: userData._id}, {password: hashed_pass})
                .then(()=> {
                    res.json({message: "Your password has been changed."});
                })
                .catch((e)=> {
                    res.json({error: e.message});
                });
            });
        });
    });
});

router.put("/admin/changeProfile", auth.verifyAdmin, profileUpload.single("profile"), (req, res)=> { 
    if(req.file==undefined) {
        return res.json({message: "Invalid image format, only supports png or jpeg image format."});
    }

    user.findOne({_id: req.adminInfo._id})
    .then((userData)=> {
        if(userData.profile_pic!="defaultProfile.png") {
            const profile_pic_path = `./uploads/profiles/${userData.profile_pic}`;
            fs.unlinkSync(profile_pic_path);
        }  
    
        user.updateOne({_id: req.adminInfo._id}, {profile_pic: req.file.filename})
        .then(()=>{
            res.json({message: "New profile picture added."});
        })
        .catch((e)=> {
            res.json({message: e.message});
        });
    })
    .catch((e)=> {
        res.json({message: e.message});
    });
});


router.put("/admin/changeUsername", auth.verifyAdmin, (req, res)=> {  
    const username = req.body.username;
    
    user.findOne({username: username}).then(function(userData) {
        if(userData!=null) {
            res.json({message: "This username is already used, try another."});
            return;
        }  
        user.updateOne({_id: req.adminInfo._id}, {username: username})
        .then(()=>{
            res.json({message: "Your username has been changed."});
        })
        .catch((e)=> {
            res.json({message: e})
        });
    });  
});

router.put("/admin/changeEmail", auth.verifyAdmin, (req, res)=> {  
    const email = req.body.email;
    
    user.findOne({email: email}).then(function(userData){
        if(userData!=null) {
            res.json({message: "This email is already used, try another."});
            return;
        }  
        user.updateOne({_id: req.adminInfo._id}, {email: email})
        .then(()=>{
            res.json({message: "Your email address has been changed."});
        })
        .catch((e)=> {
            res.json({error: e.message})
        });
    });  
});

router.put("/admin/ChangePhone", auth.verifyAdmin, (req, res)=> {  
    const phone = req.body.phone;    
             
    user.findOne({phone: phone}).then(function(userData){
        if(userData!=null) {
            res.json({message: "This phone number is already used, try another."});
            return;
        } 
        user.updateOne({_id: req.adminInfo._id}, {phone: phone})
        .then(()=>{
            res.json({message: "Your phone number has been changed."});
        })
        .catch((e)=> {
            res.json({error: e.message})
        });
    }); 
});

router.put("/user/deactivate", auth.verifyAdminSuper, (req, res)=>{
    var username = "";
    user.findOne({_id: req.body.user_id}).then((userData)=> {
        username = userData.username;
    });
    user.updateOne({_id: req.body.user_id}, {is_active: false})
    .then(()=>{
        res.json({message: `${username} has been deactivated.`});
    })
    .catch((e)=> {
        res.json({error: e.message})
    });
});

router.put("/user/activate", auth.verifyAdminSuper, (req, res)=>{
    var username = "";
    user.findOne({_id: req.body.user_id}).then((userData)=> {
        username = userData.username;
    });
    user.updateOne({_id: req.body.user_id}, {is_active: true})
    .then(()=>{
        res.json({message: `${username} has been activated.`});
    })
    .catch((e)=> {
        res.json({error: e.message})
    });
});

module.exports = router;