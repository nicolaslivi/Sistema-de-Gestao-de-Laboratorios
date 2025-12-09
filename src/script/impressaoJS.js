let dataSala = localStorage.getItem('data.idSala');


document.addEventListener('DOMContentLoaded',()=>{
    fetch(`http://localhost:3000/sala/${dataSala}`)
})