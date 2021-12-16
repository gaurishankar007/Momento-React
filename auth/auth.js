const e = require("express");
const jwt = require("jsonwebtoken");
const user = require("../models/userModel.js");

// guard for normal user
module.exports.verifyUser = function(req, res, next) {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const userData = jwt.verify(token, "mountainDuke");
        user.findOne({_id: userData.userId}).then((userData2)=>{
            req.userInfo = userData2;
            if (!userData2.admin && !userData2.super) {
                next();
            }
            else {
                res.json({message: "Only normal users are allowed. Not for admins and super users."});
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
        const userData = jwt.verify(token, "mountainDuke");
        user.findOne({_id: userData.userId}).then((userData2)=>{
            req.userInfo = userData2;
            if(userData2.admin) {
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
        const userData = jwt.verify(token, "mountainDuke");
        user.findOne({_id: userData.userId}).then((userData2)=>{
            req.userInfo = userData2;
            if(userData2.super) {
                next();
            }
            else {
                res.json({message: "Only superuser are allowed."});
            }
        }).catch(function(e){
            res.json({error: e});
        });
    }
    catch(e) {
        res.json({error: e});
    }
} 