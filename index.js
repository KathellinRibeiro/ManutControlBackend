require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();
app.use(cors())
app.use(express.json());

const routesSensor = require('./routes/database.js');
const routesEquipamento = require('./routes/databaseEquipamento.js');


app.use('/api/sensor/', routesSensor);
app.use('/api/equipamento/', routesEquipamento);
app.use('/static', express.static(path.join(__dirname, 'www')))

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})