
const mongoose = require('mongoose');

const equipamentoSchema = new mongoose.Schema({
    Descricao: {
        required: true,
        type: String
    },
    dataEntrada: {
        required: false,
        type: Date
    },
    Tag: {
        required: true,
        type: String
    },
    Status:
    {
        _id: {
            required: true,
            type: String
        },
        Descricao: {
            required: true,
            type: String
        },
    }
    ,
    Local:
    {
        _id: {
            required: true,
            type: String
        },
        Descricao: {
            required: true,
            type: String
        },
    }
    ,
    Criticidade: {
        _id: {
            required: true,
            type: String
        },
        Descricao: {
            required: true,
            type: String
        },
    },

    Sensor:{

        _id: {
            required: true,
            type: String
        },
        Descricao: {
            required: true,
            type: String
        },
        metric_Inicial: {
            required: true,
            type: String
        },
        metric_Final: {
            required: true,
            type: String
        },
    },
}, { collection: 'equipamento' },
    { db: 'manutcontroldb' }
);

module.exports = { Mongoose: mongoose, EquipamentoSchema: equipamentoSchema }