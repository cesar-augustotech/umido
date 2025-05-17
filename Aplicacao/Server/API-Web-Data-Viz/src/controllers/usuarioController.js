var usuarioModel = require("../models/usuarioModel");


async function logar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    console.log(req.body)

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

    }

    usuarioModel.logar(email, senha)
        .then(
            function (resultado) {
                res.json(JSON.stringify(resultado));
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

function salvarUsuario(req, res) {
    console.log(req.body)
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var nivel_de_acesso = req.body.nivel_de_acessoServer;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (nivel_de_acesso == undefined) {
        res.status(400).send("Sua empresa a vincular está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.salvarUsuario(nome, email, senha, nivel_de_acesso)
            .then(
                function (resultado) {
                    res.status(200).json(resultado);
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

function salvarUnidadesUsuario (req, res) {
    var idUnidade = req.body.unidade
    var idUsuario = req.body.id
    usuarioModel.salvarUnidadesUsuario(idUnidade, idUsuario).then(function (resultado) {
        res.status(200).json(resultado)
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage)
    })

    console.log('Salvndo a unidade')
}

function obterUnidadesUsuario(req, res) {
    usuarioModel.obterUnidadesUsuario().then(function (resultado) {
        res.status(200).json(resultado)
    }). catch(function (erro) {
        res.status(500).json(erro.sqlMessage)
    })
}

function obterDados(req, res) {
    var idEmpresa = req.body.idEmpresa
    console.log('CONTROLLER FOI' + idEmpresa)

    usuarioModel.obterDados(idEmpresa).then(function (resultado) {
        res.status(200).json(resultado)
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function removerUsuario(req, res) {
    var id = req.body.id

    console.log(id + 'REMOVER CONTROLLER')

    usuarioModel.removerUsuario(id).then(function (resultado) {
        res.json(resultado)
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function editarUsuario(req, res) {
    var id = req.body.idServer
    var nome = req.body.nomeServer
    var email = req.body.emailServer
    var senha = req.body.senhaServer
    var nivel_de_acesso = req.body.nivel_de_acessoServer

    usuarioModel.editarUsuario(id, nome, email, senha, nivel_de_acesso).then(function (resultado) {
        res.json(resultado)
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function obterUnidades(req, res) {
    var id = req.body.idServer

    usuarioModel.obterUnidades(id).then(function (resultado) {
        res.json(resultado)
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage)
    })
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
}