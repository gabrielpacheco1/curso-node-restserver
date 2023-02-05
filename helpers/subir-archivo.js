const { v4: uuidv4 } = require('uuid')
const path= require('path')

const subirArchivo = (files, extPermitidas = ['png','jpg', 'jpeg', 'gif'], carpeta= '') => {

    return new Promise ((resolve, reject)=>{

        const {archivo} = files

        const nombreCortado= archivo.name.split('.')
        const extension= nombreCortado[nombreCortado.length-1].toLowerCase()
    
        //validar la extension
        if(!extPermitidas.includes(extension)){
            return reject(`ERROR. Los tipos de archivos permitidos son: ${extPermitidas}`)
        }
    
        const nombreTemp= uuidv4() + '.' + extension;
        const uploadPath = path.join (__dirname, '../uploads/', carpeta, nombreTemp);
    
        archivo.mv(uploadPath, (err) => { //mover archivo
            if (err) {
                reject (err);
            }
    
            resolve(nombreTemp);
        });
    })

}

module.exports = {
    subirArchivo
}