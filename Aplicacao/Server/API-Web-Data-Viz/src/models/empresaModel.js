var database = require("../database/config")

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql

function cadastrarUsuarioEmpresa(nomeRegistrado,cnpj,telefone,email,senha,nivelDeAcesso) {
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
      INSERT INTO usuario (nome, email, senha,nivel_de_acesso) VALUES 
        ('${nomeRegistrado}', '${email}', '${senha}','${nivelDeAcesso}')
       `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarEmpresa(nomeRegistrado,cnpj,telefone,email,senha,nivelDeAcesso) {
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO empresa (nome,cnpj,telefone)
        VALUES
        ('${nomeRegistrado}','${cnpj}','${telefone}');

   
       `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    cadastrarEmpresa,
    cadastrarUsuarioEmpresa
};