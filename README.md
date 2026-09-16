# CatalogoFlix

**Assunto:** CatalogoFlix é um catálogo pessoal para qualquer amante de cinema, onde ele registra, avalia e organiza os filmes que assistiu, em um espaço com a atmosfera de uma sala de cinema escurecida — a luz da tela, o vermelho da cortina e uma coleção de estrelas douradas marcando cada avaliação.
**Equipe:** Augusto Rezende Levindo · Igor Da Silva Pascoal Pereira · Bernardo Rodrigues Dias Da Silva · Matheus de Sousa Bernardo
**Disciplina:** ARA0062 — Desenvolvimento Web em HTML5, CSS, JavaScript e PHP
**Centro Universitário Newton Paiva · 2026/2**

---

## Sobre o projeto

CatalogoFlix é um catálogo pessoal para qualquer amante de cinema, onde o usuário registra, avalia e organiza os filmes que assistiu, em um espaço com a atmosfera de uma sala de cinema escurecida — a luz da tela, o vermelho da cortina e uma coleção de estrelas douradas marcando cada avaliação.

Até o fim do semestre, o site terá uma página inicial listando os filmes cadastrados, um formulário para adicionar novos títulos com nota e comentário, e páginas individuais de detalhe para cada filme. As avaliações e os dados de cada filme serão armazenados em um banco de dados, permitindo consultar, editar e remover registros de forma persistente.

---

## Identidade visual

*Estas são as decisões que o frontend/css/estilo.css aplica. Elas estão aqui
para quem lê o repositório entender **por que** o site tem essa cara — e para
a equipe não mudar de ideia a cada aula.*

### Paleta

| Papel | Cor | Por que esta |
|---|---|---|
| --principal | #C1121F | O vermelho da cortina de cinema, usado nos botões e destaques principais |
| --sobre-principal | #FFFFFF | Texto claro sobre o vermelho, garantindo legibilidade |
| --apoio | #B8860B | O dourado das estrelas de avaliação, usado em ícones e destaques secundários |
| --fundo | #F5F5F5 | A claridade antes da sessão começar — o fundo neutro do modo claro |
| --superficie | #FFFFFF | Os cards de filme, como a tela clara do cinema |
| --texto | #141414 | O preto suave que remete à escuridão da sala |
| --texto-fraco | #5C5C5C | Texto secundário — datas, gêneros, notas de rodapé dos cards |

**Contraste conferido** em <https://webaim.org/resources/contrastchecker/>:

​
--texto sobre --superficie ......... 18,4:1
--principal sobre --superficie ..... 6,2:1
--sobre-principal sobre --principal . 6,2:1
--texto-fraco sobre --fundo ........ 6,1:1


*Todos precisam ficar em 4,5:1 ou acima.*

### Tipografia

**Fonte:** "Oswald" (títulos) + "Inter" (corpo), com plano B Arial, sans-serif
**Pesos:** 400 e 700
**Por que esta:** Oswald tem o traço condensado e vertical de um letreiro de marquise de cinema, reforçando o clima de sala de projeção nos títulos; Inter garante legibilidade no corpo do texto sem competir com esse destaque.

**Escala:** h1 2.5rem · h2 1.75rem · h3 1.25rem · corpo 1rem

### Segundo tema

**Arquivo:** frontend/css/tema-escuro.css
**O que é:** o modo escuro, pensado para quem cataloga ou revisita filmes à noite — reforça a atmosfera de sala de cinema escurecida que já é o conceito do site.

---

## Como abrir

1. Abra **a pasta inteira** no VS Code (*Arquivo → Abrir Pasta*).
2. Abra `frontend/index.html` e clique em **Go Live** (extensão *Live Server*).

---

## Estrutura


.
├─ README.md                 esta folha de rosto
├─ frontend/                 tudo o que roda no navegador
│   ├─ index.html
│   ├─ css/
│   │   ├─ estilo.css        a folha do projeto
│   │   └─ tema-<nome>.css   o segundo tema: só variáveis
│   ├─ js/
│   │   └─ script.js         vazio até o ciclo 6
│   └─ img/
└─ backend/                  tudo o que roda no servidor
    ├─ config/
    │   └─ conexao.php       vazio até o ciclo 8
    └─ processa-contato.php


---

## Quem fez o quê

*Uma linha por integrante. É o mapa de quem procurar quando algo quebra — e
bate com o histórico de commits.*

| Integrante | Parte da folha de estilo |
|---|---|
| Augusto | o `:root`, o `box-sizing` e o segundo tema |
| Bernardo | tipografia, página e conteúdo |
| Igor | cabeçalho, menu e tabela |
| Matheus | formulário, botões e rodapé |
