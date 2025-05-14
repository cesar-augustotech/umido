var empresaModel = require("../models/empresaModel");

function cadastrarEmpresa(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nomeRegistrado = req.body.nomeRegistradoServer;
    var cnpj = req.body.cnpjServer;
    var telefone = req.body.telefoneServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var nivelDeAcesso = req.body.nivelDeAcessoServer;

    // Faça as validações dos valores
    if (nomeRegistrado == undefined) {
        res.status(400).send("Seu nome registrado está undefined!");
    } else if (cnpj == undefined) {
        res.status(400).send("Seu cnpj está undefined!");
    } else if (telefone == undefined) {
        res.status(400).send("Seu telefone está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo empresaModel.js
        empresaModel.cadastrarEmpresa(nomeRegistrado,cnpj,telefone,email,senha,nivelDeAcesso)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}


function cadastrarUsuarioEmpresa(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nomeRegistrado = req.body.nomeRegistradoServer;
    var cnpj = req.body.cnpjServer;
    var telefone = req.body.telefoneServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var nivelDeAcesso = req.body.nivelDeAcessoServer;

    // Faça as validações dos valores
    if (nomeRegistrado == undefined) {
        res.status(400).send("Seu nome registrado está undefined!");
    } else if (cnpj == undefined) {
        res.status(400).send("Seu cnpj está undefined!");
    } else if (telefone == undefined) {
        res.status(400).send("Seu telefone está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo empresaModel.js
        empresaModel.cadastrarUsuarioEmpresa(nomeRegistrado,cnpj,telefone,email,senha,nivelDeAcesso)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}


module.exports = {
    cadastrarEmpresa,
    cadastrarUsuarioEmpresa

}