// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const post = require("../models/postModel.js");
const auth = require("../auth/auth.js");
const postUpload = require("../uploadSettings/post.js");

router.post("/post/add/:user_id", auth.verifyUser, postUpload.array("image_video"), (req, res)=> { 
    // If you want to fix the number of file to upload then use 'postUpload.array("image_video", 10)'
    if(req.files==undefined) {
        return res.json({error: "Invalid image or video format, only supports png or jpeg or mp4 or mkv."});
    }

    const filesArray = req.files;
    const filesNameArray = [];
    for(i=0; i<filesArray.length; i++) {
        filesNameArray.push(filesArray[i].filename);
    }
    
    console.log(req.files)
    const userPost = new post({
        user_id: req.params.user_id,
        caption: req.body.caption,
        description: req.body.description,
        attach_file: filesNameArray,
        tag_friend: req.body.tag_friend 
    });
    userPost.save()
    .then(()=> {
        res.json({message: "Post uploaded."});
    })
    .catch((e)=> {
        res.json({error: e});
    })
});

module.exports = router;