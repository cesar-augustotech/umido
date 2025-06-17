// dashboard.js - versão otimizada para atualização em tempo real sem recriar HTML

// ======= Seletores =======
const botaoExpandir = document.getElementById('botao_expandir');
const nomeUsuarioDisplay = document.getElementById('nome_usuario_dashboard');
const nivelUsuarioDisplay = document.getElementById('nivel_usuario_dashboard');
const areaUnidadesDisplay = document.getElementById('areaUnidades');
const areaAlertasDisplay = document.getElementById('areaAlertas');
const indicadoresDisplay = document.getElementById('indicadores');
const listaAlertasDisplay = document.getElementById('areaListaAlertas');

let listaUnidades = [];
const usuarioId = sessionStorage.getItem('ID_USUARIO');
const usuarioNome = sessionStorage.getItem('NOME_USUARIO') || 'Usuário';
const usuarioNivel = sessionStorage.getItem('NIVEL_DE_ACESSO');

// ======= Inicialização =======
async function inicializarDashboard() {
    configurarMenuLateral();
    mostrarDadosDoUsuario();
    if (!usuarioId) {
        limparSessaoELogoff();
        return;
    }
    await carregarUnidadesComSensores();
    if (usuarioNivel === 'admin') mostrarBotaoConfiguracoes();

    separarUnidadesEExibir();
    await montarIndicadores();
    await montarListaDeAlertas();

    setInterval(() => {
        atualizarDashboard();
    }, 1000);
}

// ======= Menu =======
function configurarMenuLateral() {
    botaoExpandir.onclick = function () {
        const menu = document.querySelector('.menu_lateral');
        menu.classList.toggle('menu_expandido');
        botaoExpandir.classList.toggle('girar');
    };
}

// ======= Usuário =======
function mostrarDadosDoUsuario() {
    nomeUsuarioDisplay.textContent = usuarioNome;
    nivelUsuarioDisplay.textContent = (usuarioNivel === 'admin') ? 'Administrador' : 'Comum';
}

function mostrarBotaoConfiguracoes() {
    const botaoConfig = document.getElementById('btn_config');
    botaoConfig.style.display = 'block';
}

function limparSessaoELogoff() {
    sessionStorage.clear();
    window.location.href = '../index.html';
}

// ======= Carregamento de Unidades e Sensores =======
async function carregarUnidadesComSensores() {
    const unidadesTexto = sessionStorage.getItem('UNIDADES');
    listaUnidades = unidadesTexto ? JSON.parse(unidadesTexto) : [];

    for (let indiceUnidade = 0; indiceUnidade < listaUnidades.length; indiceUnidade++) {
        const unidadeAtual = listaUnidades[indiceUnidade];
        unidadeAtual.sensores = await buscarSensoresDaUnidade(unidadeAtual.id);
        for (let indiceSensor = 0; indiceSensor < unidadeAtual.sensores.length; indiceSensor++) {
            const sensorAtual = unidadeAtual.sensores[indiceSensor];
            sensorAtual.ultimaMedida = await buscarUltimaMedidaDoSensor(sensorAtual.id);
        }
    }

    if (listaUnidades.length === 0) {
        areaUnidadesDisplay.innerHTML = '<p>Nenhuma unidade encontrada.</p>';
        return;
    }
}

async function buscarSensoresDaUnidade(idUnidade) {
    try {
        const resposta = await fetch(`/unidades/sensores/unidade/${idUnidade}`);
        if (resposta.ok && resposta.status !== 204) {
            return await resposta.json();
        }
    } catch (erro) {
        console.error('Erro ao buscar sensores da unidade', erro);
    }
    return [];
}

async function buscarUltimaMedidaDoSensor(idSensor) {
    try {
        const resposta = await fetch(`/medidas/ultima/${idSensor}`);
        if (resposta.ok && resposta.status !== 204) {
            return await resposta.json();
        }
    } catch (erro) {
        console.error('Erro ao buscar última medida do sensor', erro);
    }
    return null;
}

