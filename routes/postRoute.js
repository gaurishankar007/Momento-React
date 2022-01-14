// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const post = require("../models/postModel.js");
const block = require("../models/blockModel.js");
const follow = require("../models/followModel.js");
const notification = require("../models/notificationModel.js");
const auth = require("../auth/auth.js");
const postUpload = require("../uploadSettings/post.js");

router.post("/post/add", auth.verifyUser, postUpload.array("images", 12), async (req, res)=> { 
    try {
        // If you want to fix the number of file to upload then use 'postUpload.array("image_video", 10)'
        if(req.files.length==0) {
            return res.json({error: "Invalid image format, only supports png or jpeg."});
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
            // tag_friend: req.body.tag_friend, 
        });
        userPost.save();

        const follower = await follow.find({followed_user: req.userInfo._id});
        if(follower.length>0) {
            for(i=0; i<follower.length; i++) {  
                notification.create({
                    notified_user: follower[i].follower,
                    notification: `New post from ${req.userInfo.username}`,
                    notification_for: "Post",
                    notification_generator: req.userInfo._id,
                    new_post: userPost._id,
                });
            }
        }
        res.json({message: "Post uploaded"});
    }
    catch (err) {
        res.send(err.message);
    }
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

router.get("/posts/get/my", auth.verifyUser, async (req, res) => { 
    const posts = await post.find({user_id: req.userInfo._id})
    .sort({createdAt: -1});

    res.send(posts);
});

router.get("/posts/get/tagged", auth.verifyUser, async (req, res) => { 
    const posts = await post.find({tag_friend: req.userInfo._id})
    .sort({createdAt: -1});

    res.send(posts);
});

router.get("/posts/get/followedUser", auth.verifyUser, async (req, res) => { 
    const users = [];

    const followed_user = await follow.find({
        follower: req.userInfo._id
    });

    for(i=0; i<followed_user.length; i++) {
        users.push(followed_user[i].followed_user);
    }
    
    const posts = await post.find({user_id: users})
    .populate("user_id", "username profile_pic")
    .populate("tag_friend", "username profile_pic")
    .sort({createdAt: -1});

    res.send(posts);
});

module.exports = router;