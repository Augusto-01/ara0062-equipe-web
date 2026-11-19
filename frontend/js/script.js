"use strict";

const API = "../backend/";
const CINEMETA = "https://v3-cinemeta.strem.io";
const MAX_TOP = 10;
const MAX_RESULTADOS = 8;

const $ = (seletor) => document.querySelector(seletor);

/* Texto do botão de categoria -> nome do gênero na Cinemeta */
const CATEGORIAS = {
  Ação: "Action",
  Aventura: "Adventure",
  Biografia: "Biography",
  Crime: "Crime",
  Comédia: "Comedy",
  Drama: "Drama",
};
const CHAVE_GENEROS = "catalogoflix:generos";

let filmesCarregados = [];
let categoriaAtual = "Todos";
let generosPorImdb = {};

try {
  generosPorImdb = JSON.parse(localStorage.getItem(CHAVE_GENEROS)) || {};
} catch {
  generosPorImdb = {};
}

const estrelas = (nota) => "★".repeat(nota) + "☆".repeat(5 - nota);

/* Prioridade: pôster da Cinemeta (poster_url); se não houver, a capa enviada
   pelo usuário (img/capas/); se nenhum dos dois, fundo vazio. */
function urlCapa(filme) {
  if (filme.poster_url && /^https?:\/\//i.test(filme.poster_url)) {
    return `url(${JSON.stringify(filme.poster_url)})`;
  }
  if (filme.capa) {
    return `url("img/capas/${encodeURIComponent(filme.capa)}")`;
  }
  return "";
}

function mostrarAviso(el, texto, erro = false) {
  el.textContent = texto;
  el.classList.toggle("erro", erro);
}

/* ----------------------------------
   CINEMETA
---------------------------------- */

async function buscarFilmes(titulo) {
  const consulta = encodeURIComponent(titulo);

  const resposta = await fetch(
    `${CINEMETA}/catalog/movie/top/search=${consulta}.json`,
  );

  if (!resposta.ok) {
    throw new Error("Não foi possível pesquisar os filmes.");
  }

  const dados = await resposta.json();

  return dados.metas || [];
}

async function buscarDetalhes(imdbId) {
  const resposta = await fetch(
    `${CINEMETA}/meta/movie/${encodeURIComponent(imdbId)}.json`,
  );

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar o filme.");
  }

  const dados = await resposta.json();

  if (!dados.meta) {
    throw new Error("Filme não encontrado.");
  }

  return dados.meta;
}

