function calcular(){
    var area = Number(ipt_tamanho.value);
    var plantacao = ipt_tipo.value;
    var preconormal = Number(ipt_preco.value)
    var resultado_valor = preconormal * area;
    var precosct = preconormal * resultado_valor
    var total = 0;
    var resultado_prevencao = 0;
    var imposto = 0;
    var resultado_total = 0;
    var resultado_isencao = 0;

    if (area < 0) {
        alert("Insira um valor válido");
    

    if ( tipo == 'soja' || tipo == 'milho' || tipo == 'algodão' ){
            var precocct = precosct * 1.2
            var resultado_certificacao = precocct - precosct
            imposto = 0.1; 
        }


       else if ( tipo == 'café' || tipo == 'feijão' || tipo == 'frutas tropicais' || tipo ==  'banana' || tipo == 'mamão' || tipo == 'manga' ){
            var precocct = precosct * 1.3
            var resultado_certificacao = precocct - precosct 
            imposto = 0.17;
        }
        else if ( tipo == 'cana-de-açúcar' || tipo == 'arroz' || tipo == 'trigo' || tipo == 'laranja' ){
            var precocct = precosct * 1.25
            var resultado_certificacao = precocct - precosct 
            imposto = 0.15;
        }
    }
        else {
            var precocct = precosct * 1.25
            var resultado_certificacao = precocct - precosct 
            imposto = 0.15;
        }


        

        resultado_prevencao = resultado_valor * 0.3;
        resultado_isencao = resultado_valor * imposto;

        resultado_total = resultado_prevencao + resultado_isencao;


        print_resultado_valor.innerHTML = `${resultado_valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        print_resultado_prevencao.innerHTML = `${resultado_prevencao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        print_resultado_isencao.innerHTML = `${resultado_isencao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        print_resultado_total.innerHTML = `${resultado_total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        print_resultado_certificacao.innerHTML = `${resultado_certificacao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        print_resultado_venda.innerHTML = `${((area * 10000) * 5 ).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

        document.getElementById('simulador_input').classList.add('tela-inativa');
        document.getElementById('simulador_output').classList.remove('tela-inativa');


    }
  


