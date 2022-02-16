const notification = require("../models/notificationModel")
const mongoose = require("mongoose")

const url = "mongodb://localhost:27017/momento_test"

beforeAll(async ()=> {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

afterAll(async ()=> {
    await mongoose.connection.close()
})

describe('notification schema test', ()=> {
    // insert
    it('notification insert testing', ()=> {
        const newNotification = {
            "notified_user": "620ce954e88198546c94cf2f",
            "notification": "nishan liked your post.",
            "notification_for": "Like",
            "notification_generator": "620cf99cd9377d74a774dc28",    
            "target_post": "620cfbab4c91681188a25a06", 
        } 

        return notification.create(newNotification).then((notificationData)=>{
            expect(notificationData.notified_user.toString()).toEqual("620ce954e88198546c94cf2f")
            expect(notificationData.notification).toEqual("nishan liked your post.")
            expect(notificationData.notification_for).toEqual("Like")
            expect(notificationData.notification_generator.toString()).toEqual("620cf99cd9377d74a774dc28")
            expect(notificationData.target_post.toString()).toEqual("620cfbab4c91681188a25a06")
        })
    })

    // delete
    it('report delete testing', async ()=> {
       const status = await notification.deleteMany()
       expect(status.ok)
    })
})