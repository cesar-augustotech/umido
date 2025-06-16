 drop database umido;
-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS umido;
USE umido;
       
CREATE TABLE empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(20) UNIQUE,
    telefone VARCHAR(20),
    ativo int default  0
);

-- Tabela de usuários
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    nivel_de_acesso ENUM('admin', 'comum') NOT NULL
);

-- Tabela de unidades (fazendas)
CREATE TABLE unidade ( 
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    codigo_cnir VARCHAR(30),
    id_empresa INT NOT NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id)
);

-- Tabela de sensores
CREATE TABLE sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_unidade INT NOT NULL,
    identificador VARCHAR(50) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_unidade) REFERENCES unidade(id)
) auto_increment = 6;

-- Tabela de medições de umidade
CREATE TABLE medicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_sensor INT NOT NULL,
    umidade DECIMAL(5,2) NOT NULL, 
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    alerta CHAR(1),
    FOREIGN KEY (id_sensor) REFERENCES sensor(id)
);

-- Relacionamento entre usuários e unidades (muitos-para-muitos)
CREATE TABLE unidade_usuario (
    id_unidade INT NOT NULL,
    id_usuario INT NOT NULL,
    PRIMARY KEY (id_unidade, id_usuario),
    FOREIGN KEY (id_unidade) REFERENCES unidade(id),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);


select  * from usuario;
select  * from unidade_usuario;
select  * from sensor;
select  * from medicao;
select  * from unidade_usuario;
select * from empresa;

delete from usuario;
delete from medicao;
delete from empresa;
delete from unidade;
delete from unidade_usuario;
delete from sensor;



desc empresa;
desc usuario;
desc unidade;
desc unidade_usuario;
desc sensor;

insert into empresa
value ('1','Spagro','66.224.085/0001-08','1139887493','1');
      
insert into unidade
value (1,'Unidade Agrícola Santa Vitória','3124567890123','1'),
       (2,'Unidade Fazenda Boa Esperança','3559876543210','1'),
		(3,'Unidade Sítio Recanto Verde','4212345678901','1');
        
insert into usuario value
('1','Fernando Brandão','fernando@email.com','Sptech#2024','admin');

insert into unidade_usuario value
(1,1),
(2,1),
(3,1);

insert into sensor (id_unidade,identificador)
value  (1,'A1'),
		(1,'A2'),
        (1,'A3'),
		(1,'A4'),
        (1,'A5');
        
        
        update sensor set ativo = 0 where id_unidade = 1;
         update sensor set ativo = 0 where id_unidade = 2;
         update sensor set ativo = 0 where id_unidade = 3;
         select * from sensor ; 
         
        insert into sensor (id_unidade,identificador)
value  (3,'C1'),
		(3,'C2'),
        (3,'C3'),
		(3,'C4'),
        (3,'C5');
        
        insert into sensor (id_unidade,identificador)
value  (2,'B1'),
		(2,'B2'),
        (2,'B3'),
		(2,'B4'),
        (2,'B5');
        
       
       
desc medicao;
select * from sensor;
select * from medicao;


INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (6, 100.00, '2025-6-07 10:00', NULL);
insert into medicao(id_sensor,umidade,data_hora,alerta)
value	(6,'35.14','2025-6-07 10:00',0),
		(7,'35.14','2025-6-03 10:00',0),
		(8,'45.34','2025-6-27 10:00',null),
		(9,'34.23','2025-6-18 10:00',0),
		(10,'42.24','2025-6-01 10:00',null);
        
        update medicao set umidade = 45.34 where umidade = 53.43;

  select count(m.alerta) as alerta,s.identificador as sensor
from medicao as m
inner join sensor as s on s.id = m.id_sensor
inner join unidade as u on u.id = s.id_unidade
where u.id = 1 and data_hora >= DATE_SUB(now(), INTERVAL 1 month ) and alerta = 1 
group by id_sensor;

insert into medicao(id_sensor,umidade,data_hora,alerta)
value
	(6,'55.14','2025-1-14 10:00',0),
	(6,'52.40','2025-2-14 10:00',0),
	(6,'49.30','2025-3-14 10:00',0),
    (6,'45.20','2025-4-14 10:00',0),
	(6,'40.13','2025-5-14 10:00',0);
    
    
