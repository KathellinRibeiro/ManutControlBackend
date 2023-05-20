const express = require('express');
const db = require("../models/datas");
const dbSensor = require("../models/sensorDb");
const ModelSensor = db.Mongoose.model('sensor', dbSensor.SensorSchema, 'sensor');
const Model = db.Mongoose.model('datas', db.DatasSchema, 'datas');
const router = express.Router();
const moment = require("moment");
const { Int32 } = require('mongodb');
var dataFinal = new Array;
var dataMinMax = new Array;


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
router.get('/getIndicadorMtbf/:time?/:date?', async (req, res) => {
    try {
        const timeDisp = parseInt(req.params.time) < 1 || req.params.time ===undefined ? 8 : parseInt(req.params.time);
        const timeDispDate = parseInt(req.params.date) < 1 || req.params.date ===undefined  ? 0 : parseInt(req.params.date);

        let mesAno = moment().format("YYYY-MM");
        let dataInicial = moment().format("YYYY-MM") + '-01';
        var dataBusca = moment().format("YYYY-MM") + '-01';
        let timeTotal = dataInicial;

        let horaTotal = 0;
        let minutoTotal = 0
        let timeTotalMin = moment(dataInicial);
        let timeTotalHora = moment(dataInicial);
        let qtdParada = 0;

        let dateFinal = moment().format("YYYY-MM-DD");
        const sensor = await ModelSensor.find();
        const resposta = await fetch("https://elekto.com.br/api/Calendars/br-BC/Delta?initialDate=" + dataInicial + "&finalDate=" + dateFinal + "&type=financial", { mode: "cors" })
            .then(response => response.json())

        const dataMes = await Model.find({ "time": new RegExp(mesAno + '.*') });
        for (var i = 0; i <= resposta.WorkDays; i++) {
            dataMinMax = []; 9
            if (dataBusca <= dateFinal) {
                const newData = dataMes.filter(
                    function (item) {
                        if (item.time) {
                            const itemData = item.time.toUpperCase();
                            const textData = dataBusca.toUpperCase();
                            return itemData.indexOf(textData) > -1;
                        }
                    });
                const newDataOficial = newData.filter(
                    function (item1) {
                        if (item1.name) {
                            const itemData = item1.time.toUpperCase();
                            const textData = dataBusca.toUpperCase();
                            const index = itemData.indexOf(textData)
                            const filteredNames = sensor.filter(
                                sensores => sensores.name.includes(item1.name));
                            if (filteredNames.length > 0) {
                                let metricInicial = parseFloat(filteredNames[0].metric_Inicial);
                                let metricFinal = parseFloat(filteredNames.metric_Final);
                                if (index > -1) {
                                    if (parseFloat(item1.metric) < metricInicial || parseFloat(item1.metric) > metricFinal)
                                        return -1;
                                }
                                else
                                    return index > -1
                            }
                        }
                    });
                if (newDataOficial.length > 0)
                    qtdParada++;


                newDataOficial.map((item) => {
                    let dataPush = moment(item.time, ["MM-DD-YYYY HH:mm", "YYYY-MM-DD HH:mm"]).isValid();;
                    if (dataPush)
                        dataMinMax.push(moment(item.time, ["YYYY-MM-DD HH:mm"]));
                });
                dataBusca = moment(dataBusca).add(1, 'days').format("YYYY-MM-DD");
                var hora = moment.min(dataMinMax).format("HH")
                var min = moment.min(dataMinMax).format("mm")
                var subMin = moment.max(dataMinMax).subtract({ hours: hora, minutes: min }).format("mm");
                var subHH = moment.max(dataMinMax).subtract({ hours: hora, minutes: min }).format("HH");
                horaTotal = horaTotal + parseInt(subHH);
                minutoTotal = minutoTotal + parseInt(subMin);
            }
        }
        let timeActualDays = parseInt(timeDispDate) > 0 ? parseInt(timeDispDate) * timeDisp : parseInt(resposta.WorkDays) * timeDisp
        tempoDisponivel = ((timeActualDays - ((parseInt(minutoTotal) / 60) + parseInt(horaTotal))) / qtdParada).toFixed(2);
        porcentagemDisponibilidade = parseFloat(tempoDisponivel / timeActualDays).toFixed(4)
        const respostaFinal = [{
            tempoUtil: timeActualDays,
            disponibilidade: qtdParada === 0 ? timeActualDays : tempoDisponivel * 1,
            porcentagemDisponibilidade: qtdParada === 0 ? 0.1000 : porcentagemDisponibilidade * 1,
            mes: moment().format("MM/YYYY"),
            quantidadeQuebra: qtdParada
        }];

        res.json(respostaFinal);
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get all Method
router.get('/getRegistros', async (req, res) => {
    try {
        const data = await Model.distinct('name');
        data.map((item) => {
            const carregarUltimosRegistos = async () => {
                const dataSensor = [await Model.find({ "name": item }).limit(10)];

                dataFinal.push(...dataSensor);
            }
            carregarUltimosRegistos();
        });
        res.json(dataFinal);
        dataFinal = [];
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