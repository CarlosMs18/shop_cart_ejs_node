const {validationResult} = require('express-validator')
const Product = require('../models/product')

exports.formaddProduct = (req, res, next) => {
    
    res.render('admin/add-product',{
        pageTitle : 'Add Product',
        path : '/admin/add-product',
        errorMessage : '',
        oldInput : []
    })
}

exports.postAddProduct =async( req, res, next) => {
    const title = req.body.title
    const price = req.body.price
    const description = req.body.description
    const imageBody = req.file
    
    if(!imageBody){
        return res.render('admin/add-product',{
            pageTitle : 'Add Product',
            path : '/admin/add-product',
            errorMessage : 'Es necesario añadir una imagen',
            oldInput : {
                title,
                price,
                description
            }
        })
    }
    
    const errors = validationResult(req)
    
    if(!errors.isEmpty()){
        return res.render('admin/add-product',{
            pageTitle : 'Add Product',
            path : '/admin/add-product',
            errorMessage : errors.array()[0].msg,
            oldInput : {
                title,
                price,
                description
            }
        })
    }
    
    const image = imageBody.path
    console.log(image)
    try {
        const product = new Product({
            title,
            price,
            description,
            image,
            userId : req.user._id
        })

        await product.save()
        res.redirect('/admin/products')
    } catch (error) {
        console.log(error)
    }

}

exports.adminProduct = async(req, res , next) => {

    const products = await Product.find({
        userId : req.user._id
    })
    
    res.render('admin/products',{
        pageTitle : 'Admin Products',
        path : '/admin/products',
        products
    })
}

exports.getEditProduct = async(req, res , next) => {
        const editMode = req.query.edit
        const prodId = req.params.idProduct
        if(!editMode){
            return res.redirect('/admin/products')
        }
       
        const product = await Product.findById(prodId)
        if(!product){
            return res.redirect('/admin/products')
        }

        
}