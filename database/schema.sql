-- Script de criação do banco de dados do desafio de CRUD de produtos.
-- Como usar: abra este arquivo no MySQL Workbench (ou `mysql -u root -p < schema.sql`)
-- e execute. Ele cria o banco e a tabela do zero.

CREATE DATABASE IF NOT EXISTS product_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE product_management;

CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255)   NOT NULL,
  quantity    INT            NOT NULL,
  price       DECIMAL(10,2)  NOT NULL,
  category    VARCHAR(100)   NOT NULL,
  created_by  VARCHAR(100)   NOT NULL,
  created_at  DATETIME       DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(100)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  name          VARCHAR(150)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  phone         VARCHAR(20)   NOT NULL,
  created_at    DATETIME      DEFAULT CURRENT_TIMESTAMP
);
