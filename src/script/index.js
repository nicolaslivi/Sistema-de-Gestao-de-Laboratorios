
const inputBusca = document.getElementById('inputBusca');
const lupa = document.getElementById('iconLupa');
let session = localStorage.getItem('dados.session');
let noma = localStorage.getItem('dados.nome');
const nome = document.getElementById('name');
const sair = document.getElementById('sair');
let tabela = document.getElementById('tabela');





sair.addEventListener('click',async()=>{
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
            localStorage.removeItem('dados.session');
            localStorage.removeItem('dados.nome');
            session = null;
            return window.location.href = 'login.html';
        })
        .catch(error=>{
            console.error('Erro ao buscar dados:', error)
        })
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
    console.log(id)
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
                tabela.innerHTML += `<tr><td scope="row">${data[x].nomeSala}</td><td>${data[x].nome}</td><td class="status-container">${data[x].padrao5S}</td>${linhaEdit}<td><div class="status-container"><i class="fa-solid fa-trash-can" id="${data[x].idSala}" onclick="pegarId(id)"></i></div></td></tr>` 
            }


        })
        .catch(error=>{
            console.error('Erro ao buscar dados:', error);
        })

    nome.innerText = `${noma}`
});
