function trocar_tela(id_tela) {
    document.getElementById('tela_inicial').classList.add('tela-inativa');
    document.getElementById('tela_login').classList.add('tela-inativa')
    document.getElementById('tela_cadastro').classList.add('tela-inativa')
    document.getElementById(id_tela).classList.remove('tela-inativa');


}

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

let usuario = [
['aluno','Sptech#2024']    
]
function cadastrar() {

    var nomeVar = ipt_nomeRegistro.value;
    var emailVar = ipt_email.value;
    var senhaVar = ipt_senha.value;
    var cnpjVar = ipt_cnpj.value;
    var confirmacaoSenhaVar = ipt_senhaConfirmada.value;
    var telefoneVar = ipt_telefone.value;
    
    
 
    if (emailVar != '' && nomeVar != '' && telefoneVar != '' 
        && cnpjVar != '' && senhaVar != '' && confirmacaoSenhaVar != '' )
        {
    if ((senhaVar).length >= 6) {
        if (senhaVar == confirmacaoSenhaVar) {

                // Verifica se o email já existe
                for (let i = 0; i < usuario.length; i++) {
                    if (usuario[i][0] == emailVar) {
                        alert('Email já cadastrado');
                        return;
                    }
                }
                // Se o email não existe, adiciona o novo usuário
                usuario.push([emailVar,senhaVar]);
                alert('Acesso criado! Realize o login')
                trocar_tela('tela_login');
            
        } else alert('As senhas não coincidem.');
     
    } else alert('A senha deve ter no mínimo 6 caracteres.');
    } else alert ('Preencha todos os campos')

}


function acessar() {
    var loginEmailVar = ipt_login_email.value
    var loginSenhaVar = ipt_login_senha.value
    var acessoPermitido = false

    if (loginEmailVar == "root" && loginSenhaVar == "root") {
        window.location.href = '../private/pendentes.html'
        acessoPermitido = true
    }

    if (loginEmailVar == '' || loginSenhaVar == '') {
            alert('Preencha todos os campos')
            return;
        }
     for(let i = 0; i < usuario.length; i++){
       
        
        if (usuario[i][0] == loginEmailVar  && usuario[i][1] == loginSenhaVar){
            window.location.href = 'Dashboard/geral.html'
            acessoPermitido = true
        }

    } 
    if (acessoPermitido == false){
        alert('Accesso Negado ou inexistente')
    }

}



