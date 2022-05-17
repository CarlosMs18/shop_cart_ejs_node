const authController = require('../controllers/auth')
const Router = require('express')
const router = Router()

router.get('/signup',authController.signup)

module.exports = router