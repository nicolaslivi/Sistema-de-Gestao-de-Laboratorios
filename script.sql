CREATE DATABASE IF NOT EXISTS laboratorios_senai;


CREATE TABLE IF NOT EXISTS professor(
	idProfessor int not null primary key auto_increment,
    nome varchar(150) not null,
    senha varchar(15) not null,
    usuario varchar(45) not null
);

CREATE TABLE IF NOT EXISTS sala(
	idSala int not null primary key auto_increment,
    idDoProfessor int not null,
    nomeSala varchar(250) not null,
    foto varchar(450) not null,
    instrucoes text not null,
    padrao5S varchar(15) not null,
    constraint FK_idProfessor
    foreign key (idDoProfessor)
    references professor(idProfessor)

);

INSERT INTO professor(nome,senha,usuario) VALUES
('Antonio Malaquias','1234','antonio_malaquias'),
('Nicolas','1234','nicolas');


INSERT INTO sala(IdDoProfessor,nomeSala,foto,instrucoes,padrao5S) VALUES
(1,'Sala Teste','foto','instruções','Seiri'),
(2,'Sala Teste2','fot2o','instruções2','Seiton');



INSERT INTO sala(IdDoProfessor,nomeSala,foto,instrucoes,padrao5S) VALUES
(1,'Sala Teste3','foto3','instruções3','Seiri');


DELETE FROM sala WHERE idSala = 3;