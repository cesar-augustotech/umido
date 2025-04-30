
CREATE DATABASE umido;
use umido;


-- Tabela de empresa
CREATE TABLE empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(20) UNIQUE
);

-- Tabela de usuários
CREATE TABLE usuario (
	telefone varchar(20), 
    cnpj varchar(20),
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    fk_superior INT,
    FOREIGN KEY (fk_superior) REFERENCES usuario(id)
);

-- Tabela de unidade
CREATE TABLE unidade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_usuario INT NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    codigo_cnir VARCHAR(30),
     fk_empresa INT,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id),
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id)
);



-- Tabela de sensor
CREATE TABLE sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_unidade INT NOT NULL,
    identificador VARCHAR(50) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (fk_unidade) REFERENCES unidade(id)
);

CREATE TABLE medicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_sensor INT NOT NULL,
    umidade DECIMAL(5,2) NOT NULL, 
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_sensor) REFERENCES sensor(id),
    alerta BOOLEAN 
);






-- empresa
INSERT INTO empresa (nome, cnpj) VALUE 
('AgroTech Brasil', '12.345.678/0001-99'),
('GreenFarms Ltda', '98.765.432/0001-11');

-- Usuários
INSERT INTO usuario (nome, email, senha) VALUE
('Ana Silva', 'ana@agrotech.com', 'senha123'), -- Admin
('Carlos Souza', 'carlos@agrotech.com', 'senha123'), -- Supervisor de Ana
('João Oliveira', 'joao@greenfarms.com', 'senha123'); -- Admin da GreenFarms

-- Relacionar subordinado com superior (Carlos subordinado à Ana)
UPDATE usuario SET fk_superior = 1 WHERE id = 2;

-- unidade
INSERT INTO unidade (fk_usuario, nome,  fk_empresa) VALUE
(1, 'unidade Sol Nascente', 1),
(2, 'unidade Água Verde', 1),
(3, 'unidade Santa Clara' , 2);

-- sensor
INSERT INTO sensor (fk_unidade, identificador) VALUE
(1, 'A1'),
(1, 'A2'),
(2, 'A1'),
(2, 'A2'),
(2, 'B1'),
(3, 'A1'),
(3, 'B1');

DROP USER IF EXISTS umidoInsert;
CREATE USER umidoInsert IDENTIFIED BY '12345';
GRANT INSERT ON umido.medicao TO umidoInsert;
FLUSH PRIVILEGES;
