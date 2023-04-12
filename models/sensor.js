const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    
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
})

module.exports = mongoose.model('Data', dataSchema);
1
