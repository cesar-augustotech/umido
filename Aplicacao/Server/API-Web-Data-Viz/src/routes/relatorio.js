const express = require('express');
const router = express.Router();

const relatorioController = require('../controllers/relatorioController');


router.get("/buscarUmidadeMediaUnidade/:unidadeAtual", function (req, res) {
    relatorioController.buscarUmidadeMediaUnidade(req, res);
});


module.exports = router;