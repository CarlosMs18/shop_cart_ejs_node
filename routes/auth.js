const authController = require('../controllers/auth')
const {check} = require('express-validator')
const Router = require('express')
const router = Router()

router.get('/signup',authController.signup)


router.post('/signup',[
    check('email','El email ingresado no es valido')
    .isEmail()
    .normalizeEmail(),
    check('password','El password debe de tener un minimo de 5 caracteres')
    .isLength({min : 5})
    .trim(),
    check('confirmPassword')
    .custom((value, {req})=> {
        if(value !== req.body.password){
            throw new Error('Las contraseñas no coinciden')
        }
        return true
    })
],
authController.postsignup)

router.get('/signin',authController.signin)

router.post('/signin',authController.autenticarUsuario)

router.get('/reset-password',authController.resetPassword)

router.post('/reset-password',[
    check('email','Debe de ingresar un email valido')
    .isEmail()
    .normalizeEmail()
],authController.postresetPassword)


router.get('/reset-password/:token',authController.formNewPassword)

router.post('/new-password',[
    check('password','El password debe de tener un minimo de 5 caracteres')
    .isLength({min : 5})
    .trim(),
],authController.postnewPassword)
module.exports = router