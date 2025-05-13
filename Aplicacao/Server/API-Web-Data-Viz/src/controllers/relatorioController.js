var medidaModel = require("../models/relatorio.js");

async function listarUmidadeMedia(req, res) {
    try {
        const idUnidade = req.query.unidade;
        const resultado = await medidaModel.buscarUmidadeMedia(idUnidade); // ou relatorioModel, se for o caso
        res.status(200).json(resultado);
    } catch (erro) {
        console.error("Erro ao buscar médias:", erro);
        res.status(500).json({ erro: "Erro ao buscar dados de umidade" });
    }
}

async function buscarUltimasMedidas(req, res) {
    try {
        var select = await medidaModel.buscarUltimasMedidas();
        res.send(JSON.stringify(select));
        console.log(select);
    } catch (erro) {
        console.error("Erro ao buscar últimas medidas:", erro);
        res.status(500).json({ erro: "Erro ao buscar últimas medidas" });
    }
}

async function obterDados(req, res) {
    try {
        const dados = await medidaModel.obterDados();
        res.status(200).json(dados);
    } catch (erro) {
        console.error("Erro ao obter dados:", erro);
        res.status(500).json({ erro: "Erro ao obter dados" });
    }
}


/*
    const limite_linhas = 7;

    var idAquario = req.params.idAquario;

    console.log(`Recuperando as ultimas ${limite_linhas} medidas`);

    medidaModel.buscarUltimasMedidas(idAquario, limite_linhas).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as ultimas medidas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}


function buscarMedidasEmTempoReal(req, res) {

    var idAquario = req.params.idAquario;

    console.log(`Recuperando medidas em tempo real`);

    medidaModel.buscarMedidasEmTempoReal(idAquario).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as ultimas medidas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}
*/
module.exports = {
    listarUmidadeMedia,
    buscarUltimasMedidas,
    obterDados

} 