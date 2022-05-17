require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongo')




const passport = require('./config/passport')
const authRoutes = require('./routes/auth')


const app = express()

const store = new MongoStore({
    mongoUrl : process.env.MONGO_CNN,
    collectionName : 'sessions'
})

app.set('views','views')
app.set('view engine','ejs')

app.use(bodyParser.urlencoded({extended : false}))
app.use(express.static('public'))



app.use(
    session({
        secret : process.env.SECRET,
        key: process.env.KEY,
        resave :false,
        saveUninitialized : false,
        store
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())


app.use('/auth',authRoutes)

mongoose.connect(process.env.MONGO_CNN)
        .then(result =>{
            app.listen(process.env.PORT, () => {
                console.log(`Corriendo desde el puerto ${process.env.PORT}`)
            })

            console.log('Conectado con la BBDD')
            
        })
        .catch(err => {
             console.log(err)
        })