function configurarBuscaFilmes() {
  const form = $("#form-filme");
  const titulo = $("#titulo");

  if (!form || !titulo) return;

  const campoBusca = document.createElement("div");
  campoBusca.className = "busca-cinemeta";

  /* Os dois campos hidden entram no FormData e chegam ao salvar-filme.php
     como $_POST['imdb_id'] e $_POST['poster_url']. */
  campoBusca.innerHTML = `
        <label for="buscar-cinemeta">
            Buscar filme
        </label>

        <div class="busca-campo">
            <input
                type="search"
                id="buscar-cinemeta"
                placeholder="Ex.: Interestelar"
                autocomplete="off"
            >

            <button type="button" id="btn-buscar-filme" class="form-reset">
                Buscar
            </button>
        </div>

        <div id="resultados-cinemeta"></div>

        <div id="preview-filme"></div>

        <input type="hidden" name="imdb_id" id="imdb_id">

        <input type="hidden" name="poster_url" id="poster_url">
    `;

  const fieldset = form.querySelector("fieldset");

  fieldset.prepend(campoBusca);

  const busca = $("#buscar-cinemeta");
  const botao = $("#btn-buscar-filme");
  const resultados = $("#resultados-cinemeta");
  const preview = $("#preview-filme");
  const campoImdb = $("#imdb_id");
  const campoPoster = $("#poster_url");

  function limparSelecao() {
    campoImdb.value = "";
    campoPoster.value = "";
    preview.replaceChildren();
  }

  async function pesquisar() {
    const valor = busca.value.trim();

    if (!valor) return;

    botao.disabled = true;
    botao.textContent = "Buscando...";

    resultados.replaceChildren();

    try {
      const filmes = (await buscarFilmes(valor))
        .filter((filme) => filme.imdb_id || filme.id)
        .slice(0, MAX_RESULTADOS);

      if (!filmes.length) {
        resultados.textContent = "Nenhum filme encontrado.";
        return;
      }

      filmes.forEach((filme) => {
        const imdbId = filme.imdb_id || filme.id;

        const item = document.createElement("button");

        item.type = "button";
        item.className = "resultado-filme";

        const poster = document.createElement("img");
        if (filme.poster) poster.src = filme.poster;
        poster.alt = "";
        poster.loading = "lazy";

        const informacoes = document.createElement("span");

        informacoes.textContent = `${filme.name} (${filme.releaseInfo || "Ano desconhecido"})`;

        item.append(poster, informacoes);

        item.addEventListener("click", async () => {
          try {
            const detalhes = await buscarDetalhes(imdbId);

            titulo.value = detalhes.name || filme.name;

            campoImdb.value = detalhes.imdb_id || imdbId;

            campoPoster.value = detalhes.poster || filme.poster || "";

            preview.replaceChildren();

            if (campoPoster.value) {
              const imagem = document.createElement("img");
              imagem.src = campoPoster.value;
              imagem.alt = `Pôster de ${titulo.value}`;
              imagem.className = "preview-poster";
              preview.append(imagem);
            }

            const nome = document.createElement("p");
            nome.textContent = titulo.value;
            preview.append(nome);

            resultados.replaceChildren();
          } catch (erro) {
            mostrarAviso($("#aviso-filme"), erro.message, true);
          }
        });

        resultados.append(item);
      });
    } catch (erro) {
      mostrarAviso($("#aviso-filme"), erro.message, true);
    } finally {
      botao.disabled = false;
      botao.textContent = "Buscar";
    }
  }

  botao.addEventListener("click", pesquisar);

  busca.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      evento.preventDefault();
      pesquisar();
    }
  });

  // Se a pessoa edita o título à mão, o filme escolhido deixa de valer.
  titulo.addEventListener("input", limparSelecao);

  // "Limpar campos" e o form.reset() após salvar: os campos hidden não são
  // zerados pelo reset do navegador, então limpamos aqui.
  form.addEventListener("reset", () => {
    limparSelecao();
    resultados.replaceChildren();
    busca.value = "";
  });
}

/* ----------------------------------
   CARDS
---------------------------------- */

function criarCard(filme) {
  const card = document.createElement("article");
  card.className = "movie-card";

  const poster = document.createElement("div");
  poster.className = "movie-poster";
  poster.setAttribute("role", "img");
  poster.setAttribute("aria-label", `Pôster de ${filme.titulo}`);
  poster.style.backgroundImage = urlCapa(filme);

  const titulo = document.createElement("h3");
  titulo.textContent = filme.titulo;

  const nota = document.createElement("p");
  nota.className = "stars";
  nota.setAttribute("aria-label", `${filme.nota} de 5 estrelas`);
  nota.textContent = estrelas(filme.nota);

  const opiniao = document.createElement("p");
  opiniao.className = "texto-fraco";
  opiniao.textContent = filme.descricao || "Sem comentário.";

  const excluir = document.createElement("button");
  excluir.type = "button";
  excluir.className = "form-reset btn-excluir";
  excluir.textContent = "Excluir";
  excluir.setAttribute("aria-label", `Excluir ${filme.titulo}`);
  excluir.addEventListener("click", async () => {
    if (!confirm(`Excluir "${filme.titulo}"?`)) return;

    excluir.disabled = true;

    try {
      const dados = new FormData();
      dados.append("id", filme.id);

      const resposta = await fetch(`${API}excluir-filmes.php`, {
        method: "POST",
        body: dados,
      });
      const resultado = await resposta.json();

      if (!resultado.ok) throw new Error(resultado.mensagem);

      carregarFilmes();
    } catch (erro) {
      excluir.disabled = false;
      card.querySelector(".erro-campo")?.remove();
      const falha = document.createElement("p");
      falha.className = "erro-campo";
      falha.setAttribute("role", "alert");
      falha.textContent = erro.message || "Não foi possível excluir o filme.";
      card.append(falha);
    }
  });

  card.append(poster, titulo, nota, opiniao, excluir);

  return card;
}

