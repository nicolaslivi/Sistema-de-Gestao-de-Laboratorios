const usuario = document.getElementById('usuario');
const senha = document.getElementById('senha');
const errou = document.getElementById('errou');
const entrar = document.getElementById('botaoEntrar');
let session = localStorage.getItem('dados.session');
let noma = localStorage.getItem('dados.nome');

entrar.addEventListener('click',async()=>{
    const dado = {
        usuario : usuario.value,
        senha: senha.value
    }
    await fetch('http://localhost:3000/login',{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dado)
    })
        .then(response=>{
            if(!response.ok){
                throw new Error(`Erro HTTP: ${response.status}`)
            }
            return response.json()
        })
        .then(data=>{
            console.log(data);
            localStorage.setItem('dados.nome',data.nome);
            localStorage.setItem('dados.session',data.sessionId);
            noma = localStorage.getItem('dados.nome');
            session = localStorage.getItem('dados.session');
            return window.location.href = 'index.html';
            
        })
        .catch(error=>{
            console.error('Erro ao buscar dados:', error)
        })
        if(!session){
            errou.style.visibility = 'visible'
            return alert('Credenciais inválidas');
        }
});
console.log(session);

// localStorage.removeItem('dados.session');
// localStorage.removeItem('dados.nome');
// session = null;

document.addEventListener('DOMContentLoaded',()=>{
    errou.style.visibility = 'hidden';
});