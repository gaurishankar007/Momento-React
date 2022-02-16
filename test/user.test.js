const user = require("../models/userModel")
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

describe('user schema test', ()=> {
    // insert
    it('user insert testing', ()=> {
        const newUser = {
            "username": "john08",
            "password": "John@23",
            "email": "john896@gmail.com",
            "phone": 9812376540
        } 
        return user.create(newUser).then((userData)=>{
            expect(userData.username).toEqual("john08")
            expect(userData.password).toEqual("John@23")
            expect(userData.email).toEqual("john896@gmail.com")
            expect(userData.phone).toEqual(9812376540)
            expect(userData.profile_pic).toEqual("defaultProfile.png")
            expect(userData.cover_pic).toEqual("defaultCover.png")
            expect(userData.admin).toEqual(false)
            expect(userData.superuser).toEqual(false)
            expect(userData.is_active).toEqual(true)
        })
    })

    // update
    it('user update testing', ()=> {
        return user.updateOne({_id: Object("620ce954e88198546c94cf2f")}, {$set: {password: "nishan00!78", phone: 9870145633}})
        .then(()=> {
           return user.findOne({_id: Object("620ce954e88198546c94cf2f")})
            .then((updatedUser)=> {                
                expect(updatedUser.password).toEqual("nishan00!78")
                expect(updatedUser.phone).toEqual(9870145633)
            })
        })
    })
})