var root = require("../models/root");




function get_dados_empresas(req, res) {
    root.get_obterDados(req, res)
}
function post_dados_empresas(req, res) {
    root.post_obterDados(req, res)
}

function get_sensores_pendentes(req, res) {
    root.get_sensores_pendentes(function (erro, resultado) {
        if (erro) {
            res.status(500).json({ erro: erro.message || erro });
        } else {
            res.json(resultado);
        }
    });
}


module.exports = {
    post_dados_empresas,
    get_dados_empresas,
    get_sensores_pendentes
}