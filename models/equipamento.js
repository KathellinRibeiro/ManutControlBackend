
const mongoose = require('mongoose');
 
const equipamentoSchema = new mongoose.Schema({
    _id: {
        required: false,
        type: String
    },
    Descricao: {
        required: true,
        type: String
    },
    dataEntrada: {
        required: true,
        type: Date
    },
    Tag: {
        required: true,
        type: String
    },
    Status: {
        required: true,
        type: Number
    },
    Local: {
        required: true,
        type: Number
    },
    Criticidade: {
        required: true,
        type: Number
    },
}, { collection: 'equipamento' },
{db:'manutcontroldb'}
);
 
module.exports = { Mongoose: mongoose, EquipamentoSchema: equipamentoSchema }