const {model, Schema} = require('mongoose')
const bcryptjs = require('bcryptjs')
const userSchema = Schema({
    
    email : {
        type : String,
        required :true
    },
    password : {
        type : String,
        required :true
    },
    estado : {
        type : Number,
        default : 0
    },
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


userSchema.methods.comparePassword = function(password){
    return bcryptjs.compareSync(password, this.password)
}
module.exports = model('User',userSchema)