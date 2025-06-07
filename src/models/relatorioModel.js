var database = require("../database/config");

function buscarListaAlertas(idUnidade) {

    var instrucaoSql = `
SELECT id_sensor,
       umidade,
       data_hora
       from
       medicao
       inner join sensor on sensor.id = medicao.id_sensor
       where alerta in (1, 2)
       and
       id_unidade = ${idUnidade}
       limit 28;
       
       `

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarUmidadeMediaUnidade(idUnidade) {
    var instrucaoSql = `
        select avg(m.umidade) as umidade,extract(month from m.data_hora) as mes 
from medicao as m
inner join sensor as s on s.id = m.id_sensor
inner join unidade as u on u.id = s.id_unidade
where u.id = ${idUnidade}
group by mes
order by mes desc
limit 6;
    `;
    return database.executar(instrucaoSql);
}

<<<<<<< HEAD
function buscarUmidadeMediaUltimasSemanas(idUnidade) {
    var instrucaoSql = `
        select avg(m.umidade) as umidade,extract(week from m.data_hora) as semana
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
=======
    var instrucaoSql = `SELECT
     
       `;
>>>>>>> 539a0cca0486fc6b402a2f4729cd766cbca08a3c


function buscarQuantidadeDeAlertas(idUnidade) {
    var instrucaoSql = `
       select count(alerta),id_sensor
from medicao as m
inner join sensor as s on s.id = m.id_sensor
inner join unidade as u on u.id = s.id_unidade
where u.id = ${idUnidade}
group by id_sensor;

    `;
    return database.executar(instrucaoSql);
}

function buscarUmidadePorSensor(idSensor) {
    var instrucaoSql = `
       select avg(m.umidade) as umidade,extract(hour from m.data_hora) as hora 
from medicao as m
inner join sensor as s on s.id = m.id_sensor
inner join unidade as u on u.id = s.id_unidade
where s.id = ${idSensor}
group by hora
order by hora desc
limit 24;
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
