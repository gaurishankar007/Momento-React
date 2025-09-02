const block = require("../models/blockModel")
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

describe('block schema test', ()=> {
    // insert
    it('block insert testing', ()=> {
        const newBlock = {
            "blocked_user": "620cf91a33f3c13e029bb4c4",
            "blocker": "620cf99cd9377d74a774dc28",
        } 

        return block.create(newBlock).then((blockData)=>{
            expect(blockData.blocked_user.toString()).toEqual("620cf91a33f3c13e029bb4c4")
            expect(blockData.blocker.toString()).toEqual("620cf99cd9377d74a774dc28")
        })
    })

    // delete
    it('block delete testing', async ()=> {
        const status = await block.deleteMany()
        expect(status.ok)
     })
})