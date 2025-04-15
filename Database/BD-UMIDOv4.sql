create database umido;

use umido;



CREATE TABLE empresa(
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45),
  cnpj VARCHAR(45),
  PRIMARY KEY (id)
  );
  
CREATE TABLE setor(
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45),
  PRIMARY KEY (id)
  );
  
  CREATE TABLE usuario(
  id INT NOT NULL AUTO_INCREMENT,
  fk_setor INT NOT NULL,
  fk_empresa INT NOT NULL,
  nome VARCHAR(120),
  email VARCHAR(90),
  telefone VARCHAR(15),
  fk_superior INT,
  nivelAcesso CHAR(1),
  PRIMARY KEY (id, fk_empresa),
  CONSTRAINT fk_usuario_empresa FOREIGN KEY (fk_empresa) REFERENCES empresa(id),
  CONSTRAINT fk_usuario_setor FOREIGN KEY (fk_setor) REFERENCES setor (id),
  CONSTRAINT fk_usuario_superior FOREIGN KEY (fk_superior) REFERENCES usuario (id)
  );
  
  CREATE TABLE plantacao(
  id  INT NOT NULL AUTO_INCREMENT,
  cep VARCHAR(45),
  numero VARCHAR(45),
  fk_empresa INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_plantacao_empresa FOREIGN KEY (fk_empresa) REFERENCES empresa(id)
  );
  
  CREATE TABLE  sensor(
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(20),
  descricao VARCHAR(255),
  fk_plantacao INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_sensor_plantacao FOREIGN KEY (fk_plantacao) REFERENCES plantacao(id)
  );
  
  CREATE TABLE medicao(
  id INT NOT NULL AUTO_INCREMENT,
  fk_sensor INT NOT NULL,
  dt_medicao DATETIME NULL DEFAULT current_timestamp,
  status VARCHAR(45),
  umidade VARCHAR(45),
  PRIMARY KEY (id, fk_sensor),
  CONSTRAINT fk_medicao_sensor FOREIGN KEY (fk_sensor) REFERENCES sensor (id)
  );