// ======= Separar unidades e exibir (criação inicial dos cartões) =======
function separarUnidadesEExibir() {
    areaUnidadesDisplay.innerHTML = '';

    for (let i = 0; i < listaUnidades.length; i++) {
        calcularMenorUmidadeDaUnidade(listaUnidades[i]);
    }

    listaUnidades.sort((a, b) => {
        if (a.menorUmidade == null && b.menorUmidade == null) return 0;
        if (a.menorUmidade == null) return 1;
        if (b.menorUmidade == null) return -1;
        return a.menorUmidade - b.menorUmidade;
    });

    for (let i = 0; i < listaUnidades.length; i++) {
        criarElementoCartao(listaUnidades[i]);
    }
}

function calcularMenorUmidadeDaUnidade(unidade) {
    let valorMenor = null;
    for (let i = 0; i < unidade.sensores.length; i++) {
        const medida = unidade.sensores[i].ultimaMedida;
        if (medida && medida.umidade != null) {
            const valorAtual = parseFloat(medida.umidade);
            if (!isNaN(valorAtual) && (valorMenor === null || valorAtual < valorMenor)) {
                valorMenor = valorAtual;
            }
        }
    }
    unidade.menorUmidade = valorMenor;
}

function criarElementoCartao(unidade) {
    const elementoCartao = document.createElement('div');
    elementoCartao.className = 'cartao';
    elementoCartao.style.cursor = 'pointer';
    elementoCartao.onclick = function () { abrirRelatorioDaUnidade(unidade.id); };

    const textoUmidade = (unidade.menorUmidade != null)
        ? unidade.menorUmidade.toFixed(2) + '%'
        : 'Sem dados';

    const corTexto = definirCorPorUmidade(unidade.menorUmidade);

    elementoCartao.innerHTML = `
        <h4>${unidade.nome}</h4>
        <p>Menor umidade:<br>
        <span class="valor_indicador" id="medicao_${unidade.id}" style="color:${corTexto}">${textoUmidade}</span>
        </p>
    `;

    areaUnidadesDisplay.appendChild(elementoCartao);
}

function definirCorPorUmidade(valor) {
    if (valor == null) return 'gray';
    if (valor > 50) return 'green';
    if (valor > 29) return 'orange';
    return 'red';
}

