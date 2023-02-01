const {Router} = require('express')
const { check } = require('express-validator')

const { crearCategoria, getCategorias, getCategoria, actualizarCategoria, deleteCategoria } = require('../controllers/categorias')
const { existeCategoria } = require('../helpers/db-validators')
const { validarCampos, validarJWT, adminRole } = require('../middlewares/')


const router= Router()


//obtener categorias - publico
router.get('/', getCategorias)

//obtener una categoria por id
router.get('/:id', [
    check('id', 'Id inválido').isMongoId(),
    check('id').custom(existeCategoria), //crear middleware LISTOOOOOO
    validarCampos,
], getCategoria)

//crear categoria - privado
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es olbigatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

//ACTUALIZAR - ID - privado
router.put('/:id', [
    validarJWT,
    check('id').custom(existeCategoria),
    validarCampos
], actualizarCategoria)

//Borrar una categoria - admin (MARCAR ESTADO COMO FALSE)
router.delete('/:id', [
    validarJWT,
    adminRole,
    check('id').custom(existeCategoria),
    validarCampos
], deleteCategoria)

module.exports= router