
const idUsuario = sessionStorage.getItem("ID_USUARIO"); // Pega o ID do usuário logado ou usa 1 como padrão
const idEmpresa = sessionStorage.getItem("EMPRESA_ID")
const nomeUsuario = sessionStorage.getItem("NOME_USUARIO") || "Usuário";
const nivelAcesso = sessionStorage.getItem("NIVEL_DE_ACESSO");
nome_usuario_dashboard.innerHTML = nomeUsuario;
nivel_usuario_dashboard.innerHTML = nivelAcesso == 'admin' ? 'Administrador' : 'comum';
var graficoUmidadeSemana
var graficoAlertasPie
var graficoUmidadeMedia
var dadosSensores = {}
var setIntervalGrafico;
// Função para buscar as unidades relacionadas ao usuário logado
async function carregarUnidadesUsuario() {

    const response = await fetch("/usuarios/obterUnidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idServer: idUsuario })
    });
    const unidades = await response.json();

    const select = document.getElementById("selecionar_unidade");
    select.innerHTML = "";

    unidades.forEach(unidade => {
        const option = document.createElement("option");
        option.value = unidade.id;
        option.textContent = unidade.nome;
        select.appendChild(option);
    });

    // Chama o restante da lógica para atualizar os gráficos e KPIs

}

let idUnidadeSelecionada = null;

// Chame ao carregar a página
carregarUnidadesUsuario();


let ultimo_grafico;


const modalAdicionarSensor = modal_adicionar_sensor;

const formularioAdicionarSensor = formulario_adicionar_sensor;


function buscarUmidadePorSensor(idUnidade) {
    fetch(`/relatorios/buscarUmidadePorSensor/${idUnidade}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    let sensores = [];
                    lista_sensores.innerHTML = "";

                    resposta.forEach(u => {

                        if (!sensores.includes(u.identificador)) {

                            const pendente = !u.data_hora || u.umidade == null;
                            lista_sensores.innerHTML += `
                                <li style="display: flex; justify-content: space-around; width: 100%;">
                                    ${u.identificador}
                                    ${pendente ? `
                                        <span style="color: ${pendente ? '#e1b12c' : '#44bd32'}; font-size: 0.9em;">
                                        ${pendente ? 'Pendente' : ''}
                                    </span>
                                        `: `
                                        <button class="botao_adicionar" onclick="mostrar_modal_sensor(${u.id_sensor})">Ver Mais</button>
                                        `}
                                </li>`;
                            sensores.push(u.identificador);
                        }

                        dadosSensores[u.id_sensor] ??= { medicoes: [], identificador: u.identificador, unidade: idUnidade };

                        if (u.data_hora && u.umidade != null) {
                            dadosSensores[u.id_sensor].medicoes.push({ data: u.data_hora, medicao: u.umidade, status: u.alerta });
                        }
                    });
                });
            }
        });
}

function buscarQuantidadeDeAlertas(idUnidade) {
    fetch(`/relatorios/buscarQuantidadeDeAlertas/${idUnidade}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    var sensor = resposta.map(item => item.sensor)
                    var alerta = resposta.map(item => item.alerta)


                    criar_grafico_alertas_pie(sensor, alerta)
                });
            }
        })
};

function buscarUmidadeMediaUltimasSemanas(idUnidade) {
    fetch(`/relatorios/buscarUmidadeMediaUltimasSemanas/${idUnidade}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    var semana = resposta.map(item => item.umidade)


                    criar_grafico_umidade_semana(semana)

                });
            }
        })
};

function buscarUmidadeMediaUnidade(idUnidade) {
    fetch(`/relatorios/buscarUmidadeMediaUnidade/${idUnidade}`, { cache: 'no-store' })
        .then(async function (response) {
            //console.log(response)
            if (response.ok) {
                response.json().then(function (resposta) {
                    var mes = resposta.map(item => item.mes)
                    var dados = resposta.map(item => item.umidade)

                    criar_grafico_geral(mes, dados)

                });
            }
        })
};

function buscarListaAlertas(idUnidade) {
    fetch(`/relatorios/buscarListaAlertas/${idUnidade}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(resposta)
                    var data = resposta.map(item => item.data)
                    var identificador = resposta.map(item => item.identificador)
                    var umidade = resposta.map(item => item.umidade)
                    criar_lista_alertas(identificador, data, umidade)
                });
            }
        })
};