// ======= Atualização em tempo real sincronizada =======
async function atualizarDashboard() {
    await atualizarUmidadesDasUnidades();
    await atualizarKPIs();
    await atualizarListaDeAlertas();
}
let menorT = 0
async function atualizarUmidadesDasUnidades() {
    const unidadesTexto = sessionStorage.getItem('UNIDADES');
    let listaUnidadesAtualizada = unidadesTexto ? JSON.parse(unidadesTexto) : [];

    for (let indiceUnidade = 0; indiceUnidade < listaUnidadesAtualizada.length; indiceUnidade++) {
        const unidadeAtual = listaUnidadesAtualizada[indiceUnidade];
        unidadeAtual.sensores = await buscarSensoresDaUnidade(unidadeAtual.id);
        for (let indiceSensor = 0; indiceSensor < unidadeAtual.sensores.length; indiceSensor++) {
            const sensorAtual = unidadeAtual.sensores[indiceSensor];
            sensorAtual.ultimaMedida = await buscarUltimaMedidaDoSensor(sensorAtual.id);
        }
        let dadosSensores = {}
        await fetch(`/relatorios/buscarUmidadePorSensor/${unidadeAtual.id}`, { cache: 'no-store' })
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (resposta) {
                        let minimo = {
                            id: 0,
                            medicao: 0,
                            identificador: ""
                        }
                        let listaM = {}
                        resposta.forEach(u => {
                            listaM[u.identificador] ??= []
                            listaM[u.identificador].push(parseFloat(u.umidade))
                            if (minimo.id == 0 || parseFloat(u.umidade) < minimo.medicao) {
                                minimo.id = u.id
                                minimo.medicao = parseFloat(u.umidade)
                                minimo.identificador = u.identificador
                            }
                            dadosSensores[u.id_sensor] ??= { medicoes: [], identificador: u.identificador, unidade: unidadeAtual.id };
                            if (u.data_hora && u.umidade != null) {
                                dadosSensores[u.id_sensor].medicoes.push({ data: u.data_hora, medicao: u.umidade, status: u.alerta });
                            }
                        });
                        for (let u in listaM) {
                            let dados = []
                            for (let i = 1; i < 10; i++) {
                                dados.push(listaM[u][listaM[u].length - i])
                            }
                            listaM[u] = dados
                        }

                        let minimoM = 0
                        for (let u in listaM) {
                            for (let i in listaM[u]) {
                                if (minimoM == 0 || listaM[u][i] < minimoM) {
                                    minimoM = listaM[u][i]
                                }
                            }
                        }
                        if (menorT == 0 || listaM[u][i] < menorT) {
                            menorT = listaM[u][i]
                        }
                        console.log(dadosSensores, 208)
                        const spanUmidade = document.getElementById(`medicao_${unidadeAtual.id}`);
                        if (spanUmidade) {
                            const textoUmidade = (minimoM != null)
                                ? minimoM + '%'
                                : 'Sem dados';
                            spanUmidade.textContent = textoUmidade;
                            spanUmidade.style.color = definirCorPorUmidade(minimoM);
                        }
                        document.querySelector("#kpi_1 > div.valor_indicador").textContent = menorT + '%';
                    });
                }
            });
        /*
        calcularMenorUmidadeDaUnidade(unidadeAtual);

        const spanUmidade = document.getElementById(`medicao_${unidadeAtual.id}`);
        if (spanUmidade) {
            const textoUmidade = (unidadeAtual.menorUmidade != null)
                ? unidadeAtual.menorUmidade.toFixed(2) + '%'
                : 'Sem dados';
            spanUmidade.textContent = textoUmidade;
            spanUmidade.style.color = definirCorPorUmidade(unidadeAtual.menorUmidade);
        }
        */
    }

    listaUnidades = listaUnidadesAtualizada;
}

// ======= Indicadores (KPIs) =======
let menorUmidadeExibida = 1000;

async function montarIndicadores() {
    indicadoresDisplay.innerHTML = '';
    try {
        const resposta = await fetch(`/unidades/indicadores/${usuarioId}`);
        const dados = await resposta.json();
        let valor = (dados.quantidade_alerta * 100 / dados.total_alertas).toFixed(2)
        let umidade_media = dados.umidade_media
        if (typeof valor != "number" || isNaN(valor)) valor = 0
        if (typeof umidade_media != "number" || isNaN(umidade_media)) umidade_media = 0

        menorUmidadeExibida = 1000;
        for (let i = 0; i < listaUnidades.length; i++) {
            if (listaUnidades[i].menorUmidade != null && listaUnidades[i].menorUmidade < menorUmidadeExibida) {
                menorUmidadeExibida = listaUnidades[i].menorUmidade;
            }
        }
        if (menorUmidadeExibida === 1000) menorUmidadeExibida = 0;

        const itensIndicadores = [
            { valor: valor + '%', descricao: 'Porcentagem de alertas', complemento: '(Dia atual)' },
            { valor: menorUmidadeExibida + '%', descricao: 'Menor umidade', complemento: '(tempo real)' },
            { valor: dados.sensores_desativados, descricao: 'Sensores desativados', complemento: '' },
            { valor: dados.hora_atualizacao, descricao: 'Hora atualização', complemento: dados.data_atualizacao }
        ];

        for (let i = 0; i < itensIndicadores.length; i++) {
            const item = itensIndicadores[i];
            const div = document.createElement('div');
            div.className = 'cartao';
            div.id = 'kpi_' + i;
            div.innerHTML = `
                <div class="valor_indicador">${item.valor}</div>
                <div class="descricao_indicador">${item.descricao}</div>
                <div class="info_adicional">${item.complemento}</div>
            `;
            indicadoresDisplay.appendChild(div);
        }
    } catch (erro) {
        console.error('Erro ao montar indicadores:', erro);
    }
}

