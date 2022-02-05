// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const address = require("../models/AddressModel.js");
const auth = require("../auth/auth.js");

router.put("/address/update", auth.verifyUser, (req, res)=> {
    address.updateOne({user_id: req.userInfo._id}, {
        permanent: {
            country: req.body.pCountry,
            state: req.body.pState,
            city: req.body.pCity,
            street: req.body.pStreet,
        },
        temporary: {
            country: req.body.tCountry,
            state: req.body.tState,
            city: req.body.tCity,
            street: req.body.tStreet,
        },
    }
    )
    .then(function(){
        res.json({message: "Address has been updated."})
    }) 
    .catch(function(e) {
        res.json({message: e});
    });
});

router.put("/address/hide", auth.verifyUser, (req, res)=> {
    address.updateOne({user_id: req.userInfo._id}, {hide: true})
    .then(function(){
        res.json({message: "Address has been hidden."})
    }) 
    .catch(function(e) {
        res.json({message: e});
    });
});

router.put("/address/show", auth.verifyUser, (req, res)=> {
    address.updateOne({user_id: req.userInfo._id}, {hide: false})
    .then(function(){
        res.json({message: "Address has been shown."})
    }) 
    .catch(function(e) {
        res.json({message: e});
    });
});

router.get("/address/get/my", auth.verifyUser, async (req, res)=> {
    const userAddress = await address.findOne({user_id: req.userInfo._id});
    if(userAddress!=null) {
        res.json({userAddress: userAddress});
    }
});

router.post("/address/get/other", auth.verifyUser, async (req, res)=> {
    const userAddress = await address.findOne({user_id: req.body.user_id});
    if(userAddress!=null) {
        res.json({userAddress: userAddress});
    }
});

module.exports = router;