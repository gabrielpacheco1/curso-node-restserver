const { response, request } = require('express')
const jwt= require('jsonwebtoken')

const Usuario= require('../models/usuario')

const validarJWT = async(req= request, res= response, next) => {
    const token= req.header('x-token')
    
    if (!token){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {

        const {uid}=  jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        //leer el usuario modelo
        const usuarioAuth= await Usuario.findById(uid)

        if(!usuarioAuth){
            return res.status(401).json({
                msg: 'Token inválido - Usuario no existe'
            })
        }
        
        //verificar si el usuario esta activo
        if(!usuarioAuth.estado){
            return res.status(401).json({
                msg: 'Token inválido - usuario inactivo'
            })
        }


        req.usuarioAuth= usuarioAuth
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg: 'Token inválido'
        })
    }


    
}

module.exports= {
    validarJWT
}