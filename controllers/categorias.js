const { response, request } = require("express");
const mongoose= require('mongoose')
const {Categoria}= require('../models')

//obtenerCategorias - paginado - mostrar total - populate (metodo mongoose)
const getCategorias= async(req= request, res= response) => {
    const {limite= 5}= req.query;
    const query= {estado: true}

    const [total, categorias]= await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .limit(Number(limite))
            .populate('usuario', ['nombre', 'correo'])
    ])      

    res.json({
        total,
        categorias
    })
}

//obtenerCategoria  - populate (metodo mongoose)
const getCategoria= async(req= request, res= response) => {
    const {id}= req.params
  
    const categoria= await Categoria.findById(id).populate('usuario', ['nombre', 'correo'])
    
    res.json({
        categoria
    })
}

const crearCategoria = async(req, res= response) => {

    const nombre= req.body.nombre.toUpperCase()

    console.log(nombre)

    const categoriaDB= await Categoria.findOne({nombre})

    if(categoriaDB){
        res.status(400).json({
            msg: `La categoria ${nombre} ya existe`
        })
    }

    const data= {
        nombre,
        usuario: req.usuarioAuth._id
    }

    const categoria= await new Categoria(data)

    await categoria.save()

    res.status(201).json(categoria)
}

//actualizarCategoria
const actualizarCategoria= async (req, res= response) => {
    const {id}= req.params
    const {estado, usuario, ...resto}= req.body

    resto.nombre= resto.nombre.toUpperCase() 


    const categoria = await Categoria.findByIdAndUpdate(id, resto)

    res.json(categoria)
}

//borrarCategoria - cambiar estado a false
const deleteCategoria = async(req, res= response) => {
    
    const {id}= req.params
    const usuario= req.usuarioAuth._id

    const categoria= await Categoria.findByIdAndUpdate(id, {estado: false})
    
    res.json({
        categoria
    })
}


module.exports= {
    crearCategoria,
    getCategorias,
    getCategoria,
    actualizarCategoria,
    deleteCategoria
}