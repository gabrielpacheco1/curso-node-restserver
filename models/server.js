const express = require('express')
const cors= require('cors') //ayuda a restringir los dominios que pueden usar la API

class Server {

    constructor() {
        this.app = express()
        this.puerto= process.env.PORT || 3000;
        this.usuariosPath= '/api/usuarios'

        //Middlewares
        this.middlewares()

        //Rutas de la app
        this.routes()
    }

    middlewares(){
        //cors
        this.app.use(cors())

        //lectura y parseo del body
        this.app.use(express.json())
        
        //Directorio público
        this.app.use(express.static('public'))
    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/usuarios'))
    }

    listen() {
        this.app.listen(this.puerto, () => {
            console.log(`Example app listening on port ${this.puerto}`)
        })
    }
}

module.exports= Server;
