// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

 // require("dotenv").config({ path: caminho_env });

var database = require("../database/config");



function buscarUmidadeMediaUnidade(select_unidade) {
    var dataAtual = new Date();
    var mesAtual = dataAtual.getMonth() + 1;
    var anoAtual = dataAtual.getFullYear();

    if (mesAtual < 10) mesAtual = `0${mesAtual}`;

    var instrucaoSql = `
        SELECT AVG(m.umidade),u.id,s.id
    FROM medicao as m
    INNER JOIN sensor AS s ON m.id_sensor = s.id
    INNER JOIN unidade AS u ON s.id_unidade = u.id
    WHERE u.id = ${select_unidade}
    AND data_hora BETWEEN '${anoAtual}-${mesAtual}-01' AND LAST_DAY('${anoAtual}-${mesAtual}-01')
    GROUP BY u.id,s.id;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarUmidadeMediaUnidade,
}
