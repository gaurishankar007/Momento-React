// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const save = require("../models/saveModel.js");
const auth = require("../auth/auth.js");

router.post("/save/post", auth.verifyUser, (req, res)=> {
    save.findOne({
        post_id: req.body.post_id,
        user_id: req.userInfo._id
    })
    .then(function(saveData) {
        if(saveData!=null) {
            save.findByIdAndDelete({_id: saveData._id}).then().catch();
            return;
        }
        const newSave = new save({
            post_id: req.body.post_id,
            user_id: req.userInfo._id
        })
        newSave.save();
    });
});

router.get("/saves/get", auth.verifyUser, async (req, res)=> {
    const saves = await save.find({
        user_id: req.userInfo._id
    })
    .populate("post_id", "-createdAt -updatedAt")
    .sort({createdAt: -1});
    
    res.send(saves);
});

module.exports = router;