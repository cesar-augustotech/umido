
let unidades = [];

const idUsuario = sessionStorage.getItem("ID_USUARIO"); // Pega o ID do usuário logado ou usa 1 como padrão
const nomeUsuario = sessionStorage.getItem("NOME_USUARIO") || "Usuário";
const nivelAcesso = sessionStorage.getItem("NIVEL_DE_ACESSO");
nome_usuario_dashboard.innerHTML = nomeUsuario;
nivel_usuario_dashboard.innerHTML = nivelAcesso == 'admin' ? 'Administrador' : 'comum';

function botao_abrir_fechar_menu() {
    const menuLateral = document.querySelector('.menu_lateral');
    menuLateral.classList.toggle('menu_expandido');
    botao_expandir.classList.toggle('girar');
}




let paginaAtual = 1;
const itensPorPagina = 10;


async function atualizarPaginaInicial() {
    // Recupera as unidades do sessionStorage
    unidades = sessionStorage.getItem("UNIDADES") ? JSON.parse(sessionStorage.getItem("UNIDADES")) : [];

    // Para cada unidade, busca os sensores e a última medida de cada sensor
    for (const unidade of unidades) {
        // Busca sensores da unidade
        let sensores = [];
        try {
            const respSensores = await fetch(`/unidades/sensores/unidade/${unidade.id}`);
            if (respSensores.ok) {
                // Só tenta ler o JSON se houver conteúdo
                if (respSensores.status !== 204) {
                    sensores = await respSensores.json();
                } else {
                    sensores = [];
                }
            }
        } catch (error) {
            console.error(`Erro ao buscar sensores da unidade ${unidade.id}:`, error);
        }

        unidade.sensores = await Promise.all(sensores.map(async sensor => {
            let ultimaMedida = null;
            try {
                const respMedida = await fetch(`/medidas/ultima/${sensor.id}`);
                if (respMedida.ok && respMedida.status !== 204) {
                    ultimaMedida = await respMedida.json();
                }
            } catch (error) {
                console.error(`Erro ao buscar última medida do sensor ${sensor.id}:`, error);
            }
            return {
                ...sensor,
                ultimaMedida
            };
        }));
    }

    /*[
    { id: 1, id_unidade: 1, identificador: 'SENT-1A', ativo: 1 },
    { id: 2, id_unidade: 1, identificador: 'SENT-1B', ativo: 1 }
  ]
  [
    {
      id: 200,
      id_sensor: 1,
      umidade: '55.10',
      data_hora: 2025-06-09T19:00:00.000Z,
      alerta: null
    }
  ]
  []
  [ { id: 3, id_unidade: 2, identificador: 'SENT-2A', ativo: 1 } ]
  []
  []
  []
  []
  [
    { id: 1, id_unidade: 1, identificador: 'SENT-1A', ativo: 1 },
    { id: 2, id_unidade: 1, identificador: 'SENT-1B', ativo: 1 }
  ]
  []
  [
    {
      id: 200,
      id_sensor: 1,
      umidade: '55.10',
      data_hora: 2025-06-09T19:00:00.000Z,
      alerta: null
    }
  ]
  [ { id: 3, id_unidade: 2, identificador: 'SENT-2A', ativo: 1 } ]
  []
  []
  []
  []
  */


    if (!unidades || unidades.length === 0) {
        document.getElementById("areaUnidades").innerHTML = "<p>Nenhuma unidade encontrada.</p>";
        return;
    }



    console.log("Unidades carregadas:", unidades);

    const areaAlertas = document.getElementById("areaAlertas");
    const areaUnidades = document.getElementById("areaUnidades");

    areaUnidades.innerHTML = "";

    // Ordena as unidades pela menor umidade registrada entre os sensores de cada unidade
    unidades.sort((a, b) => {
        const umidadesA = a.sensores
            .map(s => (s.ultimaMedida && s.ultimaMedida.umidade !== undefined && s.ultimaMedida.umidade !== null)
                ? parseFloat(s.ultimaMedida.umidade)
                : null)
            .filter(v => v !== null && !isNaN(v));
        const umidadesB = b.sensores
            .map(s => (s.ultimaMedida && s.ultimaMedida.umidade !== undefined && s.ultimaMedida.umidade !== null)
                ? parseFloat(s.ultimaMedida.umidade)
                : null)
            .filter(v => v !== null && !isNaN(v));

        const menorA = umidadesA.length ? Math.min(...umidadesA) : Infinity;
        const menorB = umidadesB.length ? Math.min(...umidadesB) : Infinity;

        return menorA - menorB;
    });

    console.log("Unidades ordenadas:", unidades);
    console.log("Unidades com sensores:", unidades.filter(u => u.sensores.length > 0));

    console.log("Unidades com alertas:", unidades.filter(u => u.sensores.some(s => s.ultimaMedida && s.ultimaMedida.alerta == "1")));

    const alertas = unidades.filter(u => u.sensores.some(s => s.ultimaMedida && s.ultimaMedida.alerta == "1"))
    const normais = unidades.filter(u => !alertas.includes(u));

    if (alertas.length) {
        const divAlerta = document.createElement("div");
        divAlerta.className = "cartao";
        divAlerta.innerHTML = `<h2>Unidades com Alerta</h2>`;
        alertas.forEach(u => {
            const btn = document.createElement("button");
            btn.className = "botao_buscar";
            btn.textContent = u.nome;
            btn.onclick = () => abrirModalUnidade(u.id);
            divAlerta.appendChild(btn);
        });
        areaAlertas.appendChild(divAlerta);
    }

    normais.concat(alertas).forEach(u => {
        const card = document.createElement("div");
        card.className = "cartao";
        card.style.cursor = "pointer";
        card.onclick = () => abrirModalUnidade(u.id);

        const menorUmidade = Math.min(
            ...u.sensores
                .map(s =>
                    s.ultimaMedida &&
                        s.ultimaMedida.umidade !== undefined &&
                        s.ultimaMedida.umidade !== null &&
                        !isNaN(parseFloat(s.ultimaMedida.umidade))
                        ? parseFloat(s.ultimaMedida.umidade)
                        : Infinity
                )
        );

        card.innerHTML = `
    <h4>${u.nome}</h4>
    <p>Menor umidade:<br><span class="valor_indicador"> ${menorUmidade !== Infinity ? menorUmidade.toFixed(2) + "%" : "Sem dados"}</span></p>
    ${u.sensores.some(s => s.alerta === 1)
                ? '<p class="info_adicional" style="color:#e84118;">Alerta ativo!</p>'
                : ''
            }
  `;
        areaUnidades.appendChild(card);
    });

    criar_lista_alertas();
    criar_kpis();

}

