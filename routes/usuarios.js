const {Router} = require('express')
const { check } = require('express-validator')
const { 
    usuariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosDelete, 
    usuariosPatch } = require('../controllers/usuarios')
const { roleValido, emailExiste, existeUsuarioId } = require('../helpers/db-validators')
const { validarCampos } = require('../middlewares/validar-campos')

const router= Router()

router.get('/', usuariosGet)

router.post('/', [ //el segundo argumento son middlewares (en caso de haber 3)
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min:6}),
    // check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( roleValido),
    validarCampos

], usuariosPost)

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioId),
    check('rol').custom( roleValido),
    validarCampos
], usuariosPut)

router.patch('/', usuariosPatch)

router.delete('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioId),
    validarCampos
], usuariosDelete)

module.exports= router