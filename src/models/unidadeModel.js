var database = require("../database/config");

function buscarUnidadesPorEmpresa(empresaId) {

  var instrucaoSql = `SELECT * FROM unidade u WHERE id_empresa = ${empresaId}`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function cadastrar(empresaId, descricao) {
  
  var instrucaoSql = `INSERT INTO unidade (descricao, id_empresa) VALUES ('${descricao}', ${empresaId})`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarUnidadesPorUsuario(usuarioId) {
    var instrucaoSql = `
        SELECT u.*, us.nivel_de_acesso as nivel_de_acesso
        FROM unidade u
        INNER JOIN unidade_usuario uu ON uu.id_unidade = u.id
        INNER JOIN usuario us ON us.id = uu.id_usuario
        INNER JOIN empresa e ON e.id = u.id_empresa
        WHERE uu.id_usuario = ${usuarioId}
    `;
    return database.executar(instrucaoSql);
}

// Exemplo de função no model
function buscarSensoresPorUnidade(idUnidade) {
    var instrucaoSql = `
        SELECT * FROM sensor WHERE id_unidade = ${idUnidade};
    `;
    return database.executar(instrucaoSql);
}

async function buscarAlertas(idUsuario) {
  var instrucaoSql = `
    SELECT 
      u.id AS unidade_id, u.nome AS unidade_nome,
      us.nome AS responsavel_nome,
      s.id AS sensor_id, s.identificador AS sensor_nome,
      m1.umidade, m1.alerta, m1.data_hora
    FROM unidade u
    JOIN unidade_usuario uu ON uu.id_unidade = u.id
    JOIN usuario us ON us.id = uu.id_usuario
    LEFT JOIN sensor s ON s.id_unidade = u.id
    JOIN medicao m1 ON m1.id_sensor = s.id
      AND m1.alerta = '1'
      AND m1.data_hora BETWEEN (NOW() - INTERVAL 1 DAY) AND NOW()
    LEFT JOIN medicao m0 
      ON m0.id_sensor = m1.id_sensor 
      AND m0.data_hora = (
        SELECT MAX(m2.data_hora)
        FROM medicao m2
        WHERE m2.id_sensor = m1.id_sensor
          AND m2.data_hora < m1.data_hora
      )
    WHERE uu.id_usuario = ${idUsuario}
      AND (m0.alerta IS NULL OR m0.alerta <> '1')
    ORDER BY u.id, s.id, m1.data_hora DESC
  `;

  console.log("Executando a instrução SQL para buscar alertas iniciados nas últimas 24h: \n" + instrucaoSql);
  const rows = await database.executar(instrucaoSql);

  return rows;

  
}
async function buscarIndicadores(idUsuario) {
  var instrucaoSql = `
    SELECT
      (SELECT COUNT(*) 
         FROM medicao m
         JOIN sensor s ON m.id_sensor = s.id
         JOIN unidade u ON s.id_unidade = u.id
         JOIN unidade_usuario uu ON uu.id_unidade = u.id
        WHERE m.alerta in(1, 0)
          AND DATE(m.data_hora) = CURDATE()
          AND uu.id_usuario = ${idUsuario}
      ) AS quantidade_alerta,

      (SELECT ROUND(AVG(ultimas.umidade), 2)
         FROM (
           SELECT m.umidade
           FROM sensor s
           JOIN unidade u ON s.id_unidade = u.id
           JOIN unidade_usuario uu ON uu.id_unidade = u.id
           JOIN medicao m ON m.id_sensor = s.id
           WHERE uu.id_usuario = ${idUsuario}
             AND s.ativo = true
             AND m.id = (
               SELECT MAX(m2.id)
               FROM medicao m2
               WHERE m2.id_sensor = s.id
             )
         ) AS ultimas
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
        WHERE s.ativo = false
          AND uu.id_usuario = ${idUsuario}
      ) AS sensores_desativados,

      (SELECT current_time()) AS hora_atualizacao,

      (SELECT DATE_FORMAT(MAX(m.data_hora), '%d/%m/%Y')
         FROM medicao m
         JOIN sensor s ON m.id_sensor = s.id
         JOIN unidade u ON s.id_unidade = u.id
         JOIN unidade_usuario uu ON uu.id_unidade = u.id
        WHERE uu.id_usuario = ${idUsuario}
      ) AS data_atualizacao,
      
      (SELECT COUNT(*) 
         FROM medicao m
         JOIN sensor s ON m.id_sensor = s.id
         JOIN unidade u ON s.id_unidade = u.id
         JOIN unidade_usuario uu ON uu.id_unidade = u.id
        WHERE DATE(m.data_hora) = CURDATE()
          AND uu.id_usuario = ${idUsuario}
      ) AS total_alertas
  `;

  console.log("Executando a instrução SQL para buscar KPIs: \n" + instrucaoSql);
  const [indicadores] = await database.executar(instrucaoSql);
  return indicadores;
}


async function buscarAlertasPorUnidade(idUsuario, idUnidade) {
  var instrucaoSql = `
    SELECT 
      u.id AS unidade_id, u.nome AS unidade_nome,
      us.nome AS responsavel_nome,
      s.id AS sensor_id, s.identificador AS sensor_nome,
      m1.umidade, m1.alerta, m1.data_hora
    FROM unidade u
    JOIN unidade_usuario uu ON uu.id_unidade = u.id
    JOIN usuario us ON us.id = uu.id_usuario
    LEFT JOIN sensor s ON s.id_unidade = u.id
    JOIN medicao m1 ON m1.id_sensor = s.id
      AND m1.alerta = '1'
      AND m1.data_hora BETWEEN (NOW() - INTERVAL 1 DAY) AND NOW()
    LEFT JOIN medicao m0 
      ON m0.id_sensor = m1.id_sensor 
      AND m0.data_hora = (
        SELECT MAX(m2.data_hora)
        FROM medicao m2
        WHERE m2.id_sensor = m1.id_sensor
          AND m2.data_hora < m1.data_hora
      )
    WHERE uu.id_usuario = ${idUsuario}
      AND u.id = ${idUnidade}
      AND (m0.alerta IS NULL OR m0.alerta <> '1')
    ORDER BY u.id, s.id, m1.data_hora DESC
  `;

  console.log("Executando a instrução SQL para buscar alertas iniciados nas últimas 24h na unidade: \n" +idUnidade + instrucaoSql);
  const rows = await database.executar(instrucaoSql);

  return rows;
}
async function buscarIndicadoresPorUnidade(idUsuario, idUnidade) {
  var instrucaoSql = `
    SELECT
      (SELECT COUNT(*) 
         FROM medicao m
         JOIN sensor s ON m.id_sensor = s.id
         JOIN unidade u ON s.id_unidade = u.id
         JOIN unidade_usuario uu ON uu.id_unidade = u.id
        WHERE m.alerta in(1, 0)
          AND DATE(m.data_hora) = CURDATE()
          AND uu.id_usuario = ${idUsuario}
          AND u.id = ${idUnidade}
      ) AS quantidade_alerta,

      (SELECT ROUND(AVG(ultimas.umidade), 2)
         FROM (
           SELECT m.umidade
           FROM sensor s
           JOIN unidade u ON s.id_unidade = u.id
           JOIN unidade_usuario uu ON uu.id_unidade = u.id
           JOIN medicao m ON m.id_sensor = s.id
           WHERE uu.id_usuario = ${idUsuario}
             AND u.id = ${idUnidade}
             AND s.ativo = true
             AND m.id = (
               SELECT MAX(m2.id)
               FROM medicao m2
               WHERE m2.id_sensor = s.id
             )
         ) AS ultimas
      ) AS umidade_media,

      (SELECT COUNT(*)
         FROM medicao m
         JOIN sensor s ON m.id_sensor = s.id
         JOIN unidade u ON s.id_unidade = u.id
         JOIN unidade_usuario uu ON uu.id_unidade = u.id
        WHERE MONTH(m.data_hora) = MONTH(CURRENT_DATE())
          AND YEAR(m.data_hora) = YEAR(CURRENT_DATE())
          AND uu.id_usuario = ${idUsuario}
          AND u.id = ${idUnidade}
      ) AS exportacoes_realizadas,

      (SELECT COUNT(*)
         FROM sensor s
         JOIN unidade u ON s.id_unidade = u.id
         JOIN unidade_usuario uu ON uu.id_unidade = u.id
        WHERE s.ativo = false
          AND uu.id_usuario = ${idUsuario}
          AND u.id = ${idUnidade}
      ) AS sensores_desativados,

      (SELECT current_time()) AS hora_atualizacao,

      (SELECT DATE_FORMAT(MAX(m.data_hora), '%d/%m/%Y')
         FROM medicao m
         JOIN sensor s ON m.id_sensor = s.id
         JOIN unidade u ON s.id_unidade = u.id
         JOIN unidade_usuario uu ON uu.id_unidade = u.id
        WHERE uu.id_usuario = ${idUsuario}
          AND u.id = ${idUnidade}
      ) AS data_atualizacao
  `;

  console.log("Executando a instrução SQL para buscar KPIs na unidade: \n"+ idUnidade + instrucaoSql);
  const [indicadores] = await database.executar(instrucaoSql);
  return indicadores;
}

module.exports = {
  buscarUnidadesPorEmpresa,
  cadastrar,
  buscarUnidadesPorUsuario,
  buscarSensoresPorUnidade,
  buscarAlertas,
  buscarIndicadores,
  buscarIndicadoresPorUnidade,
  buscarAlertasPorUnidade
}
