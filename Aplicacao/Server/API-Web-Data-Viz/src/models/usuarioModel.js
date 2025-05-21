var database = require("../database/config")

async function logar(email, senha) {
    var instrucaoSql = `
        SELECT u.id as "id_usuario", u.nome as "nome_usuario", u.senha as "senha", u.email as "email_usuario", u.nivel_de_acesso as "nivel_de_acesso", e.ativo, e.id as "id_empresa" FROM usuario u
        inner join unidade_usuario uu on uu.id_unidade = u.id
            inner join unidade uni on uni.id = uu.id_unidade
                inner join empresa e on uni.empresa_id = e.id
where u.email = "${email}" and u.senha = "${senha}";
    `;
    let valido = await database.executar(instrucaoSql);
    let usuario = {}
    if (valido.length > 0) {
        usuario = valido[0]
        if (usuario.nivel_de_acesso == "A") {
            let instrucaoSql2 = `
                select u.id, u.nome from unidade u
                    inner join empresa e on u.empresa_id = e.id where e.id = ${usuario.id_empresa};
            `
            let todas_unidades = await database.executar(instrucaoSql2);
            usuario.unidades = todas_unidades
        } else {
            let instrucaoSql2 = `
            select u.id, u.nome from unidade_usuario uu
                inner join unidade u on u.id = uu.id_unidade
            where uu.id_usuario = ${usuario.id_usuario};
            `
            let todas_unidades = await database.executar(instrucaoSql2);
            usuario.unidades = todas_unidades
        }
    }
    return usuario

}


function obterDados(idEmpresa) {
    var instrucaoSql = `
        SELECT DISTINCT u.id, u.nome, u.email, u.nivel_de_acesso FROM usuario u 
        inner join unidade_usuario uu on u.id = uu.id_usuario 
        inner join unidade uni on uni.id = uu.id_unidade 
        inner join empresa e on e.id = uni.empresa_id where e.id = ${idEmpresa};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql)
}

function obterUnidades(id) {

    console.log(`OBTER DADOS DA UNIDADE ${id}`)
    var instrucaoSql = `
    SELECT nome from unidade d inner join unidade_usuario uu on d.id = uu.id_unidade where uu.id_usuario = ${id};
    `

    return database.executar(instrucaoSql)
}

function salvarUsuario(nome, email, senha, nivel_de_acesso) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, nivel_de_acesso);

    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, nivel_de_acesso) VALUES ('${nome}', '${email}', '${senha}', '${nivel_de_acesso}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql)
}

function salvarUnidadesUsuario(idUnidade, idUsuario) {
    var instrucaoSql = `
        INSERT INTO unidade_usuario (id_usuario, id_unidade)
            VALUES (
            ${idUsuario},
            (SELECT id FROM unidade WHERE nome = '${idUnidade}')
        );
    `
    console.log(instrucaoSql)
    return database.executar(instrucaoSql)
}

function obterUnidadesUsuario() {
    instrucaoSql = `SELECT max(id) as id from usuario;`
    console.log('Executando a instrução SQL: ' + instrucaoSql)

    return database.executar(instrucaoSql)
}

function removerUsuario(id) {
    console.log(id)
    var instrucaoSql = `
        DELETE FROM unidade_usuario where id_usuario = ${id};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    database.executar(instrucaoSql);
    instrucaoSql = `
        DELETE FROM usuario where id = ${id};
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executar(instrucaoSql)

}

function editarUsuario(id, nome, email, senha, nivel_de_acesso) {
    console.log(id, nome, email, senha, nivel_de_acesso, 'MODELLLLLLLL')
    var instrucaoSql = `
        UPDATE usuario SET nome = '${nome}', email = '${email}', senha = '${senha}', nivel_de_acesso = '${nivel_de_acesso}' WHERE id = ${id};
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executar(instrucaoSql)
}







module.exports = {
    logar,
    obterDados,
    salvarUsuario,
    removerUsuario,
    editarUsuario,
    obterUnidades,
    salvarUnidadesUsuario,
    obterUnidadesUsuario
};