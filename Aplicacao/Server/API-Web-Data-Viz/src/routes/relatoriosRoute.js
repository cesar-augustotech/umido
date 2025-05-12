var express = require("express");
var router = express.Router();

var relatorios =  require ('C:\\Users\\Desktop\\Desktop\\Faculdade\\PI\\Grupo - git\\umido\\Aplicacao\\Server\\API-Web-Data-Viz\\src\\controllers\\relatorioController.js')
router.get("/", function (req, res) {
    relatorios.buscarUltimasMedidas(req, res);
});

module.exports = router;