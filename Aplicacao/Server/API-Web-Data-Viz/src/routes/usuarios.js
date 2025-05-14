var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js

router.post("/logar", function (req, res) {
    usuarioController.logar(req, res);
});
router.get("/logar2", function (req, res) {
    console.log(req)
    usuarioController.logar(req, res);
});
router.get("/usuarioLogado", function (req, res) {
    usuarioController.usuarioLogado(req, res);
});
router.post("/salvarUsuario", function (req, res) {
    usuarioController.salvarUsuario(req, res);
})

router.get("/obterDados", function (req, res) {
    usuarioController.obterDados(req, res);
});


module.exports = router;