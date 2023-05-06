const express = require('express');
const db = require("../models/alerta");
const Model = db.Mongoose.model('alerta', db.AlertaSchema, 'alerta');
const router = express.Router();
const moment = require("moment");
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
router.get('/getIndicadores', async (req, res) => {
    try {
        let mesAno = moment().format("YYYY-MM");
        let dataInicial = moment().format("YYYY-MM") + '-01';
        let dataBusca = dataInicial;
        let timeTotal = moment(dataInicial);

        let dataMax;
        let dateFinal = moment().format("YYYY-MM-DD");
        // console.log(dataInicial);
        //console.log(dateFinal);

        const resposta = await fetch('https://elekto.com.br/api/Calendars/br-BC/Delta?initialDate=' + dataInicial + '&finalDate=' + dateFinal + '&type=financial');
        const dataMes = await Model.find({ "time": new RegExp(mesAno + '.*') });

        dataMinMax = [];
        if (dataBusca <= dateFinal) {
            const newData = dataMes.filter(
                function (item) {
                    if (item.time) {
                        const itemData = item.time.toUpperCase();
                        const textData = dataBusca.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                });

            newData.map((item) => {
                /// console.log(item.time)
                let dataPush = moment(item.time, ["MM-DD-YYYY HH:mm", "YYYY-MM-DD HH:mm"]).isValid();;
                //.format("YYYY-MM-DD HH:mm");
                if (dataPush)
                    dataMinMax.push(moment(item.time, ["YYYY-MM-DD HH:mm"]));
            })


            dataBusca = moment(dataBusca).add(1, 'days').format("YYYY-MM-DD");

            var hora = moment.min(dataMinMax).format("HH")
            var min = moment.min(dataMinMax).format("mm")
            var max = moment.max(dataMinMax).format("YYYY-MM-DD HH:mm")

            var subMin = moment.max(dataMinMax).subtract({ hours: hora, minutes: min }).format("mm");
            var subHH = moment.max(dataMinMax).subtract({ hours: hora, minutes: min }).format("HH");
            timeTotal = moment(timeTotal).add({ hours: subHH, minutes: subMin }).format("HH:mm");
            console.log(timeTotal)
        }


        /*   let dataPush = moment(itemData1.time, ["MM-DD-YYYY HH:mm", "YYYY-MM-DD HH:mm"]);;
          //.format("YYYY-MM-DD HH:mm");
          if (dataPush !== 'Invalid date')
              dataMinMax.push(dataPush); */



        /*      var min = moment.min(dataMinMax);
             console.log(min)
             var max = moment.max(dataMinMax);
             console.log(max) */

        /// res.json(data)

        ///   console.log(dataMes);
        const app = await resposta.json();
        let timeWprkDays = app.WorkDays * 24
        moment().hours(timeTotal);
        console.log(  moment().hours(timeTotal))
        res.json(app);
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