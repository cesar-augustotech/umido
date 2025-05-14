var database = require("../database/config")

function logar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
    select email,senha from usuario as usu
where usu.email = "${email}" and usu.senha = "${senha}"; 
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function obterDados(nome, email, nivel_de_acesso) {
    var instrucaoSql = `
        SELECT nome, email, nivel_de_acesso FROM usuario;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function salvarUsuario(nome, email, senha, nivel_de_acesso) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, nivel_de_acesso);

    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, nivel_de_acesso) VALUES ('${nome}', '${email}', '${senha}', '${nivel_de_acesso}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



module.exports = {
    autenticar,
    obterDados,
    salvarUsuario
};