async function criar_kpis() {
    indicadores.innerHTML = "";
    //TROCAR ID DA EMPRESA AQUIIIIIIIIIIIIIIIIIIIII
    try {
        const response = await fetch(`/unidades/indicadores/${idUsuario}`);
        const dados = await response.json();
        console.log(dados);

        let dadosIndicadores = [
            [(dados.quantidade_alerta * 100 / dados.total_alertas).toFixed(2), "Porcentagem de alertas", "(Dia atual)"],
            [dados.umidade_media + "%", "menor umidade atual", "(em tempo atual)"],

            [dados.sensores_desativados, "sensores desativados", ""],
            [dados.hora_atualizacao, dados.data_atualizacao, "última atualização"]
        ];

        for (let i = 0; i < dadosIndicadores.length; i++) {
            indicadores.innerHTML += `
        <div class="cartao">
            <div class="valor_indicador">${dadosIndicadores[i][0]}</div>
            <div class="descricao_indicador">${dadosIndicadores[i][1]}</div>
            <div class="info_adicional">${dadosIndicadores[i][2]}</div>
        </div>`;
        }
    } catch (error) {
        console.error("Erro ao buscar indicadores:", error);
    }
}

async function criar_lista_alertas() {
    let html_lista = "";
    let areaListaAlertas = document.getElementById("areaListaAlertas");

    try {
        //TROCAR ID DA EMPRESA AQUIIIIIIIIIIIIIIIIIIIII
        const resposta = await fetch(`/unidades/alertas/${idUsuario}`);
        const alertas = await resposta.json();

        if (alertas.length === 0) {
            html_lista = `<tr><td colspan="2">Nenhum alerta nas últimas 24h</td></tr>`;
        } else {
            alertas.forEach(a => {
                html_lista += `
                
                  <td>${a.unidade_nome}</td>
                  <td>${a.sensor_nome}</td>
                  <td>${a.umidade}%</td>
                  <td>${new Date(a.data_hora).toLocaleString()}</td>
                </tr>
              `;
            });
        }
    } catch (error) {
        html_lista = `<tr><td colspan="2">Erro ao buscar alertas</td></tr>`;
    }

    let html = `
    <div class="container_grafico_mensal">
      <div class="cartao">
        <div class="valor_indicador">ALERTAS</div>
        <div class="descricao_indicador">Últimos alertas registrados (24h)</div><br>
        <table class="tabela_grafico">
          <tr>
            <th>Unidade</th>
            <th>Sensor</th>
            <th>Umidade</th>
            <th>Data</th>
          </tr>
          ${html_lista}
        </table>
      </div>
    </div>
  `;
    areaListaAlertas.innerHTML = html;
}

function abrirModalUnidade(id) {
    const u = unidades.find(x => x.id === id);
    console.log(unidades)
    document.getElementById("uni_nome").textContent = u.nome;
    const ulSens = document.getElementById("uni_sensores");
    ulSens.innerHTML = "";
    u.sensores.forEach(s => {
        const li = document.createElement("li");
        li.textContent = `${s.nome} ${s.umidade} ${s.alerta === 1 ? " ⚠️ (ALERTA)" : ""}`;
        ulSens.appendChild(li);
    });
    document.getElementById("uni_infos").textContent = u.outrasInfos;
    document.getElementById("modalUnidade").style.display = "block";
}

function fecharModalUnidade() {
    document.getElementById("modalUnidade").style.display = "none";
}


function logout() {
    sessionStorage.clear()
    window.location.href = '../index.html'
}

atualizarPaginaInicial();
if (sessionStorage.NIVEL_DE_ACESSO == "admin") {
    btn_config.style.display = ""
}