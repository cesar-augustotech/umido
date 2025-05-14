var express = require("express");
var router = express.Router();

var unidadeController = require("../controllers/unidadeController");

router.get("/:empresaId", function (req, res) {
  unidadeController.buscarUnidadePorEmpresa(req, res);
});

router.post("/cadastrarUnidade", function (req, res) {
  unidadeController.cadastrarUnidade(req, res);
})

module.exports = router;