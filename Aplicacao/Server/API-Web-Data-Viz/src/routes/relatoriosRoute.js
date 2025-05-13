var express = require("express");
var router = express.Router();

var relatorios =  require ('../controllers/relatorioController.js')
router.get("/", function (req, res) {
    relatorios.buscarUltimasMedidas(req, res);
});

module.exports = router;