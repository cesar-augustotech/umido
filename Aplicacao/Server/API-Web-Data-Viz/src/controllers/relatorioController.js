var relatorioModel = require("../models/relatorioModel");


function buscarUmidadeMediaUnidade(req, res) {
  var select_unidade = req.params.select_unidade;

    relatorioModel.buscarUmidadeMediaUnidade(select_unidade).then((resultado) => {
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
  relatorioModel,
}