function criar_lista_alertas(identificador, data, umidade) {
    var html_lista = ""

    for (let i = 0; i < identificador.length; i++) {
        html_lista += `
        <li style="display: grid; grid-template-columns: 1fr 1fr;  border-bottom: 1px solid black; ">
            <div style='width: 400px;'>Sensor ${identificador[i]} | ${data[i]}     |       ${umidade[i]}(%)</div>
           <br>
           
        </li>  
        `
    }
    let html = `
    <div class="container_grafico_mensal">
        <div class="lista_alertas">
            <div class="titulo_grafico">ALERTAS</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr;">
                <div style='width: 600px;'> <b> Identificador de área  | data do alerta | umidade </b></div>

            </div>
            <ul>
                ${html_lista}
            </ul>
        </div>
    </div>
    `
    lista_area.innerHTML = html
}

function criar_grafico_geral(mes, dados) {
    let contexto = document.getElementById('grafico_umidade').getContext('2d');

    for (let i = 0; i < 12; i++) {
        if (mes[i] == 1) {
            mes[i] = 'jan'
        } else if (mes[i] == 2) {
            mes[i] = 'fev'
        } else if (mes[i] == 3) {
            mes[i] = 'mar'
        } else if (mes[i] == 4) {
            mes[i] = 'abr'
        } else if (mes[i] == 5) {
            mes[i] = 'mai'
        } else if (mes[i] == 6) {
            mes[i] = 'jun'
        } else if (mes[i] == 7) {
            mes[i] = 'jul'
        } else if (mes[i] == 8) {
            mes[i] = 'ago'
        } else if (mes[i] == 9) {
            mes[i] = 'set'
        } else if (mes[i] == 10) {
            mes[i] = 'out'
        } else if (mes[i] == 11) {
            mes[i] = 'nov'
        } else if (mes[i] == 12) {
            mes[i] = 'dez'
        }
    }


    graficoUmidadeMedia = new Chart(contexto, {
        type: "line",
        data: {
            labels: mes,
            datasets: [
                {
                    label: "CRÍTICO",
                    data: [30, 30, 30, 30, 30, 30],
                    backgroundColor: 'rgba(255, 168, 255, 0.2)',
                    borderColor: 'rgba(255, 000, 000, 0.5)',
                    borderWidth: 2,
                    fill: true
                },
                {
                    label: "ALERTA",
                    data: [40, 40, 40, 40, 40, 40],
                    backgroundColor: 'rgba(255, 168, 255, 0.2)',
                    borderColor: 'rgba(100, 208, 255, 0.9)',
                    borderWidth: 2,
                    fill: true
                },
                {
                    label: "Umidade (%)",
                    data: dados,
                    backgroundColor: 'rgba(0, 168, 255, 0.9)',
                    borderColor: 'rgba(0, 150, 255, 1)',
                    borderWidth: 2,
                    fill: false
                }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMin: 0,
                    suggestedMax: 80,
                }
            }
        }
    });

}

async function criar_kpis(idUnidadeSelecionada) {
    indicadores.innerHTML = "";
    try {
        const response = await fetch(`/unidades/${idUnidadeSelecionada}/indicadores/${idUsuario}`);
        const dados = await response.json();
        let umidade_media = dados.umidade_media
        if (typeof umidade_media != "number")
            umidade_media = 0
        let dadosIndicadores = [
            [umidade_media, "Minima medição Atual", "(Tempo real)", "div_media"],
            [dados.quantidade_alerta, "incidentes", "(Mês atual)", "div_alerta"],
            [dados.sensores_desativados, "sensores desativados", "", "div_sensor"],
            [dados.hora_atualizacao, "", "última atualização", "div_hora"]
        ];

        for (let i = 0; i < dadosIndicadores.length; i++) {
            indicadores.innerHTML += `
        <div class="cartao">
            <div class="valor_indicador" id="${dadosIndicadores[i][3]}">${dadosIndicadores[i][0]}</div>
            <div class="descricao_indicador">${dadosIndicadores[i][1]}</div>
            <div class="info_adicional">${dadosIndicadores[i][2]}</div>
        </div>`;
        }
    } catch (error) {
        console.error("Erro ao buscar indicadores:", error);
    }
}

