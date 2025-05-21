var unidadeModel = require("../models/unidadeModel");

function buscarUnidadesDoResponsavel(req, res) {
  var idUsuario = req.params.idUsuario;

  unidadeModel.buscarUnidadesDoResponsavel(idUsuario).then((resultado) => {
    if (resultado.length > 0) {
      res.status(200).json(resultado);
    } else {
      res.status(204).json([]);
    }
  }).catch(function (erro) {
    console.log(erro);
    console.log("Houve um erro ao buscar as unidades: ", erro.sqlMessage);
    res.status(500).json(erro.sqlMessage);
  });
}

async function buscarIndicadores(req, res) {
  try {
    const idUsuario = req.params.idUsuario;
    const indicadores = await unidadeModel.buscarIndicadores(idUsuario);
    res.json(indicadores); // <-- ESSA LINHA É OBRIGATÓRIA
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar indicadores" });
  }
}

async function buscarAlertas(req, res) {
  try {
    const idUsuario = req.params.idUsuario;
    const alertas = await unidadeModel.buscarAlertas(idUsuario);
    res.json(alertas); // <-- ESSA LINHA É OBRIGATÓRIA
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar alertas" });
  }
}

function cadastrarUnidade(req, res) {
  var descricao = req.body.descricao;
  var idUsuario = req.body.idUsuario;

  if (descricao == undefined) {
    res.status(400).send("descricao está undefined!");
  } else if (idUsuario == undefined) {
    res.status(400).send("idUsuario está undefined!");
  } else {


    unidadeModel.cadastrar(descricao, idUsuario)
      .then((resultado) => {
        res.status(201).json(resultado);
      }
      ).catch((erro) => {
        console.log(erro);
        console.log(
          "\nHouve um erro ao realizar o cadastro! Erro: ",
          erro.sqlMessage
        );
        res.status(500).json(erro.sqlMessage);
      });
  }
}

module.exports = {
  buscarUnidadesDoResponsavel,
  cadastrarUnidade,
  buscarIndicadores,
  buscarAlertas
}