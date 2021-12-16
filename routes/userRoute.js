const express = require("express");
const router = new express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const user = require("../models/userModel.js");
const auth = require("../auth/auth.js");

router.post("/user/register", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    user.findOne({username : username}).then(function(userData) {
        if(userData!=null) {
            res.json({message: "User already exists. try another username."});
            return;
        }
        user.findOne({email: email}).then(function(userData){
            if(userData!=null) {
                res.json({message: "This email address is already used. please! try another email address."});
                return;
            }
            
            // now this place is for the user which is available in db
            const password = req.body.password;
            const profile_pic = req.body.profile_pic;
            const cover_pic = req.body.cover_pic;
            const phone = req.body.phone;
            bcryptjs.hash(password, 10, function(e, hashed_value) {
                const newUser = new user({
                    username: username,
                    password: hashed_value,
                    profile_pic: profile_pic,
                    cover_pic: cover_pic,
                    email: email,
                    phone: phone,
                });
                newUser.save()
                .then(function() {
                    res.json({message: "New user has been registered."})
                })
                .catch(function(e) {
                    res.json(e)
                })
            });
        });
    })
});

// login route for user using username or email
router.post("/user/login", (req, res)=> {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    user.findOne({username: username}).then((userData)=> {
        if(userData==null) {
            user.findOne({email: email}).then((userData1)=> {
                if(!validator.isEmail(email)) {
                    return res.json({message: "User with that username does not exist or provide valid email address."});
                }
                else if(userData1==null) {
                    return res.json({message: "User with that email address does not exist."});
                }
                // now comparing client password with the given password
                bcryptjs.compare(password, userData1.password, function(e, result){
                    if(!result) {
                        res.json({message: "Incorrect password, try again."});
                    }
                    else {                        
                        // now lets generate token
                        const token = jwt.sign({userId: userData1._id}, "mountainDuke");
                        res.json({token: token, message: "Success"});  
                    }          
                }); 
            });
        }
        else {            
            // now comparing client password with the given password
            bcryptjs.compare(password, userData.password, function(e, result){
                if(!result) {
                    return res.json({message: "Incorrect password, try again."});
                }
                // now lets generate token
                const token = jwt.sign({userId: userData._id}, "mountainDuke");
                res.json({token: token, message: "Success"});            
            });
        }
    });
});

router.get("/testUser", auth.verifyUser, function(req, res) {
    res.json({message: "user phone number: "+ req.userInfo.phone + "."});
});

router.get("/testAdmin", auth.verifyAdmin, function(req, res) {
    res.json({message: "success"});
});

router.get("/testSuper", auth.verifySuper, function(req, res) {
    res.json({message: "success"});
});
module.exports = router;