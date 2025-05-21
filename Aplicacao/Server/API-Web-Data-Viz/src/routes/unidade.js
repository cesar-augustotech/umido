var express = require("express");
var router = express.Router();

var unidadeController = require("../controllers/unidadeController");

router.get("/indicadores/:idUsuario", function (req, res) {
  unidadeController.buscarIndicadores(req, res);
});

router.get("/:idUsuario", function (req, res) {
  unidadeController.buscarUnidadesDoResponsavel(req, res);
});

router.get("/alertas/:idUsuario", function (req, res) {
  unidadeController.buscarAlertas(req, res);
});

router.post("/cadastrarUnidade", function (req, res) {
  unidadeController.cadastrarUnidade(req, res);
})

module.exports = router;