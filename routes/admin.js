const Router = require('express')
const router = Router()
const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')
const {check} = require('express-validator')
const { route } = require('./shop')

router.get('/add-product',isAuth,adminController.formaddProduct)

router.post('/add-product',isAuth,[
    check('title','El titulo no puede ir vacio')
    .not().isEmpty(),
    check('price','El precio no puede ir vacio')
    .not().isEmpty(),
    check('description','La descripcion debe de tener un minimo de 5 digitos')
    .isLength({min:5})
],adminController.postAddProduct)


router.get('/products',isAuth,adminController.adminProduct)


router.get('/edit-product/:idProduct',isAuth, adminController.getEditProduct)


router.post('/edit-product/:idProduct',isAuth,[
    check('title','El titulo no puede ir vacio')
    .not().isEmpty(),
    check('price','El precio no puede ir vacio')
    .not().isEmpty(),
    check('description','La descripcion debe de tener un minimo de 5 digitos')
    .isLength({min:5})
],adminController.postEditProduct)


router.post('/delete-product/:productId',isAuth,adminController.postDeleteProduct)
module.exports = router