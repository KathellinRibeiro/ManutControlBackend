const mongoose = require('mongoose');
 
const alertaSchema = new mongoose.Schema({
    time: {
        required: true,
        type: String
    },
    metric: {
        required: true,
        type: String
    },
    nameSensor: {
        required: true,
        type: String    }

}, { collection: 'alerta' },
{db:'manutcontroldb'}
);
 
module.exports = { Mongoose: mongoose, AlertaSchema: alertaSchema }

