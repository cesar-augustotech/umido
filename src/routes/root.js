var express = require("express");
var router = express.Router();

var dados = require("../controllers/rootController");


router.post("/dados_empresas", function (req, res) {
    dados.post_dados_empresas(req, res);
});

router.get("/dados_empresas", function (req, res) {
    dados.get_dados_empresas(req, res);
});

router.get("/sensores_pendentes", function (req, res) {
    dados.get_sensores_pendentes(req, res);
});

router.post("/adicionarSensor", function(req,res) {
   dados.adicionarSensor(req, res);
});

router.post("/adicionarUnidade", function(req,res) {
    dados.adicionarUnidade(req, res);
})

module.exports = router;