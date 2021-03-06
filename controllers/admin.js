const {validationResult} = require('express-validator')
const res = require('express/lib/response')
const Product = require('../models/product')
const fs = require('fs')


exports.formaddProduct = (req, res, next) => {
    
    res.status(200).render('admin/add-product',{
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
        return res.status(422).render('admin/add-product',{
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
        return res.status(422).render('admin/add-product',{
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
    } catch (err) {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     }

}

exports.adminProduct = async(req, res , next) => {

    const products = await Product.find({
        userId : req.user._id
    })
    
    res.status(200).render('admin/products',{
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

        res.status(200).render('admin/edit-product',{
            pageTitle : product.title,
            path : '/admin/edit-product',

            errorMessage :'',
            product
        })
        
}

exports.postEditProduct = async(req, res , next) => {
        const title = req.body.title
        const price = req.body.price
        const description = req.body.description
        const imageBody = req.file


        const prodId = req.params.idProduct
        const product = await Product.findOne({id : prodId, userId : req.user._id})

        if(!product){
            return res.redirect('/admin/products')
        }

        
    

        
        const errors = validationResult(req)
        if(!errors.status(422).isEmpty()){
            return res.render('admin/edit-product',{
                pageTitle : product.title,
                path : '/admin/edit-product',
                errorMessage : errors.array()[0].msg,
                product 
            })
        }


       
        try {
            product.title = title
            product.price = price
            product.description = description

            
            if(imageBody){
                fs.unlinkSync(product.image)
                product.image = imageBody.path
            }
            await product.save()
            res.redirect('/admin/products')
            
        } catch (err) {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
         }
}


exports.postDeleteProduct = async(req, res, next) => {
        const prodId = req.params.productId

        const product = await Product.findOne({id : prodId , userId : req.user._id})

        if(!product){
            return res.redirect('/admin/products')
        }

        try {
            fs.unlinkSync(product.image)
            await Product.deleteOne({id:prodId, userId:req.user._id})
            return res.redirect('/admin/products')
        } catch (err) {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
         }
}