var database = require("../database/config");

function buscarListaAlertas(idUnidade) {

    var instrucaoSql = `SELECT 
       id_sensor,
       umidade,
       data_hora
       where alerta in (1, 2)
       and
       id_unidade = ${idUnidade}`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMediaMensal () {

    var instrucaoSql = `SELECT 
       `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
buscarListaAlertas,
buscarMediaMensal
}
