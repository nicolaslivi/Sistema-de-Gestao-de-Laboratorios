const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(cors({origin:true,credentials:true}));
const port = 3000;

// Pra testar os bgl é preciso baixar o express, mysql2 e o cors na pasta app(Só usar o 'npm i ' pra todos)
// Você também precisa abrir o scrpit.sql no Workbench e usar os comandos pra criar o banco
// Lá no tabela dos professor no sql vai estar o usuario e a senha, caso você queria testar o login
 



const sessions = new Map();
function generateSessionId() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 9);
    return timestamp + randomPart;
  }

function authenticate(req,res,next){
    const header = req.headers['authorization'];
    const token = header.slice(7);
    console.log(token);
    console.log(sessions);
    if(!token)  return res.status(401).send('Sessão não informada');
    const session = sessions.get(token);
    console.log('Passou ', session);
    if(!session) return res.status(401).send('Sessão inválida');
    req.user = {id: session.idProfessor,usuario: session.usuario};
    next();
}

app.get('/professores',async(req,res)=>{
    try {
        const [professor] = await db.query('SELECT * FROM professor');
        return res.status(201).send(professor);
    } catch (error) {
        console.error('Vish',error);
        return res.status(500).send('Deu erro')
    }
});

app.get('/salas',async(req,res)=>{
    try {
        const [salas] = await db.query('SELECT sala.idSala,sala.idDoProfessor,sala.nomeSala,sala.padrao5S,professor.nome FROM sala JOIN professor ON sala.idDoProfessor = professor.idProfessor');
        return res.status(201).send(salas);
    } catch (error) {
        console.error('Vish',error);
        return res.status(500).send('Deu ruim',error);
    }
});


app.get('/sala/:id',async(req,res)=>{
    const id = parseInt(req.params.id);
    if(!id) return res.status(400).send('falta Informação');
    try {
        const [sala] = await db.query('SELECT sala.idSala,sala.idDoProfessor,sala.nomeSala,sala.padrao5S,sala.foto,sala.instrucoes,professor.nome FROM sala JOIN professor ON sala.idDoProfessor = professor.idProfessor WHERE idSala = ?',[id]);
        return res.status(201).send(sala)
    } catch (error) {
        console.error('Vish',error);
        return res.status(500).send('Deu ruim',error);
    }
})

app.post('/login',async(req,res)=>{
    const {usuario,senha} = req.body;
    if(!usuario || !senha){
        return res.status(401).send('Falta Valores');
    }
    try {
        const [professor] = await db.query('SELECT * FROM professor WHERE usuario = ?',[usuario]);
        if(professor[0].usuario !== usuario || professor[0].senha !== senha){
            return res.status(400).send('Credenciais inválidas');
        }
        const user = professor[0];
        const sessionId = generateSessionId();
        sessions.set(sessionId, {idProfessor: user.idProfessor, usuario: user.usuario});
        console.log(sessions);
        return res.send({
            sessionId,
            user: user.idProfessor, nome: user.nome, usuario: user.usuario
        });
    } catch (error) {
        console.error('Vish',error);
        return res.status(500).send('Erro interno do servidor ao buscar.');
    }
});
app.post('/logout',authenticate,(req,res)=>{
    const header = req.headers['authorization'];
    const token = header.slice(7);
    if(token && sessions.has(token)) sessions.delete(token);
    console.log(sessions);
    return res.status(204);
});
app.post('/novoLab',async(req,res)=>{
    let {idProfessor,nome,s5,descri,foto} = req.body;
    if(!nome || !s5 || !foto || !descri){
        return res.status(400).send('Falta Informação');
    }
    try {
        const [novoLab] = await db.query('INSERT INTO sala(IdDoProfessor,nomeSala,foto,instrucoes,padrao5S) VALUES (?,?,?,?,?)',[idProfessor,nome,foto,descri,s5]);
        return res.status(204)
    } catch (error) {
        console.error('Vish',error);
        return res.status(500).send('Erro interno do servidor ao buscar.')
    }
})

app.put('/editRoom/:id',async(req,res)=>{
    const id = parseInt(req.params.id);
    if(!id) return res.status(400).send('id inválido!');
    const {nome,instrucoes,padrao5s,foto} = req.body;
    if(!nome && !instrucoes && !padrao5s && !foto) return res.status(400).send('Mande pelo menos uma informação!');
    try {
        const [sala] = await db.query('SELECT * FROM sala WHERE idSala = ?',[id]);
        if(nome){
            const [alterRoomName] = await db.query('UPDATE sala SET nomeSala = ? WHERE idSala = ?',[nome,id]);
        }
        if(instrucoes){
            const [alterRoomInstrucoes] = await db.query('UPDATE sala SET instrucoes = ? WHERE idSala = ?',[instrucoes,id]);
        }
        if(padrao5s){
            const [alterRoompadrao5s] = await db.query('UPDATE sala SET padrao5S = ? WHERE idSala = ?',[padrao5s,id])
        }
        if(foto){
            const [alterRoomPicture] = await db.query('UPDATE sala SET foto = ? WHERE idSala = ?',[foto,id]);
        }
        return res.status(204).send();
    } catch (error) {
        console.error('Vish',error);
        return res.status(500).send('Deu Ruim');
    }
})


app.delete('/deletar/sala/:id',async(req,res)=>{
    const id = parseInt(req.params.id);
    if(!id) return res.status(400).send('Falta Informação');
    try {
        const [apaga] = await db.query('DELETE FROM sala WHERE idSala = ?',[id]);
        return res.status(204);
    } catch (error) {
        console.error('Vish',error);
        return res.status(500).send('Ocorreu um problema');
    }
})




app.listen(port,()=>{
    console.log(`Rodando na porta: ${port}`)
});