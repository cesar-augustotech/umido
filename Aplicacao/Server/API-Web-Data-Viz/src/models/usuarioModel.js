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
    let usuario={}
    if(valido.length > 0){
        usuario = valido[0]
        if(usuario.nivel_de_acesso =="A"){
            let instrucaoSql2 = `
                select u.id, u.nome from unidade u
                    inner join empresa e on u.empresa_id = e.id where e.id = ${usuario.id_empresa};
            `
            let todas_unidades = await database.executar(instrucaoSql2);
            usuario.unidades = todas_unidades
        }else{
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
    logar,
    obterDados,
    salvarUsuario
};