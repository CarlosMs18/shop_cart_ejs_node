const User = require('../models/user')
const passport = require('passport')
const crypto = require('crypto')
const {validationResult} = require('express-validator')
exports.signup = (req, res , next) => {
    let message = req.flash('error')
    if(message.length > 0){
        message = message[0]
    }else{
        message =null
    }
    
    res.render('auth/signup',{
        pageTitle : 'Sign Up',
        errorMessage : message,
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
    console.log(errors)
    if(!errors.isEmpty()){
        return res.render('auth/signup',{
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
    
    const emailExist = await User.findOne({email})
    if(emailExist){
        req.flash('error','El email ya se encuentra en uso')
        return res.redirect('/auth/signup')
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
        errorMessage : message,
    })
}


exports.autenticarUsuario  = passport.authenticate('local',{
    
    successRedirect : '/',
    failureRedirect : '/auth/signin',
    failureFlash : true,
    badRequestMessage : 'Ambos campos son obligatorios'
})


exports.logout = (req, res , next) => {
    req.logout()
    res.redirect('/auth/signin')
}


exports.resetPassword =(req, res , next) => {
    let message = req.flash('error')
    if(message.length > 0){
        message = message[0]
    }else{
        message = ''
    }
    
    res.render('auth/reset-password',{
        pageTitle : 'Reset Password',
        path : '',
        errorMessage : message
    })
}


 
exports.postresetPassword = async(req, res , next) => {
    const email = req.body.email
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.render('auth/reset-password',{
            pageTitle : 'Reset-password',
            path : '',
            errorMessage : errors.array()[0].msg
        })
    }

   

    try {
        const user = await User.findOne({
            email
        })
    
        if(!user){
            req.flash('error','El usuario no existe')
            return res.redirect('/auth/reset-password')
        }

        user.token = crypto.randomBytes(20).toString('hex')
        user.expiration = Date.now() + 360000

    
        await user.save()

        const resetUrl = `http://${req.headers.host}/auth/reset-password/${user.token}`

        console.log(resetUrl)

        res.redirect('/auth/signin')
    } catch (error) {
        console.log(error)
    }
}

exports.formNewPassword = async(req, res , next) => {
        const token = req.params.token

        const user = await User.findOne({
            token
        })
       
        if(!user){
            req.flash('error','Sucedio un ERROR, solicite una nueva contraseña  de nuevo')
            return res.redirect('/auth/signin')
        }

        res.render('auth/new-password',{
            pageTitle : 'New Password',
            token,
            path : '',
            errorMessage : ''
        })
}

exports.postnewPassword = async(req, res , next) => {
        const token = req.body.tokenPassword    
        const password = req.body.password

        const errors = validationResult(req)
        
        if(!errors.isEmpty()){
            return res.render('auth/new-password',{
                pageTitle : 'New Password',
                token,
                path : '',
                errorMessage :errors.array()[0].msg,
                 
            })
        }
        const user = await User.findOne({token})
        if(!user){
            req.flash('error','Hubo un problema, vuelva a recargar la pagina')
            return res.redirect('/auth/signin')
        }
        console.log('a')
        try {
            
            user.password = password
            user.token = undefined
            user.expiration = undefined

            await user.save()
            console.log(user)
            res.redirect('/auth/signin')
        } catch (error) {
            console.log(err)
        }

        
}