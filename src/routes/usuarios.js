var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/salvarUsuario", function (req, res) {
    usuarioController.salvarUsuario(req, res);
})

router.post("/removerUsuario", function (req, res) {
    usuarioController.removerUsuario(req, res)
});

router.post("/editarUsuario", function (req, res) {
    usuarioController.editarUsuario(req, res)
})

router.post("/obterDados", function (req, res) {
    usuarioController.obterDados(req, res);
});

router.post("/obterUnidades", function (req, res) {
    usuarioController.obterUnidades(req, res)
})
router.get("/obterUnidadesUsuario", function(req, res) {
    usuarioController.obterUnidadesUsuario(req, res)
})
module.exports = router;