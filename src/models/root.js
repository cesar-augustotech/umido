

var database = require("../database/config");

[]

async function get_obterDados(req,res) {
    const email = req.query.emailServer;
    
    var instrucaoSql = `select * from empresa ;`;
    let dados = await database.executar(instrucaoSql);3
    res.json({dados:dados});
    if(email =="root"){
    }



}
async function post_obterDados(req,res) {
    const email = req.body.emailServer;
    const empresa = req.body.empresa;
console.log(empresa);
    var instrucaoSql = `update empresa set ativo=1 where id=${empresa}`;
    let dados = await database.executar(instrucaoSql);
    res.json({dados:true});
    if(email =="root"){
    }
}


async function get_sensores_pendentes(callback) {
    var instrucaoSql = `
   SELECT 
	sensor.id AS id_sensor,
    sensor.identificador as identificador,
            empresa.nome AS empresa,
            CASE WHEN sensor.ativo = 0 THEN 'PENDENTE' ELSE 'ENVIADO' END AS status
        FROM sensor
        INNER JOIN unidade u ON u.id = sensor.id_unidade
		INNER JOIN empresa ON u.id_empresa = empresa.id
        WHERE sensor.ativo = 0;
    `;
    try {
        let resultado = await database.executar(instrucaoSql);
        callback(null, resultado);
    } catch (erro) {
        callback(erro, null);
    }
}

async function adicionarSensor(nome, idUnidade) {
    const instrucaoSql = `
        INSERT INTO sensor (identificador, id_unidade, ativo)
        VALUES ('${nome}', ${idUnidade}, 0);
    `;
    return database.executar(instrucaoSql);
}

/*
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
        WHERE sensor.id_unidade = ${unidadeAtual}
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
        WHERE sensor.id_unidade = ${idUnidade}
    `;

    console.log("Executando a instrução SQL para média de umidade: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
*/

module.exports = {
    get_obterDados,
    post_obterDados,
    get_sensores_pendentes,
    adicionarSensor
}
