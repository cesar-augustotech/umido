// Variáveis globais
let usuarios = [];
let unidadesDisponiveis = [];
let idEditando;
let usuariosIds = [];
let listaCheckBoxCadastro = [];
let listaCheckBoxEditar = [];

const idUsuario = sessionStorage.getItem("ID_USUARIO");
const nomeUsuario = sessionStorage.getItem("NOME_USUARIO") || "Usuário";
const nivelAcesso = sessionStorage.getItem("NIVEL_DE_ACESSO");
const idEmpresa = sessionStorage.getItem("EMPRESA_ID");

nome_usuario_dashboard.innerHTML = nomeUsuario;
nivel_usuario_dashboard.innerHTML = nivelAcesso == 'admin' ? 'Administrador' : 'Comum';

// Carrega unidades disponíveis
fetch("/usuarios/obterUnidades", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ idServer: idUsuario }),
})
    .then(response => response.json())
    .then(unidadeUsuario => {
        unidadesDisponiveis = [];
        unidadeUsuario.forEach(unidadeAtual => {
            unidadesDisponiveis.push(unidadeAtual.nome);
        });
        gerarCheckboxes([], "checkboxes_unidades_cadastro", listaCheckBoxCadastro);
        gerarCheckboxes([], "checkboxes_unidades_editar", listaCheckBoxEditar);
    })
    .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
    });

function botao_abrir_fechar_menu() {
    const menuLateral = document.querySelector('.menu_lateral');
    menuLateral.classList.toggle('menu_expandido');
    botao_expandir.classList.toggle('girar');
}

function obterDados() {
    tabela_usuarios.innerHTML = '';
    usuariosIds = [];
    fetch('/usuarios/obterDados', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ idEmpresa: idEmpresa })
    })
        .then(response => response.json())
        .then(data => {
            usuarios = data;
            tabela_usuarios.innerHTML = "";
            usuarios.forEach(usuarios => {
                const tr = document.createElement("tr");
                usuariosIds.push(usuarios.id)
                tr.innerHTML = `
            <td>${usuarios.id}</td>
            <td>${usuarios.nome}</td>
            <td>${usuarios.email}</td>
            <td id="valores_obter_unidades${usuarios.id}"></td>
            <td>
              <button class="botao_buscar" onclick="abrirModalUsuarioEditar(${usuarios.id})" aria-label="Editar usuário">Editar</button>
              <button class="botao_cancelar" onclick="removerUsuario(${usuarios.id})" aria-label="Remover usuário">Remover</button>
            </td>
          `;
                tabela_usuarios.appendChild(tr);
            });
        })
        .then(function () {
            for (let i = 0; i < usuariosIds.length; i++) {
                fetch("/usuarios/obterUnidades", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ idServer: usuariosIds[i] }),
                })
                    .then(response => response.json())
                    .then(unidadeUsuario => {
                        const elemento = document.getElementById(`valores_obter_unidades${usuariosIds[i]}`);
                        let nomes = '';
                        unidadeUsuario.forEach(unidadeAtual => {
                            nomes += unidadeAtual.nome + ', ';
                        });
                        elemento.innerHTML = nomes.slice(0, -2);
                    })
                    .catch(function (resposta) {
                        console.log(`#ERRO: ${resposta}`);
                    });
            }
        })
        .catch(err => {
            console.log("Erro ao obter dados:", err);
        });
}

function abrirModalUsuario() {
    idEditando = null;
    document.getElementById("ipt_nome").value = "";
    document.getElementById("ipt_email").value = "";
    document.getElementById("ipt_senha").value = "";
    document.getElementById("sel_nivel").value = "comum";
    gerarCheckboxes([], "checkboxes_unidades_cadastro", listaCheckBoxCadastro);
    document.getElementById("modalUsuario").style.display = "block";
}

function abrirModalUsuarioEditar(id) {
    // Busca dados do usuário para preencher o modal
    const usuario = usuarios.find(u => u.id === id);
    document.getElementById("ipt_nome_editar").value = usuario ? usuario.nome : "";
    document.getElementById("ipt_email_editar").value = usuario ? usuario.email : "";
    document.getElementById("ipt_senha_editar").value = "";
    document.getElementById("sel_nivel_editar").value = usuario && usuario.nivel_de_acesso ? usuario.nivel_de_acesso : "comum";
    // Busca unidades vinculadas
    fetch("/usuarios/obterUnidades", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ idServer: id }),
    })
        .then(response => response.json())
        .then(unidadeUsuario => {
            const selecionadas = unidadeUsuario.map(u => u.nome);
            gerarCheckboxes(selecionadas, "checkboxes_unidades_editar", listaCheckBoxEditar);
        });
    document.getElementById("modalUsuarioEditar").style.display = "block";
    botaoEditar.innerHTML = `<button class="botao_salvar" onclick="editarUsuario(${id})" aria-label="Editar usuário">Editar</button>`;
}

