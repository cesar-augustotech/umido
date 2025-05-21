var database = require("../database/config");

async function buscarUnidadesDoResponsavel(idUsuario) {
  var instrucaoSql = `
    SELECT 
      u.id AS unidade_id, u.nome AS unidade_nome,
      us.nome AS responsavel_nome,
      s.id AS sensor_id, s.identificador AS sensor_nome,
      m.umidade, m.alerta
    FROM unidade u
    JOIN unidade_usuario uu ON uu.id_unidade = u.id
    JOIN usuario us ON us.id = uu.id_usuario
    JOIN (
      SELECT empresa_id FROM unidade u2
      JOIN unidade_usuario uu2 ON uu2.id_unidade = u2.id
      WHERE uu2.id_usuario = ${idUsuario}
      LIMIT 1
    ) empresa ON empresa.empresa_id = u.empresa_id
    LEFT JOIN sensor s ON s.id_unidade = u.id
    LEFT JOIN medicao m ON m.id_sensor = s.id
    WHERE uu.id_usuario = ${idUsuario}
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  const rows = await database.executar(instrucaoSql);


  const unidadesMap = {};

 rows.forEach(row => {
  if (!unidadesMap[row.unidade_id]) {
    unidadesMap[row.unidade_id] = {
      id: row.unidade_id,
      nome: row.unidade_nome,
      responsaveis: [],
      sensores: []
    };
  }
  // Adiciona responsável se ainda não estiver na lista
  if (row.responsavel_nome && !unidadesMap[row.unidade_id].responsaveis.includes(row.responsavel_nome)) {
    unidadesMap[row.unidade_id].responsaveis.push(row.responsavel_nome);
  }
  // Agrupa sensores pelo id
  if (row.sensor_id) {
    let sensores = unidadesMap[row.unidade_id].sensores;
    let sensorExistente = sensores.find(s => s.nome === row.sensor_nome);
    if (!sensorExistente) {
      sensores.push({
        nome: row.sensor_nome,
        umidade: row.umidade !== null && row.umidade !== undefined ? `${row.umidade}%` : null,
        alerta: row.alerta ? 1 : 0
      });
    } else {
      // Se já existe, atualize para a última medição (opcional)
      sensorExistente.umidade = row.umidade !== null && row.umidade !== undefined ? `${row.umidade}%` : sensorExistente.umidade;
      sensorExistente.alerta = row.alerta ? 1 : 0;
    }
  }
});

  return Object.values(unidadesMap);
}
async function buscarIndicadores(idUsuario) {
  var instrucaoSql = `
    SELECT
      (SELECT COUNT(*) 
         FROM medicao m
         JOIN sensor s ON m.id_sensor = s.id
         JOIN unidade u ON s.id_unidade = u.id
         JOIN unidade_usuario uu ON uu.id_unidade = u.id
        WHERE m.alerta = 1
          AND MONTH(m.data_hora) = MONTH(CURRENT_DATE())
          AND YEAR(m.data_hora) = YEAR(CURRENT_DATE())
          AND uu.id_usuario = ${idUsuario}
      ) AS quantidade_alerta,

      (SELECT ROUND(AVG(m.umidade), 2)
         FROM medicao m
         JOIN sensor s ON m.id_sensor = s.id
         JOIN unidade u ON s.id_unidade = u.id
         JOIN unidade_usuario uu ON uu.id_unidade = u.id
        WHERE MONTH(m.data_hora) = MONTH(CURRENT_DATE())
          AND YEAR(m.data_hora) = YEAR(CURRENT_DATE())
          AND uu.id_usuario = ${idUsuario}
      ) AS umidade_media,

      (SELECT COUNT(*)
         FROM medicao m
         JOIN sensor s ON m.id_sensor = s.id
         JOIN unidade u ON s.id_unidade = u.id
         JOIN unidade_usuario uu ON uu.id_unidade = u.id
        WHERE MONTH(m.data_hora) = MONTH(CURRENT_DATE())
          AND YEAR(m.data_hora) = YEAR(CURRENT_DATE())
          AND uu.id_usuario = ${idUsuario}
      ) AS exportacoes_realizadas,

      (SELECT COUNT(*)
         FROM sensor s
         JOIN unidade u ON s.id_unidade = u.id
         JOIN unidade_usuario uu ON uu.id_unidade = u.id
        WHERE s.ativo = 1
          AND uu.id_usuario = ${idUsuario}
      ) AS sensores_funcionando,

      (SELECT current_time()) AS hora_atualizacao,

      (SELECT DATE_FORMAT(MAX(m.data_hora), '%d/%m/%Y')
         FROM medicao m
         JOIN sensor s ON m.id_sensor = s.id
         JOIN unidade u ON s.id_unidade = u.id
         JOIN unidade_usuario uu ON uu.id_unidade = u.id
        WHERE uu.id_usuario = ${idUsuario}
      ) AS data_atualizacao
  `;

  console.log("Executando a instrução SQL para buscar KPIs: \n" + instrucaoSql);
  const [indicadores] = await database.executar(instrucaoSql);
  return indicadores;
}

async function buscarAlertas(idUsuario) {
  var instrucaoSql = `
    SELECT 
      u.id AS unidade_id, u.nome AS unidade_nome,
      us.nome AS responsavel_nome,
      s.id AS sensor_id, s.identificador AS sensor_nome,
      m.umidade, m.alerta, m.data_hora
    FROM unidade u
    JOIN unidade_usuario uu ON uu.id_unidade = u.id
    JOIN usuario us ON us.id = uu.id_usuario
    LEFT JOIN sensor s ON s.id_unidade = u.id
    LEFT JOIN (
      SELECT m1.*
      FROM medicao m1
      INNER JOIN (
        SELECT id_sensor, MAX(data_hora) AS max_data
        FROM medicao
        WHERE alerta = 1 AND data_hora >= NOW() - INTERVAL 1 DAY
        GROUP BY id_sensor
      ) ult ON ult.id_sensor = m1.id_sensor AND ult.max_data = m1.data_hora
      WHERE m1.alerta = 1
    ) m ON m.id_sensor = s.id
    WHERE uu.id_usuario = ${idUsuario} AND m.alerta = 1
  `;

  console.log("Executando a instrução SQL para buscar alertas na empresa: \n" + instrucaoSql);
  const rows = await database.executar(instrucaoSql);

  return rows;
}
function cadastrarUnidade(idEmpresa, descricao) {
  
  var instrucaoSql = `INSERT INTO (descricao, fk_empresa) aquario VALUES (${descricao}, ${idEmpresa})`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


module.exports = {
  buscarUnidadesDoResponsavel,
  cadastrarUnidade,
  buscarIndicadores,
  buscarAlertas
}
