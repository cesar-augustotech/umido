var express = require("express");
var router = express.Router();

var dados = require("../controllers/rootController");

//Recebendo os dados do html e direcionando para a função cadastrar de empresaController.js
router.post("/dados_empresas", function (req, res) {
    dados.post_dados_empresas(req, res);
})

router.get("/dados_empresas", function (req, res) {
    dados.get_dados_empresas(req, res);
})

module.exports = router;