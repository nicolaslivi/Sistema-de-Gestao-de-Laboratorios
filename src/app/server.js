const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors({origin:true,credentials:true}));

app.listen(300,()=>{
    console.log(`Rodando na porta: ${port}`)
});