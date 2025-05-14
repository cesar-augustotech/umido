var database = require("../database/config")

async function obterDados(nome, email) {
    var instrucaoSql = `
        SELECT u.id as "id_usuario", u.nome as "nome_usuario", u.email as "email_usuario", u.nivel_de_acesso as "nivel_de_acesso", e.ativo, e.id as "id_empresa" FROM usuario u
		inner join unidade_usuario uu on uu.id_unidade = u.id
			inner join unidade uni on uni.id = uu.id_unidade
				inner join empresa e on uni.empresa_id = e.id
where u.email = "ana@agrotech.com" and u.senha = "senha123";
    `;
    let valido = await database.executar(instrucaoSql);
    let usuario={}
    if(valido.length > 0){
        usuario = valido[0]
        if(usuario.nivel_de_acesso =="A"){
            let instrucaoSql2 = `
                select u.id, u.nome from unidade u
	                inner join empresa e on u.empresa_id = e.id where e.id = ${usuario.id_empresa};
            `
            let todas_unidades = await database.executar(instrucaoSql2);
            usuario.unidades = todas_unidades
        }else{
            let instrucaoSql2 = `
            select u.id, u.nome from unidade_usuario uu
            	inner join unidade u on u.id = uu.id_unidade
            where uu.id_usuario = ${usuario.id_usuario};
            `
            let todas_unidades = await database.executar(instrucaoSql2);
            usuario.unidades = todas_unidades
        }
    }
    return usuario
}

obterDados()



module.exports = {
    obterDados
};