const API_URI = "http://rem-rest-api.herokuapp.com/api/";
const API_LEARN = "http://rest.learncode.academy/api/jessica/";
const USUARIO_KEY = "usuario";

function logarUser() {
    let usuario = pegarDadosUsuario();
    makeGET('usuarios', function (data) {
        let user = data.find(e => e.email === usuario.email);
        if (user && user.senha === usuario.senha) {
            window.localStorage.setItem(USUARIO_KEY, JSON.stringify(user));
            $('.drop-login').hide();
            $('.drop-carrinho').show();
            alert('usuário logado');
        }
        else {
            alert('nome de usuario e/ou senha invalidos');
        }
    })
}

function configurarBotaoCadastro() {
    $('#cadastro-button').click(function (event) {
        event.preventDefault();
        cadastrarUser();
    });
}

function configurarBotaoEntrar() {
    $('#entrar-button').click(function (event) {
        event.preventDefault();
        logarUser();
    });
}

function configurarBotaoSair() {
    $('#sair').click(function (event) {
        event.preventDefault();
        deslogar();
    });
}

function estaLogado() {
    $('.qtd').show();
    $('.add-carrinho').show();
    return !!window.localStorage.getItem(USUARIO_KEY);
}

function elementosShowOrHide() {
    if (estaLogado()) {
        $('#sair').show();
        $('.drop-login').hide();
        $('.drop-carrinho').show();
    }
    else {
        $('#sair').hide();
        $('.qtd').hide();
        $('.add-carrinho').hide();
        $('.drop-login').show();
        $('.drop-carrinho').hide();
    }
}

function deslogar() {
    window.localStorage.removeItem(USUARIO_KEY);
    elementosShowOrHide();
    alert('usuário saiu');
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
    return { email: email, senha: senha };
}

function cadastroRequisicao(usuario) {
    makePOST('usuarios', usuario, function (data) {
        window.localStorage.setItem(USUARIO_KEY, JSON.stringify(data));
        $('.drop-login').hide();
        $('.drop-carrinho').show();
        elementosShowOrHide();
        alert('usuário cadastrado!');
    });
}

function makeGET(path, sucesso, error) {
    $.ajax({
        type: 'GET',
        url: API_URI + path,
        success: (data) => sucesso(data.data), // colocar .data para o heroi cu
        error: error
    });
}

function makePOST(path, body, sucesso, error) {
    $.ajax({
        type: 'POST',
        url: API_URI + path,
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
    configurarAjax();
    elementosShowOrHide();
    configurarBotaoCadastro();
    configurarBotaoEntrar();
    configurarBotaoSair();
});