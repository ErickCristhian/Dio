let apiKey: string = '774a09e48b54c9ef4e094d26f1b77108';
let requestToken: string;
let username: string;
let password: string;
let sessionId: string;
let listId: string = '8213902';
let filmesList: string[] = [];
let nomeLista: string;
let descLista: string;

let loginButton = document.getElementById('login-button') as HTMLButtonElement;
let searchButton = document.getElementById('search-button');
let searchContainer = document.getElementById('search-container');
let listaButton = document.getElementById('lista-button') as HTMLButtonElement;
let favoritos = document.getElementById("seach-favoritos") as HTMLButtonElement;

listaButton?.addEventListener('click', async () => {
    criarLista(nomeLista, descLista);
})
loginButton?.addEventListener('click', async () => {
  await criarRequestToken();
  await logar();
  await criarSessao();
})

favoritos?.addEventListener('click', async () => {
    let favoritosList = document.getElementById('favoritos')

    if(favoritosList) {
        favoritosList.innerHTML = "<h1>Lista de Favotiros</h1>"
    }
    let listaDeFavoritos: { items?: any[] } = await pegarLista() as Object
    console.log(listaDeFavoritos)
    let ul = document.createElement('ul');
    ul.id = "lista-favoritos"
    if(listaDeFavoritos.items) {
        for(const item of listaDeFavoritos.items) {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(item.original_title))
            ul.appendChild(li)
        }
    }
    favoritosList?.appendChild(ul)
})

searchButton?.addEventListener('click', async () => {
  let lista = document.getElementById("lista");
  if (lista) {
    lista.outerHTML = "";
  }
  let search = document.getElementById('search') as HTMLInputElement
  let query = search?.value;
  let listaDeFilmes: { results?: any[] } = await procurarFilme(query) as Object;
  let ul = document.createElement('ul');
  ul.id = "lista"
  if(listaDeFilmes.results) {
    for (const item of listaDeFilmes.results) {
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(item.original_title))
        li.innerHTML += `<button onclick="adicionarFilmeNaLista(${item.id}, ${listId})">Favoritar</button>`
        ul.appendChild(li)
    }
 }
 console.log(listaDeFilmes)
  searchContainer?.appendChild(ul);
})

function preencherSenha() {
  let senha = document.getElementById('senha') as HTMLInputElement
  password = senha?.value;
  validateLoginButton();
}


function preencherLogin() {
  let login = document.getElementById('login') as HTMLInputElement;
  username = login?.value;
  validateLoginButton();
}

function preencherListaNome() {
    let lista = document.getElementById('lista-nome') as HTMLInputElement;
    nomeLista = lista?.value;
}
function preencherListaDesc() {
    let descricao = document.getElementById('descricao') as HTMLInputElement;
    descLista = descricao?.value;
}

function preencherApi() {
  let key = document.getElementById('api-key') as HTMLInputElement
  apiKey = key?.value;
  validateLoginButton();
}

function validateLoginButton() {
  if (password && username && apiKey) {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

class HttpClient {
  static async get({url, method, body = null}: {url: string, method: string, body?: any}) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open(method, url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }
      }
      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText
        })
      }

      if (body) {
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        body = JSON.stringify(body);
      }
      request.send(body);
    })
  }
}

async function procurarFilme(query: string) {
  query = encodeURI(query)
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
    method: "GET"
  })
  return result 
}

async function adicionarFilme(filmeId: string) {
    let result = await HttpClient.get({
      url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
      method: "GET"
    })
    console.log(result);
  }

async function criarRequestToken () {
  let result: { request_token?: any } = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    method: "GET"
  }) as Object
  if(result) {
    requestToken = result.request_token
  }
}

async function logar() {
  await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: "POST",
    body: {
      username: `${username}`,
      password: `${password}`,
      request_token: `${requestToken}`
    }
  })
}

async function criarSessao() {
  let result: { session_id?: any } = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    method: "GET"
  }) as Object
  sessionId = result.session_id;
}

async function criarLista(nomeDaLista: string, descricao: string) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      name: nomeDaLista,
      description: descricao,
      language: "pt-br"
    }
  })
  console.log(result);
}

async function adicionarFilmeNaLista(filmeId: string, listaId: string) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      media_id: filmeId
    }
  })
  console.log(result);
}

async function pegarLista() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    method: "GET"
  })
  return result;
}

{/* <div style="display: flex;">
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
</div>*/}