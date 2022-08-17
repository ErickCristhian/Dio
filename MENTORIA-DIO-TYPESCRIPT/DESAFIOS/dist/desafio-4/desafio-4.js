"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let apiKey = '774a09e48b54c9ef4e094d26f1b77108';
let requestToken;
let username;
let password;
let sessionId;
let listId = '8213902';
let filmesList = [];
let nomeLista;
let descLista;
let loginButton = document.getElementById('login-button');
let searchButton = document.getElementById('search-button');
let searchContainer = document.getElementById('search-container');
let listaButton = document.getElementById('lista-button');
let favoritos = document.getElementById("seach-favoritos");
listaButton === null || listaButton === void 0 ? void 0 : listaButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    criarLista(nomeLista, descLista);
}));
loginButton === null || loginButton === void 0 ? void 0 : loginButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    yield criarRequestToken();
    yield logar();
    yield criarSessao();
}));
favoritos === null || favoritos === void 0 ? void 0 : favoritos.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    let favoritosList = document.getElementById('favoritos');
    if (favoritosList) {
        favoritosList.innerHTML = "<h1>Lista de Favotiros</h1>";
    }
    let listaDeFavoritos = yield pegarLista();
    console.log(listaDeFavoritos);
    let ul = document.createElement('ul');
    ul.id = "lista-favoritos";
    if (listaDeFavoritos.items) {
        for (const item of listaDeFavoritos.items) {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(item.original_title));
            ul.appendChild(li);
        }
    }
    favoritosList === null || favoritosList === void 0 ? void 0 : favoritosList.appendChild(ul);
}));
searchButton === null || searchButton === void 0 ? void 0 : searchButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    let lista = document.getElementById("lista");
    if (lista) {
        lista.outerHTML = "";
    }
    let search = document.getElementById('search');
    let query = search === null || search === void 0 ? void 0 : search.value;
    let listaDeFilmes = yield procurarFilme(query);
    let ul = document.createElement('ul');
    ul.id = "lista";
    if (listaDeFilmes.results) {
        for (const item of listaDeFilmes.results) {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(item.original_title));
            li.innerHTML += `<button onclick="adicionarFilmeNaLista(${item.id}, ${listId})">Favoritar</button>`;
            ul.appendChild(li);
        }
    }
    console.log(listaDeFilmes);
    searchContainer === null || searchContainer === void 0 ? void 0 : searchContainer.appendChild(ul);
}));
function preencherSenha() {
    let senha = document.getElementById('senha');
    password = senha === null || senha === void 0 ? void 0 : senha.value;
    validateLoginButton();
}
function preencherLogin() {
    let login = document.getElementById('login');
    username = login === null || login === void 0 ? void 0 : login.value;
    validateLoginButton();
}
function preencherListaNome() {
    let lista = document.getElementById('lista-nome');
    nomeLista = lista === null || lista === void 0 ? void 0 : lista.value;
}
function preencherListaDesc() {
    let descricao = document.getElementById('descricao');
    descLista = descricao === null || descricao === void 0 ? void 0 : descricao.value;
}
function preencherApi() {
    let key = document.getElementById('api-key');
    apiKey = key === null || key === void 0 ? void 0 : key.value;
    validateLoginButton();
}
function validateLoginButton() {
    if (password && username && apiKey) {
        loginButton.disabled = false;
    }
    else {
        loginButton.disabled = true;
    }
}
class HttpClient {
    static get({ url, method, body = null }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest();
                request.open(method, url, true);
                request.onload = () => {
                    if (request.status >= 200 && request.status < 300) {
                        resolve(JSON.parse(request.responseText));
                    }
                    else {
                        reject({
                            status: request.status,
                            statusText: request.statusText
                        });
                    }
                };
                request.onerror = () => {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                };
                if (body) {
                    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    body = JSON.stringify(body);
                }
                request.send(body);
            });
        });
    }
}
function procurarFilme(query) {
    return __awaiter(this, void 0, void 0, function* () {
        query = encodeURI(query);
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
            method: "GET"
        });
        return result;
    });
}
function adicionarFilme(filmeId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
            method: "GET"
        });
        console.log(result);
    });
}
function criarRequestToken() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
            method: "GET"
        });
        if (result) {
            requestToken = result.request_token;
        }
    });
}
function logar() {
    return __awaiter(this, void 0, void 0, function* () {
        yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
            method: "POST",
            body: {
                username: `${username}`,
                password: `${password}`,
                request_token: `${requestToken}`
            }
        });
    });
}
function criarSessao() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
            method: "GET"
        });
        sessionId = result.session_id;
    });
}
function criarLista(nomeDaLista, descricao) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                name: nomeDaLista,
                description: descricao,
                language: "pt-br"
            }
        });
        console.log(result);
    });
}
function adicionarFilmeNaLista(filmeId, listaId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                media_id: filmeId
            }
        });
        console.log(result);
    });
}
function pegarLista() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
            method: "GET"
        });
        return result;
    });
}
{ /* <div style="display: flex;">
  <div style="display: flex; width: 300px; height: 100px; justify-content: space-between; flex-direction: column;">
      <input id="login" placeholder="Login" onchange="preencherLogin(event)">
      <input id="senha" placeholder="Senha" type="password" onchange="preencherSenha(event)">
      <input id="api-key" placeholder="Api Key" onchange="preencherApi()">
      <button id="login-button" disabled>Login</button>
  </div>
  <div id="search-container" style="margin-left: 20px">
      <input id="search" placeholder="Escreva...">
      <button id="search-button">Pesquisar Filme</button>
  </div>
</div>*/
}
