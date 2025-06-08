var express = require("express");
var router = express.Router();

var relatorioController = require("../controllers/relatorioController");


router.get("/buscarListaAlertas/:idUnidade", function (req, res) {
    relatorioController.buscarListaAlertas(req, res);
})

router.get("/buscarUmidadeMediaUnidade/:idUnidade", function (req, res) {
   relatorioController.buscarUmidadeMediaUnidade(req, res);
});


router.get("/buscarUmidadeMediaUltimasSemanas/:idUnidade", function (req, res) {
   relatorioController.buscarUmidadeMediaUltimasSemanas(req, res);
});


router.get("/buscarQuantidadeDeAlertas/:idUnidade", function (req, res) {
   relatorioController.buscarQuantidadeDeAlertas(req, res);
});


router.get("/buscarUmidadePorSensor/:idUnidade", function (req, res) {
   relatorioController.buscarUmidadePorSensor(req, res);
});



module.exports = router;