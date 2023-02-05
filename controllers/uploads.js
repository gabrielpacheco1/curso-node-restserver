const path= require('path')
const fs= require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { response } = require("express");
const {subirArchivo} = require("../helpers");

const { Usuario, Producto } = require("../models");


const cargarArchivo = async(req, res= response) => {

    try {
        //const nombre= await subirArchivo(req.files, ['txt'], 'imgs')
        console.log(req.files)
        const nombre= await subirArchivo(req.files, ['txt'], 'imgs')
    
        res.json({
            nombre
        })
        
    } catch (error) {
        res.json(error)
    }
 
}

const actualizarImagen = async(req, res= response) => {

    const {id, coleccion}= req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo= await Usuario.findById(id)   
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe el usuario con el ID ${id}`
                })
            }    
            break;
        case 'productos':
            modelo= await Producto.findById(id)   
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe el producto con el ID ${id}`
                })
            }     
            break;
    
        default:
            return res.status(500).json({msg: 'No se validó esto'})
    }


    //limpiar imagenes previas
    if(modelo.img){
        //borrar la img del servidor
        const pathImagen= path.join(__dirname, '../uploads', coleccion, modelo.img) 
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen)
        }
    }


    try {
        const nombre= await subirArchivo(req.files, ['png','jpg', 'jpeg', 'gif'], coleccion)
        modelo.img= nombre
    
        await modelo.save()
    
        res.json(modelo)
        
    } catch (error) {
        res.json(error)
    }
        
}

const mostrarImagen = async(req, res= response) => {

    const {id, coleccion}= req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo= await Usuario.findById(id)   
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe el usuario con el ID ${id}`
                })
            }    
            break;
        case 'productos':
            modelo= await Producto.findById(id)   
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe el producto con el ID ${id}`
                })
            }     
            break;
    
        default:
            return res.status(500).json({msg: 'No se validó esto'})
    }


    if(modelo.img){
        //borrar la img del servidor
        const pathImagen= path.join(__dirname, '../uploads', coleccion, modelo.img) 
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen)
        }
    }

    const nombreNoImagen= 'No-image-found.jpg'
    const pathNoImagen= path.join(__dirname, '../assets', nombreNoImagen)
    res.sendFile(pathNoImagen)
}

const actualizarImagenCloudinary = async(req, res= response) => {

    const {id, coleccion}= req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo= await Usuario.findById(id)   
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe el usuario con el ID ${id}`
                })
            }    
            break;
        case 'productos':
            modelo= await Producto.findById(id)   
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe el producto con el ID ${id}`
                })
            }     
            break;
    
        default:
            return res.status(500).json({msg: 'No se validó esto'})
    }


    //limpiar imagenes previas
    if(modelo.img){
        const nombreArr= modelo.img.split('/')
        const nombre= nombreArr[nombreArr.length-1]
        const [public_id]= nombre.split('.')
        cloudinary.uploader.destroy(public_id)
    }

    const {tempFilePath}= req.files.archivo
    const {secure_url}= await cloudinary.uploader.upload(tempFilePath)
    
    modelo.img= secure_url
        
    await modelo.save()
    
    res.json(modelo)

    // try {

    //     const nombre= await subirArchivo(req.files, ['png','jpg', 'jpeg', 'gif'], coleccion)
    //     modelo.img= nombre
        
    //     await modelo.save()
    
        
        
    // } catch (error) {
    //     res.json(error)
    // }
      
}

module.exports= {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}