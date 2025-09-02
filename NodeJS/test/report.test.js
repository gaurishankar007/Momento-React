const report = require("../models/reportModel")
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

describe('report schema test', ()=> {
    // insert
    it('report insert testing', ()=> {
        const newReport = {
            "reported_post": "620cfbab4c91681188a25a06",
            "reporter": "620cf91a33f3c13e029bb4c4",
            "report_for": ["Impropriate language", "Bullying", "Hate speech"], 
        } 

        return report.create(newReport).then((reportData)=>{
            expect(reportData.reported_post.toString()).toEqual("620cfbab4c91681188a25a06")
            expect(reportData.reporter.toString()).toEqual("620cf91a33f3c13e029bb4c4")
            expect(reportData.report_for).toEqual(["Impropriate language", "Bullying", "Hate speech"])
        })
    })

    // delete
    it('report delete testing', async ()=> {
       const status = await report.deleteMany()
       expect(status.ok)
    })
})