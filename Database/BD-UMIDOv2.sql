-- Criando o banco de dados
CREATE DATABASE umido;
USE umido;

-- Criando a tabela de empresas
CREATE TABLE empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

-- Criando a tabela de usuários
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nivel_acesso VARCHAR(3) NOT NULL DEFAULT "CHF" CHECK (nivel_acesso IN ("ADM", "FUN", "CHF")),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email LIKE "%@%" AND email LIKE "%.%" ),
    senha VARCHAR(255) NOT NULL CHECK (LENGTH(senha) >= 8),
    setor VARCHAR(15),
    empresa_Id INT,
    FOREIGN KEY (empresa_Id) REFERENCES empresa(id) ON DELETE SET NULL
);

-- Criando a tabela de sensores
CREATE TABLE sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(20) NOT NULL,
    descricao VARCHAR(255),
    setor VARCHAR(15),
    empresa_Id INT,
    FOREIGN KEY (empresa_Id) REFERENCES empresa(id) ON DELETE SET NULL
);

-- Criando a tabela de histórico de sensores
CREATE TABLE historicoSensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_coleta DATETIME NOT NULL,
    status_umidade VARCHAR(10),
    umidade INT,
    sensor_id INT,
    posicao_x INT,
    posicao_y INT,
    FOREIGN KEY (sensor_id) REFERENCES sensor(id) ON DELETE CASCADE
);

-- Criando a tabela de histórico de alertas
CREATE TABLE historicoAlerta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_alerta VARCHAR(10),
    descricao VARCHAR(255),
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Inserindo empresas
INSERT INTO empresa (nome) VALUES 
('Tech Solutions'),
('Green Energy'),
('Safe Home'),
('AI Robotics'),
('Eco Sensors');

-- Inserindo usuários
INSERT INTO usuario (nivel_acesso, nome, email, senha, setor, empresa_Id) VALUES 
('ADM', 'Carlos Silva', 'carlos@tech.com', 'senhaSegura123', 'TI', 1),
('FUN', 'Ana Souza', 'ana@green.com', 'passworD1', 'Engenharia', 2),
('CHF', 'Marcos Lima', 'marcos@safe.com', 'seguraForte2', 'Segurança', 3),
('ADM', 'Juliana Costa', 'juliana@airobotics.com', 'robotic@123', 'Pesquisa', 4),
('FUN', 'Pedro Oliveira', 'pedro@ecosensors.com', 'ecoNature99', 'Meio Ambiente', 5);

-- Inserindo sensores
INSERT INTO sensor (nome, descricao, setor, empresa_Id) VALUES 
('UmidAr001', 'Sensor de umidade do ar - Zona 1', 'Agricultura', 2),
('UmidAr002', 'Sensor de umidade do ar - Zona 2', 'Agricultura', 2),
('UmidAr003', 'Sensor de umidade do ar - Zona 3', 'Agricultura', 2),
('UmidAr004', 'Sensor de umidade do ar - Zona 4', 'Agricultura', 2),
('UmidAr005', 'Sensor de umidade do ar - Zona 5', 'Agricultura', 2);


-- Inserindo históricos de sensores
INSERT INTO historicoSensor (data_coleta, status_umidade, umidade, sensor_id, posicao_x, posicao_y) VALUES 
('2025-03-29 10:00:00', 'Normal', 50, 1, 5, 10),
('2025-03-29 10:05:00', 'Baixa', 20, 2, 15, 8),
('2025-03-29 10:10:00', 'Alta', 80, 3, 3, 12),
('2025-03-29 10:15:00', 'Normal', 55, 4, 7, 9),
('2025-03-29 10:20:00', 'Crítica', 10, 5, 11, 6),
('2025-03-29 10:25:00', 'Normal', 60, 1, 2, 5),
('2025-03-29 10:30:00', 'Baixa', 30, 2, 9, 3),
('2025-03-29 10:35:00', 'Alta', 75, 3, 4, 15);


-- Inserindo alertas históricos
INSERT INTO historicoAlerta (status_alerta, descricao, usuario_id) VALUES 
('Ativo', 'Umidade do ar abaixo do nível esperado na Zona 1', 1),
('Resolvido', 'Falha no sensor de umidade do ar na Zona 2', 2),
('Ativo', 'Umidade do ar acima do nível esperado na Zona 3', 3),
('Ativo', 'Sensor de umidade do ar falhando na Zona 4', 4),
('Resolvido', 'Sensor de umidade do ar na Zona 5 com leitura incorreta', 5),
('Ativo', 'Sensor de umidade do ar da Zona 1 com leitura irregular', 1),
('Resolvido', 'Manutenção realizada no sensor de umidade do ar na Zona 5', 5);



-- Selecionar informações de usuários e suas empresas

SELECT u.nome AS 'Nome do usuário', u.setor, e.nome AS 'Nome da empresa'
FROM usuario u
INNER JOIN empresa e ON u.empresa_Id = e.id;

-- Selecionar sensores e os históricos de coleta com status de umidade:

SELECT s.nome AS 'Sensor', hs.status_umidade as 'Status', hs.umidade as 'Umidade', hs.data_coleta as 'Data de coleta'
FROM historicoSensor hs
INNER JOIN sensor s ON hs.sensor_id = s.id;

-- Selecionar alertas e os usuários que os receberam

SELECT ha.status_alerta, ha.descricao, u.nome AS 'Responsável'
FROM historicoAlerta ha
INNER JOIN usuario u ON ha.usuario_id = u.id;

-- Selecionar histórico de sensores com a empresa e o nome do usuário que recebeu o alerta:

SELECT s.nome AS 'Sensor', hs.umidade, hs.posicao_x, hs.posicao_y, e.nome AS 'Empresa', u.nome AS 'Responsável', hs.data_coleta as 'Data de coleta'
FROM historicoSensor hs
INNER JOIN sensor s ON hs.sensor_id = s.id
INNER JOIN empresa e ON s.empresa_Id = e.id
INNER JOIN historicoAlerta ha ON ha.id = hs.id
INNER JOIN usuario u ON ha.usuario_id = u.id;

