var express = require("express");
var router = express.Router();

var unidadeController = require("../controllers/unidadeController");

router.get("/:empresaId", function (req, res) {
  unidadeController.buscarUnidadesPorEmpresa(req, res);
});

router.post("/cadastrar", function (req, res) {
  unidadeController.cadastrar(req, res);
})


router.get("/sensores/unidade/:idUnidade", function (req, res) {
  unidadeController.buscarSensoresPorUnidade(req, res);
});


router.get("/alertas/:idUsuario", function (req, res) {
  unidadeController.buscarAlertas(req, res);
});

router.get("/indicadores/:idUsuario", function (req, res) {
  unidadeController.buscarIndicadores(req, res);
});


router.get("/:idUnidadeSelecionada/alertas/:idUsuario", function (req, res) {
  unidadeController.buscarAlertasPorUnidade(req, res);
});

router.get("/:idUnidadeSelecionada/indicadores/:idUsuario", function (req, res) {
  unidadeController.buscarIndicadoresPorUnidade(req, res);
});


module.exports = router;