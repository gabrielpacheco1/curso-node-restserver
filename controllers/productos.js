const { response, request } = require("express");
const {Producto, Categoria}= require('../models')

//obtenerProductos - paginado - mostrar total - populate (metodo mongoose)
const getProductos= async(req= request, res= response) => {
    const {limite= 5}= req.query;
    const query= {estado: true}

    const [total, productos]= await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .limit(Number(limite))
            .populate('usuario', ['nombre', 'correo'])
            .populate('categoria', 'nombre')
            
    ])      

    res.json({
        total,
        productos
    })
}

//obtenerProducto  - populate (metodo mongoose)
const getProducto= async(req= request, res= response) => {
    const {id}= req.params
  
    const producto= await Producto.findById(id)
        .populate('usuario', ['nombre', 'correo'])
        .populate('categoria','nombre')
    
    res.json({
        producto
    })
}

const crearProducto = async(req, res= response) => {

    const nombre= req.body.nombre.toUpperCase()
    const categoria= req.body.categoria.toUpperCase()

    const {precio, descripcion, estado, usuario, ...body}= req.body

    //validar si el producto no existe
    const productoDB= await Producto.findOne({nombre})

    if(productoDB){
        res.status(400).json({
            msg: `El Producto ${nombre} ya existe`
        })
    }

    //validar que la categoria existe
    const existeCat= await Categoria.findOne({nombre: categoria})

    if(!existeCat){
        res.status(400).json({
            msg: 'BAD REQUEST. No existe categoria'
        }) 
    }

    //crear data
    const data= {
        nombre,
        categoria: existeCat._id,
        precio,
        descripcion,
        usuario: req.usuarioAuth._id
    }

    const producto= await new Producto(data)

    await producto.save()
    console.log('GUARDADO EN BD')

    res.status(201).json(producto)
}

//actualizarProducto
const actualizarProducto= async (req, res= response) => {
    const {id}= req.params
    const {estado, usuario, ...resto}= req.body

    if(resto.nombre)
        resto.nombre= resto.nombre.toUpperCase() 

    const producto = await Producto.findByIdAndUpdate(id, resto)

    res.json(producto)
}

//borrarProducto - cambiar estado a false
const deleteProducto = async(req, res= response) => {
    
    const {id}= req.params
    const usuario= req.usuarioAuth._id

    const producto= await Producto.findByIdAndUpdate(id, {estado: false})
    
    res.json({
        producto
    })
}


module.exports= {
    crearProducto,
    getProductos,
    getProducto,
    actualizarProducto,
    deleteProducto
}