CREATE DATABASE umido;

use umido;

CREATE USER umidoInsert IDENTIFIED BY '12345';
GRANT INSERT ON medicao TO umidoInsert;
FLUSH PRIVILEGES;

-- Tabela de empresa
CREATE TABLE empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(20) UNIQUE
);

-- Tabela de usuários
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    id_superior INT,
    id_empresa INT,
    FOREIGN KEY (id_superior) REFERENCES usuario(id),
    FOREIGN KEY (id_empresa) REFERENCES empresa(id)
);

-- Tabela de unidade
CREATE TABLE unidade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    codigo_cnir VARCHAR(30),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);



-- Tabela de sensor
CREATE TABLE sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_unidade INT NOT NULL,
    identificador VARCHAR(50) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_unidade) REFERENCES unidade(id)
);

CREATE TABLE medicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_sensor INT NOT NULL,
    umidade DECIMAL(5,2) NOT NULL, 
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sensor) REFERENCES sensor(id)
);


-- Tabela de alerta
CREATE TABLE alerta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_sensor INT NOT NULL,
    mensagem VARCHAR(255) NOT NULL,
    umidade INT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sensor) REFERENCES sensor(id)
);



-- empresa
INSERT INTO empresa (nome, cnpj) VALUE 
('AgroTech Brasil', '12.345.678/0001-99'),
('GreenFarms Ltda', '98.765.432/0001-11');

-- Usuários
INSERT INTO usuario (nome, email, senha, id_empresa) VALUE
('Ana Silva', 'ana@agrotech.com', 'senha123', 1), -- Admin
('Carlos Souza', 'carlos@agrotech.com', 'senha123', 1), -- Supervisor de Ana
('João Oliveira', 'joao@greenfarms.com', 'senha123', 2); -- Admin da GreenFarms

-- Relacionar subordinado com superior (Carlos subordinado à Ana)
UPDATE usuario SET id_superior = 1 WHERE id = 2;

-- unidade
INSERT INTO unidade (id_usuario, nome) VALUE
(1, 'unidade Sol Nascente'),
(2, 'unidade Água Verde'),
(3, 'unidade Santa Clara');

-- sensor
INSERT INTO sensor (id_unidade, identificador) VALUE
(1, 'A1'),
(1, 'A2'),
(2, 'A1'),
(2, 'A2'),
(2, 'B1'),
(3, 'A1'),
(3, 'B1');


