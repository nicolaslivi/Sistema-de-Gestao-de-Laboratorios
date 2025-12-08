
const inputBusca = document.getElementById('inputBusca');
const lupa = document.getElementById('iconLupa');
let session = localStorage.getItem('dados.session');
let noma = localStorage.getItem('dados.nome');
let idProfessor = localStorage.getItem('dados.idProfessor');
const nome = document.getElementById('name');
const sair = document.getElementById('sair');
let tabela = document.getElementById('tabela');
const modalfiltro = document.getElementById('modal-filtro')


console.log(idProfessor);


sair.addEventListener('click',async()=>{
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
    // modalfiltro = document.getElementById('modal-filtro')
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
    modalfiltro.showModal();
}

console.log(session);
document.addEventListener('DOMContentLoaded',()=>{
    let linhaEdit = '<td><div class="status-container"><i class="fa-solid fa-pen" id="editIcon"></i></div></td>'
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
                tabela.innerHTML += `<tr><td scope="row" id="${data[x].idSala}" onclick="verDados(id)">${data[x].nomeSala}</td><td>${data[x].nome}</td><td class="status-container">${data[x].padrao5S}</td>${linhaEdit}<td><div class="status-container"><i class="fa-solid fa-trash-can" id="${data[x].idSala}" onclick="pegarId(id)"></i></div></td></tr>` 
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