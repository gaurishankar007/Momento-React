const chat = require("../models/chatModel")
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

describe('chat schema test', ()=> {
    // insert
    it('chat insert testing', ()=> {
        const newChat = {
            users: [Object("620cf99cd9377d74a774dc28"), Object("620cf91a33f3c13e029bb4c4"), Object("620ce954e88198546c94cf2f")],
            name: "Bros",
            group: true,    
            admin: Object("620cf99cd9377d74a774dc28"),
        } 

        return chat.create(newChat).then((chatData)=>{
            expect(chatData.users.toString()).toEqual("620cf99cd9377d74a774dc28,620cf91a33f3c13e029bb4c4,620ce954e88198546c94cf2f")
            expect(chatData.latest_message).toEqual(null)
            expect(chatData.name).toEqual("Bros")
            expect(chatData.group).toEqual(true)
            expect(chatData.admin.toString()).toEqual("620cf99cd9377d74a774dc28")
        })
    })
})