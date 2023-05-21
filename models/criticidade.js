
const mongoose = require('mongoose');

const criticidadeSchema = new mongoose.Schema({
      Descricao: {
        required: true,
        type: String
    },
}, { collection: 'criticidade' }
);

module.exports = { Mongoose: mongoose, CriticidadeSchema: criticidadeSchema }