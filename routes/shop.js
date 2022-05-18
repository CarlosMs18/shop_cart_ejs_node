const Router = require('express')
const router = Router()
const shopRoutes = require('../controllers/shop')

router.get('/',shopRoutes.home)

router.get('/product/:productId',shopRoutes.productDetail)

router.get('/products',shopRoutes.productIndex)
module.exports = router