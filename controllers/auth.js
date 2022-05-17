const User = require('../models/user')
const {validationResult} = require('express-validator')
exports.signup = (req, res , next) => {
    res.render('auth/signup',{
        pageTitle : 'Sign Up',
        errorMessage : '',
        oldInput : '',
        validationErrors : []
    })
}


exports.postsignup = async(req, res , next) => {

    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword

    const errors = validationResult(req)
   
    if(!errors.isEmpty()){
        res.render('auth/signup',{
            pageTitle : 'Sign Up',
            errorMessage : errors.array()[0].msg,
            validationErrors : errors.array(),
            oldInput : {
                email,
                password,
                confirmPassword
            }
        })
    }

    console.log(password)
    try {
        const user = new User({
            email,
            password
        })

        await user.save()
        res.redirect('/auth/signin')
        
    } catch (error) {
        console.log(error)
    }

    
    
}
