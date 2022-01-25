// Importing installed packages.....
const express = require("express");
const router = new express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const fs = require("fs");

// Importing self made js files....
const user = require("../models/userModel")
const auth = require("../auth/auth.js");
const sendEmail = require("../utils/sendEmail.js");
const profileUpload = require("../uploadSettings/profile.js");
const coverUpload = require("../uploadSettings/cover.js");


// User routes.....
router.post("/user/register", (req, res) => {
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
                res.json({message: "This email is already used, try another."});
                return;
            }            
            user.findOne({phone: phone}).then(function(userData){
                if(userData!=null) {
                    res.json({message: "This phone number is already used, try another."});
                    return;
                }                
                // Now this place is for the user which is available in db
                const password = req.body.password;
                bcryptjs.hash(password, 10, function(e, hashed_value) {
                    const newUser = new user({
                        username: username,
                        password: hashed_value,
                        email: email,
                        phone: phone,
                    });
                    newUser.save()
                    .then(function() {
                        res.json({message: "Your account has been created."})
                    })
                    .catch(function(e) {
                        res.json({error: e});
                    })
                });
            });
        });
    })
});

// Login route for user using username or email
router.post("/user/login", (req, res)=> {
    const username_email = req.body.username_email;
    const password = req.body.password;
    user.findOne({username: username_email}).then((userData)=> {
        if(userData==null) {
            if(!validator.isEmail(username_email)) {
                return res.json({message: "User with that username does not exist or provide a valid email address."});
            }
            user.findOne({email: username_email}).then((userData1)=> {
                if(userData1==null) {
                    return res.json({message: "User with that email address does not exist."});
                }
                // Now comparing client password with the given password
                bcryptjs.compare(password, userData1.password, function(e, result){
                    if(!result) {
                        res.json({message: "Incorrect password, try again."});
                    }
                    else {                        
                        // Now lets generate token
                        const token = jwt.sign({userId: userData1._id}, "loginKey");
                        if(!userData1.is_active) {
                            res.json({message: "Sorry, your account has been deactivated."});
                        }
                        else if (userData1.admin==false && userData1.superuser==false) {
                            res.json({token: token, message: "Login success"});                              
                        }
                        else if(userData1.admin) {
                            res.json({token: token, message: "Login success as admin."});  
                        }
                        else if(userData1.superuser) {
                            res.json({token: token, message: "Login success as super."});  
                        }
                    }          
                }); 
            });
        }
        else {            
            // Now comparing client password with the given password
            bcryptjs.compare(password, userData.password, function(e, result){
                if(!result) {
                    return res.json({message: "Incorrect password, try again."});
                }
                // Now lets generate token
                const token = jwt.sign({userId: userData._id}, "loginKey");
                if(!userData.is_active) {
                    res.json({message: "Sorry, your account has been deactivated."});
                }
                else if (userData.admin==false && userData.superuser==false){
                    res.json({token: token, message: "Login success"});                              
                }
                else if(userData.admin) {
                    res.json({token: token, message: "Login success as admin."});  
                }
                else if(userData.superuser) {
                    res.json({token: token, message: "Login success as super."});  
                }
            });
        }
    });
});

router.post("/user/passResetLink", function(req, res) {
    const email = req.body.email;
    const newPass = req.body.newPass;

    if(!validator.isEmail(email)) {
        return res.json({message: "Provide a valid email address."});
    }
    user.findOne({email: email}).then(function(userData) {
        if(userData==null) {
            return res.json({message: "User with that email address does not exist."});
        }
        const token = jwt.sign({userId: userData._id}, "passResetKey", {expiresIn: "3m"});
        const half_link = `${token}/${newPass}`;
        sendEmail(email, "Password Reset Link", half_link);
    });

});

router.put("/user/passReset/:resetToken/:newPass", function(req, res) {
    try{
        const token = req.params.resetToken;
        const userData = jwt.verify(token, "passResetKey");  
        bcryptjs.hash(req.params.newPass, 10, (e, hashed_pass)=> { 
            user.updateOne({_id: userData.userId}, {password: hashed_pass})
            .then(function() {
                res.json({message: "Your password has been reset."})
            })
            .catch(function(e) {
                res.json({error: e});
            });
        });        
    }
    catch(e) {
        res.json({error: e});
    }
});

