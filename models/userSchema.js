const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
name:{
    type:String,
    required:[true,'name is required']
},
email:{
    type:String,
    unique:[true,'user allready exist'],
    required:[true,'email is required']
},
password:{
    type:String,
    required:[true,'password is required']
}
})

module.exports = mongoose.model('user',userSchema)