// page 2
const API_URI = "http://rem-rest-api.herokuapp.com/api/";
const API_LEARN = "http://rest.learncode.academy/api/jessica/";

function adicionarElementoItem(data) {
    let item = `
        <div class="col-md-4">
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="./media/${data.imgFile}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${data.nome}</h5>
                    <span class="preco">${data.preco}</span> <br>   
                </div>
            </div>
        </div>
    `;
    $('#pedidos').append(item);
}


function produtoGET() {
    let produto = pegarDadosProduto();
    $.ajax({
        type: 'GET',
        url: API_URI + 'carrinho',
        success: function() {
            adicionarElementoItem(produto);
        }
    });
}

function pegarDadosProduto() {
    
}

function adicionarProdutoCarrinho() {
    $('')
}

function configurarAjax() {
    $.ajaxSetup({
        xhrFields: { withCredentials: true }
    });
}

window.addEventListener('load', function (event) {
    configurarAjax();
    // [
    //     {
    //         imagemPath: 'moletom1.jpg',
    //         preco: '10.000,99',
    //         nome: 'bruza'
    //     },
    //     {
    //         imagemPath: 'midia/moletom2.jpg',
    //         preco: '200,99',
    //         nome: 'jaqueta de coro'
    //     }
    // ].forEach(item => adicionarElementoItem(item));
})