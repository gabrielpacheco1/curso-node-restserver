const bcryptjs= require('bcryptjs')
const { response } = require("express");

const { generarJWT } = require('../helpers/generar-jwt');
const Usuario= require('../models/usuario');

const login = async(req, res= response) => {

    const {correo, password}= req.body

    try {

        //verficar si el correo existe
        const usuario= await Usuario.findOne({correo})
        if(!usuario){
            return res.status(400).json({
                msg: `Usuario / password no son correctos. El correo ${correo} no está registrado`
            })   
        }

        //verificar si el user está activo
        if (!usuario.estado){
            return res.status(400).json({
                msg: `El usuario con el correo ${correo} no está activo`
            })   
        }

        //verificar la contraseña
        const contraseñaValida= bcryptjs.compareSync(password, usuario.password)
        
        if (!contraseñaValida){
            return res.status(400).json({
                msg: `La contraseña es incorrecta`
            })   
        }

        //generar el JWT
        const token= await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status.apply(500).json({
            msg: 'Comuniquese con el administrador'
        })
    }
}

module.exports= {
    login
}