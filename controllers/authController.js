const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const { promisify } = require('util')
const { addAbortSignal } = require('stream')
const { ok } = require('assert')

//metodo para registrar
exports.register = async (req, res) => {
    try {
        const user = req.body.user
        const password = req.body.password
        const name = req.body.name
        let passHash = await bcryptjs.hash(password, 8)
        /*conexion.query('INSERT INTO users SET ?', {user: user, name: name, pass:passHash}, (error,results)=>{
            if(error){console.log(error)}
            res.redirect('/')
        })*/
        console.log(name)
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}

exports.login = async (req, res) => {
    try {
        const user = req.body.user
        const password = req.body.password
        if(!user || !password){
            res.render('login')
            console.log('no pusiste nada')
        }else{
            conexion.query('SELECT * FROM useres WWHERE user = ?', [user], async (error, results)=>{
                if(results.length == 0 || !(await bcryptjs.compare(password, results[0].password))){
                    console.log('contraseña incorrecta')
                }else{
                    console.log('logeaste ok')

                    const id= results[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRACION
                    } )
                    //aca configuro las cookies
                    const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 *60 * 60 * 1000),
                        httpOnly : true                        
                    }
                    res.cookie('jwt', token, cookiesOptions)
                    res.render('login')
                }
            })
        }
        
    } catch (error) {
        console.log(error)
    }
}

exports.isAuthenticated = async (req, res, next)=>{
    if(req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM users WHERE id = ?'), [decodificada.id], (error, results)=>{
                if(!results){return next()}
                req.user = results[0]
                return next()
            }
        } catch (error) {
            console.log(error)
            return next()
        }
    }else {
        res.redirect('/login')
    }
}

exports.logout = (req,res) =>{
    res.clearCookie('jwt')
    return res.redirect('/')
}