
const mongoose = require('mongoose');
 
const setorsSchema = new mongoose.Schema({
    _id: {
        required: false,
        type: String
    },
    Nome: {
        required: true,
        type: String
    },
}, { collection: 'setors' },
{db:'manutcontroldb'}
);
 
module.exports = { Mongoose: mongoose, SetorsSchema: setorsSchema }