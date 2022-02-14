// Importing installed packages.....
const express = require("express");
const router = new express.Router();
const bcryptjs = require("bcryptjs");

// Importing self made js files....
const user = require("../models/userModel.js");
const auth = require("../auth/auth.js");

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
                    res.json({error: e});
                });
            });
        });
    });
});

router.put("/admin/changeProfile", auth.verifyAdmin, (req, res)=> {   
    const profile_pic = req.body.profile_pic;    
    
    user.updateOne({_id: req.adminInfo._id}, {profile_pic: profile_pic})
    .then(()=> {
        res.json({message: "You have changed your profile picture."});
    })
    .catch((e)=> {
        res.json({error: e})
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
            res.json({error: e})
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
            res.json({error: e})
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
        res.json({error: e})
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
        res.json({error: e})
    });
});

module.exports = router;