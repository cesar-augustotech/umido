const express = require('express');
const router = express.Router();

const controller = require('../controllers/relatorioController');

const relatorioController = require('../controllers/relatorioController');


router.get("/buscarUmidadeMediaUnidade/:unidadeAtual", function (req, res) {
    relatorioController.buscarUmidadeMediaUnidade(req, res);
});


router.get("/buscarAlertas/:unidadeAtual", function (req, res) {
    relatorioController.buscarAlertas(req, res);
});



router.get("/buscarIncidentes/:unidadeAtual", function (req, res) {
    relatorioController.buscarIncidentes(req, res);
});



router.get("/buscarUnidadeMediaPorSemana/:unidadeAtual", function (req, res) {
    relatorioController.buscarUnidadeMediaPorSemana(req, res);
});






module.exports = router;