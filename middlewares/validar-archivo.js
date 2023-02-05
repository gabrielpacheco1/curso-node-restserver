const { response } = require("express")

const validarArchivo = (req, res= response, next) => {
    console.log(req)
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        return res.status(400).json({
            msg: 'No hay archivo - validarArchivo'});
        
    }
    next()
}

module.exports= {validarArchivo}