const like = require("../models/likeModel")
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

describe('like schema test', ()=> {
    // insert
    it('like insert testing', ()=> {
        const newLike = {
            "post_id": "620cfbab4c91681188a25a06",
            "user_id": "620cf99cd9377d74a774dc28",
        } 

        return like.create(newLike).then((likeData)=>{
            expect(likeData.post_id.toString()).toEqual("620cfbab4c91681188a25a06")
            expect(likeData.user_id.toString()).toEqual("620cf99cd9377d74a774dc28")
        })
    })
})