const comment = require("../models/commentModel")
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

describe('comment schema test', ()=> {
    // insert
    it('comment insert testing', ()=> {
        const newComment = {
            "post_id": "620cfbab4c91681188a25a06",
            "user_id": "620cf99cd9377d74a774dc28",
            "comment": "Oh hero! looking good."
        } 

        return comment.create(newComment).then((commentData)=>{
            expect(commentData.post_id.toString()).toEqual("620cfbab4c91681188a25a06")
            expect(commentData.user_id.toString()).toEqual("620cf99cd9377d74a774dc28")
            expect(commentData.comment).toEqual("Oh hero! looking good.")
        })
    })

    // update
    it('comment update testing', ()=> {
        return comment.updateOne({_id: Object("620d2bcd4ddb8ba0ab13505a")}, {$set: {comment: "What the hell am i looking at."}})
        .then(()=> {
           return comment.findOne({_id: Object("620d2bcd4ddb8ba0ab13505a")})
            .then((updatedComment)=> {                
                expect(updatedComment.comment).toEqual("What the hell am i looking at.")
            })
        })
    })
})