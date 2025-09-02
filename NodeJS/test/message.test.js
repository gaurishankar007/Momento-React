const message = require("../models/messageModel")
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

describe('message schema test', ()=> {
    // insert
    it('message insert testing', ()=> {
        const newMessage = {
            "sender": "620cf91a33f3c13e029bb4c4",
            "content": "Whats up guys?",
            "chat_id": "620d35e1c99c7ec014d38e4a",
        } 

        return message.create(newMessage).then((messageData)=>{
            expect(messageData.sender.toString()).toEqual("620cf91a33f3c13e029bb4c4")
            expect(messageData.content).toEqual("Whats up guys?")
            expect(messageData.chat_id.toString()).toEqual("620d35e1c99c7ec014d38e4a")
        })
    })
})