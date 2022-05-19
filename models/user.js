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
    
    cart : {
        items : [
            {
                productId : {
                    type : Schema.Types.ObjectId,
                    ref: 'Product',
                    required :true
                },
                quantity :{
                    type : Number,
                    required :true
                }
            }
        ]
    },
    token : String,
    expiration : Date
})



userSchema.methods.comparePassword = function(password){
    return bcryptjs.compareSync(password, this.password)
}


userSchema.methods.addtoCart = function(product){

    const productIndex = this.cart.items.findIndex( p => {
        return product._id.toString() === p.productId.toString() 
    })

    const cartItems = [...this.cart.items]
    let newQuantity = 1
    if(productIndex >= 0){
        newQuantity = cartItems[productIndex].quantity + 1
        cartItems[productIndex].quantity =  newQuantity
    }else{
        cartItems.push({
            productId  : product._id,
            quantity : 1
        })
    }


    const newCart = {
        items: cartItems
    }

    this.cart = newCart
    return this.save()
}


userSchema.methods.deleteItemCart = function(productId){
    
    const newCartItems = this.cart.items.filter( p => {
        
        return  productId.toString() !== p.productId.toString()
        
    })
    
    this.cart.items = newCartItems
    return this.save()
}

userSchema.methods.clearCart = function(){
    this.cart = {items:[]}
    return this.save()
}
userSchema.pre('save',function(next){
    if(!this.isModified('password')){
       
        return next()
    }
    
    const hash = bcryptjs.hashSync(this.password, bcryptjs.genSaltSync())
    this.password = hash
    next()
})


module.exports = model('User',userSchema)