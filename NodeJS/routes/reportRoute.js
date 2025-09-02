// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const report = require("../models/reportModel.js");
const post = require("../models/postModel.js");
const restrict = require("../models/restrictModel.js");
const notification = require("../models/notificationModel.js");
const user = require("../models/userModel")
const auth = require("../auth/auth.js");

router.post("/report/post", auth.verifyUser, (req, res)=>{
    post.findOne({_id: req.body.post_id}).then((postData)=>{        
        const newReport = new report({
            reported_post: postData._id,
            reporter: req.userInfo._id,
            report_for: req.body.report_for,
        });
        newReport.save().then(()=> {
            var reportFor = "";
            const reportForArray = req.body.report_for;
            for(i=0; i<reportForArray.length; i++) {
                if(i==(reportForArray.length-1)) {
                    reportFor = reportFor + reportForArray[i];
                }
                else {
                    reportFor = reportFor + reportForArray[i] + ", ";
                }
            }

            post.updateOne({_id: postData._id}, {report_num: (postData.report_num+1)}).then(()=> {
                restrict.findOne({
                    restricted_user: req.userInfo._id,
                    restricting_user: postData.user_id
                }).then((restrictData)=> {
                    if(restrictData==null) {
                        const newNotification = new notification({
                            notified_user: postData.user_id,
                            notification: `Your post got reported for ${reportFor} content from ${req.userInfo.username}.`,
                            notification_for: "Report",
                            notification_generator: req.userInfo._id,
                            target_post: postData._id,
                        });
                        newNotification.save();
                    }
                    res.json({message: "Reported."});
                });
            });
        });
    });
});

router.get("/reports/get", auth.verifyAdminSuper, async (req, res)=> {
    report.find({})
    .populate("reported_post", "_id user_id caption description attach_file")
    .populate("reporter", "_id username profile_pic is_active")
    .sort({createdAt: -1})
    .then(async (reportsData)=> {
        reportsData = await report.populate(reportsData, { 
            path: "reported_post.user_id",
            select: "_id username profile_pic is_active",
        });
        res.send(reportsData);
    });
});

router.post("/reports/search/reportedUser", auth.verifyAdminSuper, async (req, res)=> {    
    var userId = []
    var post_id = []
    const username = req.body.parameter
    ? {username: { $regex: req.body.parameter, $options: "i" }}
    :{}; 

    const users = await user.find(username).find({admin: false, superuser: false});
    for(var i=0; i<users.length; i++) {
        userId.push(users[i]._id)
    }
    
    const posts = await post.find({user_id: userId})
    for(var i=0; i<posts.length; i++) {
        post_id.push(posts[i]._id)
    }

    report.find({reported_post: post_id})
    .populate("reported_post", "_id user_id caption description attach_file")
    .populate("reporter", "_id username profile_pic is_active")
    .sort({createdAt: -1})
    .then(async (reportsData)=> {
        reportsData = await report.populate(reportsData, { 
            path: "reported_post.user_id",
            select: "_id username profile_pic is_active",
        });
        res.send(reportsData);
    });

});

router.post("/reports/search/reporter", auth.verifyAdminSuper, async (req, res)=> {    
    var reporter_id = []
    const username = req.body.parameter
    ? {username: { $regex: req.body.parameter, $options: "i" }}
    :{}; 

    const users = await user.find(username).find({admin: false, superuser: false});
    for(var i=0; i<users.length; i++) {
        reporter_id.push(users[i]._id)
    }

    report.find({reporter: reporter_id})
    .populate("reported_post", "_id user_id caption description attach_file")
    .populate("reporter", "_id username profile_pic is_active")
    .sort({createdAt: -1})
    .then(async (reportsData)=> {
        reportsData = await report.populate(reportsData, { 
            path: "reported_post.user_id",
            select: "_id username profile_pic is_active",
        });
        res.send(reportsData);
    });

});

router.delete("/report/delete/:report_id", auth.verifyAdminSuper, async (req, res)=> {
    report.deleteOne({_id: req.params.report_id}).then(()=> {
        res.json({"message": "Report deleted."})
    });
});

module.exports = router;