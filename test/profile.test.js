const profile = require("../models/profileModel")
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

describe('profile schema test', ()=> {
    // insert
    it('profile insert testing', ()=> {
        const newProfile = {
            "first_name": "John",
            "last_name": "Don",
            "gender": "Male",
            "birthday": "2002-05-18",
            "biography": "My name is John Don. I live in Los Angeles."
        } 
        return profile.create(newProfile).then((profileData)=>{
            expect(profileData.first_name).toEqual("John")
            expect(profileData.last_name).toEqual("Don")
            expect(profileData.gender).toEqual("Male")
            expect(Date(profileData.birthday)).toEqual(Date("2002-05-18T00:00:00.000Z"))
            expect(profileData.biography).toEqual("My name is John Don. I live in Los Angeles.")
        })
    })

    // update
    it('profile update testing', ()=> {
        return profile.updateOne({_id: Object("620d192b434ffb06a000adde")}, 
        {$set: {first_name: "Lila", last_name: "Pant", gender: "Female", "birthday": "2001-06-08", biography: "My name is Lila Pant. I live in Los Angeles."}})
        .then(()=> {
           return profile.findOne({_id: Object("620d192b434ffb06a000adde")})
            .then((updatedProfile)=> {        
                expect(updatedProfile.first_name).toEqual("Lila")
                expect(updatedProfile.last_name).toEqual("Pant")
                expect(updatedProfile.gender).toEqual("Female")
                expect(Date(updatedProfile.birthday)).toEqual(Date("2001-06-08T00:00:00.000Z"))
                expect(updatedProfile.biography).toEqual("My name is Lila Pant. I live in Los Angeles.")
            })
        })
    })
})