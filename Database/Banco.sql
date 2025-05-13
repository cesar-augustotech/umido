-- Remoção do banco de dados para efeito de demonstração de execução do script (Apagar sessão após apresentação)
DROP DATABASE IF EXISTS umido;

-- Criação do banco de dados
CREATE DATABASE umido;
USE umido;

-- Remoção das tabelas para efeito de demonstração de execução do script (Apagar sessão após apresentação)
DROP TABLE IF EXISTS unidade_usuario;
DROP TABLE IF EXISTS medicao;
DROP TABLE IF EXISTS sensor;
DROP TABLE IF EXISTS unidade;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS empresa;

-- Criação das tabelas

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
    `nivel_de_acesso` CHAR(1)
);

-- Tabela de unidade
CREATE TABLE unidade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    codigo_cnir VARCHAR(30),
    empresa_id INT NOT NULL,
    FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);

-- Tabela de sensor
CREATE TABLE sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_unidade INT NOT NULL,
    identificador VARCHAR(50) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_unidade) REFERENCES unidade(id)
);

-- Tabela de medição
CREATE TABLE medicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_sensor INT NOT NULL,
    umidade DECIMAL(5,2) NOT NULL, 
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    alerta BOOLEAN,
    FOREIGN KEY (id_sensor) REFERENCES sensor(id)
);

-- Tabela de relacionamento entre unidade e usuário (muitos-para-muitos)
CREATE TABLE unidade_usuario (
    id_unidade INT NOT NULL,
    id_usuario INT NOT NULL,
    PRIMARY KEY (id_unidade, id_usuario),
    FOREIGN KEY (id_unidade) REFERENCES unidade(id),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

-- Inserção de empresas
INSERT INTO empresa (nome, cnpj) VALUES 
('AgroTech Brasil', '12.345.678/0001-99'),
('GreenFarms Ltda', '98.765.432/0001-11');

-- Inserção de usuários
INSERT INTO usuario (nome, email, senha, nivel_de_acesso) VALUES
('Ana Silva', 'ana@agrotech.com', 'senha123', 'A'),
('Carlos Souza', 'carlos@agrotech.com', 'senha123', 'S'),
('João Oliveira', 'joao@greenfarms.com', 'senha123', 'A');

-- Inserção das unidades
INSERT INTO unidade (nome, codigo_cnir, empresa_id) VALUES
('Unidade Sol Nascente', NULL, 1),
('Unidade Água Verde', NULL, 1),
('Unidade Santa Clara', NULL, 2);

-- Associação de usuários às unidades
INSERT INTO unidade_usuario (id_unidade, id_usuario) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Inserção dos sensores
INSERT INTO sensor (id_unidade, identificador) VALUES
(1, 'A1'),
(1, 'A2'),
(2, 'A1'),
(2, 'A2'),
(2, 'B1'),
(3, 'A1'),
(3, 'B1');

-- Criação do usuário com permissão de inserção de medições
DROP USER IF EXISTS 'umidoInsert'@'%';
CREATE USER 'umidoInsert'@'%' IDENTIFIED BY 'Sptech#2024';
GRANT INSERT ON umido.medicao TO 'umidoInsert'@'%';

DROP USER IF EXISTS 'umido'@'%';
CREATE USER 'umido'@'%' IDENTIFIED BY 'Sptech#2024';
GRANT INSERT ON umido.* TO 'umido'@'%';
FLUSH PRIVILEGES;

