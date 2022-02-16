const follow = require("../models/followModel")
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

describe('follow schema test', ()=> {
    // insert
    it('follow insert testing', ()=> {
        const newFollow = {
            "followed_user": "620cf91a33f3c13e029bb4c4",
            "follower": "620cf99cd9377d74a774dc28",
        } 

        return follow.create(newFollow).then((followData)=>{
            expect(followData.followed_user.toString()).toEqual("620cf91a33f3c13e029bb4c4")
            expect(followData.follower.toString()).toEqual("620cf99cd9377d74a774dc28")
        })
    })
})