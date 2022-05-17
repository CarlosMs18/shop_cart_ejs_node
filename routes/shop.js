const Router = require('express')
const router = Router()
const shopRoutes = require('../controllers/shop')

router.get('/',shopRoutes.home)


module.exports = router