const express = require('express');
const db = require("../models/alerta");
const Model = db.Mongoose.model('alerta', db.AlertaSchema, 'alerta');
const router = express.Router();
var dataFinal = new Array;


//Post Method
router.post('/post', async (req, res) => {
    const data = new Model({
        name: req.body.name,
        metric: req.body.metric
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get all Method
router.get('/getAll', async (req, res) => {
    try {
        const data = await Model.find();

        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get all Method
router.get('/getRegistros', async (req, res) => {
    try {
        const data = await Model.distinct('nameSensor');
        data.map((item) => {
            const carregarUltimosRegistos = async () => {
                const dataSensor = [await Model.find({ "nameSensor": item }).limit(10)];
               
                dataFinal.push(...dataSensor);
            }
            carregarUltimosRegistos();
        });
        res.json(dataFinal);
        dataFinal=[];
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update by ID Method
router.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        console.log(id);
        console.log(req.body);
        const result = await Model.findOneAndUpdate(id, updatedData, options);

        console.log(JSON.stringify(result));

        console.log(result);
        res.send(JSON.stringify(result))
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;