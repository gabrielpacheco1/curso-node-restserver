const express = require('express')
const cors= require('cors') //ayuda a restringir los dominios que pueden usar la API
const { dbConnection } = require('../database/config')

class Server {

    constructor() {
        this.app = express()
        this.puerto= process.env.PORT
        
        this.path= {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
        }


        //Conectar a BD
        this.conectarDB()

        //Middlewares
        this.middlewares()

        //Rutas de la app
        this.routes()
    }

    async conectarDB(){
        await dbConnection()
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
        this.app.use(this.path.auth, require('../routes/auth'))
        this.app.use(this.path.buscar, require('../routes/buscar'))
        this.app.use(this.path.categorias, require('../routes/categorias'))
        this.app.use(this.path.productos, require('../routes/productos'))
        this.app.use(this.path.usuarios, require('../routes/usuarios'))
    }

    listen() {
        this.app.listen(this.puerto, () => {
            console.log(`Example app listening on port ${this.puerto}`)
        })
    }
}

module.exports= Server;