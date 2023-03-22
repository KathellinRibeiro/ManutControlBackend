
const mongoose = require('mongoose');
 
const sensorSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    metric: {
        required: true,
        type: String
    }
}, { collection: 'sensor' },
{db:'manutcontroldb'}
);
 
module.exports = { Mongoose: mongoose, SensorSchema: sensorSchema }