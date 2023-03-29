
const mongoose = require('mongoose');

const criticidadeSchema = new mongoose.Schema({
    _id: {
        required: false,
        type: String
    },
    Descricao: {
        required: true,
        type: String
    },
}, { collection: 'criticidade' },
    { db: 'manutcontroldb' }
);

module.exports = { Mongoose: mongoose, CriticidadeSchema: criticidadeSchema }