var usuarioModel = require("../models/usuarioModel");
var unidadeModel = require("../models/unidadeModel");
const e = require("express");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                   

                    if (resultadoAutenticar.length == 1) {
                        if (resultadoAutenticar[0].empresa_ativo == 0) {
                            res.status(403).send("A empresa deste usuário está inativa. Aguarde a ativação.");
                            return;
                        }

                        console.log(resultadoAutenticar);

                        unidadeModel.buscarUnidadesPorUsuario(resultadoAutenticar[0].id)
                            .then((resultadoUnidades) => {
                                if (resultadoUnidades.length > 0) {
                                    res.json({
                                        id: resultadoAutenticar[0].id,
                                        email: resultadoAutenticar[0].email,
                                        nome: resultadoAutenticar[0].nome,
                                        senha: resultadoAutenticar[0].senha,
                                        unidades: resultadoUnidades,
                                        nivel_de_acesso: resultadoAutenticar[0].nivel_de_acesso,
                                        empresa_ativo: resultadoAutenticar[0].empresa_ativo,
                                        empresa_id: resultadoAutenticar[0].empresa_id,
                                        empresa_nome: resultadoAutenticar[0].empresa_nome
                                    });
                                } else {
                                    res.status(204).json({ unidades: [] });
                                }
                            })
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {


    // Recupere os valores enviados pelo cadastro.html
    var nomeUsuario = req.body.nomeUsuarioServer;
    var nomeEmpresa = req.body.nomeEmpresaServer;
    var email = req.body.emailServer;
    var telefone = req.body.telefoneServer;
    var cnpj = req.body.cnpjServer;
    var senha = req.body.senhaServer;

    // Faça as validações dos valores
    if (nomeEmpresa == undefined) {
        res.status(400).send("O nome da sua empresa está undefined!");
    } else if (nomeUsuario == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (telefone == undefined) {
        res.status(400).send("Seu telefone está undefined!");
    } else if (cnpj == undefined) {
        res.status(400).send("Seu CNPJ está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else {
        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nomeUsuario, nomeEmpresa, email, telefone, cnpj, senha)
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

function salvarUsuario(req, res) {
    console.log(req.body)
    // Recupere os valores enviados pelo front
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var nivel_de_acesso = req.body.nivel_de_acessoServer;
    var unidades = req.body.unidades; // <-- Adicione esta linha para pegar as unidades

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (nivel_de_acesso == undefined) {
        res.status(400).send("Seu nível de acesso está undefined!");
    } else if (!Array.isArray(unidades) || unidades.length === 0) {
        res.status(400).send("Nenhuma unidade selecionada!");
    } else {
        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.salvarUsuario(nome, email, senha, nivel_de_acesso, unidades)
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

function obterDados(req, res) {
    var idEmpresa = req.body.idEmpresa
    console.log('CONTROLLER FOI' + idEmpresa)

    usuarioModel.obterDados(idEmpresa).then(function (resultado) {
        console.log(resultado)
        res.status(200).json(resultado)
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
function obterUnidadesUsuario(req, res) {
    usuarioModel.obterUnidadesUsuario().then(function (resultado) {
        res.status(200).json(resultado)
    }). catch(function (erro) {
        res.status(500).json(erro.sqlMessage)
    })
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
}