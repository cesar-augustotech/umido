var unidadeModel = require("../models/unidadeModel");

function buscarUnidadesPorUsuario(req, res) {
  
  var idUsuario = req.params.idUsuario;

  unidadeModel.buscarUnidadesPorUsuario(idUsuario).then((resultado) => {
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


function cadastrar(req, res) {
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

async function buscarSensoresPorUnidade(req, res) {
    const idUnidade = req.params.idUnidade;

    if (!idUnidade) {
        return res.status(400).send("idUnidade está undefined!");
    }

    try {
        const sensores = await unidadeModel.buscarSensoresPorUnidade(idUnidade);
        if (sensores.length > 0) {
            res.status(200).json(sensores);
        } else {
            res.status(204).json([]);
        }
    } catch (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os sensores: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    }
}


async function buscarAlertas(req, res) {
  try {
    const idUsuario = req.params.idUsuario;
    const alertas = await unidadeModel.buscarAlertas(idUsuario);
    res.json(alertas); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar alertas" });
  }
}
async function buscarIndicadores(req, res) {
  try {
    const idUsuario = req.params.idUsuario;
    const indicadores = await unidadeModel.buscarIndicadores(idUsuario);
    res.json(indicadores); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar indicadores" });
  }
}


async function buscarAlertasPorUnidade(req, res) {
  try {
    const idUsuario = req.params.idUsuario;
    const idUnidade = req.params.idUnidadeSelecionada;
   
    const alertas = await unidadeModel.buscarAlertasPorUnidade(idUsuario,idUnidade);
    res.json(alertas); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar alertas" });
  }
}
async function buscarIndicadoresPorUnidade(req, res) {
  try {
    const idUsuario = req.params.idUsuario;
     const idUnidade = req.params.idUnidadeSelecionada;
      console.log(`Model de buscar KPIs por unidade usando idUnidade: ${ idUnidade}`)
    const indicadores = await unidadeModel.buscarIndicadoresPorUnidade(idUsuario,idUnidade);
    res.json(indicadores); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar indicadores" });
  }
}

module.exports = {
  buscarUnidadesPorUsuario,
  cadastrar,
  buscarSensoresPorUnidade,
  buscarAlertas,
  buscarIndicadores,
  buscarIndicadoresPorUnidade,
  buscarAlertasPorUnidade
};