async function acessar() {
    var emailVar = document.getElementById('ipt_login_email').value.trim();
    var senhaVar = document.getElementById('ipt_login_senha').value;


    if (emailVar == "suporte" && senhaVar == "Sptech#2024") {
        window.location.href = window.location.href.replace("login", "suporte")
        return
    }
    // Elementos para exibir mensagens de erro (adicione no HTML se quiser)
    var cardErro = document.getElementById('cardErro');
    var mensagem_erro = document.getElementById('mensagem_erro');

    // Limpa mensagens anteriores
    if (mensagem_erro) {
        mensagem_erro.style.color = "red";
        mensagem_erro.innerHTML = "";
    }

    if (emailVar === "" || senhaVar === "") {
        if (cardErro && mensagem_erro) {
            cardErro.style.display = "block";
            mensagem_erro.innerHTML = "Preencha todos os campos!";
            setTimeout(sumirMensagem, 5000);
        }
        return false;
    }

    try {
        const resposta = await fetch("/usuarios/autenticar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailServer: emailVar,
                senhaServer: senhaVar
            })
        });



        if (resposta.ok) {
            const json = await resposta.json();
            sessionStorage.EMAIL_USUARIO = json.email;
            sessionStorage.NOME_USUARIO = json.nome;
            sessionStorage.ID_USUARIO = json.id;
            sessionStorage.UNIDADES = JSON.stringify(json.unidades)
            sessionStorage.NIVEL_DE_ACESSO = json.nivel_de_acesso;
            sessionStorage.EMPRESA_ID = json.empresa_id;
            sessionStorage.EMPRESA_NOME = json.empresa_nome;


            if (json.empresa_ativo) {
                sessionStorage.EMPRESA_ATIVO = json.empresa_ativo;
            } else {
                sessionStorage.EMPRESA_ATIVO = "false";
                if (cardErro && mensagem_erro) {
                    cardErro.style.display = "block";
                    mensagem_erro.innerHTML = "Empresa não está ativa!";
                    setTimeout(sumirMensagem, 5000);
                }
                return false;
            }

            if (sessionStorage.EMAIL_USUARIO == 'umidoRoot') {
                sessionStorage.ADMIN = "true";
            } else {
                sessionStorage.ADMIN = "false";
            }
            await setTimeout(function () {
                if (sessionStorage.ADMIN == "true") {
                    window.location = "./pendentes.html";
                } else {
                    window.location = "./dashboard/geral.html";
                }

            }, 1000);
        } else {
            const texto = await resposta.text();
            if (cardErro && mensagem_erro) {
                cardErro.style.display = "block";
                mensagem_erro.innerHTML = texto || "Houve um erro ao tentar realizar o login!";
                setTimeout(sumirMensagem, 5000);
            }
        }
    } catch (erro) {
        if (cardErro && mensagem_erro) {
            cardErro.style.display = "block";
            mensagem_erro.innerHTML = "Erro de conexão!";
            setTimeout(sumirMensagem, 5000);
        }
    }

    return false;
}

function sumirMensagem() {
    var cardErro = document.getElementById('cardErro');
    if (cardErro) cardErro.style.display = "none";
}
