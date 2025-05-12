var express = require("express");
var router = express.Router();

var unidadeController = require("../controllers/unidadeController");

router.get("/:empresaId", function (req, res) {
  unidadeController.buscarUnidadePorEmpresa(req, res);
});

router.post("/cadastrar", function (req, res) {
  unidadeController.cadastrar(req, res);
})

module.exports = router;