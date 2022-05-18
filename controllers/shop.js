const Product = require('../models/product')
exports.home = async(req, res , next) => {
    const products = await Product.find()
    res.render('shop/index',{
        pageTitle : 'Home',
        path : '/',
        products
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
