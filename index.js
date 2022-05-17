require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')


const authRoutes = require('./routes/auth')


const app = express()

app.set('views','views')
app.set('view engine','ejs')

app.use(bodyParser.urlencoded({extended : false}))
app.use(express.static('public'))

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


