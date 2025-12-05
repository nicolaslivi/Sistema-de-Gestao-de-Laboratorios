// const { response } = require("express");

let session = localStorage.getItem('dados.session');
let noma = localStorage.getItem('dados.nome');
const nome = document.getElementById('name');
const inputsCadastro = document.getElementsByClassName('inputsCadastro')
const buttonAddLab = document.getElementById('buttonAddLab');
const professor = document.getElementById('professor');
let idProfessor = localStorage.getItem('dados.idProfessor');
console.log(idProfessor);

buttonAddLab.addEventListener('click',()=>{
    let labInfo = [idProfessor];
    for(let x = 0; x < inputsCadastro.length; x++){
        if(!inputsCadastro[x].value){
            alert('falta informação');
            window.location.reload()
            break;
        }
        labInfo.push(inputsCadastro[x].value);
    }
    let dados = {
        idProfessor : labInfo[0],
        nome: labInfo[1],
        s5: labInfo[2],
        descri: labInfo[4]
    }

    fetch('http://localhost:3000/novoLab',{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
        .then(response=>{
            if(!response.ok){
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json()
        })
        .then(data=>{
            console.log(data)
        })
        .catch(error=>{
            console.error('Erro ao buscar dados:',error)
        })

    
})


// localStorage.removeItem('dados.session');
// localStorage.removeItem('dados.nome');
// session = null;


document.addEventListener('DOMContentLoaded',()=>{
    professor.value = noma;
    nome.innerText = `${noma}`;
})