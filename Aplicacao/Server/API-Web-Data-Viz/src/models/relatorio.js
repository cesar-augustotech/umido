// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

 // require("dotenv").config({ path: caminho_env });

var database = require("../database/config");

var vetorMes = []


function buscarUltimasMedidas(unidadeAtual) {
    var dataAtual = new Date();
    var mesAtual = dataAtual.getMonth() + 1;
    var anoAtual = dataAtual.getFullYear();

    if(unidadeAtual == undefined){
        unidadeAtual = 1
    }

    // Formata para dois dígitos
    if (mesAtual < 10) mesAtual = `0${mesAtual}`;

    var instrucaoSql = `
        SELECT AVG(umidade) AS umidade
        FROM sensor
        INNER JOIN medicao ON sensor.id = medicao.id_sensor
        WHERE sensor.id_unidade = 1
        AND data_hora BETWEEN '${anoAtual}-${mesAtual}-01' AND LAST_DAY('${anoAtual}-${mesAtual}-01')
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarUmidadeMedia(idUnidade) {
    var instrucaoSql = `
        SELECT AVG(umidade) AS umidade_media
        FROM medicao
        INNER JOIN sensor ON medicao.id_sensor = sensor.id
        WHERE sensor.id_unidade = 1
    `;

    console.log("Executando a instrução SQL para média de umidade: \n" + instrucaoSql);
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
    buscarUmidadeMedia,
}
