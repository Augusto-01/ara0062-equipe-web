# CatalogoFlix

*Assunto:* CatalogoFlix é um catálogo pessoal para qualquer amante de cinema, onde ele registra, avalia e organiza os filmes que assistiu, em um espaço com a atmosfera de uma sala de cinema escurecida — a luz da tela, o vermelho da cortina e uma coleção de estrelas douradas marcando cada avaliação.
*Equipe:* Augusto Rezende Levindo · Igor Da Silva Pascoal Pereira · Bernardo Rodrigues Dias Da Silva · Matheus de Sousa Bernardo
*Disciplina:* ARA0062 — Desenvolvimento Web em HTML5, CSS, JavaScript e PHP
*Centro Universitário Newton Paiva · 2026/2*

---

## Sobre o projeto

CatalogoFlix é um catálogo pessoal para qualquer amante de cinema, onde o usuário registra, avalia e organiza os filmes que assistiu, em um espaço com a atmosfera de uma sala de cinema escurecida — a luz da tela, o vermelho da cortina e uma coleção de estrelas douradas marcando cada avaliação.

O site permite cadastrar filmes (buscando na Cinemeta ou enviando um pôster), dar uma nota de 1 a 5 estrelas, ver a lista com ordenação e filtro por categoria, ver o Top 10, excluir filmes e enviar mensagens pelo formulário de contato. Os dados ficam em um banco MySQL, acessado por PHP (PDO).

---

## Identidade visual

*Estas são as decisões que o frontend/css/estilo.css aplica. Elas estão aqui
para quem lê o repositório entender *por que* o site tem essa cara — e para
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

*Contraste conferido* em <https://webaim.org/resources/contrastchecker/>:

​
--texto sobre --superficie ......... 18,4:1
--principal sobre --superficie ..... 6,2:1
--sobre-principal sobre --principal . 6,2:1
--texto-fraco sobre --fundo ........ 6,1:1


Todos precisam ficar em 4,5:1 ou acima.

### Tipografia

*Fonte:* "Oswald" (títulos) + "Inter" (corpo), com plano B Arial, sans-serif
*Pesos:* 400 e 700
*Por que esta:* Oswald tem o traço condensado e vertical de um letreiro de marquise de cinema, reforçando o clima de sala de projeção nos títulos; Inter garante legibilidade no corpo do texto sem competir com esse destaque.

*Escala:* h1 2.5rem · h2 1.75rem · h3 1.25rem · corpo 1rem

### Segundo tema

*Arquivo:* frontend/css/tema-escuro.css
*O que é:* o modo escuro, pensado para quem cataloga ou revisita filmes à noite — reforça a atmosfera de sala de cinema escurecida que já é o conceito do site.

---

## Como rodar no XAMPP

1. Ligue o *Apache* e o *MySQL* no painel do XAMPP.
2. Copie a pasta do projeto para C:\xampp\htdocs\ara0062-equipe-web.
3. Abra http://localhost/phpmyadmin, clique em *Importar* e escolha backend/sql/banco.sql (ele cria o banco catalogoflix e as tabelas filmes e contatos).
4. Se o seu MySQL tiver senha, ajuste backend/config/conexao.php (no XAMPP padrão é usuário root e senha vazia).
5. Abra http://localhost/ara0062-equipe-web/frontend/index.html.

A busca de filmes usa a Cinemeta e precisa de internet; o cadastro manual funciona sem ela.

## Estrutura


.
├─ README.md                 esta folha de rosto
├─ frontend/                 tudo o que roda no navegador
│   ├─ index.html
│   ├─ css/
│   │   ├─ estilo.css        a folha do projeto
│   │   └─ tema-<nome>.css   o segundo tema: só variáveis
│   ├─ js/
│   │   └─ script.js         listas, validação e envio dos formulários
│   └─ img/
└─ backend/                  tudo o que roda no servidor
    ├─ config/
    │   └─ conexao.php       conexão PDO com o MySQL
    ├─ processa-contato.php
    ├─ salvar-filme.php
    ├─ listar-filmes.php
    ├─ excluir-filmes.php
    └─ sql/
        └─ banco.sql


---

### Quem fez o quê

### Augusto Rezende Levindo — @Augusto-01

- *Arquivos:* frontend/js/script.js
- *Funcionalidades:* Desenvolvimento da lógica JavaScript do sistema, incluindo cadastro e exclusão dinâmica de filmes, validação de formulários, filtros por gênero, ordenação do catálogo, geração do Top 10, sistema de avaliações e atualização dinâmica das informações do perfil.

### Igor Da Silva Pascoal Pereira — @H3mZs

- *Arquivos:* backend/config/conexao.php, backend/salvar-filme.php, backend/listar-filmes.php, backend/excluir-filmes.php, backend/processa-contato.php.
- *Funcionalidades:* Desenvolvimento e implementação do backend em PHP, incluindo a integração com a API Cinemeta para buscar informações e pôsteres dos filmes, conexão com o banco de dados MySQL utilizando PDO, implementação do cadastro, consulta e exclusão de filmes, além do processamento do formulário de contato.

### Bernardo Rodrigues Dias Da Silva — @bernardodias1905-web

- *Arquivos:* frontend/css/estilo.css, README.md, backend/sql/banco.sql.
- *Funcionalidades:* Participação na estilização inicial do projeto, trabalhando na tipografia, organização visual da página e apresentação dos conteúdos. Também foi responsável pela criação e estruturação do banco de dados, incluindo a definição das tabelas necessárias para armazenar as informações do sistema. Contribuiu ainda com a documentação e organização das informações do projeto.

### Matheus de Sousa Bernardo — @Matdev6

- *Arquivos:* frontend/index.html, frontend/css/estilo.css, frontend/css/tema-escuro.css.
- *Funcionalidades:* Desenvolvimento da estrutura HTML e da interface visual em CSS, incluindo organização das seções, cabeçalho, menu de navegação, formulários, botões e rodapé. Também trabalhou na identidade visual do CATÁLOGOFLIX, aprimorando o layout, a aparência dos componentes e a experiência visual do usuário, incluindo melhorias no plano de fundo cinematográfico e na seção de perfil.

### Folha de estilo (divisão do CSS)

| Integrante | Parte da folha de estilo |
|---|---|
| Augusto | o :root, o box-sizing e o segundo tema |
| Bernardo | tipografia, página e conteúdo |
| Igor | cabeçalho, menu e tabela |
| Matheus | formulário, botões e rodapé |
