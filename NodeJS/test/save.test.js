const save = require("../models/saveModel")
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

describe('save schema test', ()=> {
    // insert
    it('save insert testing', ()=> {
        const newSave = {
            "post_id": "620cfbab4c91681188a25a06",
            "user_id": "620cf99cd9377d74a774dc28",
        } 

        return save.create(newSave).then((saveData)=>{
            expect(saveData.post_id.toString()).toEqual("620cfbab4c91681188a25a06")
            expect(saveData.user_id.toString()).toEqual("620cf99cd9377d74a774dc28")
        })
    })
})