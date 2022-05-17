const {model, Schema} = require('mongoose')
const bcryptjs = require('bcryptjs')
const userSchema = Schema({
  
    email : String,
    password : String,
    token : String,
    expiration : Date
})

userSchema.pre('save',function(next){
    if(!this.isModified('password')){
        console.log('ya esta modificado')
        next()
    }
    console.log('aun no')
    const hash = bcryptjs.hashSync(this.password, bcryptjs.genSaltSync())
    this.password = hash
    next()
})

module.exports = model('User',userSchema)