/* ----------------------------------
   TOP 10
---------------------------------- */

function mostrarTop10(filmes) {
  const top = [...filmes]
    .sort((a, b) => b.nota - a.nota || b.id - a.id)
    .slice(0, MAX_TOP);

  [...$("#lista-top10").children].forEach((item, i) => {
    const poster = item.querySelector(".rank-poster");

    poster.querySelector(".rank-titulo")?.remove();

    const filme = top[i];

    poster.style.backgroundImage = filme ? urlCapa(filme) : "";

    if (!filme) {
      poster.setAttribute("aria-label", `Posição ${i + 1} livre`);
      return;
    }

    poster.setAttribute(
      "aria-label",
      `${filme.titulo}, ${filme.nota} de 5 estrelas`,
    );

    const legenda = document.createElement("span");
    legenda.className = "rank-titulo";
    legenda.textContent = filme.titulo;

    poster.append(legenda);
  });
}

/* ----------------------------------
   PERFIL
---------------------------------- */

const CHAVE_NOME_PERFIL = "catalogoflix:nome-perfil";

function configurarNomePerfil() {
  const nomeSalvo = localStorage.getItem(CHAVE_NOME_PERFIL) || "Cinéfilo";
  $("#nome-perfil").textContent = nomeSalvo;
  $("#editar-nome-perfil").value = nomeSalvo === "Cinéfilo" ? "" : nomeSalvo;

  $("#salvar-nome-perfil").addEventListener("click", () => {
    const campo = $("#editar-nome-perfil");
    const nome = campo.value.trim().slice(0, 32);
    if (!nome) {
      campo.focus();
      return;
    }
    localStorage.setItem(CHAVE_NOME_PERFIL, nome);
    $("#nome-perfil").textContent = nome;
    campo.value = nome;
  });
}

function mostrarPerfil(filmes) {
  $("#total-filmes").textContent = filmes.length;
  $("#total-filmes-perfil").textContent = filmes.length;

  const media = filmes.length
    ? filmes.reduce((soma, filme) => soma + filme.nota, 0) / filmes.length
    : null;
  $("#media-notas").textContent =
    media === null ? "–" : media.toFixed(1).replace(".", ",");

  const melhorNota = filmes.length
    ? Math.max(...filmes.map((filme) => filme.nota))
    : null;
  $("#melhor-nota").textContent =
    melhorNota === null ? "–" : `${melhorNota}/5`;

  const recentes = [...filmes]
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);
  const lista = $("#perfil-recentes");
  lista.replaceChildren();

  if (!recentes.length) {
    const vazio = document.createElement("p");
    vazio.className = "profile-empty";
    vazio.textContent =
      "Seus filmes recentes aparecerão aqui quando você adicionar títulos.";
    lista.append(vazio);
    return;
  }

  recentes.forEach((filme) => {
    const item = document.createElement("article");
    item.className = "profile-recent-item";

    const poster = document.createElement("div");
    poster.className = "profile-recent-poster";
    poster.style.backgroundImage = urlCapa(filme);
    poster.setAttribute("role", "img");
    poster.setAttribute("aria-label", `Pôster de ${filme.titulo}`);

    const info = document.createElement("div");
    info.className = "profile-recent-info";

    const titulo = document.createElement("strong");
    titulo.textContent = filme.titulo;

    const nota = document.createElement("span");
    nota.textContent = `${estrelas(filme.nota)}  ${filme.nota}/5`;

    info.append(titulo, nota);
    item.append(poster, info);
    lista.append(item);
  });
}

/* ----------------------------------
   CARREGAR FILMES
---------------------------------- */

