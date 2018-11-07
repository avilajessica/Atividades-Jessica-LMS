let botao_sanduiche = document.querySelector(".botao-sanduiche");
let menu_lateral = document.querySelector(".lateral");

botao_sanduiche.addEventListener("click", function(){
    menu_lateral.classList.toggle("show")
})

let mostra = document.querySelectorAll(".acordeon .botao");

function mostraConteudo(i) {
    mostra[i].classList.toggle("show");
    for(let j=0; j < mostra.length; j++) {
        if(j != i)
            mostra[j].classList.remove("show");
    }
}

for(let i=0; i < mostra.length; i++)
    mostra[i].addEventListener("click", function(){mostraConteudo(i)});