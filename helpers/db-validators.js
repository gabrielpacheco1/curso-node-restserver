const { Categoria, Role, Usuario, Producto } = require('../models');


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


const existeCategoria = async (id) => {
    const existe= await Categoria.findById(id)
        if (!existe) {
            throw new Error(`La categoria ${id} no está registrada en la BD`)
        }
}

const existeProductoId = async (id) => {
    const existe= await Producto.findById(id)
        if (!existe) {
            throw new Error(`El producto con ID: ${id} no está registrado en la BD`)
        }
}

//Validar colecciones permititas
const coleccionesPermitidas = (coleccion= '', colecciones= []) => {
    const incluida= colecciones.includes(coleccion)
    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permititda - ${colecciones}`)
    }
    return true
}

module.exports= {
    roleValido,
    emailExiste,
    existeUsuarioId,
    existeCategoria,
    existeProductoId,
    coleccionesPermitidas
}