var relatorioModel = require("../models/relatorioModel");

function buscarListaAlertas(req, res) {
let idUnidade = req.params.idUnidade;

    relatorioModel.buscarListaAlertas(idUnidade).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar a lista de alertas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function buscarUmidadeMediaUnidade(req, res) {
    let idUnidade = req.params.idUnidade;
     relatorioModel.buscarUmidadeMediaUnidade(idUnidade).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar a lista de alertas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function buscarUmidadeMediaUltimasSemanas(req, res) {
    let idUnidade = req.params.idUnidade;
     relatorioModel.buscarUmidadeMediaUnidade(idUnidade).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar a lista de alertas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function buscarQuantidadeDeAlertas(req, res) {
    let idUnidade = req.params.idUnidade;
     relatorioModel.buscarUmidadeMediaUnidade(idUnidade).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar a lista de alertas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function buscarUmidadePorSensor(req, res) {
    let idSensor = req.params.idSensor;
     relatorioModel.buscarUmidadePorSensor(idSensor).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar a lista de alertas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
buscarListaAlertas,
 buscarUmidadeMediaUnidade,
 buscarUmidadePorSensor,
 buscarUmidadeMediaUltimasSemanas,
 buscarQuantidadeDeAlertas
}