var root = require("../models/root");




function get_dados_empresas(req, res) {
    root.get_obterDados(req, res)
}
function post_dados_empresas(req, res) {
    root.post_obterDados(req, res)
}



module.exports = {
    post_dados_empresas,
    get_dados_empresas
}