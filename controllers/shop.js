const Product = require('../models/product')
const User = require('../models/user')
const Order = require('../models/order')
exports.home = async(req, res , next) => {
    
   let message = req.flash('error')
   if(message.length > 0){
       message = message[0]
   }else{
       message = ''
   }
    const products = await Product.find()
    res.render('shop/index',{
        pageTitle : 'Home',
        path : '/',
        products,
        errorMessage : message
    })
}

exports.productIndex = async(req, res , next) => {

    const products = await Product.find()
    res.render('shop/products-index',{
        pageTitle : 'Products',
        path : '/products',
        products
    })
}


exports.productDetail = async(req, res , next) => {
    const productId = req.params.productId

    const product = await Product.findById(productId)
    if(!product){
        return res.redirect('/')
    }
    res.render('shop/product-detail',{
        pageTitle : product.title,
        path : '/product/detail',
        product
    })
}


exports.addtoCart = async(req, res , next) => {
    const prodId = req.body.productId
    const product = await Product.findById(prodId)

    if(!product){
        req.flash('error','El producto no existe')
        return res.redirect('/')
    }
    const user = await User.findById(req.user._id)
    try {
        await user.addtoCart(product)
        res.redirect('/')
     
    } catch (error) {
        console.log(error)
    }
}


exports.getCart = async(req, res , next) => {
    const user = await User.findById(req.user._id)
    const items = await user.populate('cart.items.productId')
    const products = user.cart.items
        res.render('shop/cart',{
            pageTitle : 'Cart',
            path : '/cart',
            products
        })
}

exports.deleteProductCart = async(req, res , next) => {
    const productId = req.params.prodId
    
    const product = await Product.findById(productId)
    if(!product){
        return res.redirect('/cart')
    }
  
    const user = await User.findById(req.user._id)
    try {
        user.deleteItemCart(productId)
        res.redirect('/cart')
    } catch (error) {
        console.log(error)
    }
}


exports.createOrder = async(req, res , next) => {
    const user = await User.findById(req.user._id)

    
    const items = await user.populate('cart.items.productId')
    const products = user.cart.items

    if(!user){
        return res.redirect('/cart')
    }

    const productsOrder = products.map(e => {
        
        return {product : {...e.productId._doc}, quantity : e.quantity}
    })
    console.log(productsOrder)

    try {
        const order =new Order({
            products : productsOrder,
            user: {
                email : user.email,
                userId : user._id
    
            }
        })
    
        await order.save()
    
    } catch (error) {
        console.log(error)
    }
   
}

exports.getOrders = async(req, res , next) => {
        const orders = await Order.find({'user.userId': req.user._id})
        
        res.render('shop/order',{
            pageTitle : 'Order',
            path : '/order',
            orders
        })
}