insert into medicao(id_sensor,umidade,data_hora,alerta)
value	(6,'25.14','2025-6-14 15:00',1),
		(7,'32.14','2025-6-14 15:00',0),
		(8,'44.34','2025-6-14 15:00',null),
		(9,'23.23','2025-6-14 15:00',1),
		(10,'22.24','2025-6-14 15:00',1); 	

insert into medicao(id_sensor,umidade,data_hora,alerta)
value	(6,'25.14','2025-6-14 13:20',1),
		(6,'32.14','2025-6-14 15:21',0),
		(6,'44.34','2025-6-14 15:22',null),
		(6,'23.23','2025-6-14 15:23',1),
		(6,'22.24','2025-6-14 15:24',1); 
	

insert into medicao(id_sensor,umidade,data_hora,alerta)
value	(10,'21.13','2025-6-14 13:20',1),
		(10,'35.64','2025-6-14 15:21',0),
		(10,'45.23','2025-6-14 15:22',null),
		(10,'100.10','2025-6-14 15:23',1),
		(10,'22.24','2025-6-14 15:24',1); 
        
        select * from medicao where umidade  = 25.14 ;
        
        
        
insert into medicao(id_sensor,umidade,data_hora,alerta)
value	(12,'44.64','2025-1-10 10:00',null),
		(12,'42.24','2025-2-10 10:00',null),
		(12,'41.74','2025-3-10 10:00',null),
		(12,'42.63','2025-4-10 10:00',null),
		(12,'40.24','2025-5-10 10:00',null),
        (12,'38.94','2025-6-01 10:00',0),
        (12,'37.42','2025-6-08 10:00',0),
        (12,'35.56','2025-6-15 10:00',0),
        (12,'36.34','2025-6-21 10:00',0);

        
        delete from medicao where id_sensor = 17;
insert into medicao(id_sensor,umidade,data_hora,alerta)
value	(17,'65.64','2025-1-10 10:00',null),
		(17,'63.24','2025-2-10 10:00',null),
		(17,'61.74','2025-3-10 10:00',null),
		(17,'53.63','2025-4-10 10:00',null),
		(17,'67.24','2025-5-10 10:00',null),
        (17,'68.94','2025-6-01 10:00',null),
        (17,'65.42','2025-6-08 10:00',null),
        (17,'63.56','2025-6-15 10:00',null),
        (17,'60.34','2025-6-21 10:00',null);
        
                delete from medicao where id_sensor = 17;
insert into medicao(id_sensor,umidade,data_hora,alerta)
value   (19,'68.94','2025-6-01 10:00',null),
        (19,'40.42','2025-6-08 10:00',null),
        (20,'63.56','2025-6-15 15:00',null),
        (19,'35.34','2025-6-21 15:00',0),
         (18,'68.94','2025-6-01 15:00',null),
        (17,'65.42','2025-6-08 14:00',null),
        (17,'63.56','2025-6-15 13:00',null),
        (20,'40.00','2025-6-21 12:00',0),
         (19,'68.94','2025-6-01 15:00',null),
        (19,'65.42','2025-6-08 10:00',null),
        (20,'39.56','2025-6-15 16:00',0),
        (20,'60.34','2025-6-21 16:00',null),
         (19,'68.94','2025-6-01 12:00',null),
        (19,'65.42','2025-6-08 12:00',null),
        (20,'39.56','2025-6-15 08:30',0),
        (20,'34.34','2025-6-21 10:30',0),
        (16,'39.56','2025-6-14 16:00',0),
        (16,'60.34','2025-6-21 16:00',null),
         (16,'68.94','2025-6-01 12:00',null),
        (16,'65.42','2025-6-08 12:00',null),
        (16,'39.56','2025-6-14 08:30',0),
        (16,'34.34','2025-6-14 10:30',0);
        
        
           select count(m.alerta) as alerta,s.identificador as sensor
from medicao as m
inner join sensor as s on s.id = m.id_sensor
inner join unidade as u on u.id = s.id_unidade
where u.id = 2 and data_hora >= DATE_SUB(now(), INTERVAL 1 month ) and alerta = 1 or
 u.id = 2 and data_hora >= DATE_SUB(now(), INTERVAL 1 month ) and alerta = 0
group by id_sensor;









select * from sensor where ativo = 1;

delete from medicao where id_sensor = 20;



