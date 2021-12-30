// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const post = require("../models/postModel.js");
const follow = require("../models/followModel.js");
const notification = require("../models/notificationModel.js");
const auth = require("../auth/auth.js");
const postUpload = require("../uploadSettings/post.js");

router.post("/post/add", auth.verifyUser, postUpload.array("image_video"), async (req, res)=> { 
    // If you want to fix the number of file to upload then use 'postUpload.array("image_video", 10)'
    if(req.files==undefined) {
        return res.json({error: "Invalid image or video format, only supports png or jpeg or mp4 or mkv."});
    }

    // Making array of filenames
    const filesArray = req.files;
    const filesNameArray = [];
    for(i=0; i<filesArray.length; i++) {
        filesNameArray.push(filesArray[i].filename);
    }

    const userPost = new post({
        user_id: req.userInfo._id,
        caption: req.body.caption,
        description: req.body.description,
        attach_file: filesNameArray,
        tag_friend: req.body.tag_friend, 
    })
    userPost.save()
    .then(async ()=> {
        const follower = await follow.find({followed_user: req.userInfo._id, block_follower: false});
        for(i=0; i<follower.length; i++) {  
            const newNotification = new notification({
                notified_user: follower[i].follower,
                notification: `New post from ${req.userInfo.username}`,
                notification_for: "Post",
                notification_generator: req.userInfo._id,
            });
            newNotification.save();
        }
        res.json({message: "Post uploaded"});
    });
});

router.put("/post/edit", auth.verifyUser, (req, res)=> {
    post.updateOne({_id: req.body.post_id}, {
        caption: req.body.caption,
        description: req.body.description,
        }
    )
    .then(function(){
        res.json({message: "Post has been edited updated."})
    }) 
    .catch(function(e) {
        res.json(e);
    });
});

router.delete("/post/delete", auth.verifyUser, (req, res)=> {
    post.findByIdAndDelete({_id: req.body.post_id})
    .then(function() {
        res.json({message: "Post Deleted."});
    })
    .catch((e)=> {
        res.json({error: e});
    });
});

module.exports = router;