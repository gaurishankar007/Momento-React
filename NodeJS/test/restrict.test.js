const restrict = require("../models/restrictModel")
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

describe('restrict schema test', ()=> {
    // insert
    it('restrict insert testing', ()=> {
        const newRestrict = {
            "restricted_user": "620cf91a33f3c13e029bb4c4",
            "restricting_user": "620cf99cd9377d74a774dc28",
        } 

        return restrict.create(newRestrict).then((restrictData)=>{
            expect(restrictData.restricted_user.toString()).toEqual("620cf91a33f3c13e029bb4c4")
            expect(restrictData.restricting_user.toString()).toEqual("620cf99cd9377d74a774dc28")
        })
    })
})