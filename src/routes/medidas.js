var express = require("express");
var router = express.Router();

var medidaController = require("../controllers/medidaController");


router.get("/tempo-real/:idUnidade", function (req, res) {
    medidaController.buscarMedidasEmTempoReal(req, res);
})

router.get("/ultima/:idSensor", function (req, res) {
    medidaController.buscarUltimaPorSensor(req, res);
});

module.exports = router;