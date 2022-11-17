const express = require('express')
const router = express.Router()


const authController = require('../controllers/authController')

//router para las vistas
router.get('/', authController.isAuthenticated, (req, res)=>{
    conexion()
    res.render('index', {user:req.user})
})
router.get('/login', (req, res)=>{
    res.render('login')
})
router.get('/register', (req, res)=>{
    res.render('register')
})

//router para los controllers

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)



module.exports = router