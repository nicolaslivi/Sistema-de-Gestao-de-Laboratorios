let session = localStorage.getItem('dados.session');
let noma = localStorage.getItem('dados.nome');
const nome = document.getElementById('name');
const inputsCadastro = document.getElementsByClassName('inputsCadastro')
const buttonAddLab = document.getElementById('buttonAddLab');


buttonAddLab.addEventListener('click',()=>{
    let labInfo = [];
    for(let x = 0; x < inputsCadastro.length; x++){
        if(!inputsCadastro[x].value){
            alert('falta informação');
            break;
        }
        labInfo.push(inputsCadastro[x].value);
    }
    console.log(labInfo);

})


// localStorage.removeItem('dados.session');
// localStorage.removeItem('dados.nome');
// session = null;


document.addEventListener('DOMContentLoaded',()=>{
    nome.innerText = `${noma}`;
})