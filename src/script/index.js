// const { response } = require("express");

let session = localStorage.getItem('dados.session');
let noma = localStorage.getItem('dados.nome');
let idProfessor = localStorage.getItem('dados.idProfessor');
let tabela = document.getElementById('tabela');
let idUsa = '';
const inputBusca = document.getElementById('inputBusca');
const lupa = document.getElementById('iconLupa');
const nome = document.getElementById('name');
const sair = document.getElementById('sair');
const modalfiltro = document.getElementById('modal-filtro');
const blockEdit = document.getElementById('edit');
const editarmodal = document.getElementById('editar-modal');
const nomeSala = document.getElementById('nomeSalaEdit');
const responsavel = document.getElementById('responsavelEdit');
const padrao5s = document.getElementById('padrao5sEdit');
const instru = document.getElementById('instruEdit');
const foto = document.getElementById('fotoEdit');
const buttonLimpar = document.getElementById('buttonLimpar');
console.log(idProfessor);


buttonLimpar.addEventListener('click',()=>{
    window.location.reload();
});

function editar(id){
    
    fetch(`http://localhost:3000/sala/${id}`)
    .then(response=>{
        if(!response.ok){
            throw new Error(`Erro HTTP: ${response.status}`)
        }
        return response.json()
    })
    .then(data=>{
        foto.src = data[0].foto;
        nomeSala.value = data[0].nomeSala;
        responsavel.value = data[0].nome;
        padrao5s.value = data[0].padrao5S;
        instru.value = data[0].instrucoes;
        console.log(data)
    })
    .catch(error=>{
        console.error('Vish',error);
        
    })
    idUsa = id;
    blockEdit.showModal();
}


const buttonAplicar = document.getElementById('buttonAplicar');
buttonAplicar.addEventListener('click',()=>{
    const padrao = document.getElementsByClassName('padrao');
    let linhaEdit = '<div class="status-container"><i class="fa-solid fa-pen" id="editIcon"></i></div>'
    fetch('http://localhost:3000/salas')
    .then(response=>{
        if(!response.ok){
            throw new Error(`Erro HTTP: ${response.status}`)
        }
        return response.json()
    })
    .then(data=>{
            tabela.innerHTML = '';
             for(let x = 0; x < data.length; x++){
                for(let y = 0; y < padrao.length; y++){
                    if(padrao[y].checked){
                        if(padrao[y].value == data[x].padrao5S){
                            tabela.innerHTML += `<tr><td scope="row" id="${data[x].idSala}" onclick="verDados(id)">${data[x].nomeSala}</td><td>${data[x].nome}</td><td class="status-container">${data[x].padrao5S}</td><td id="${data[x].idSala}" onclick="editar(id)">${linhaEdit}</td><td><div class="status-container"><i class="fa-solid fa-trash-can" id="${data[x].idSala}" onclick="pegarId(id)"></i></div></td></tr>` 
                        }
                    }
                }
            }

            console.log(data)
        })
        .catch(error=>{
            console.error('Deu ruim',error);
        });
});



editarmodal.addEventListener('click',async()=>{

    if(!nomeSala.value || !instru.value || !padrao5s.value) return alert('Falta informação');

    const dados = {
        nome: nomeSala.value,
        instrucoes: instru.value,
        padrao5s: padrao5s.value
    }
    console.log(idUsa);
    if(window.confirm('Você deseja editar essa sala?')){

        await fetch(`http://localhost:3000/editRoom/${idUsa}`,{
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })
            .then(response=>{
                if(!response.ok){
                    throw new Error(`Erro HTTP: ${response.status}`)
                }
                // return response.json();
            })
            .then(data=>{
                console.log(data);
            })
            .catch(error=>{
                console.error('Deu ruim',error);
            })
            blockEdit.close();
            window.location.reload();
    }
});



sair.addEventListener('click',async()=>{
    fetch('http://localhost:3000/logout',{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session}`
        }
    })

    if(window.confirm("Você deseja sair do sistema?")){
        fetch('http://localhost:3000/logout',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session}`
            }
        })
    
        .then(response=>{
            if(!response.ok){
                throw new Error(`Erro HTTP: ${response.status}`)
            }
            // return response.json()
        })
        .then(data=>{  
            console.log(data);
            
        })
        .catch(error=>{
            console.error('Erro ao buscar dados:', error)
        })
        localStorage.removeItem('dados.session');
        localStorage.removeItem('dados.nome');
        session = null;
        return window.location.href = 'login.html';
    } else {
        console.log('aqui.');
    }
});




