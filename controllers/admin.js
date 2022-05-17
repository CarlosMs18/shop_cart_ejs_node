exports.formaddProduct = (req, res, next) => {
    res.render('admin/add-product',{
        pageTitle : 'Add Product',
        path : '/admin/add-product'
    })
}

exports.postAddProduct =(req, res, next) => {
        res.send('aaaa')
}