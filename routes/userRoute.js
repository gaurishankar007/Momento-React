const express = require("express");
const router = new express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const user = require("../models/userModel")
const auth = require("../auth/auth.js");
const sendEmail = require("../utils/sendEmail.js");

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
                // now this place is for the user which is available in db
                const password = req.body.password;
                const profile_pic = req.body.profile_pic;
                const cover_pic = req.body.cover_pic;
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
                        res.json({error: e});
                    })
                });
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
            if(!validator.isEmail(email)) {
                return res.json({message: "User with that username does not exist or provide valid email address."});
            }
            user.findOne({email: email}).then((userData1)=> {
                if(userData1==null) {
                    return res.json({message: "User with that email address does not exist."});
                }
                // now comparing client password with the given password
                bcryptjs.compare(password, userData1.password, function(e, result){
                    if(!result) {
                        res.json({message: "Incorrect password, try again."});
                    }
                    else {                        
                        // now lets generate token
                        const token = jwt.sign({userId: userData1._id}, "loginKey");
                        if(!userData1.is_active) {
                            res.json({message: "Sorry, your account has been deactivated."});
                        }
                        else if (!userData1.admin && !userData1.superuser){
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
            // now comparing client password with the given password
            bcryptjs.compare(password, userData.password, function(e, result){
                if(!result) {
                    return res.json({message: "Incorrect password, try again."});
                }
                // now lets generate token
                const token = jwt.sign({userId: userData._id}, "loginKey");
                if(!userData.is_active) {
                    res.json({message: "Sorry, your account has been deactivated."});
                }
                else if (!userData.admin && !userData.superuser){
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
        const token = jwt.sign({userId: userData._id}, "passResetKey", {expiresIn: "1m"});
        const link = `${process.env.PRB_URL}/user/passReset/${token}/${newPass}`;
        sendEmail(email, "Password Reset Link", link);
        res.json({message: link});
    });

});

router.put("/user/passReset/:resetToken/:newPass", function(req, res) {
    try{
        const token = req.params.resetToken;
        const userData = jwt.verify(token, "passResetKey");          
        console.log("entered"); 
        bcryptjs.hash(req.params.newPass, 10, (e, hashed_pass)=> {           
            console.log("entered bcryptjs"); 
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

router.put("/user/changePassword/:id", auth.verifyUser, (req, res)=> {
    const currPassword = req.body.currPassword;
    const newPassword = req.body.newPassword;

    user.findOne({_id: req.params.id}).then((userData)=> {
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

router.put("/user/changeProfile/:id", auth.verifyUser, (req, res)=> {   
    const profile_pic = req.body.profile_pic;    
    
    user.updateOne({_id: req.params.id}, {profile_pic: profile_pic})
    .then(()=>{
        res.json({message: "You have changed your profile picture."});
    })
    .catch((e)=> {
        res.json({error: e})
    });
});

router.put("/user/changeCover/:id", auth.verifyUser, (req, res)=> {
    const cover_pic = req.body.cover_pic;
    
    user.updateOne({_id: req.params.id}, {cover_pic: cover_pic})
    .then(()=>{
        res.json({message: "You have changed your cover picture."});
    })
    .catch((e)=> {
        res.json({error: e})
    });
});

router.put("/user/changeEmail/:id", auth.verifyUser, (req, res)=> {  
    const email = req.body.email;
    
    user.findOne({email: email}).then(function(userData){
        if(userData!=null) {
            res.json({message: "This email is already used, try another."});
            return;
        }  
        user.updateOne({_id: req.params.id}, {email: email})
        .then(()=>{
            res.json({message: "Your email address has been changed."});
        })
        .catch((e)=> {
            res.json({error: e})
        });
    });  
});

router.put("/user/ChangePhone/:id", auth.verifyUser, (req, res)=> {  
    const phone = req.body.phone;    
             
    user.findOne({phone: phone}).then(function(userData){
        if(userData!=null) {
            res.json({message: "This phone number is already used, try another."});
            return;
        } 
        user.updateOne({_id: req.params.id}, {phone: phone})
        .then(()=>{
            res.json({message: "Your phone number has been changed."});
        })
        .catch((e)=> {
            res.json({error: e})
        });
    }); 
});

router.put("/user/bePrivate/:id", auth.verifyUser, (req, res)=> {    
    user.updateOne({_id: req.params.id}, {private: true})
    .then(()=>{
        res.json({message: "You have become private."});
    })
    .catch((e)=> {
        res.json({error: e})
    });
});

router.put("/user/bePublic/:id", auth.verifyUser, (req, res)=> {    
    user.updateOne({_id: req.params.id}, {private: false})
    .then(()=>{
        res.json({message: "You have become public."});
    })
    .catch((e)=> {
        res.json({error: e})
    });
});

module.exports = router;