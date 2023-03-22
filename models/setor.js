
const mongoose = require('mongoose');
 
const setorsSchema = new mongoose.Schema({
    Descricao: {
        required: true,
        type: String
    },
}, { collection: 'setors' },
{db:'manutcontroldb'}
);
 
module.exports = { Mongoose: mongoose, SetorsSchema: setorsSchema }