var express = require("express");
var router = express.Router();

var medidaController = require("../controllers/relatorioController.js");

router.get("/ultimas/:idAquario", function (req, res) {
    relatorioController.buscarListaAlertas(req, res);
});


module.exports = router;