const express = require('express');
const db = require("../models/usuario");
const Model = db.Mongoose.model('usuario', db.UsuarioSchema, 'usuario');
const router = express.Router();
var crypto = require('crypto');

function gerarSalt() {
    return crypto.randomBytes(16).toString('hex');
};

function sha512(senha, salt) {
    var hash = crypto.createHmac('sha512', salt); // Algoritmo de cripto sha512
    hash.update(senha);
    var hash = hash.digest('hex');
    return {
        salt,
        hash,
    };
};

function gerarSenha(senha) {
    var salt = gerarSalt(16); // Vamos gerar o salt
    var senhaESalt = sha512(senha, salt); // Pegamos a senha e o salt
    // A partir daqui você pode retornar a senha ou já salvar no banco o salt e a senha
    console.log('Senha Hash: ' + senhaESalt.hash);
    console.log('Salt: ' + senhaESalt.salt);

    return senhaESalt;
}

function login(senhaDoLogin, saltNoBanco, hashNoBanco) {
    var senhaESalt = sha512(senhaDoLogin, saltNoBanco)
    return hashNoBanco === senhaESalt.hash;
}

//Post Method
router.post('/post', async (req, res) => {
    let validaCadastro = false;
    var senhaESalt = gerarSenha(req.body.Senha);
    const data = new Model({
        Nome: req.body.Nome,
        Email: req.body.Email,
        Senha: senhaESalt.hash,
        Salt: senhaESalt.salt
    })
    const emailExiste = await Model.find({ "Email": req.body.Email });
    console.log(emailExiste)
    if (emailExiste) {
        res.json(false)
    }

    else {

        try {
            const dataToSave = await data.save();
            res.json(true);
            // res.status(200).json(dataToSave)
        }
        catch (error) {
            res.status(400).json({ message: error.message })
        }
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
router.get('/getTest', async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID Method
router.get('/getLogin/:email/:senha', async (req, res) => {
    try {
        let validLogin = false;
        const email = req.params.email;
        const senha = req.params.senha;
        const data = await Model.findOne({ "Email": email });
        if (data) {
            const hash = data.Senha;
            const salt = data.Salt;
            validLogin = login(senha, salt, hash)
        }
        console.log(validLogin)

        res.json(validLogin)
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
        const result = await Model.findByIdAndUpdate(id, updatedData, options);

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