const {Schema, model}= require('mongoose')

const ProductoSchema= Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        required: true,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', //debe estar igual que el module.exports (model) de ese modelo
        required: true,
    },
    precio: {
        type: Number,
        default: 0

    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria', //debe estar igual que el module.exports (model) de ese modelo
        //required: true,
    },
    descripcion: {
        type: String,
    },
    disponible: {
        type: Boolean,
        default: true
    }
})

ProductoSchema.methods.toJSON= function() {
    const {__v, estado, ...data}= this.toObject()
    return data
}

module.exports= model('Producto', ProductoSchema)