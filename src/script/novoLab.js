// const { response } = require("express");

let session = localStorage.getItem('dados.session');
let noma = localStorage.getItem('dados.nome');
let idProfessor = localStorage.getItem('dados.idProfessor');
let namePicture = '';
let resultado = '';
const nome = document.getElementById('name');
const inputsCadastro = document.getElementsByClassName('inputsCadastro')
const buttonAddLab = document.getElementById('buttonAddLab');
const professor = document.getElementById('professor');
const foto = document.querySelector('#foto');
const boxImage = document.querySelector('.boxImage');
const baixar = document.getElementById('baixar');
let urlPictures =`/src/app/pictures/${namePicture}`;
console.log(idProfessor);

buttonAddLab.addEventListener('click',()=>{
    let labInfo = [idProfessor];
    for(let x = 0; x < inputsCadastro.length; x++){
        if(!inputsCadastro[x].value){
            alert('falta informação');
            // window.location.reload()
            break;
        }
        labInfo.push(inputsCadastro[x].value);
    }
    let dados = {};
    if(namePicture){
        dados = {
            idProfessor : labInfo[0],
            nome: labInfo[1],
            s5: labInfo[2],
            descri: labInfo[4],
            foto: urlPictures
        }
    } else {
        alert('falta informação');
    }
    let verifica = false;
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
            
            // verifica = true
            // return response.json()
        })
        .then(data=>{
            console.log(data)
           
        })
        .catch(error=>{
            console.error('Erro ao buscar dados:',error)
        })
        console.log(verifica)
    if(dados.idProfessor && dados.nome && dados.s5 && dados.descri && namePicture){
        baixar.href = resultado;
        baixar.download = namePicture;
        alert('Sala cadastrada com sucesso');
        window.location.href = 'index.html';
    }
})



foto.addEventListener('change',function(e){
    const fotoTarget = e.target;
    const file = fotoTarget.files[0];
    if(file){
        const reader = new FileReader();
        reader.addEventListener('load',function(e){
            const readerFile = e.target;
            const img = document.createElement('img');
            img.src = readerFile.result;
            img.classList.add("boxImage");
            boxImage.innerHTML = '';
            boxImage.appendChild(img);
            // baixar.href = readerFile.result;
            // baixar.download = file.name;
            namePicture = file.name;
            resultado = readerFile.result;
            urlPictures =`/src/app/pictures/${namePicture}`;
        })
        reader.readAsDataURL(file);
    }
    
})
// localStorage.removeItem('dados.session');
// localStorage.removeItem('dados.nome');
// session = null;


document.addEventListener('DOMContentLoaded',()=>{
    professor.value = noma;
    nome.innerText = `${noma}`;
})