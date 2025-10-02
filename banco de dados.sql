CREATE DATABASE IF NOT EXISTS portal_planos
DEFAULT CHARSET = utf8mb4
DEFAULT COLLATE = utf8mb4_general_ci;

USE portal_planos;

CREATE TABLE IF NOT EXISTS cursos (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    tipo_curso VARCHAR(50)
) DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS turmas (
    id_turma INT AUTO_INCREMENT PRIMARY KEY,
    id_curso INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
) DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS disciplinas (
    id_disciplina INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
) DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS registros (
    id_registro INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('plano_curso','plano_aula','material') NOT NULL,
    professor VARCHAR(100) NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    curso VARCHAR(100),
    turma VARCHAR(100),
    disciplina VARCHAR(100),
    area VARCHAR(100),
    tipo_curso VARCHAR(50),
    tipo_material VARCHAR(50),
    data DATE NOT NULL,
    arquivo VARCHAR(255),
    link VARCHAR(255)
) DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;