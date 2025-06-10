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

async function adicionarSensor(req, res) {
    const { nome, idUnidade } = req.body;
    console.log("Adicionando sensor:", nome, "para unidade:", idUnidade);
    if (!nome || !idUnidade) {
        return res.status(400).json({ erro: "Nome e idUnidade são obrigatórios" });
    }
    try {
        const resultado = await root.adicionarSensor(nome, idUnidade);
        res.status(201).json(resultado);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao adicionar sensor" });
    }
}
module.exports = {
    post_dados_empresas,
    get_dados_empresas,
    get_sensores_pendentes,
    adicionarSensor
}