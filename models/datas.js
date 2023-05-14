const mongoose = require('mongoose');
 
const datasSchema = new mongoose.Schema({
    time: {
        required: true,
        type: String
    },
    metric: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String    }

}, { collection: 'datas' },
{db:'manutcontroldb'}
);
 
module.exports = { Mongoose: mongoose, DatasSchema: datasSchema }

