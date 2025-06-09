var database = require("../database/config");

function buscarListaAlertas(idUnidade) {

    var instrucaoSql = `
SELECT s.identificador,
m.umidade,
DATE_FORMAT(m.data_hora, '%H:%i:%s  %d/%m/%Y') as data,m.data_hora
from  medicao as m
inner join sensor as s on s.id = m.id_sensor
where id_unidade = ${idUnidade}  and data_hora >= DATE_SUB(now(), INTERVAL 48 hour) and alerta = (0 or 1)
order by data_hora desc
limit 28;
       
       `

    //console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarUmidadeMediaUnidade(idUnidade) {
    var instrucaoSql = `
        select  truncate(avg(m.umidade),1) as umidade,extract(month from m.data_hora) as mes 
from medicao as m
inner join sensor as s on s.id = m.id_sensor
inner join unidade as u on u.id = s.id_unidade
where u.id = ${idUnidade}
group by mes
order by mes 
limit 6;
    `;
    return database.executar(instrucaoSql);
}


function buscarUmidadeMediaUltimasSemanas(idUnidade) {
    var instrucaoSql = `
        select  truncate(avg(m.umidade),1) as umidade,extract(week from m.data_hora) as semana
from medicao as m
inner join sensor as s on s.id = m.id_sensor
inner join unidade as u on u.id = s.id_unidade
where u.id = ${idUnidade}
group by semana
order by semana desc
limit 4;
    `;
    return database.executar(instrucaoSql);
}


function buscarQuantidadeDeAlertas(idUnidade) {
    var instrucaoSql = `
      select count(alerta) as alerta,id_sensor as sensor
from medicao as m
inner join sensor as s on s.id = m.id_sensor
inner join unidade as u on u.id = s.id_unidade
where u.id = ${idUnidade}
group by id_sensor;
    `;
    return database.executar(instrucaoSql);
}

function buscarUmidadePorSensor(idUnidade, idSensor) {
    console.log(64, idSensor)
    var instrucaoSql = ` 
    select s.identificador, m.*
    from medicao as m
    inner join sensor as s on s.id = m.id_sensor
    where s.id_unidade = ${idUnidade};
`;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarListaAlertas,
    buscarUmidadeMediaUnidade,
    buscarUmidadePorSensor,
    buscarUmidadeMediaUltimasSemanas,
    buscarQuantidadeDeAlertas
}
