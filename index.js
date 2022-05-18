require('dotenv').config()
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const multer = require('multer')




const passport = require('./config/passport')

const errorController = require('./controllers/404')

const authRoutes = require('./routes/auth')
const shopRoutes = require('./routes/shop')
const adminRoutes =require('./routes/admin')


const app = express()

const store = new MongoStore({
    mongoUrl : process.env.MONGO_CNN,
    collectionName : 'sessions'
})


const fileStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        /* cb(null, path.join(__dirname, '/public','/images')) */
        cb(null, 'images')
    },
    filename : (req,file, cb) =>{
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const fileFilter = (req, file,cb) =>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true)
    }else{
        cb(null, false)
    }
    
}



app.set('views','views')
app.set('view engine','ejs')

app.use(bodyParser.urlencoded({extended : false}))
app.use(express.static('public'))

app.use('/images',express.static(path.join(__dirname, 'images')))
app.use(multer({storage : fileStorage, fileFilter}).single('image'))


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


app.use((req, res , next) => {
    res.locals.isAuthenticated = req.user
    next()
})
app.use(flash())


app.use('/auth',authRoutes)
app.use('/admin',adminRoutes)
app.use(shopRoutes)


app.use(errorController.get404)
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