function criar_grafico_umidade_semana(semana) {

    let contexto = document.getElementById('grafico_umidade_semana').getContext('2d');

    graficoUmidadeSemana = new Chart(contexto, {
        type: 'bar',
        data: {
            labels: ['1º semana', '2º semana', '3º semana', '4º semana'],
            datasets: [{
                label: 'Umidade (%)',
                data: semana,
                borderColor: '#00a8ff',
                backgroundColor: 'rgba(0, 168, 255, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Umidade média das últimas semana',
                    color: '#000000',
                    font: {
                        Size: 150,
                    },
                },
            }
        }
    });


}

function criar_grafico_alertas_pie(sensor, alerta) {

    let contexto = document.getElementById('grafico_alertas_pie').getContext('2d');



    graficoAlertasPie = new Chart(contexto, {
        type: 'polarArea',
        data: {
            labels: sensor,
            datasets: [{
                label: 'quantidade de alertas',
                data: alerta,
                borderColor: '#00a8ff',
                backgroundColor: 'rgba(0, 168, 255, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Áreas com alertas',
                    color: '#000000',
                    font: {
                        Size: 150,
                    },
                },
            }
        },
    })
};

function criar_grafico_modal_sensor(horas, dados, idUnidade, idSensor) {
    try {
        clearTimeout(setIntervalGrafico)
    } catch (e) { }
    const contexto = document.getElementById('grafico_historico_sensor').getContext('2d');
    if (window.graficoHistoricoSensor) {
        window.graficoHistoricoSensor.destroy();
    }
    window.graficoHistoricoSensor = new Chart(contexto, {
        type: 'line',
        data: {
            labels: horas,
            datasets: [{
                label: 'Umidade (%)',
                data: dados,
                borderColor: '#00a8ff',
                backgroundColor: 'rgba(0, 168, 255, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 20,
                    max: 100
                }
            }
        }
    });
    let ultima = ""
    let data = ""


}


function mostrar_modal_sensor(posicao) {
    const modal = modal_sensor;
    const umidadeSensor = umidade_sensor;
    const statusSensor = status_sensor;
    let dados = dadosSensores[posicao]
    setTimeout(() => {
        titulo_modal_sensor.innerHTML = dados.identificador;
        umidadeSensor.textContent = dados.medicoes[dados.medicoes.length - 1].medicao;
        statusSensor.textContent = dados.medicoes[dados.medicoes.length - 1].status == null ? "Sem Alerta" : (dados.medicoes[dados.medicoes.length - 1].status == "0" ? "Possivel Queimada" : "Alerta Critico");
        umidade_sensor.innerHTML = dados.medicoes[dados.medicoes.length - 1].medicao
    }, 200)
    modal.style.display = 'block';
    let horas = []
    let dados_grafico = []
    for (let i = 1; i < 11; i++) {
        let pre_data = dados.medicoes[dados.medicoes.length - i].data.split("T")[1].replace(".000Z", "")
        dados_grafico.push(dados.medicoes[dados.medicoes.length - i].medicao)
        horas.push(pre_data)
    }
    /*
    horas = horas.reverse()
    dados_grafico = dados_grafico.reverse()
    */
    criar_grafico_modal_sensor(horas, dados_grafico, posicao, dados.unidade);
}

function mostrar_modal_unidade() {
    modal_unidade.style.display = 'block';
}

function mostrar_modal_adicionar_sensor() {
    modalAdicionarSensor.style.display = 'block';

}

function fechar_modal() {
    try {
        clearTimeout(setIntervalGrafico)
    } catch (e) { }
    modal_sensor.style.display = 'none';
}

function fechar_modal_unidade() {
    modal_unidade.style.display = 'none';
}

function fechar_modal_adicionar_sensor() {
    modalAdicionarSensor.style.display = 'none';
    formularioAdicionarSensor.reset();
}