async function carregarFilmes() {
  try {
    const resposta = await fetch(`${API}listar-filmes.php`);

    if (!resposta.ok) throw new Error("Falha ao listar");

    const filmes = (await resposta.json()).map((f) => ({
      ...f,
      id: Number(f.id),
      nota: Number(f.nota),
    }));

    filmesCarregados = filmes;

    renderizarLista();
    mostrarTop10(filmes);
    mostrarPerfil(filmes);
    carregarGeneros(filmes);
  } catch (erro) {
    const falha = document.createElement("p");
    falha.className = "texto-fraco";
    falha.textContent =
      "Não foi possível carregar os filmes. Confira se o Apache e o MySQL estão ligados.";
    $("#lista-filmes").replaceChildren(falha);
    console.error("Erro ao carregar filmes:", erro);
  }
}

/* ----------------------------------
   FORMULÁRIOS
---------------------------------- */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Onde a mensagem de erro entra: logo depois do campo (ou do grupo de estrelas). */
function refDoCampo(campo) {
  return campo.type === "radio" ? campo.closest(".star-rating") : campo;
}

function mostrarErro(campo, mensagem) {
  const ref = refDoCampo(campo);
  let erro = ref.nextElementSibling;

  if (!erro || !erro.classList.contains("erro-campo")) {
    erro = document.createElement("p");
    erro.className = "erro-campo";
    erro.setAttribute("role", "alert");
    ref.after(erro);
  }

  erro.textContent = mensagem;
  campo.setAttribute("aria-invalid", "true");
}

function limparErroDoCampo(campo) {
  const ref = refDoCampo(campo);
  const erro = ref?.nextElementSibling;

  if (erro?.classList.contains("erro-campo")) erro.remove();
  campo.removeAttribute("aria-invalid");

  // nas estrelas, o aria-invalid fica no primeiro radio do grupo
  if (campo.type === "radio") {
    campo.form.elements.nota[0].removeAttribute("aria-invalid");
  }
}

function limparErros(form) {
  form.querySelectorAll(".erro-campo").forEach((erro) => erro.remove());
  form
    .querySelectorAll("[aria-invalid]")
    .forEach((campo) => campo.removeAttribute("aria-invalid"));
}

/* Cada validador devolve uma lista de [campo, mensagem]. Lista vazia = tudo certo. */
function validarFilme(form) {
  const erros = [];
  const { titulo, nota } = form.elements;

  if (titulo.value.trim().length < 2) {
    erros.push([titulo, "Digite o título do filme (mínimo 2 letras)."]);
  }
  if (!nota.value) {
    erros.push([nota[0], "Escolha uma nota de 1 a 5 estrelas."]);
  }
  return erros;
}

function validarContato(form) {
  const erros = [];
  const { nome, email, mensagem } = form.elements;

  if (nome.value.trim().length < 3) {
    erros.push([nome, "O nome precisa ter pelo menos 3 letras."]);
  }
  if (!EMAIL.test(email.value.trim())) {
    erros.push([email, "Digite um e-mail válido, como nome@email.com."]);
  }
  if (mensagem.value.trim().length < 10) {
    erros.push([mensagem, "A mensagem precisa ter pelo menos 10 caracteres."]);
  }
  return erros;
}

function ligarFormulario(form, aviso, aoSalvar, validar) {
  form.noValidate = true; // a validação é feita aqui, em JavaScript

  form.addEventListener("reset", () => limparErros(form));
  form.addEventListener("input", (evento) => limparErroDoCampo(evento.target));

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    limparErros(form);
    mostrarAviso(aviso, "");

    const erros = validar ? validar(form) : [];

    if (erros.length) {
      erros.forEach(([campo, mensagem]) => mostrarErro(campo, mensagem));
      erros[0][0].focus();
      return; // envio bloqueado enquanto houver erro
    }

    const botao = form.querySelector('[type="submit"]');

    botao.disabled = true;

    try {
      const resposta = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
      });

      const dados = await resposta.json();

      mostrarAviso(aviso, dados.mensagem, !dados.ok);

      if (dados.ok) {
        form.reset();
        aoSalvar?.();
      }
    } catch {
      mostrarAviso(
        aviso,
        "Não foi possível falar com o servidor. Confira se o Apache e o MySQL estão ligados.",
        true,
      );
    } finally {
      botao.disabled = false;
    }
  });
}

