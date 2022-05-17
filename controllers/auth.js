const User = require('../models/user')
const passport = require('passport')
const {validationResult} = require('express-validator')
exports.signup = (req, res , next) => {
    
    res.render('auth/signup',{
        pageTitle : 'Sign Up',
        errorMessage : '',
        oldInput : '',
        validationErrors : [],
        path : '/auth/signup'
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
            path : '/auth/signup',
            errorMessage : errors.array()[0].msg,
            validationErrors : errors.array(),
            oldInput : {
                email,
                password,
                confirmPassword
            },
            
        })
    }

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

exports.signin = (req, res , next) => {

    let message = req.flash('error')
    if(message.length > 0){
        message = message[0]
    }else{
        message =null
    }
    

    res.render('auth/signin',{
        pageTitle : 'Sign In',
        path : '/auth/signin',
        errorMessage : message
    })
}


exports.autenticarUsuario  = passport.authenticate('local',{
    
    successRedirect : '/',
    failureRedirect : '/auth/signin',
    failureFlash : true,
    badRequestMessage : 'Ambos campos son obligatorios'
})


exports.resetPassword =(req, res , next) => {
    res.render('auth/reset-password',{
        pageTitle : 'Reset Password',
        path : ''
    })
}


