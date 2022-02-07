// Importing installed packages.....
const express = require("express");
const router = new express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const fs = require("fs");

// Importing self made js files....
const user = require("../models/userModel")
const profile = require("../models/profileModel.js");
const address = require("../models/AddressModel.js");
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
                bcryptjs.hash(password, 10, async function(e, hashed_value) {
                    const newUser = await user.create({
                        username: username,
                        password: hashed_value,
                        email: email,
                        phone: phone,
                    });
                    
                    const newProfile = new profile({
                        user_id: newUser._id,
                        first_name: "",
                        last_name: "",
                        gender: "",
                        birthday: "",
                        biography: "",
                    });
                    newProfile.save();
                    
                    const newAddress = new address({
                        user_id: newUser._id,
                        permanent: {
                            country: "",
                            state: "",
                            city: "",
                            street: "",
                        },
                        temporary: {
                            country: "",
                            state: "",
                            city: "",
                            street: "",
                        },
                    });
                    newAddress.save()

                    // Now lets generate token
                    const token = jwt.sign({userId: newUser._id}, "loginKey");
                    res.json({token: token, message: "Your account has been created."});
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

router.get("/user/checkType", (req, res)=> {    
    try{
        const token = req.headers.authorization.split(" ")[1]
        
        const userData = jwt.verify(token, "loginKey");
        user.findOne({_id: userData.userId}).then((user)=>{
            if(user!=null) {                
                res.send({userData: user});
            }
        }).catch(function(e){
            res.json({message: e});
        });
    }
    catch(e) {
        res.json({message: "Invalid Token!", error: e});
    }
});

router.post("/user/other", auth.verifyUser, (req, res)=> {    
    user.findOne({_id: req.body.user_id}).then((user)=>{
        if(user!=null) {             
            res.send({userData: user});
        }
    }).catch(function(e){
        res.json({message: e});
    });
});

router.post("/user/generatePassResetToken", function(req, res) {
    const email = req.body.email;
    const newPass = req.body.newPass;

    if(!validator.isEmail(email)) {
        return res.json({message: "Provide a valid email address."});
    }
    user.findOne({email: email}).then(function(userData) {
        if(userData==null) {
            return res.json({message: "User with that email address does not exist."});
        }
        const token = jwt.sign({userId: userData._id, newPass: newPass}, "passResetKey", {expiresIn: "3m"});
        sendEmail(email, "Password Reset Token", token);
        res.json({message: "Token was send."});
    });

});

router.put("/user/passReset/:resetToken", function(req, res) {
    try{
        const token = req.params.resetToken;
        const userData = jwt.verify(token, "passResetKey");  
        bcryptjs.hash(userData.newPass, 10, (e, hashed_pass)=> { 
            user.updateOne({_id: userData.userId}, {password: hashed_pass})
            .then(function() {
                res.json({message: "Your password has been reset."})
            })
            .catch(function(e) {
                res.json({message: e});
            });
        });        
    }
    catch(e) {
        res.json({message: "Invalid Token!"});
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
        return res.json({message: "Invalid image format, only supports png or jpeg image format."});
    }

    user.findOne({_id: req.userInfo._id})
    .then((userData)=> {
        if(userData.profile_pic!="defaultProfile.png") {
            const profile_pic_path = `./uploads/profiles/${userData.profile_pic}`;
            fs.unlinkSync(profile_pic_path);
        }  
    
        user.updateOne({_id: req.userInfo._id}, {profile_pic: req.file.filename})
        .then(()=>{
            res.json({message: "    "});
        })
        .catch((e)=> {
            res.json({message: e});
        });
    })
    .catch((e)=> {
        res.json({message: e});
    });
});

router.put("/user/changeCover", auth.verifyUser, coverUpload.single("cover"), (req, res)=> {
    if(req.file==undefined) {
        return res.json({error: "Invalid image format, only supports png or jpeg image format."});
    }

    user.findOne({_id: req.userInfo._id})
    .then((userData)=> {
        if(userData.cover_pic!="defaultCover.png") {
            const cover_pic_path = `./uploads/covers/${userData.cover_pic}`;
            fs.unlinkSync(cover_pic_path);
        }    

        user.updateOne({_id: req.userInfo._id}, {cover_pic: req.file.filename})
        .then(()=>{
            res.json({message: "New cover picture added."});
        })
        .catch((e)=> {
            res.json({message: e});
        });
    })
    .catch((e)=> {
        res.json({message: e});
    });
});

router.put("/user/changeUsername", auth.verifyUser, (req, res)=> {  
    const username = req.body.username;
    
    user.findOne({username: username}).then(function(userData) {
        if(userData!=null) {
            res.json({message: "This username is already used, try another."});
            return;
        }  
        user.updateOne({_id: req.userInfo._id}, {username: username})
        .then(()=>{
            res.json({message: "Your username has been changed."});
        })
        .catch((e)=> {
            res.json({message: e})
        });
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
            res.json({message: e})
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

router.post("/user/search", auth.verifyUser, async (req, res)=> {
    const name = req.body.username_email
    var searchedUsers = [];

    // Using async function show that only after searching all the users, it will send the users 
    // Otherwise it will produce error 
    // Because it will start to run the code below it even though all the users have not been completely searched
    const usernameUsers = await user.find({username: name}).find({_id: {$ne: req.userInfo._id}});
    const emailUsers = await user.find({email: name}).find({_id: {$ne: req.userInfo._id}});

    searchedUsers.push.apply(searchedUsers, usernameUsers);
    searchedUsers.push.apply(searchedUsers, emailUsers);
    
    const nameUsers = await profile.find({
        $or: [
            {first_name: name},
            {last_name: name}
        ]
    })
    .find({_id: {$ne: req.userInfo._id}})
    .populate("user_id");

    for(var i=0; i<nameUsers.length; i++) {    
        searchedUsers.push(nameUsers[i].user_id);
    }

    res.json(searchedUsers); 
});

module.exports = router; 