require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')






const app = express()




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