-- case 1
-- Sensor ID: 6
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (6, 45.23, '2025-06-14 10:05:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (6, 38.76, '2025-06-14 10:06:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (6, 25.10, '2025-06-14 10:07:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (6, 55.99, '2025-06-14 10:08:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (6, 32.50, '2025-06-14 10:09:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (6, 60.01, '2025-06-14 10:10:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (6, 29.80, '2025-06-14 10:11:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (6, 41.22, '2025-06-14 10:12:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (6, 35.67, '2025-06-14 10:13:00', 0);

-- Sensor ID: 7
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (7, 50.00, '2025-06-14 10:15:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (7, 39.12, '2025-06-14 10:16:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (7, 38.50, '2025-06-14 10:17:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (7, 65.43, '2025-06-14 10:18:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (7, 30.15, '2025-06-14 10:19:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (7, 42.88, '2025-06-14 10:20:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (7, 22.00, '2025-06-14 10:21:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (7, 58.76, '2025-06-14 10:22:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (7, 37.90, '2025-06-14 10:23:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (7, 75.20, '2025-06-14 10:24:00', NULL);

-- Sensor ID: 8
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (8, 48.10, '2025-06-14 10:25:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (8, 36.55, '2025-06-14 10:26:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (8, 27.05, '2025-06-14 10:27:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (8, 52.33, '2025-06-14 10:28:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (8, 34.00, '2025-06-14 10:29:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (8, 68.91, '2025-06-14 10:30:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (8, 21.50, '2025-06-14 10:31:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (8, 40.00, '2025-06-14 10:32:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (8, 31.78, '2025-06-14 10:33:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (8, 62.45, '2025-06-14 10:34:00', NULL);

-- Sensor ID: 9
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (9, 58.20, '2025-06-14 10:35:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (9, 30.00, '2025-06-14 10:36:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (9, 39.99, '2025-06-14 10:37:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (9, 63.14, '2025-06-14 10:38:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (9, 39.50, '2025-06-14 10:39:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (9, 47.01, '2025-06-14 10:40:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (9, 24.18, '2025-06-14 10:41:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (9, 51.66, '2025-06-14 10:42:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (9, 33.20, '2025-06-14 10:43:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (9, 71.30, '2025-06-14 10:44:00', NULL);

-- Sensor ID: 10
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (10, 41.00, '2025-06-14 10:45:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (10, 31.00, '2025-06-14 10:46:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (10, 19.60, '2025-06-14 10:47:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (10, 59.87, '2025-06-14 10:48:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (10, 39.99, '2025-06-14 10:49:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (10, 66.22, '2025-06-14 10:50:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (10, 26.70, '2025-06-14 10:51:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (10, 44.50, '2025-06-14 10:52:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (10, 35.05, '2025-06-14 10:53:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (10, 72.80, '2025-06-14 10:54:00', NULL);



-- case 2
-- Sensor ID: 11
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (11, 49.30, '2025-06-14 10:55:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (11, 37.10, '2025-06-14 10:56:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (11, 23.45, '2025-06-14 10:57:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (11, 54.67, '2025-06-14 10:58:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (11, 38.00, '2025-06-14 10:59:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (11, 61.11, '2025-06-14 11:00:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (11, 28.00, '2025-06-14 11:01:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (11, 46.50, '2025-06-14 11:02:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (11, 30.50, '2025-06-14 11:03:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (11, 73.99, '2025-06-14 11:04:00', NULL);

-- Sensor ID: 12
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (12, 53.00, '2025-06-14 11:05:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (12, 34.80, '2025-06-14 11:06:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (12, 26.00, '2025-06-14 11:07:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (12, 60.50, '2025-06-14 11:08:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (12, 36.00, '2025-06-14 11:09:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (12, 43.10, '2025-06-14 11:10:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (12, 39.00, '2025-06-14 11:11:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (12, 57.25, '2025-06-14 11:12:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (12, 32.10, '2025-06-14 11:13:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (12, 69.00, '2025-06-14 11:14:00', NULL);

-- Sensor ID: 13
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (13, 40.50, '2025-06-14 11:15:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (13, 30.01, '2025-06-14 11:16:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (13, 30.99, '2025-06-14 11:17:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (13, 56.78, '2025-06-14 11:18:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (13, 39.00, '2025-06-14 11:19:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (13, 64.32, '2025-06-14 11:20:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (13, 35.50, '2025-06-14 11:21:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (13, 47.90, '2025-06-14 11:22:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (13, 33.70, '2025-06-14 11:23:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (13, 70.50, '2025-06-14 11:24:00', NULL);

-- Sensor ID: 14
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (14, 51.20, '2025-06-14 11:25:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (14, 38.99, '2025-06-14 11:26:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (14, 24.50, '2025-06-14 11:27:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (14, 62.00, '2025-06-14 11:28:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (14, 31.25, '2025-06-14 11:29:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (14, 45.00, '2025-06-14 11:30:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (14, 27.80, '2025-06-14 11:31:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (14, 59.10, '2025-06-14 11:32:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (14, 35.90, '2025-06-14 11:33:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (14, 67.50, '2025-06-14 11:34:00', NULL);

-- Sensor ID: 15
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (15, 43.70, '2025-06-14 11:35:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (15, 30.80, '2025-06-14 11:36:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (15, 32.10, '2025-06-14 11:37:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (15, 50.05, '2025-06-14 11:38:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (15, 37.00, '2025-06-14 11:39:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (15, 63.88, '2025-06-14 11:40:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (15, 39.50, '2025-06-14 11:41:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (15, 48.00, '2025-06-14 11:42:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (15, 34.40, '2025-06-14 11:43:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (15, 71.00, '2025-06-14 11:44:00', NULL);





-- case 3


-- Sensor ID: 16
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (16, 54.50, '2025-06-14 11:45:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (16, 61.33, '2025-06-14 11:48:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (16, 52.00, '2025-06-14 11:50:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (16, 55.70, '2025-06-14 11:52:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (16, 68.10, '2025-06-14 11:54:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (16, 50.90, '2025-06-14 11:46:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (16, 53.01, '2025-06-14 11:47:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (16, 51.80, '2025-06-14 11:49:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (16, 51.01, '2025-06-14 11:51:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (16, 53.15, '2025-06-14 11:53:00', 0);

-- Sensor ID: 17
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (17, 56.10, '2025-06-14 11:55:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (17, 58.00, '2025-06-14 11:58:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (17, 65.00, '2025-06-14 12:00:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (17, 52.40, '2025-06-14 12:02:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (17, 74.10, '2025-06-14 12:04:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (17, 50.50, '2025-06-14 11:56:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (17, 53.00, '2025-06-14 11:57:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (17, 50.10, '2025-06-14 11:59:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (17, 54.90, '2025-06-14 12:01:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (17, 50.50, '2025-06-14 12:03:00', 0);

-- Sensor ID: 18
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (18, 54.00, '2025-06-14 12:05:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (18, 57.00, '2025-06-14 12:08:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (18, 60.00, '2025-06-14 12:10:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (18, 54.00, '2025-06-14 12:12:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (18, 70.00, '2025-06-14 12:14:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (18, 50.80, '2025-06-14 12:06:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (18, 52.00, '2025-06-14 12:07:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (18, 53.50, '2025-06-14 12:09:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (18, 51.50, '2025-06-14 12:11:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (18, 52.00, '2025-06-14 12:13:00', 0);

-- Sensor ID: 19
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (19, 52.50, '2025-06-14 12:15:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (19, 53.00, '2025-06-14 12:18:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (19, 62.00, '2025-06-14 12:20:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (19, 54.00, '2025-06-14 12:22:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (19, 75.00, '2025-06-14 12:24:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (19, 50.50, '2025-06-14 12:16:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (19, 51.70, '2025-06-14 12:17:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (19, 59.00, '2025-06-14 12:19:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (19, 53.50, '2025-06-14 12:21:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (19, 56.00, '2025-06-14 12:23:00', 0);

-- Sensor ID: 20
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (20, 50.50, '2025-06-14 12:25:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (20, 64.00, '2025-06-14 12:28:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (20, 52.50, '2025-06-14 12:30:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (20, 56.00, '2025-06-14 12:32:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (20, 69.50, '2025-06-14 12:34:00', NULL);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (20, 54.00, '2025-06-14 12:26:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (20, 50.00, '2025-06-14 12:27:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (20, 53.50, '2025-06-14 12:29:00', 0);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (20, 52.80, '2025-06-14 12:31:00', 1);
INSERT INTO medicao (id_sensor, umidade, data_hora, alerta) VALUES (20, 55.50, '2025-06-14 12:33:00', 0);
