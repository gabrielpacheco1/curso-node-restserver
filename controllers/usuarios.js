const {response, request}= require('express')

const usuariosGet =(req= request, res= response) => {

    const {edad= 25, apikey, page= 1, limit= 10}= req.query;

    res.json({
        msg: 'Get API - controller',
        edad,
        apikey,
        page,
        limit
    })
}

const usuariosPost =(req, res= response) => {

    const {nombre, edad}= req.body //extraigo el cuerpo de la peticion. Probar enviando en postman
                                    //Es una forma de valida, ya que solo voy a enviar esas
                                    //2 propiedades, ignorando si envia algo mas
    res.json({
        msg: 'Post API - controller',
        nombre,
        edad
    })
}

const usuariosPut =(req, res= response) => {
    const id= req.params.id
    
    res.json({
        msg: 'Put API - controller',
        id
    })
}

const usuariosPatch =(req, res= response) => {
    res.json({
        msg: 'Patch API - controller'
    })
}

const usuariosDelete =(req, res= response) => {
    res.json({
        msg: 'Delete API - controller'
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}