router.put("/user/changePassword", auth.verifyUser, (req, res)=> {
    const currPassword = req.body.currPassword;
    const newPassword = req.body.newPassword;

    user.findOne({_id: req.userInfo._id}).then((userData)=> {
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

router.put("/user/changeProfile", auth.verifyUser, profileUpload.single("profile"), (req, res)=> {  
    if(req.file==undefined) {
        return res.json({error: "Invalid image format, only supports png or jpeg image format."});
    }

    user.findOne({_id: req.userInfo._id})
    .then((userData)=> {
        if(userData.profile_pic!="defaultProfile.png") {
            const profile_pic_path = `./uploadedFiles/profiles/${userData.profile_pic}`;
            fs.unlinkSync(profile_pic_path);
        }  
    
        user.updateOne({_id: req.userInfo._id}, {profile_pic: req.file.filename})
        .then(()=>{
            res.json({message: "New profile picture added."});
        })
        .catch((e)=> {
            res.json({error: e});
        });
    })
    .catch((e)=> {
        res.json({error: e});
    });
});

router.put("/user/changeCover", auth.verifyUser, coverUpload.single("cover"), (req, res)=> {
    if(req.file==undefined) {
        return res.json({error: "Invalid image format, only supports png or jpeg image format."});
    }

    user.findOne({_id: req.userInfo._id})
    .then((userData)=> {
        if(userData.cover_pic!=undefined) {
            const cover_pic_path = `./uploadedFiles/covers/${userData.cover_pic}`;
            fs.unlinkSync(cover_pic_path);
        }    

        user.updateOne({_id: req.userInfo._id}, {cover_pic: req.file.filename})
        .then(()=>{
            res.json({message: "New cover picture added."});
        })
        .catch((e)=> {
            res.json({error: e});
        });
    })
    .catch((e)=> {
        res.json({error: e});
    });
});

router.put("/user/changeEmail", auth.verifyUser, (req, res)=> {  
    const email = req.body.email;
    
    user.findOne({email: email}).then(function(userData){
        if(userData!=null) {
            res.json({message: "This email is already used, try another."});
            return;
        }  
        user.updateOne({_id: req.userInfo._id}, {email: email})
        .then(()=>{
            res.json({message: "Your email address has been changed."});
        })
        .catch((e)=> {
            res.json({error: e})
        });
    });  
});

router.put("/user/ChangePhone", auth.verifyUser, (req, res)=> {  
    const phone = req.body.phone;    
             
    user.findOne({phone: phone}).then(function(userData){
        if(userData!=null) {
            res.json({message: "This phone number is already used, try another."});
            return;
        } 
        user.updateOne({_id: req.userInfo._id}, {phone: phone})
        .then(()=>{
            res.json({message: "Your phone number has been changed."});
        })
        .catch((e)=> {
            res.json({error: e})
        });
    }); 
});

router.put("/user/bePrivate", auth.verifyUser, (req, res)=> {    
    user.updateOne({_id: req.userInfo._id}, {private: true})
    .then(()=>{
        res.json({message: "You have become private."});
    })
    .catch((e)=> {
        res.json({error: e})
    });
});

router.put("/user/bePublic", auth.verifyUser, (req, res)=> {    
    user.updateOne({_id: req.userInfo._id}, {private: false})
    .then(()=>{
        res.json({message: "You have become public."});
    })
    .catch((e)=> {
        res.json({error: e})
    });
});

router.get("/user/search", auth.verifyUser, async (req, res)=> {
    const keyword = req.query.username
    ? {username: { $regex: req.query.username, $options: "i" }}
    :{}; // Making keyword workable json format data according to user search

    // Using async function show that only after searching all the users, it will send the users 
    // Otherwise it will produce error 
    // Because it will start to run the code below it even though all the users have not been completely searched
    const users = await user.find(keyword).find({_id: {$ne: req.userInfo._id}});
    res.json(users); 
});

module.exports = router;