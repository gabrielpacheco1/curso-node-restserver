const {response, request}= require('express')
const bcryptjs = require('bcryptjs')

const Usuario= require('../models/usuario');

const usuariosGet= async(req= request, res= response) => {

    const {limite= 5, desde= 0}= req.query;
    const query= {estado: true}

    const [total, usuarios]= await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    
    /* const usuarios= await Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))

    const total= await Usuario.countDocuments(query) */        

    res.json({
        total,
        usuarios
    })

    
}

const usuariosPost = async (req, res= response) => {


    const {nombre, correo, password, rol}= req.body //extrae el cuerpo de la peticion. Probar enviando en postman
                                    //solo se van a recibir esas
                                    //4 propiedades, ignorando si se envia algo mas

    const usuario= new Usuario({nombre, correo, password, rol})

    //verificar si el correo existe
    

    //encriptar la contraseña
    const salt= bcryptjs.genSaltSync()
    usuario.password= bcryptjs.hashSync(password, salt)

    //guardar en bd
    await usuario.save()

    res.json({
        usuario
    })
}

const usuariosPut =async (req, res= response) => {
    const {id}= req.params
    const {_id, password, google, correo, ...resto}= req.body //excluyendo datos para no actualizarlos

    //Validar contra BD
    if (password) {
        //Encriptar la contraseña
        const salt= bcryptjs.genSaltSync()
        resto.password= bcryptjs.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json(usuario)
}

const usuariosPatch =(req, res= response) => {
    res.json({
        msg: 'Patch API - controller'
    })
}

const usuariosDelete = async(req, res= response) => {
    
    const {id}= req.params

    //Borrar fisicamente
    //const usuario= await Usuario.findByIdAndDelete(id)
    
    const usuario= await Usuario.findByIdAndUpdate(id, {estado: false})

    res.json({
        usuario
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}