
const mongoose = require('mongoose');
 
const usuarioSchema = new mongoose.Schema({
    Nome: {
        required: true,
        type: String
    },
    Email: {
        required: true,
        type: String
    },
    Senha: {
        required: true,
        type: String
    },
    Salt: {
        required: false,
        type: String
    }
}, { collection: 'usuario' },
{db:'manutcontroldb'}
);
 
module.exports = { Mongoose: mongoose, UsuarioSchema: usuarioSchema }