
function renderizarConversas(grupos) {
    barraContatos = document.getElementById('barra-contatos');
    grupos.forEach(function (item) {
        let grupo = criarGrupoElemento(item.id, item.grupo);
        barraContatos.appendChild(grupo);
    })
}

function criarMensagemElemento(usuario, texto) {
    let panel = document.createElement('div');
    let heading = document.createElement('div');
    let title = document.createElement('h3');
    let body = document.createElement('div');

    panel.setAttribute('class', 'panel panel-default');
    heading.setAttribute('class', 'panel-heading');
    title.setAttribute('class', 'panel-title');
    body.setAttribute('class', 'panel-body');

    title.innerText = usuario;
    body.innerHTML = texto;

    panel.appendChild(heading);
    heading.appendChild(title);
    panel.appendChild(body);
    return panel;
}

function criarGrupoElemento(grupoId, grupoNome) {
    let grupo = document.createElement('div');
    let img = document.createElement('img');
    let h2 = document.createElement('h2');

    grupo.setAttribute('class', 'lista-contatos');
    grupo.setAttribute('id', 'grupo-' + grupoId);
    img.setAttribute('src', 'icon-perfil.png');
    h2.innerText = grupoNome;

    grupo.appendChild(img);
    grupo.appendChild(h2);
    return grupo;
}

function renderizarMensagens(mensagens) {
    let barraMensagem = document.getElementById('barra-mensagem');
    barraMensagem.innerHTML = '';
    mensagens.forEach(function (item) {
        let msg = criarMensagemElemento(item.usuario, item.texto);
        barraMensagem.appendChild(msg);
    });
}

function estaLogado() {
    return !!window.localStorage.getItem('user_id');
}

function autenticacao() {
    event.preventDefault();
    if (estaLogado()) {
        deslogar();
    }
    else {
        abrirModalLogin();
    }
}

function configurarModalLogin() {
    let modal_overlay = document.querySelector(".modal-overlay");
    let close = document.querySelector(".modal-overlay .modal .close")
    let loginInput = document.getElementById('login-form');

    close.addEventListener("click", function () {
        modal_overlay.classList.remove("active");
    })

    loginInput.addEventListener('submit', logar);

    window.addEventListener("click", function () {
        if (event.target == modal_overlay) {
            modal_overlay.classList.remove("active");
        }
    })
}

function abrirModalLogin() {
    let modal_overlay = document.querySelector(".modal-overlay");
    modal_overlay.classList.add('active');
}

function fecharModalLogin() {
    let modal_overlay = document.querySelector(".modal-overlay");
    modal_overlay.classList.remove('active');
}

function logar() {
    event.preventDefault();
    let loginInput = document.getElementById('login-input');
    let botaoEntrar = document.getElementById('entrar-button');
    let usuario = loginInput.value;
    window.localStorage.setItem('user_id', usuario);
    loginInput.value = '';
    botaoEntrar.innerHTML = 'Sair';
    fecharModalLogin();
}

function deslogar() {
    window.localStorage.removeItem('user_id');
    let botaoEntrar = document.getElementById('entrar-button');
    botaoEntrar.innerHTML = 'Entrar';
}

function enviarMensagemREST(groupID, mensagem) {
    fetch('http://rest.learncode.academy/api/jessica/' + groupID, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mensagem)
    })
        .then(res => res.json()) // converte o corpo da response pra js
        .then(function (msg) { // processa o resultado de fato
            let msgElemento = criarMensagemElemento(msg.userName, msg.message);
            document.getElementById('barra-mensagem').appendChild(msgElemento);
            // remover depois que estiver usando somente a API:
            let conversa = grupos.find(e => e.id == groupID);
            conversa.mensagens.push({ usuario: msg.userName, texto: msg.message });
        });
}

function enviarMensagem(event) {
    event.preventDefault();
    let msgElemento = document.getElementById('input');
    let msg = { userName: 'jessica', message: msgElemento.value };
    msgElemento.value = '';
    let groupID = window.localStorage.getItem('grupo_id');
    enviarMensagemREST(groupID, msg);
}

function criarGrupoREST(grupo) {
    fetch('http://rest.learncode.academy/api/jessica/groups', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grupo)
    })
        .then(res => res.json())
        .then(function (gp) {
            let gpElemento = criarGrupoElemento(gp.groupID, gp.groupName);
            document.getElementById('barra-contatos').appendChild(gpElemento);
            grupos.push({ id: gp.groupID, grupo: gp.groupName, mensagens: [] });
        })
}

function criarGrupo(event) {
    event.preventDefault();
    let gpId = document.getElementById('input-gp-id').value;
    let gpNome = document.getElementById('input-gp-nome').value;
    criarGrupoREST({ groupID: gpId, groupName: gpNome });
}

window.addEventListener('load', function () {
    renderizarConversas(grupos);
    configurarModalLogin();

    let entrarButton = document.getElementById('entrar-button');
    entrarButton.addEventListener('click', autenticacao);

    let listaGrupos = [...this.document.getElementsByClassName('lista-contatos')];
    let campoMsg = this.document.getElementById('msg');
    let barbieImg = this.document.getElementById('barbie-img');
    listaGrupos.forEach(function (item) {
        item.addEventListener('click', function () {
            let id = item.getAttribute('id').split('-')[1];
            let grupo1 = grupos.find(e => e.id == id);
            let img = document.getElementById('img-perfil');
            img.style.display = 'inherit';
            document.getElementById('titulo-conversa').innerText = grupo1.grupo;
            renderizarMensagens(grupo1.mensagens);
            window.localStorage.setItem('grupo_id', id);
            campoMsg.style.display = "block";
            barbieImg.style.display = "none";

        });
        document.getElementById('msg').addEventListener('submit', enviarMensagem);
        document.getElementById('novo-grupo').addEventListener('submit', criarGrupo);
    })

    let bodyCor = document.querySelectorAll(".lista-contatos");
    function mudarCorFundo(i) {
        for (let j = 0; j < bodyCor.length; j++) {
            bodyCor[j].classList.add("fundo");
            if (j != i)
                bodyCor[j].classList.remove("fundo");
        }

    }
    for (let i = 0; i < bodyCor.length; i++)
        bodyCor[i].addEventListener("click", function () {
            mudarCorFundo(i)
        });
});