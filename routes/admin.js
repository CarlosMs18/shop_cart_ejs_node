const Router = require('express')
const router = Router()
const adminController = require('../controllers/admin')

router.get('/add-product',adminController.formaddProduct)

router.post('/add-product',adminController.postAddProduct)

module.exports = router