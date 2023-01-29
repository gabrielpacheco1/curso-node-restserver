const bcryptjs= require('bcryptjs')
const { response } = require("express");

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
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

const googleSignIn = async(req, res= response) => {
    const {id_token}= req.body

    try {

        const {nombre, img, correo}= await googleVerify(id_token)
        console.log(nombre, img, correo)

        let usuario= await Usuario.findOne({correo})

        if(!usuario){
            //crear usuario
            const data = {
                nombre,
                correo,
                password: '123',
                img,
                google: true
            }

            usuario= new Usuario(data)

            await usuario.save()
            console.log('SE GUARDÓ')
        }

        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el admin. Usuario bloqueado'
            })
        }

        //generar el JWT
        console.log('HOLAAAA')
        const token= await generarJWT(usuario.id)
        console.log(token)

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo validar'
        })
    }
    
}   


module.exports= {
    login,
    googleSignIn
}