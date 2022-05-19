const Product = require('../models/product')
const User = require('../models/user')
const Order = require('../models/order')
const PDFDocument = require('pdfkit');
const path = require('path')
const fs = require('fs')
exports.home = async(req, res , next) => {
  
   let message = req.flash('error')
   if(message.length > 0){
       message = message[0]
   }else{
       message = ''
   }
    const products = await Product.find()
    res.status(200).render('shop/index',{
        pageTitle : 'Home',
        path : '/',
        products,
        errorMessage : message
    })
}

exports.productIndex = async(req, res , next) => {

    const products = await Product.find()
    res.status(200).render('shop/products-index',{
        pageTitle : 'Products',
        path : '/products',
        products
    })
}


exports.productDetail = async(req, res , next) => {
    const productId = req.params.productId

    const prod = await Product.findById(productId)
    if(!prod){
        return res.redirect('/')
    }
    res.status(200).render('shop/product-detail',{
        pageTitle : prod.title,
        path : '/product/detail',
        prod
    })
}


exports.addtoCart = async(req, res , next) => {
    const prodId = req.body.productId
    const product = await Product.findById(prodId)

    if(!product){
        req.flash('error','El producto no existe')
        return res.redirect('/')
    }
    const user = await User.findOne({_id : req.user._id, estado :1})
    try {
        await user.addtoCart(product)
        res.redirect('/')
     
    } catch (err) {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     }
}


exports.getCart = async(req, res , next) => {
    const user = await User.findOne({_id : req.user._id, estado :1})
    const items = await user.populate('cart.items.productId')
    const products = user.cart.items
        res.status(200).render('shop/cart',{
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
  
    const user = await User.findOne({_id : req.user._id, estado :1})
    try {
        user.deleteItemCart(productId)
        res.redirect('/cart')
    } catch (err) {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     }
}


exports.createOrder = async(req, res , next) => {
    const user = await User.findOne({_id : req.user._id, estado :1})

    
    const items = await user.populate('cart.items.productId')
    const products = user.cart.items

    if(!user){
        return res.redirect('/cart')
    }

    const productsOrder = products.map(e => {
        
        return {product : {...e.productId._doc}, quantity : e.quantity}
    })
  

    try {
        const order =new Order({
            products : productsOrder,
            user: {
                email : user.email,
                userId : user._id
    
            }
        })
        
        await order.save()
        await user.clearCart()
        res.redirect('/orders')
    
    } catch (err) {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     }
   
}

exports.getOrders = async(req, res , next) => {
 
        const orders = await Order.find({'user.userId': req.user._id})
        let message = req.flash('error')
        if(message.length > 0 ) {
            message = message[0]
        }else{
            message = null
        }
        res.render('shop/order',{
            pageTitle : 'Order',
            path : '/order',
            orders,
            errorMessage : message
        })
}


exports.getInvoce = async(req, res , next) => {
    const orderId = req.params.orderId
    
    const order = await Order.findById(orderId)

    if(!order){
        req.flash('error','No hay ninguna solicitud de orden pendiente!')
        return res.redirect('/orders')
    }
    
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);

    const pdfDoc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'inline; filename="' + invoiceName + '"'
    );
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text('Invoice', {
      underline: true
    });
    pdfDoc.text('-----------------------');
    let totalPrice = 0;
    order.products.forEach(prod => {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc
        .fontSize(14)
        .text(
          prod.product.title +
            ' - ' +
            prod.quantity +
            ' x ' +
            '$' +
            prod.product.price
        );
    });
    pdfDoc.text('---');
    pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

    pdfDoc.end();
        
       
    

    
}