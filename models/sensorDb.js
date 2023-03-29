
const mongoose = require('mongoose');
 
const sensorSchema = new mongoose.Schema({
    _id: {
        required: true,
        type: Number
    },
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