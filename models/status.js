
const mongoose = require('mongoose');
 
const statusSchema = new mongoose.Schema({
    Descricao: {
        required: true,
        type: String
    }
}, { collection: 'status' },
{db:'manutcontroldb'}
);
 
module.exports = { Mongoose: mongoose, StatusSchema: statusSchema }