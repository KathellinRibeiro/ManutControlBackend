require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const mongoString = process.env.DATABASE_URL;
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');

const swaggerFile = require('./swagger_output.json');


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

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const routesSensor = require('./routes/database.js');
const routesEquipamento = require('./routes/databaseEquipamento.js');
const routesCriticidade = require('./routes/databaseCriticidade.js');
const routesSetor = require('./routes/databaseSetor.js');
const routesStatus = require('./routes/databaseStatus.js');
const routesAlerta = require('./routes/databaseAlerta.js');
const routesIndicadores = require('./routes/databaseIndicadores.js');
const routesUsuario = require('./routes/databaseUsuario.js');

app.use('/api/sensor/', routesSensor);
app.use('/api/equipamento/', routesEquipamento);
app.use('/api/criticidade/', routesCriticidade);
app.use('/api/setor/', routesSetor);
app.use('/api/status/', routesStatus);
app.use('/api/alerta/', routesAlerta);
app.use('/api/indicadores/', routesIndicadores);
app.use('/api/usuario/', routesUsuario);



app.use('/static', express.static(path.join(__dirname, 'www')))

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})