function calcular(){
    var area = Number(ipt_tamanho.value);
    var plantacao = ipt_tipo.value;
    var preconormal = Number(ipt_preco.value)
    var prodtotal = preconormal * area;
    var precosct = preconormal * prodtotal
    var total = 0;
    var economiaPrevencao = 0;
    var imposto = 0;
    var totalEconomizado = 0;
    var economiaImposto = 0;

    if (area < 0) {
        alert("Insira um valor válido");
    

    if ( tipo == 'soja' || tipo == 'milho' || tipo == 'algodão' ){
            var precocct = precosct * 1.2
            var lucrocc = precocct - precosct
            imposto = 0.1; 
        }


       else if ( tipo == 'café' || tipo == 'feijão' || tipo == 'frutas tropicais' || tipo ==  'banana' || tipo == 'mamão' || tipo == 'manga' ){
            var precocct = precosct * 1.3
            var lucrocc = precocct - precosct 
            imposto = 0.17;
        }
        else if ( tipo == 'cana-de-açúcar' || tipo == 'arroz' || tipo == 'trigo' || tipo == 'laranja' ){
            var precocct = precosct * 1.25
            var lucrocc = precocct - precosct 
            imposto = 0.15;
        }
    }
        else {
            var precocct = precosct * 1.25
            var lucrocc = precocct - precosct 
            imposto = 0.15;
        }


        

        economiaPrevencao = prodtotal * 0.3;
        economiaImposto = prodtotal * imposto;

        totalEconomizado = economiaPrevencao + economiaImposto;


        h3_resultado_liquido.innerHTML = `Sua plantação vale R$${prodtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ao todo.`;
        h3_resultado_economia.innerHTML = `Você economizará R$${economiaPrevencao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} com a prevenção`;
        h3_resultado_isencao.innerHTML = `e R$${economiaImposto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} com impostos.`;
        h3_total_economia.innerHTML = `Economia total: R$${totalEconomizado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`;
        h3_precocc.innerHTML = `Projeção de lucro de preços com certificação: R$${lucrocc.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`;
        h3_resultado_preco_sensor.innerHTML = `O preço médio da venda de dados pode ser de até R$${((area * 10000) * 5 ).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
 }
  


