const {Router} = require('express')
const { check } = require('express-validator')

const { crearProducto, 
        getProductos, 
        getProducto, 
        actualizarProducto, 
        deleteProducto } = require('../controllers/productos')
const { existeProductoId } = require('../helpers/db-validators')
const { validarCampos, validarJWT, adminRole } = require('../middlewares/')

const router= Router()


//obtener Productos - publico
router.get('/', getProductos)

//obtener un Producto por id
router.get('/:id', [
    check('id', 'Id inválido').isMongoId(),
    check('id').custom(existeProductoId), //crear middleware LISTOOOOOO
    validarCampos,
], getProducto)

//crear Producto - privado
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria tiene un id inválido').isMongoId(),
    validarCampos
], crearProducto)

//ACTUALIZAR - ID - privado
router.put('/:id', [
    validarJWT,
    check('id', 'El id es inválido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
], actualizarProducto)

//Borrar un Producto - admin (MARCAR ESTADO COMO FALSE)
router.delete('/:id', [
    validarJWT,
    adminRole,
    check('id').custom(existeProductoId),
    validarCampos
], deleteProducto)

module.exports= router