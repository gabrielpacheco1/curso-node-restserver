const { response } = require("express")


const adminRole = (req, res= response, next) => {
    
    if(!req.usuarioAuth){
        return res.status(500).json({
            msg: 'Validar el token antes de verificar el rol del usuario'
        })
    } 
    
    const {rol, nombre}= req.usuarioAuth
    //console.log(rol)
    if(rol!=='ADMIN_ROLE'){
        return res.status(401).json({
            msg: 'Debe ser usuario administrador para realizar esta acción'
        })
    }
    
    next()
}

tieneRole = (...roles) => {
    
    return (req, res= response, next) => {
        
        if(!req.usuarioAuth){
            return res.status(500).json({
                msg: 'Validar el token antes de verificar el rol del usuario'
            })
        } 

        if(!roles.includes(req.usuarioAuth.rol)){
            return res.status(401).json({
                msg: `Debe ser [ ${roles} ] para realizar esta acción`
            })
        }

        next()
    }
    
}

module.exports= {
    adminRole,
    tieneRole
}