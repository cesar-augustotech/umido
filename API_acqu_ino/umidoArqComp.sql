CREATE TABLE `medida` (
  `id` int NOT NULL AUTO_INCREMENT,
  `data` datetime DEFAULT (now()),
  `umidade` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=166 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
