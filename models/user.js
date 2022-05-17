const {model, Schema} = require('mongoose')

const userSchema = Schema({
    name : String,
    email : String,
    token : String,
    expiration : Date
})

module.exports = model('User',userSchema)