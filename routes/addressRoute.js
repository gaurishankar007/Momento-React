const express = require("express");
const router = new express.Router();

const address = require("../models/AddressModel.js");

router.post("/address/add/:user_id", (req, res)=> {
    const newAddress = new address({
        user_id: req.params.user_id,
        permanent: {
            country: req.body.permanent.country,
            state: req.body.permanent.state,
            city: req.body.permanent.city,
            street: req.body.permanent.street,
        },
    });
    newAddress.save().then(function(){
        res.json({message: "Address has been added."})
    });
});

module.exports = router;