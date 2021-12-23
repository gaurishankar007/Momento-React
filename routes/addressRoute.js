// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const address = require("../models/AddressModel.js");
const auth = require("../auth/auth.js");

router.post("/address/add/:user_id", auth.verifyUser, (req, res)=> {
    const newAddress = new address({
        user_id: req.params.user_id,
        permanent: {
            country: req.body.permanent.country,
            state: req.body.permanent.state,
            city: req.body.permanent.city,
            street: req.body.permanent.street,
        },
        temporary: {
            country: req.body.temporary.country,
            state: req.body.temporary.state,
            city: req.body.temporary.city,
            street: req.body.temporary.street,
        },
    });
    newAddress.save().then(function(){
        res.json({message: "Address has been added."})
    }).catch(function(e){
        res.json(e);
    });
});

router.put("/address/update/:address_id", auth.verifyUser, (req, res)=> {
    address.updateOne({_id: req.params.address_id}, {
        permanent: {
            country: req.body.permanent.country,
            state: req.body.permanent.state,
            city: req.body.permanent.city,
            street: req.body.permanent.street,
        },
        temporary: {
            country: req.body.temporary.country,
            state: req.body.temporary.state,
            city: req.body.temporary.city,
            street: req.body.temporary.street,
        },
    }
    )
    .then(function(){
        res.json({message: "Address has been updated."})
    }) 
    .catch(function(e) {
        res.json(e);
    });
});

router.put("/address/hide/:address_id", auth.verifyUser, (req, res)=> {
    address.updateOne({_id: req.params.address_id}, {hide: true})
    .then(function(){
        res.json({message: "Address has been hidden."})
    }) 
    .catch(function(e) {
        res.json(e);
    });
});

router.put("/address/show/:address_id", auth.verifyUser, (req, res)=> {
    address.updateOne({_id: req.params.address_id}, {hide: false})
    .then(function(){
        res.json({message: "Address has been shown."})
    }) 
    .catch(function(e) {
        res.json(e);
    });
});

module.exports = router;