/* ----------------------------------
   ORDENAR E FILTRAR A LISTA
---------------------------------- */

function ordenarFilmes(filmes, criterio) {
  const lista = [...filmes];
  const porNome = (a, b) =>
    a.titulo.localeCompare(b.titulo, "pt-BR", { sensitivity: "base" });

  switch (criterio) {
    case "alfabetica-asc":
      return lista.sort(porNome);
    case "alfabetica-desc":
      return lista.sort((a, b) => porNome(b, a));
    case "nota":
      return lista.sort((a, b) => b.nota - a.nota || b.id - a.id);
    default: // recentes
      return lista.sort((a, b) => b.id - a.id);
  }
}

function filmeTemGenero(filme, categoria) {
  if (categoria === "Todos") return true;
  const generos = generosPorImdb[filme.imdb_id] || [];
  return generos.includes(CATEGORIAS[categoria]);
}

function renderizarLista() {
  const grade = $("#lista-filmes");

  if (filmesCarregados.length === 0) {
    const vazio = document.createElement("p");
    vazio.className = "texto-fraco";
    vazio.textContent =
      "Você ainda não adicionou filmes. Use o formulário abaixo para registrar o primeiro.";
    grade.replaceChildren(vazio);
    return;
  }

  const criterio = $("#ordenacao")?.value || "recentes";

  const visiveis = ordenarFilmes(
    filmesCarregados.filter((filme) => filmeTemGenero(filme, categoriaAtual)),
    criterio,
  );

  if (visiveis.length === 0) {
    const vazio = document.createElement("p");
    vazio.className = "texto-fraco";
    vazio.textContent = `Nenhum filme encontrado em “${categoriaAtual}”.`;
    grade.replaceChildren(vazio);
    return;
  }

  grade.replaceChildren(...visiveis.map(criarCard));
}

/* A tabela não guarda gênero: buscamos na Cinemeta pelo imdb_id e guardamos
   no navegador (localStorage) para não repetir o pedido a cada visita.
   Filmes sem imdb_id (upload manual) aparecem só em "Todos". */
async function carregarGeneros(filmes) {
  const faltando = filmes.filter(
    (filme) => filme.imdb_id && !(filme.imdb_id in generosPorImdb),
  );

  if (!faltando.length) return;

  await Promise.allSettled(
    faltando.map(async (filme) => {
      const meta = await buscarDetalhes(filme.imdb_id);
      const generos = meta.genres || meta.genre || [];
      generosPorImdb[filme.imdb_id] = Array.isArray(generos) ? generos : [];
    }),
  );

  try {
    localStorage.setItem(CHAVE_GENEROS, JSON.stringify(generosPorImdb));
  } catch {
    // sem localStorage: só perde o cache
  }

  if (categoriaAtual !== "Todos") renderizarLista();
}

function configurarFiltros() {
  const chips = [...document.querySelectorAll(".category-chip")];

  chips.forEach((chip) => {
    chip.setAttribute(
      "aria-pressed",
      String(chip.classList.contains("active")),
    );

    chip.addEventListener("click", () => {
      categoriaAtual = chip.textContent.trim();

      chips.forEach((outro) => {
        const ativo = outro === chip;
        outro.classList.toggle("active", ativo);
        outro.setAttribute("aria-pressed", String(ativo));
      });

      renderizarLista();
    });
  });

  $("#ordenacao")?.addEventListener("change", renderizarLista);
}

/* ----------------------------------
   INICIALIZAÇÃO
---------------------------------- */

configurarBuscaFilmes();
configurarFiltros();
configurarNomePerfil();

ligarFormulario(
  $("#form-filme"),
  $("#aviso-filme"),
  carregarFilmes,
  validarFilme,
);

ligarFormulario(
  $("#form-contato"),
  $("#aviso-contato"),
  undefined,
  validarContato,
);

carregarFilmes();
