const Router = require('express')
const router = Router()
const shopRoutes = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

router.get('/',shopRoutes.home)

router.get('/product/:productId',shopRoutes.productDetail)

router.get('/products',shopRoutes.productIndex)

router.post('/cart',isAuth,shopRoutes.addtoCart)

router.get('/cart',isAuth, shopRoutes.getCart)


router.post('/cart-delete-item/:prodId',isAuth,shopRoutes.deleteProductCart)

router.post('/create-order',isAuth,shopRoutes.createOrder)

router.get('/orders',isAuth,shopRoutes.getOrders)


router.get('/orders/:orderId',isAuth,shopRoutes.getInvoce)
module.exports = router