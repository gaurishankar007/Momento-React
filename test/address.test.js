const address = require("../models/addressModel")
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

describe('address schema test', ()=> {
    // insert
    it('address insert testing', ()=> {
        const newAddress = {
            "permanent": {
                "country": "Nepal",
                "state": "Province-1",
                "city": "Morang",
                "street": "Pacham",
            },
            "temporary": {
                "country": "Nepal",
                "state": "Bagmati",
                "city": "Bhaktapur",
                "street": "Balkot",
            },
        } 
        return address.create(newAddress).then((addressData)=>{
            expect(addressData.permanent.country).toEqual("Nepal")
            expect(addressData.permanent.state).toEqual("Province-1")
            expect(addressData.permanent.city).toEqual("Morang")
            expect(addressData.permanent.street).toEqual("Pacham")
            expect(addressData.temporary.country).toEqual("Nepal")
            expect(addressData.temporary.state).toEqual("Bagmati")
            expect(addressData.temporary.city).toEqual("Bhaktapur")
            expect(addressData.temporary.street).toEqual("Balkot")
        })
    })
})