
const mongoose = require('mongoose');
 
const sensorSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    metric_Final: {
        required: true,
        type: String
    },
    metric_Inicial: {
        required: true,
        type: String
    }
}, { collection: 'sensor' },
{db:'manutcontroldb'}
);
 
module.exports = { Mongoose: mongoose, SensorSchema: sensorSchema }