function fecharModalUsuario() {
    document.getElementById("modalUsuario").style.display = "none";
}

function fecharModalUsuarioEditar() {
    document.getElementById("modalUsuarioEditar").style.display = "none";
}

function salvarUsuario() {
    var nomeFetch = ipt_nome.value.trim();
    var emailFetch = ipt_email.value.trim();
    var senhaFetch = ipt_senha.value;
    var nivel_de_acessoFetch = sel_nivel.value;
    const unidadesSelecionadas = [...listaCheckBoxCadastro];

    // Validação básica
    if (!nomeFetch || !emailFetch || !senhaFetch) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }
    if (!emailFetch.includes('@')) {
        alert("Digite um email válido.");
        return;
    }

    fecharModalUsuario();

    fetch("/usuarios/salvarUsuario", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nomeServer: nomeFetch,
            emailServer: emailFetch,
            senhaServer: senhaFetch,
            nivel_de_acessoServer: nivel_de_acessoFetch,
            unidades: unidadesSelecionadas
        }),
    })
        .then(function (resposta) {
            if (resposta.ok) {
                obterDados();
            } else {
                throw "Houve um erro ao tentar realizar o cadastro!";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function editarUsuario(id) {
    var nomeFetch = ipt_nome_editar.value.trim();
    var emailFetch = ipt_email_editar.value.trim();
    var senhaFetch = ipt_senha_editar.value;
    var nivel_de_acessoFetch = sel_nivel_editar.value;
    const unidadesSelecionadas = [...listaCheckBoxEditar];

    if (!nomeFetch || !emailFetch) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }
    if (!emailFetch.includes('@')) {
        alert("Digite um email válido.");
        return;
    }

    fecharModalUsuarioEditar();

    fetch("/usuarios/editarUsuario", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idServer: id,
            nomeServer: nomeFetch,
            emailServer: emailFetch,
            senhaServer: senhaFetch,
            nivel_de_acessoServer: nivel_de_acessoFetch,
            unidades: unidadesSelecionadas
        }),
    }).then(function (resposta) {
        if (resposta.ok) {
            obterDados();
        } else {
            throw "Houve um erro ao tentar realizar o cadastro!";
        }
    })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
    botaoEditar.innerHTML = '';
}

function removerUsuario(id) {
    if (confirm("Deseja realmente remover este usuário?")) {
        fetch("/usuarios/removerUsuario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        }).then(function (resposta) {
            if (resposta.ok) {
                obterDados();
            } else {
                throw "Houve um erro ao tentar excluir um usuario";
            }
        })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });
    }
}

// Função para gerar checkboxes de unidades
function gerarCheckboxes(selecionadas, containerId, listaCheckBox) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    listaCheckBox.length = 0;
    unidadesDisponiveis.forEach(unidade => {
        const id = `chk_${containerId}_${unidade.replace(/\s+/g, "_")}`;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = id;
        checkbox.value = unidade;
        checkbox.onchange = () => addListaCheck(checkbox, listaCheckBox);

        if (selecionadas && selecionadas.includes(unidade)) {
            checkbox.checked = true;
            listaCheckBox.push(unidade);
        }

        const label = document.createElement("label");
        label.htmlFor = id;
        label.innerText = unidade;
        label.style.marginRight = "15px";

        const div = document.createElement("div");
        div.appendChild(checkbox);
        div.appendChild(label);

        container.appendChild(div);
    });
}

function addListaCheck(checkbox, listaCheckBox) {
    if (checkbox.checked) {
        if (!listaCheckBox.includes(checkbox.value)) {
            listaCheckBox.push(checkbox.value);
        }
    } else {
        const index = listaCheckBox.indexOf(checkbox.value);
        if (index !== -1) {
            listaCheckBox.splice(index, 1);
        }
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = '../index.html';
}

// Chama obterDados ao carregar a página
obterDados();
if(sessionStorage.NIVEL_DE_ACESSO == "admin"){
    btn_config.style.display = ""
}