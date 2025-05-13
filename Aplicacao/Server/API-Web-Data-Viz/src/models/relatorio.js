// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

 // require("dotenv").config({ path: caminho_env });

var database = require("../database/config");

var vetorMes = []
var relatorio = require ('../../public/Dashboard/relatorio.html');

var select_unidade = require( '../../public/Dashboard/relatorio.html');

function buscarUltimasMedidas() {

    var dataAtual = new Date();
    var mesAtual = dataAtual.getMonth();
    var anoAtual = dataAtual.getFullYear();
    var unidadeAtual = select_unidade();
    return relatorio.executar(instrucaoSql);

    var instrucaoSql = `select avg (umidade)
from sensor
inner join medicao on id_sensor = sensor.id
where id_unidade = ${unidadeAtual} and
AND DATE(data_hora) BETWEEN '${anoAtual}-${mesAtual}-01' 
AND 'LAST_DAY(${anoAtual}-${mesAtual}-01')`;

vetorMes[mesAtual] = instrucaoSql

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

/*
function buscarMedidasEmTempoReal(idAquario) {

    var instrucaoSql = `SELECT 
        dht11_temperatura as temperatura, 
        dht11_umidade as umidade,
                        DATE_FORMAT(momento,'%H:%i:%s') as momento_grafico, 
                        fk_aquario 
                        FROM medida WHERE fk_aquario = ${idAquario} 
                    ORDER BY id DESC LIMIT 1`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}*/

module.exports = {
    buscarUltimasMedidas,
}
