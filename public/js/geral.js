// dashboard.js - versão sem .map() e sem .some(), variáveis descritivas

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

  separarUnidadesEExibir();
  await montarIndicadores();
  await montarListaDeAlertas();
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

// ======= Separar unides e exibir =======
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
    criarCartaoDeUnidade(listaUnidades[i]);
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

function criarCartaoDeUnidade(unidade) {
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
      <span class="valor_indicador" style="color:${corTexto}">${textoUmidade}</span>
    </p>
  `;

  areaUnidadesDisplay.appendChild(elementoCartao);
}

function definirCorPorUmidade(valor) {
  if (valor == null) return 'gray';
  if (valor > 50) return 'green';
  if (valor > 30) return 'yellow';
  return 'red';
}

function criarPainelDeBotoesAlerta(listaComAlerta) {
  const painel = document.createElement('div');
  painel.className = 'cartao';
  painel.innerHTML = '<h2>Unidades com Alerta</h2>';

  for (let i = 0; i < listaComAlerta.length; i++) {
    const botao = document.createElement('button');
    botao.className = 'botao_buscar';
    botao.textContent = listaComAlerta[i].nome;
    botao.onclick = function () { abrirRelatorioDaUnidade(listaComAlerta[i].id); };
    painel.appendChild(botao);
  }

  areaAlertasDisplay.appendChild(painel);
}

// ======= Indicadores (KPIs) =======
async function montarIndicadores() {
  indicadoresDisplay.innerHTML = '';
  try {
    const resposta = await fetch(`/unidades/indicadores/${usuarioId}`);
    const dados = await resposta.json();
    let valor = (dados.quantidade_alerta * 100 / dados.total_alertas).toFixed(2)
    let umidade_media = dados.umidade_media
    if (typeof valor != "number")
      valor = 0
    if (typeof umidade_media != "number")
      umidade_media = 0
    const itensIndicadores = [
      { valor: valor + '%', descricao: 'Porcentagem de alertas', complemento: '(Dia atual)' },
      { valor: umidade_media + '%', descricao: 'Umidade média', complemento: '(tempo real)' },
      { valor: dados.sensores_desativados, descricao: 'Sensores desativados', complemento: '' },
      { valor: dados.hora_atualizacao, descricao: 'Hora atualização', complemento: dados.data_atualizacao }
    ];

    for (let i = 0; i < itensIndicadores.length; i++) {
      const item = itensIndicadores[i];
      const div = document.createElement('div');
      div.className = 'cartao';
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
          <tr><th>Unidade</th><th>Sensor</th><th>Umidade</th><th>Data</th></tr>
          ${linhasTabela}
        </table>
      </div>`;

    listaAlertasDisplay.appendChild(container);
  } catch (erro) {
    console.error('Erro ao montar lista de alertas:', erro);
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
