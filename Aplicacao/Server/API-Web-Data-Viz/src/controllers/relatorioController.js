var relatorioModel = require("../models/relatorioModel");


function buscarUmidadeMediaUnidade(req, res) {
    var unidadeAtual = req.params.unidadeAtual;

    console.log(`controller`);

    relatorioModel.buscarUmidadeMediaUnidade(unidadeAtual).then((resultado) => {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).json([]);
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as medidas: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}


function buscarAlertas(req, res) {
    var unidadeAtual = req.params.unidadeAtual;

    console.log(`controller`);

    relatorioModel.buscarAlertas(unidadeAtual).then((resultado) => {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).json([]);
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as medidas: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function buscarIncidentes(req, res) {
    var unidadeAtual = req.params.unidadeAtual;

    console.log(`controller`);

    relatorioModel.buscarIncidentes(unidadeAtual).then((resultado) => {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).json([]);
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as medidas: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function buscarUnidadeMediaPorSemana(req, res) {
    var unidadeAtual = req.params.unidadeAtual;

    console.log(`controller`);

    relatorioModel.buscarUnidadeMediaPorSemana(unidadeAtual).then((resultado) => {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).json([]);
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as medidas: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}




module.exports = {
    buscarUmidadeMediaUnidade,
    buscarIncidentes,
    buscarUnidadeMediaPorSemana,
    buscarAlertas
}