function botao_salvar_unidade() {
    selecionar_unidade.innerHTML += `<option value="${nome_unidade.value}">${nome_unidade.value}</option>
`
    const nome = nome_unidade.value;
    const cnir = cnir_unidade.value;

    fetch('/root/adicionarUnidade', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: nome,
            idEmpresa: idEmpresa,
            cnir: cnir
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar unidade');
            }
            return response.json();
        })
        .then(data => {
            buscarUmidadePorSensor(idUnidadeSelecionada);
            criar_kpis(idUnidadeSelecionada);
            fechar_modal_unidade();
        })
        .catch(error => {
            alert('Falha ao adicionar unidade:' + error.message);
        })
    modal_unidade.style.display = 'none';
    return false;

}

function botao_salvar_formulario() {
    const nome = nome_sensor.value;
    //console.log("Adicionando sensor:", nome, "para unidade:", idUnidadeSelecionada);

    fetch('/root/adicionarSensor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: nome,
            idUnidade: idUnidade
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar sensor');
            }
            return response.json();
        })
        .then(data => {

            buscarUmidadePorSensor(idUnidadeSelecionada);
            criar_kpis(idUnidadeSelecionada);
            fechar_modal_adicionar_sensor();
        })
        .catch(error => {
            alert('Falha ao adicionar sensor: ' + error.message);
        });

    return false;
}

function botao_abrir_fechar_menu() {
    const menuLateral = document.querySelector('.menu_lateral');
    menuLateral.classList.toggle('menu_expandido');
    botao_expandir.classList.toggle('girar');
}

function select_unidade() {
    const select = document.getElementById("selecionar_unidade");
    idUnidadeSelecionada = select.value;

    lista_sensores.innerHTML = ''
    lista_area.innerHTML = ''
    graficoUmidadeSemana?.destroy()
    graficoAlertasPie?.destroy()
    graficoUmidadeMedia?.destroy()



    buscarQuantidadeDeAlertas(idUnidadeSelecionada)
    buscarUmidadePorSensor(idUnidadeSelecionada)
    buscarUmidadeMediaUltimasSemanas(idUnidadeSelecionada)
    buscarUmidadeMediaUnidade(idUnidadeSelecionada)
    buscarListaAlertas(idUnidadeSelecionada)
    criar_kpis(idUnidadeSelecionada)

}

// criar_html_estatisticas_mes()
if (sessionStorage.NIVEL_DE_ACESSO == "admin") {
    btn_config.style.display = ""
}

const params = new URLSearchParams(window.location.search);
const id = params.get("ID");
let idUnidade = id || selecionar_unidade.value

criar_kpis(idUnidade)
buscarQuantidadeDeAlertas(idUnidade)
buscarUmidadePorSensor(idUnidade)
buscarUmidadeMediaUltimasSemanas(idUnidade)
buscarUmidadeMediaUnidade(idUnidade)
let ultima = ""
let hora = ""
setInterval(async () => {
    let res = await fetch(`/relatorios/buscarUmidadePorSensor/${idUnidade}/1`, { cache: 'no-store' })
    res = await res.json()
    if (res[0].umidade != ultima || res[0].data_hora != data) {
        try {
            window.graficoHistoricoSensor.data.labels.shift();
            window.graficoHistoricoSensor.data.datasets[0].data.shift();
            window.graficoHistoricoSensor.data.labels.push(res[0].data_hora.split("T")[1].replace(".000Z", ""));
            window.graficoHistoricoSensor.data.datasets[0].data.push(parseFloat(res[0].umidade));
            window.graficoHistoricoSensor.update();
        } catch (e) { }
        ultima = res[0].umidade
        data = res[0].data_hora
        umidade_sensor.innerHTML = ultima
        div_media.innerHTML = ultima
        document.querySelector("#div_media").innerHTML = ultima
        if (res[0].alerta == "1" || res[0].alerta == 1) {
            let valor = Number(div_alerta.innerHTML) + 1
            div_alerta.innerHTML=valor
            alert(`A unidade ${idUnidade} tem incidente no área ${res[0].identificador}`)
        }
    }
}, 1000)
setInterval(() => {
    buscarListaAlertas(idUnidade)
}, 1000)
setTimeout(() => {
    if (id >= 0 && id) {
        selecionar_unidade.value = id
    }
}, 500)
/*
*/