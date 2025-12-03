const usuario = document.getElementById('usuario');
const senha = document.getElementById('senha');
const entrar = document.getElementById('botaoEntrar');
let session = localStorage.getItem('dados.session');
let noma = localStorage.getItem('dados.nome');

entrar.addEventListener('click',async()=>{
    console.log(usuario.value,senha.value);

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
            window.location.href = 'index.html';
            
        })
        .catch(error=>{
            console.error('Erro ao buscar dados:', error)
        })
});
console.log(session);