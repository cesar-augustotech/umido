var database = require("../database/config");



function buscarUltimaPorSensor(idSensor) {
    var instrucaoSql = `
        SELECT * FROM medicao
        WHERE id_sensor = ${idSensor}
        ORDER BY data_hora DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}


module.exports = {
    buscarUltimaPorSensor
}