inputBusca.addEventListener('keyup',async()=>{
    if(!inputBusca.value) return window.location.reload();
    let linhaEdit = '<td><div class="status-container"><i class="fa-solid fa-pen" id="editIcon"></i></div></td>';
    // let linhaDelete = '<td><div class="status-container"><i class="fa-solid fa-trash-can" id="deleteIcon"></i></div></td>';
    fetch('http://localhost:3000/salas')
        .then(response=>{
            if(!response.ok){
                throw new Error(`Erro HTTP: ${response.status}`)
            }
            return response.json()
        })
        .then(data=>{
            
            tabela.innerHTML = '';
            for(let x = 0; x < data.length; x++){
                if(data[x].nome.toLowerCase().includes(inputBusca.value.toLowerCase()) || data[x].nomeSala.toLowerCase().includes(inputBusca.value.toLowerCase())){
                    tabela.innerHTML += `<tr><td scope="row">${data[x].nomeSala}</td><td>${data[x].nome}</td><td class="status-container">${data[x].padrao5S}</td>${linhaEdit}<td><div class="status-container"><i class="fa-solid fa-trash-can" id="${data[x].idSala}" onclick="pegarId(id)"></i></div></td></tr>` 
                }
            }
            // return window.location.reload();
        })
        .catch(error=>{
            console.error('Erro ao buscar dados:',error)
        })
});
// localStorage.removeItem('dados.session');
// localStorage.removeItem('dados.nome');
// session = null;


function imprimir(){
    window.print();
}


async function pegarId(id){
    // console.log(id);
    if(window.confirm('Você deseja apagar essa sala?')){
        fetch(`http://localhost:3000/deletar/sala/${id}`,{
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
       })
            .then(response=>{
                    if(!response.ok){
                        throw new Error(`Erro HTTP: ${response.status}`)
                    }
                    return response.json()
            })
            .then(data =>{
                    console.log(data);
            })
            .catch(error=>{
                console.error('Erro ao buscar dados:',error);
            })
        alert('Sala deletada com sucesso');
        window.location.reload();
    } else {
        // console.log('Blz');
    }
}

function verDados(id){
    const nomeSala = document.getElementById('nomeSala');
    const responsavel = document.getElementById('responsavel');
    const padrao5s = document.getElementById('padrao5s');
    const instru = document.getElementById('instru');
    const foto = document.getElementById('foto');
    fetch(`http://localhost:3000/sala/${id}`)
        .then(response=>{
            if(!response.ok){
                throw new Error(`Erro HTTP: ${response.status}`)
            }
            return response.json()
        })
        .then(data=>{
            foto.src = data[0].foto;
            nomeSala.value = data[0].nomeSala;
            responsavel.value = data[0].nome;
            padrao5s.value = data[0].padrao5S;
            instru.value = data[0].instrucoes;
            localStorage.setItem('data.idSala',data[0].idSala);
            let dataSala = localStorage.getItem('data.idSala');
            console.log(data)
        })
        .catch(error=>{
            console.error('Vish',error);
            
        })
    modalfiltro.showModal();
}

console.log(session);
document.addEventListener('DOMContentLoaded',()=>{
    let linhaEdit = '<div class="status-container"><i class="fa-solid fa-pen" id="editIcon"></i></div>'
    let linhaDelete = '<td><div class="status-container"><i class="fa-solid fa-trash-can" id="deleteIcon"></i></div></td>'
    fetch('http://localhost:3000/salas')
        .then(response=>{
            if(!response.ok){
                throw new Error(`Erro HTTP: ${response.status}`)
            }
            return response.json()
        })
        .then(data=>{
            console.log(data);
            for(let x = 0; x < data.length; x++){
                tabela.innerHTML += `<tr><td scope="row" id="${data[x].idSala}" onclick="verDados(id)">${data[x].nomeSala}</td><td>${data[x].nome}</td><td class="status-container">${data[x].padrao5S}</td><td id="${data[x].idSala}" onclick="editar(id)">${linhaEdit}</td><td><div class="status-container"><i class="fa-solid fa-trash-can" id="${data[x].idSala}" onclick="pegarId(id)"></i></div></td></tr>` 
            }


        })
        .catch(error=>{
            console.error('Erro ao buscar dados:', error);
        })

    nome.innerText = `${noma}`
});

// 1. Capturar os elementos do DOM
const modal = document.getElementById('modal-filtro');
const abrirModalBtn = document.getElementById('iconFiltro');
const fecharModalBtn = document.getElementById('fechar-modal');
const closeModalX = document.getElementById('close-modal');

// 2. Adicionar evento para abrir o modal
// abrirModalBtn.addEventListener('click', () => {
//     // showModal() exibe o dialog e o backdrop
//     modal.showModal();
// });

// 3. Adicionar evento para fechar o modal
fecharModalBtn.addEventListener('click', () => {
    // close() esconde o dialog
     modalfiltro.close();
});

closeModalX.addEventListener('click', () => {
    // close() esconde o dialog
     modalfiltro.close();
});

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', (event) => {
    const button = document.getElementById('iconFiltro');
    const popover = document.getElementById('myPopover');

    // Alterna a visibilidade do popover ao clicar no botão
    button.addEventListener('click', () => {
        popover.classList.toggle('show');
    });

    // Opcional: Oculta o popover se o usuário clicar fora dele
    document.addEventListener('click', (event) => {
        if (!button.contains(event.target) && !popover.contains(event.target)) {
            popover.classList.remove('show');
        }
    });
});