async function atualizarKPIs() {
    try {
        const resposta = await fetch(`/unidades/indicadores/${usuarioId}`);
        const dados = await resposta.json();
        let valor = (dados.quantidade_alerta * 100 / dados.total_alertas).toFixed(2)
        let umidade_media = dados.umidade_media
        if (typeof valor != "number" || isNaN(valor)) valor = 0
        if (typeof umidade_media != "number" || isNaN(umidade_media)) umidade_media = 0

        menorUmidadeExibida = 1000;
        for (let i = 0; i < listaUnidades.length; i++) {
            if (listaUnidades[i].menorUmidade != null && listaUnidades[i].menorUmidade < menorUmidadeExibida) {
                menorUmidadeExibida = listaUnidades[i].menorUmidade;
            }
        }
        if (menorUmidadeExibida === 1000) menorUmidadeExibida = 0;

        document.querySelector('#kpi_0 .valor_indicador').textContent = valor + '%';
        document.querySelector('#kpi_2 .valor_indicador').textContent = dados.sensores_desativados;
        document.querySelector('#kpi_3 .valor_indicador').textContent = dados.hora_atualizacao;
    } catch (erro) {
        console.error('Erro ao atualizar KPIs:', erro);
    }
}

// ======= Lista de Alertas =======
async function montarListaDeAlertas() {
    listaAlertasDisplay.innerHTML = '';
    try {
        const resposta = await fetch(`/unidades/alertas/${usuarioId}`);
        const alertas = await resposta.json();
        let linhasTabela = '';

        if (alertas.length === 0) {
            linhasTabela = '<tr><td colspan="4">Nenhum alerta nas últimas 24h</td></tr>';
        } else {
            for (let i = 0; i < alertas.length; i++) {
                const alerta = alertas[i];
                linhasTabela += `
                    <tr>
                        <td>${alerta.unidade_nome}</td>
                        <td>${alerta.sensor_nome}</td>
                        <td>${alerta.umidade}%</td>
                        <td>${new Date(alerta.data_hora).toLocaleString()}</td>
                    </tr>`;
            }
        }

        const container = document.createElement('div');
        container.className = 'container_grafico_mensal';
        container.innerHTML = `
            <div class="cartao">
                <div class="valor_indicador">ALERTAS</div>
                <div class="descricao_indicador">Últimos alertas registrados (24h)</div>
                <table class="tabela_grafico">
                    <thead>
                        <tr><th>Unidade</th><th>Área</th><th>Umidade</th><th>Data</th></tr>
                    </thead>
                    <tbody id="tbody_alertas">
                        ${linhasTabela}
                    </tbody>
                </table>
            </div>`;
        listaAlertasDisplay.appendChild(container);
    } catch (erro) {
        console.error('Erro ao montar lista de alertas:', erro);
    }
}

async function atualizarListaDeAlertas() {
    try {
        const resposta = await fetch(`/unidades/alertas/${usuarioId}`);
        const alertas = await resposta.json();
        let linhasTabela = '';

        if (alertas.length === 0) {
            linhasTabela = '<tr><td colspan="4">Nenhum alerta nas últimas 24h</td></tr>';
        } else {
            for (let i = 0; i < alertas.length; i++) {
                const alerta = alertas[i];
                linhasTabela += `
                    <tr>
                        <td>${alerta.unidade_nome}</td>
                        <td>${alerta.sensor_nome}</td>
                        <td>${alerta.umidade}%</td>
                        <td>${new Date(alerta.data_hora).toLocaleString()}</td>
                    </tr>`;
            }
        }

        const tbody = document.getElementById('tbody_alertas');
        if (tbody) {
            tbody.innerHTML = linhasTabela;
        }
    } catch (erro) {
        console.error('Erro ao atualizar lista de alertas:', erro);
    }
}

// ======= Ações =======
function abrirRelatorioDaUnidade(idUnidade) {
    window.location.href = `./relatorio.html?ID=${idUnidade}`;
}

function logout() {
    limparSessaoELogoff();
}

// ======= Executa =======
inicializarDashboard();