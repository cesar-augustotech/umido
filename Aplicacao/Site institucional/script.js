function trocar_tela(id_tela) {
    document.getElementById('tela_inicial').classList.add('tela-inativa');
    document.getElementById('tela_login').classList.add('tela-inativa')
    document.getElementById('tela_cadastro').classList.add('tela-inativa')
    document.getElementById(id_tela).classList.remove('tela-inativa');


}



let email = ['aluno'];
let senha = ['Sptech#2024'];
function cadastrar() {

 

    if (ipt_email.value != '' && ipt_nomeRegistro.value != '' && ipt_telefone.value != '' 
        && ipt_cnpj.value != '' && ipt_senha.value != '' && ipt_senhaConfirmada.value != '' )
        {
    if ((ipt_senha.value).length >= 6) {
        if (ipt_senha.value == ipt_senhaConfirmada.value) {
           

                email.push(ipt_email.value);
                senha.push(ipt_senha.value);
                console.log(email);
                console.log(senha);
                console.log(trocar_tela('tela_login'))
                trocar_tela('tela_login');
            
        } else alert('As senhas não coincidem.');
     
    } else alert('A senha deve ter no mínimo 6 caracteres.');
    } else alert ('Preencha todos os campos')

    /*    if(ipt_senha.value == undefined|| ipt_senhaConfirmada.value ==undefined || ipt_email.value == undefined || ipt_nomeRegistro.value == undefined ||ipt_cnpj.value == undefined|| ipt_telefone.value == undefined) {
}else alert('Insira todos os dados') */
}

function acessar() {
     if (email.includes(ipt_login_email.value) && senha.includes(ipt_login_senha.value)) {
         /*document.getElementById(tela_dashboard).classList.remove('tela-inativa');*/
         console.log('Acesso concedido')

         document.getElementById('tela_inicial').classList.add('tela-inativa');
    document.getElementById('tela_login').classList.add('tela-inativa')
    document.getElementById('tela_cadastro').classList.add('tela-inativa')
    /* document.getElementById('tela_dashboard').classList.add('tela-inativa')*/

    window.location.href = 'dashboard.html'
         
     } else {console.log('Accesso Negado')
        alert('Accesso Negado')}
     



}


function calcular() {
    var area = Number(ipt_tamanho.value);
    var preconormal = Number(ipt_preco.value)
    var resultado_valor = preconormal * area;
    var precosct = preconormal * resultado_valor
    var total = 0;
    var resultado_prevencao = 0;
    var imposto = 0;
    var resultado_total = 0;
    var resultado_isencao = 0;

    if (area < 0) {
        alert("Insira um valor de tamanho válido");
        process.exit()
    }




    resultado_prevencao = resultado_valor * 0.3;
    resultado_isencao = resultado_valor * imposto;

    resultado_total = resultado_prevencao + resultado_isencao;


    print_resultado_valor.innerHTML = `${resultado_valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    print_resultado_prevencao.innerHTML = `${resultado_prevencao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    print_resultado_venda.innerHTML = `${(area *52500).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    document.getElementById('simulador_input').classList.add('tela-inativa');
    document.getElementById('simulador_output').classList.remove('tela-inativa');


}

