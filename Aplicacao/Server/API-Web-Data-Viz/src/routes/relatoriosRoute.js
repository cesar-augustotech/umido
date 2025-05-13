const express = require('express');
const router = express.Router();

const relatorioController = require('../controllers/relatorioController');

router.get('/', relatorioController.listarUmidadeMedia);

router.get('/ultimas', relatorioController.buscarUltimasMedidas);

router.get('/dados', relatorioController.obterDados);

module.exports = router;