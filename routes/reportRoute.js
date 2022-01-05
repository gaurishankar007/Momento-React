// Importing installed packages.....
const express = require("express");
const router = new express.Router();

// Importing self made js files....
const report = require("../models/reportModel.js");
const post = require("../models/postModel.js");
const restrict = require("../models/restrictModel.js");
const notification = require("../models/notificationModel.js");
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
                            reported_post: postData._id,
                        });
                        newNotification.save();
                    }
                });
            });
        });
    });
});

router.get("/reports/get", auth.verifyAdminSuper, async (req, res)=> {
    const reports = await report.find({})
    .populate("reported_post", "-createdAt -updatedAt")
    .populate("reporter", "username profile_pic")
    .sort({createdAt: -1});

    res.send(reports);
});

module.exports = router;