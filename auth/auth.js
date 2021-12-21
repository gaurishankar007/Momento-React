const e = require("express");
const jwt = require("jsonwebtoken");
const user = require("../models/userModel.js");

// guard for normal user
module.exports.verifyUser = function(req, res, next) {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const userData = jwt.verify(token, "loginKey");
        user.findOne({_id: userData.userId}).then((nUser)=>{
            req.userInfo = nUser;
            if (nUser.admin==false && nUser.super==false) {
                next();
            }
            else {
                res.json({message: "Only normal users are allowed. Not for admin or super users."});
            }
        }).catch(function(e){
            res.json({error: e});
        });
    }
    catch(e) {
        res.json({error: e});
    }
} 

// guard for admin user
module.exports.verifyAdmin = function(req, res, next) {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const userData = jwt.verify(token, "loginKey");
        user.findOne({_id: userData.userId}).then((aUser)=>{
            req.adminInfo = aUser;
            if(aUser.admin) {
                next();
            }
            else {
                res.json({message: "Only admins are allowed."});
            }
        }).catch(function(e){
            res.json({error: e});
        });
    }
    catch(e) {
        res.json({error: e});
    }
} 

// guard for super user
module.exports.verifySuper = function(req, res, next) {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const userData = jwt.verify(token, "loginKey");
        user.findOne({_id: userData.userId}).then((sUser)=>{
            req.superInfo = sUser;
            if(sUser.superuser) {
                next();
            }
            else {
                res.json({message: "Only superusers are allowed."});
            }
        }).catch(function(e){
            res.json({error: e});
        });
    }
    catch(e) {
        res.json({error: e});
    }
} 

// guard for admin or super user
module.exports.verifyAdminSuper = function(req, res, next) {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const userData = jwt.verify(token, "loginKey");
        user.findOne({_id: userData.userId}).then((asUser)=>{
            req.adminSuperInfo = asUser;
            if(asUser.admin || asUser.superuser) {
                next();
            }
            else {
                res.json({message: "Only admins or superusers are allowed."});
            }
        }).catch(function(e){
            res.json({error: e});
        });
    }
    catch(e) {
        res.json({error: e});
    }
} 