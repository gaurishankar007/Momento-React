// Importing installed packages.....
const express = require("express");
const router = new express.Router();
const mongoose = require("mongoose");
const fs = require("fs");

// Importing self made js files....
const post = require("../models/postModel.js");
const like = require("../models/likeModel.js");
const comment = require("../models/commentModel.js");
const follow = require("../models/followModel.js");
const notification = require("../models/notificationModel.js");
const auth = require("../auth/auth.js");
const postUpload = require("../uploadSettings/post.js");

router.post("/post/add", auth.verifyUser, postUpload.array("images", 12), async (req, res)=> { 
    try {
        // If you want to fix the number of file to upload then use 'postUpload.array("image_video", 10)'
        if(req.files.length==0) {
            return res.json({message: "Invalid image format, only supports png or jpeg."});
        }
        
        // Making array of filenames
        const filesArray = req.files;
        const filesNameArray = [];
        for(i=0; i<filesArray.length; i++) {
            filesNameArray.push(filesArray[i].filename);
        }
        
        // Making array of tagged friends 
        const taggedFriend = [];
        if(typeof(req.body.tag_friend)=="string") {
            taggedFriend.push(mongoose.Types.ObjectId(req.body.tag_friend));
        }
        else if(typeof(req.body.tag_friend)=="object") {
            for(i=0; i<req.body.tag_friend.length; i++) {
                taggedFriend.push(mongoose.Types.ObjectId(req.body.tag_friend[i]));
            }
        }      

        const userPost = await post.create({
            user_id: req.userInfo._id,
            caption: req.body.caption,
            description: req.body.description,
            attach_file: filesNameArray,
            tag_friend: taggedFriend, 
        });

        if(taggedFriend.length>0) {
            for(i=0; i<taggedFriend.length; i++) {                
                notification.create({
                    notified_user: taggedFriend[i],
                    notification: `You have been tagged in  ${req.userInfo.username}'s post.`,
                    notification_for: "Tag",
                    notification_generator: req.userInfo._id,
                    target_post: userPost._id,
                });
            }
        }

        const follower = await follow.find({followed_user: req.userInfo._id});
        if(follower.length>0) {
            for(i=0; i<follower.length; i++) {  
                notification.create({
                    notified_user: follower[i].follower,
                    notification: `New post from ${req.userInfo.username}.`,
                    notification_for: "Post",
                    notification_generator: req.userInfo._id,
                    target_post: userPost._id,
                });
            }
        }
        res.json({message: "Post uploaded"});
    }
    catch (err) {
        console.log(err);
        res.send({message: err.message});
    }
});

router.put("/post/edit", auth.verifyUser, (req, res)=> {
    // Making array of tagged friends 
    const taggedFriend = [];
    if(typeof(req.body.tag_friend)=="string") {
        taggedFriend.push(mongoose.Types.ObjectId(req.body.tag_friend));
    }
    else if(typeof(req.body.tag_friend)=="object") {
        for(i=0; i<req.body.tag_friend.length; i++) {
            taggedFriend.push(mongoose.Types.ObjectId(req.body.tag_friend[i]));
        }
    }

    post.updateOne({_id: req.body.post_id}, {
        caption: req.body.caption,
        description: req.body.description,
        tag_friend: taggedFriend, 
        }
    )
    .then(function(){
        res.json({message: "Post has been edited."})
    }) 
    .catch(function(e) {
        res.json(e);
    });
});

router.delete("/post/delete", auth.verifyUser, (req, res)=> {
    post.findById(req.body.post_id).then((postData)=> {
        const attach_files = postData.attach_file.length;
        for(i=0; i<attach_files; i++) {            
            const image_path = `./uploads/posts/${postData.attach_file[i]}`;
            fs.unlinkSync(image_path);
        }

        post.findByIdAndDelete(postData._id)
        .then(function() {
            res.json({message: "Post has been deleted."});
        })
        .catch((e)=> {
            res.json({message: e});
        });
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

router.post("/posts/get/other", auth.verifyUser, async (req, res) => { 
    const posts = await post.find({user_id: req.body.user_id})
    .sort({createdAt: -1});

    res.send(posts);
});

router.post("/posts/get/tagged/other", auth.verifyUser, async (req, res) => { 
    const posts = await post.find({tag_friend: req.body.user_id})
    .sort({createdAt: -1});

    res.send(posts);
});

router.post("/post/get/single", auth.verifyUser, async (req, res) => { 
    post.findOne({_id: req.body.post_id})
    .populate("user_id", "username profile_pic")
    .populate("tag_friend", "_id username profile_pic")
    .then((postData)=> {
        res.send(postData);
    });
});

router.post("/post/get/single/lc", auth.verifyUser, async (req, res) => { 
    post.findOne({_id: req.body.post_id})
    .then(async (postData)=> {
        var liked = false, commented = false;
        await like.findOne({post_id: postData._id, user_id: req.userInfo._id}).then((likeData)=> {
            if(likeData!=null) {
                liked = true;
            } 
        })
    
        await comment.findOne({post_id: postData._id, user_id: req.userInfo._id}).then((commentData)=> {
            if(commentData!=null) {
                commented = true;
            } 
        })
    
        res.send({liked: liked, commented: commented});
    });
});

router.get("/posts/get/followedUser", auth.verifyUser, async (req, res) => { 
    const users = [];
    const liked = [];
    const commented = [];

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

    for(i=0; i<posts.length; i++) {
        await like.findOne({post_id: posts[i]._id, user_id: req.userInfo._id}).then((likeData)=> {
           if(likeData!=null) {
               liked.push(true);
           } else {
               liked.push(false);
           }
       })

       await comment.findOne({post_id: posts[i]._id, user_id: req.userInfo._id}).then((commentData)=> {
           if(commentData!=null) {
               commented.push(true);
           } else {
               commented.push(false);
           }
       })
   }

    res.send({followedPosts: posts, liked: liked, commented: commented});
});

module.exports = router;