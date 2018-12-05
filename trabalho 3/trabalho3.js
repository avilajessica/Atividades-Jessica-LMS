const API_URI = "http://rem-rest-api.herokuapp.com/api/";
const API_LEARN = "http://rest.learncode.academy/api/jessica/";
const USUARIO_KEY = "usuario";

function logarUser() {
    let usuario = pegarDadosUsuario();
    makeGET('usuarios', function (data) {
        let user = data.find(e => e.email === usuario.email);
        if (user && user.senha === usuario.senha) {
            window.localStorage.setItem(USUARIO_KEY, user);
            alert('usuário logado');
            $('.drop-login').hide();
            $('.drop-carrinho').show();
        }
        else {
            alert('nome de usuario e/ou senha invalidos');
        }
    })
}

function estaLogado() {
    $('.qtd').show();
    $('.add-carrinho').show();
    return !!window.localStorage.getItem(USUARIO_KEY);
}

function botaoSair() {
    if (estaLogado()) {
        $('#sair').show();
    }
    else {
        $('#sair').hide();
        $('.qtd').hide();
        $('.add-carrinho').hide();
    }
}

function deslogar() {
    window.localStorage.removeItem(USUARIO_KEY);
    alert('usuário saiu');
    $('.drop-login').show();
    $('.drop-carrinho').hide();

    botaoSair();
}

function cadastrarUser() {
    let usuario = pegarDadosUsuario();
    makeGET('usuarios', function (usuarios) {
        if (usuarios.find((u) => u.email === usuario.email)) {
            alert('email já cadastrado');
        }
        else {
            cadastroRequisicao(usuario);
        }
    })
}

function pegarDadosUsuario() {
    let email = $("#email").val().toString();
    let senha = $("#senha").val().toString();
    return {email: email, senha: senha};
}

function cadastroRequisicao(usuario) {
    makePOST('usuarios', usuario, function (data) {
        window.localStorage.setItem(USUARIO_KEY, data);
        alert('usuário cadastrado!');
        $('.drop-login').hide();
        $('.drop-carrinho').show();
        botaoSair();
    });
}

function makeGET(path, sucesso, error) {
    $.ajax({
        type: 'GET',
        url: API_LEARN + path,
        success: (data) => sucesso(data), // colocar .data para o heroi cu
        error: error
    });
}

function makePOST(path, body, sucesso, error) {
    $.ajax({
        type: 'POST',
        url: API_LEARN + path,
        data: JSON.stringify(body),
        success: sucesso,
        error: error
    });
}

function configurarAjax() {
    $.ajaxSetup({
        xhrFields: { withCredentials: true }
    });
}

window.addEventListener('load', function () {
    // configurarAjax();
    $('#cadastro-button').click(function(event) {
        event.preventDefault();
        cadastrarUser();
    });
    $('#entrar-button').click(function(event) {
        event.preventDefault();
        logarUser();
    });
    $('#sair').click(function(event) {
        event.preventDefault();
        deslogar();
    });
});