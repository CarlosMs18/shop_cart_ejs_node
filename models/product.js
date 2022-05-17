const {model, Schema} = require('mongoose')

const productSchema = Schema({
    title :{
        type : String,
        required :true
    },
    image : String,
    price : {
        type : Number,
        required :true
    },
    description: {
        type:String,
        required : true
    },
    userId : {
        type :Schema.Types.ObjectId,
        ref : 'User',
        required :true
    }
})

module.exports = model('Product',productSchema)