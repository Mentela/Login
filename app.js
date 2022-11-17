const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

const app = express()
 
//seteando motor de plantillas

app.set('view engine', 'ejs')

//seteo la carpeta public para archivos estaticos

app.use(express.static('public'))

//para procesar los datos enviados desde forms

app.use(express.urlencoded({extended:true}))
app.use(express.json())

//seteamos variables de entorno

dotenv.config({path: './env/.env'})

//para poder trabjar con cookies

app.use(cookieParser())

app.use('/', require('./routes/router'))

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> {
    console.log('arranco el server en el puerto')
})