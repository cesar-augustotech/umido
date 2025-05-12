

function calcular() {
    var area = Number(ipt_tamanho.value);
    var preconormal = Number(ipt_preco.value)
    var resultado_valor = preconormal * area;
    var resultado_prevencao = 0;
    var imposto = 0;
    var resultado_total = 0;
    var resultado_isencao = 0;

    if (area < 0) {
        alert("Insira um valor de tamanho válido");
        process.exit()
    }


    resultado_prevencao = resultado_valor * 0.3;
   
    print_resultado_valor.innerHTML = `${resultado_valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    print_resultado_prevencao.innerHTML = `${resultado_prevencao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    print_resultado_venda.innerHTML = `${(area *52500).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    document.getElementById('simulador_input').classList.add('tela-inativa');
    document.getElementById('simulador_output').classList.remove('tela-inativa');


}

