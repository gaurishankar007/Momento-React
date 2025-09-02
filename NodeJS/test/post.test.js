const post = require("../models/postModel")
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

describe('post schema test', ()=> {
    // insert
    it('post insert testing', ()=> {
        const newPost = {
            "user_id": "620ce954e88198546c94cf2f",
            "caption": "Flying in the sky",
            "description": "Experiencing sky diving for the first time.",
            "attach_file": ["image1.png", "image2.jpg"],
            "tag_friend": [], 
        } 

        return post.create(newPost).then((postData)=>{
            expect(postData.caption).toEqual("Flying in the sky")
            expect(postData.description).toEqual("Experiencing sky diving for the first time.")
            expect(postData.attach_file).toEqual(["image1.png", "image2.jpg"])
            expect(postData.tag_friend).toEqual([])
        })
    })

    // update
    it('post update testing', ()=> {
        return post.updateOne({_id: Object("620cfbab4c91681188a25a06")}, 
        {$set: {caption: "Hello guys", description: "I am going to organize an event."}})
        .then(()=> {
           return post.findOne({_id: Object("620cfbab4c91681188a25a06")})
            .then((postData)=> {                
                expect(postData.caption).toEqual("Hello guys")
                expect(postData.description).toEqual("I am going to organize an event.")
            })
        })
    })
})