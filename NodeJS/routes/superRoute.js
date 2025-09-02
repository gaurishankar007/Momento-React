// Importing installed packages.....
const express = require("express");
const router = new express.Router();
const bcryptjs = require("bcryptjs");

// Importing self made js files....
const user = require("../models/userModel.js");
const auth = require("../auth/auth.js");
const profileUpload = require("../uploadSettings/profile.js");

router.post("/admin/register", auth.verifySuper, profileUpload.single("profile"), (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const phone = req.body.phone;
    user.findOne({username : username}).then(function(userData) {
        if(userData!=null) {
            res.json({message: "User already exists. try another username."});
            return;
        }
        user.findOne({email: email}).then(function(userData){
            if(userData!=null) {
                res.json({message: "This email address is already used. try another email address."});
                return;
            }            
            user.findOne({phone: phone}).then(function(userData){
                if(userData!=null) {
                    res.json({message: "This phone number is already used. try another phone number."});
                    return;
                }    
                const password = req.body.password;
                const profile_pic = req.body.profile_pic;
                bcryptjs.hash(password, 10, function(e, hashed_value) {
                    const newAdmin = new user({
                        username: username,
                        password: hashed_value,
                        profile_pic: profile_pic,
                        email: email,
                        phone: phone,
                        admin: true,
                    });
                    newAdmin.save()
                    .then(function() {
                        res.json({message: "New admin has been registered."})
                    })
                    .catch(function(e) {
                        res.json({error: e.message});
                    })
                });
            });
        });
    })
});

router.put("/admin/deactivate", auth.verifySuper, (req, res)=>{
    var username = "";
    user.findOne({_id: req.body.admin_id}).then((userData)=> {
        username = userData.username;
    });
    user.updateOne({_id: req.body.admin_id}, {is_active: false})
    .then(()=>{
        res.json({message: `${username} has been deactivated.`});
    })
    .catch((e)=> {
        res.json({error: e.message})
    });
});

router.put("/admin/activate", auth.verifySuper, (req, res)=>{
    var username = "";
    user.findOne({_id: req.body.admin_id}).then((userData)=> {
        username = userData.username;
    });
    user.updateOne({_id: req.body.admin_id}, {is_active: true})
    .then(()=>{
        res.json({message: `${username} has been activated.`});
    })
    .catch((e)=> {
        res.json({error: e.message})
    });
});

router.delete("/admin/delete", auth.verifySuper, (req, res)=>{
    var username = "";
    user.findOne({_id: req.body.admin_id}).then((userData)=> {
        username = userData.username;
    });
    user.findByIdAndDelete({_id: req.body.admin_id})
    .then(()=>{
        res.json({message:  `${username} has been deleted.`});
    })
    .catch((e)=> {
        res.json({error: e.message})
    });
});

module.exports = router;