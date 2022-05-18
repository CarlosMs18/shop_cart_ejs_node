const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user')

passport.use(
    new LocalStrategy({
        usernameField : 'email',
        passwordField  : 'password'
    },
    async(email, password, done) => {
        try {
            const user = await User.findOne({email, estado : 1})

            if(!user){
                return done(null, false,{
                    message : 'Usuario no existente'
                })
            }

            if(!user.comparePassword(password)){
                return done(null, false,{
                    message : 'Password Incorrect'
                })
            }

            return done(null, user)
        } catch (error) {
            console.log(error)
        }
    })
)

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id).exec();
    return done(null, user);
});

module.exports = passport