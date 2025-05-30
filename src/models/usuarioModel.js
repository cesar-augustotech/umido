var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL para autenticar:", email);
    var instrucaoSql = `
        SELECT u.id, u.nome, u.email, u.nivel_de_acesso, e.nome AS empresa_nome, e.id AS empresa_id, e.ativo AS empresa_ativo
        FROM usuario u
        JOIN unidade_usuario uu ON uu.id_usuario = u.id
        JOIN unidade un ON un.id = uu.id_unidade
        JOIN empresa e ON e.id = un.id_empresa
        WHERE u.email = '${email}' AND u.senha = '${senha}' 
        LIMIT 1;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nomeUsuario, nomeEmpresa, email, telefone, cnpj, senha) {
    
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nomeUsuario, email, senha);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO empresa (nome, cnpj, telefone) VALUES ('${nomeEmpresa}', '${cnpj}', '${telefone}');
        SET @last_empresa_id = LAST_INSERT_ID();
        INSERT INTO unidade (nome, id_empresa) VALUES ('1º Unidade ${nomeEmpresa}', @last_empresa_id);
        SET @last_unidade_id = LAST_INSERT_ID();
        INSERT INTO usuario (nome, email, senha, nivel_de_acesso) VALUES ('${nomeUsuario}', '${email}', '${senha}', 'admin');
        SET @last_usuario_id = LAST_INSERT_ID();
        INSERT INTO unidade_usuario (id_usuario, id_unidade) VALUES (@last_usuario_id, @last_unidade_id);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


async function salvarUsuario(nomeServer, emailServer, senhaServer, nivel_de_acessoServer, unidades) {
 
  const sqlUsuario = ` 
    INSERT INTO usuario (nome, email, senha, nivel_de_acesso)
    VALUES ('${nomeServer}', '${emailServer}', '${senhaServer}', '${nivel_de_acessoServer}');
  `;
  const resultado = await database.executar(sqlUsuario);

 
  const usuarioId = resultado.insertId;

  
  for (const unidadeNome of unidades) {
    
    const [unidade] = await database.executar(`SELECT id FROM unidade WHERE nome = '${unidadeNome}'`);
    if (unidade) {
      await database.executar(`INSERT INTO unidade_usuario (id_usuario, id_unidade) VALUES (${usuarioId}, ${unidade.id})`);
    }
  }

  return { id: usuarioId }; 
}
async function removerUsuario(id) {
    console.log(id)
    var instrucaoSql1 = `
        DELETE FROM unidade_usuario WHERE id_usuario = ${id};
    `;
    var instrucaoSql2 = `
        DELETE FROM usuario WHERE id = ${id};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql1)
    await database.executar(instrucaoSql1);
    console.log("Executando a instrução SQL: \n" + instrucaoSql2)
    return database.executar(instrucaoSql2);
}

function editarUsuario(id, nome, email, senha, nivel_de_acesso) {
    console.log(id, nome, email, senha, nivel_de_acesso, 'MODELLLLLLLL')
    var instrucaoSql = `
        UPDATE usuario SET nome = '${nome}', email = '${email}', senha = '${senha}', nivel_de_acesso = '${nivel_de_acesso}' WHERE id = ${id};
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executar(instrucaoSql)
}

function obterDados(idEmpresa) {
    var instrucaoSql = `
        SELECT DISTINCT u.id, u.nome, u.email, u.nivel_de_acesso FROM usuario u 
        inner join unidade_usuario uu on u.id = uu.id_usuario 
        inner join unidade uni on uni.id = uu.id_unidade 
        inner join empresa e on e.id = uni.id_empresa where e.id = ${idEmpresa};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql)
}

function obterUnidades(id) {

    console.log(`OBTER UNIDADES DO USUARIO ${id}`)
    var instrucaoSql = `
    SELECT d.nome, d.id from unidade d inner join unidade_usuario uu on d.id = uu.id_unidade where uu.id_usuario = ${id};
    `

    return database.executar(instrucaoSql)
}

function obterUnidadesUsuario() {
    instrucaoSql = `SELECT max(id) as id from usuario;`
    console.log('Executando a instrução SQL: ' + instrucaoSql)

    return database.executar(instrucaoSql)
}

module.exports = {
    autenticar,
    cadastrar,
     salvarUsuario,
    removerUsuario,
    editarUsuario,
    obterDados,
    obterUnidades,
    obterUnidadesUsuario
};