const Role = require('../models/role')
const Usuario= require('../models/usuario');

const roleValido = async (rol='') => { //recibe como argumento el rol que recibo del body
    const existeRol= await Role.findOne({rol})
    if(!existeRol){
        throw new Error(`El rol ${rol} no existe en la BD`)
    }
}

const emailExiste = async (correo= '') => {
    const existeEmail= await Usuario.findOne({correo})
        if (existeEmail) {
            /* return res.status(400).json({
                msg: 'el correo ya está registrado'
            }) */
            throw new Error(`El correo ${correo} ya está registrado en la BD`)
        }
}

const existeUsuarioId = async (id) => {
    const existeUsuario= await Usuario.findById(id)
        if (!existeUsuario) {
            throw new Error(`El ID ${id} no está registrado en la BD`)
        }
}

module.exports= {
    roleValido,
    emailExiste,
    existeUsuarioId
}