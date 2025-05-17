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

router.post("/salvarUnidadesUsuario", function (req, res) {
    usuarioController.salvarUnidadesUsuario(req, res)
    console.log('Passei pela rota' + req)
})

router.get("/obterUnidadesUsuario", function(req, res) {
    usuarioController.obterUnidadesUsuario(req, res)
})

router.post("/obterDados", function (req, res) {
    usuarioController.obterDados(req, res);
});

router.post("/removerUsuario", function (req, res) {
    usuarioController.removerUsuario(req, res)
});

router.post("/editarUsuario", function (req, res) {
    usuarioController.editarUsuario(req, res)
})

router.post("/obterUnidades", function (req, res) {
    usuarioController.obterUnidades(req, res)
})

module.exports = router;