const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(cors({origin:true,credentials:true}));
const port = 3000;

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
    req.user = {id: session.idUsuarios,email: session.email};
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
    return res.sendStatus(204);
});

app.listen(port,()=>{
    console.log(`Rodando na porta: ${port}`)
});