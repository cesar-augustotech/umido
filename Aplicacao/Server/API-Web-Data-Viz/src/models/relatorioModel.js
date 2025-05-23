// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

// require("dotenv").config({ path: caminho_env });

var database = require("../database/config");

console.log(`model`);

function buscarUmidadeMediaUnidade(unidadeAtual) {
    var dataAtual = new Date();
    var mesAtual = dataAtual.getMonth() + 1;
    var anoAtual = dataAtual.getFullYear();

    if (mesAtual < 10) mesAtual = `0${mesAtual}`;

    var instrucaoSql = `
     SELECT 
    MONTH(m.data_hora) AS mes,
    ROUND(AVG(m.umidade), 2) AS mediaMensal
    FROM 
    medicao AS m
    JOIN 
    sensor AS s ON m.id_sensor = s.id
    JOIN 
    unidade AS u ON s.id_unidade = u.id
    WHERE 
    u.id = ${unidadeAtual}
    AND YEAR(m.data_hora) = ${anoAtual}
    GROUP BY 
    mes
    ORDER BY 
    mes;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarAlertas(unidadeAtual) {
    var dataAtual = new Date();
    var mesAtual = dataAtual.getMonth() + 1;
    var anoAtual = dataAtual.getFullYear();

    if (mesAtual < 10) mesAtual = `0${mesAtual}`;

    var instrucaoSql = `
     SELECT m.alerta,s.identificador,m.data_hora
    FROM medicao as m
    INNER JOIN sensor AS s ON m.id_sensor = s.id
    INNER JOIN unidade AS u ON s.id_unidade = u.id
    WHERE u.id = ${umidade} and m.alerta is not null
    AND data_hora BETWEEN '${anoAtual}-${mesAtual}-01' AND LAST_DAY('${anoAtual}-${mesAtual}-01');
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);`
}

function buscarIncidentes(unidadeAtual) {
    var dataAtual = new Date();
    var mesAtual = dataAtual.getMonth() + 1;
    var anoAtual = dataAtual.getFullYear();

    if (mesAtual < 10) mesAtual = `0${mesAtual}`;

    var instrucaoSql = `
    SELECT
    m.id_sensor,
    count(case WHEN alerta = '1' THEN 'alerta_critico' end) as alerta_critivo,
    count(case WHEN alerta = '0' THEN 'alerta' end) as alerta
    FROM medicao as m
    INNER JOIN sensor AS s ON m.id_sensor = s.id
    INNER JOIN unidade AS u ON s.id_unidade = u.id
    WHERE u.id = ${unidadeAtual}
    AND data_hora BETWEEN '${anoAtual}-${mesAtual}-01' AND LAST_DAY('${anoAtual}-${mesAtual}-01')
    AND m.alerta IS NOT NULL
    GROUP BY id_sensor;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarUnidadeMediaPorSemana(unidadeAtual) {
    var dataAtual = new Date();
    var mesAtual = dataAtual.getMonth() + 1;
    var anoAtual = dataAtual.getFullYear();

    if (mesAtual < 10) mesAtual = `0${mesAtual}`;

    var instrucaoSql = `
    SELECT
    CASE
    WHEN m.data_hora >= CURDATE() - INTERVAL 0 DAY THEN 1
    WHEN m.data_hora >= CURDATE() - INTERVAL 7 DAY THEN 2
    WHEN m.data_hora >= CURDATE() - INTERVAL 14 DAY THEN 3
    WHEN m.data_hora >= CURDATE() - INTERVAL 21 DAY THEN 4
    END AS semana,
    AVG(m.umidade) AS umidade_media
    FROM medicao m
    JOIN sensor s ON m.id_sensor = s.id
    JOIN unidade u ON s.id_unidade = u.id
    WHERE m.data_hora >= CURDATE() - INTERVAL 28 DAY and u.id = ${unidadeAtual}
    GROUP BY u.nome, semana
    ORDER BY semana;
    `
}



module.exports = {
    buscarUmidadeMediaUnidade,
    buscarIncidentes,
    buscarUnidadeMediaPorSemana,
    buscarAlertas
}

