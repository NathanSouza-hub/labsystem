# LabSystem — CRUD de Produtos

Sistema de cadastro de produtos (Create, Read, Update, Delete), com autenticação via JWT.

**Repositório:** https://github.com/NathanSouza-hub/labsystem

## Tecnologias

- **Back-end:** Node.js + Express
- **Autenticação:** JWT (`jsonwebtoken`) em cookie httpOnly + senhas com `bcrypt`
- **Banco de dados:** MySQL
- **Front-end:** HTML, CSS e JavaScript puro (sem framework)

## Estrutura do projeto

```
sytem/
├── backend/     API REST em Node.js/Express
├── frontend/    Interface web (HTML/CSS/JS)
└── database/    Script SQL de criação do banco
```

## Pré-requisitos

- Node.js instalado
- MySQL instalado e rodando

## Como rodar o projeto

### 1. Banco de dados

Execute o script `database/schema.sql` no seu MySQL (via MySQL Workbench, DBeaver ou linha de comando). Ele cria o banco `product_management` e as tabelas `products` e `users`.

```bash
mysql -u root -p < database/schema.sql
```

### 2. Back-end

```bash
cd backend
npm install
```

Crie um arquivo `.env` dentro de `backend/` com suas credenciais do MySQL e o segredo do JWT:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=product_management

JWT_SECRET=uma_string_aleatoria_longa
FRONTEND_URL=http://localhost:5500
```

`FRONTEND_URL` deve apontar exatamente para a origem em que o front-end está rodando — é usada tanto no CORS quanto para o cookie do token JWT funcionar entre front e back.

Inicie o servidor:

```bash
npm run dev
```

(usa `nodemon`, reinicia sozinho a cada alteração; `npm start` sobe sem isso)

A API sobe em `http://localhost:3000`.

### 3. Front-end

O front-end é HTML/CSS/JS puro, sem build. Basta servir a pasta `frontend/` com qualquer servidor estático (ela consome a API em `http://localhost:3000`).

Exemplo usando a extensão **Live Server** do VS Code, ou:

```bash
cd frontend
npx http-server -p 5500
```

Depois acesse `http://localhost:5500/login.html`.

> O CORS está restrito à origem definida em `FRONTEND_URL` (não é mais `*`), pois a autenticação depende de cookies — o front-end precisa rodar exatamente nessa origem.
>
> **Importante:** acesse sempre via `localhost` (`http://localhost:5500/...`), nunca `http://127.0.0.1:5500/...`. Embora o CORS aceite as duas, o cookie do token é `SameSite=Lax` — o navegador não o envia em requisições entre `127.0.0.1` e `localhost` por serem consideradas origens diferentes, então o login parece "não fazer nada" (a chamada funciona, só que sem o cookie).

## Autenticação

O sistema usa **JWT** (`jsonwebtoken`) com senhas criptografadas por `bcrypt`. Não existe usuário pré-cadastrado: crie o seu na própria tela de login (link "Ainda não tem conta? Cadastre-se").

No login, o back-end gera um token assinado (payload `{ id, username }`, expira em 2h) e o envia em um cookie **httpOnly** chamado `token` — o front-end nunca lê ou manipula o token diretamente, só precisa enviar `credentials: "include"` nas requisições para o cookie ser incluído automaticamente. O middleware `requireAuth` verifica e decodifica esse token a cada requisição protegida, populando `req.user`.

As rotas de leitura de produtos (`GET`) continuam públicas. As rotas de escrita (`POST`, `PUT`, `DELETE`) exigem um token válido — sem ele (ou com token expirado/adulterado), retornam `401`.

| Método | Rota            | Descrição                              | Body (JSON)                              |
|--------|-----------------|------------------------------------------|-------------------------------------------|
| POST   | `/auth/register`| Cadastra um novo usuário                 | `{ "username": "", "password": "", "name": "", "email": "", "phone": "" }` |
| POST   | `/auth/login`   | Autentica e gera o token JWT             | `{ "username": "", "password": "" }`     |
| POST   | `/auth/logout`  | Limpa o cookie do token                  | —                                         |
| GET    | `/auth/me`      | Retorna o usuário do token atual         | —                                         |

No cadastro (`/auth/register`), `password` deve ter no mínimo 6 caracteres, e `name`, `email` (formato válido, único) e `phone` são obrigatórios. Requisições ao front-end para a API precisam enviar `credentials: "include"` para que o cookie do token seja incluído.

## Endpoints da API

Base URL: `http://localhost:3000`

| Método | Rota            | Descrição                          | Autenticação | Body (JSON)                                       |
|--------|-----------------|-------------------------------------|--------------|----------------------------------------------------|
| GET    | `/products`     | Lista produtos (aceita `?q=`, `?category=`, `?sort=`, `?order=asc\|desc`) | não          | —                                     |
| GET    | `/products/:id` | Busca um produto pelo ID            | não          | —                                                    |
| POST   | `/products`     | Cadastra um novo produto            | sim          | `{ "description": "", "quantity": 0, "price": 0, "category": "" }`  |
| PUT    | `/products/:id` | Atualiza um produto existente       | sim          | `{ "description": "", "quantity": 0, "price": 0, "category": "" }`  |
| DELETE | `/products/:id` | Exclui um produto                   | sim          | —                                                    |

Campos obrigatórios na criação/edição: `description` (texto), `quantity` (inteiro ≥ 0), `price` (número > 0), `category` (uma das opções: Hardware, Periféricos, Componentes, Armazenamento, Redes, Informática, Outros). Requisições inválidas retornam `400` com a lista de erros.

`created_by` e `created_at` **não são enviados pelo cliente**: o back-end preenche `created_by` automaticamente com o usuário autenticado (extraído do token JWT) no momento do cadastro, e `created_at` é preenchido pelo banco (`CURRENT_TIMESTAMP`). Na edição, `created_by` não muda — preserva o registro de quem originalmente cadastrou o produto.

`q` faz uma busca única por ID (match exato), descrição ou usuário (`LIKE`, parcial). `category` filtra por categoria exata, combinável com `q`. `sort` aceita `id`, `created_at`, `created_by`, `price`, `description` ou `quantity` (whitelist no back-end contra SQL injection); `order` aceita `asc` ou `desc`. Todos os filtros são combináveis entre si.

Exemplos: `GET /products?q=teclado` (busca por descrição/ID/usuário), `GET /products?category=Hardware` (filtra por categoria), `GET /products?q=mouse&category=Periféricos` (busca + categoria combinados), `GET /products?sort=price&order=desc` (ordena por valor, decrescente).

### Usuários

Base URL: `http://localhost:3000`. Todas as rotas exigem token JWT válido — qualquer usuário logado pode gerenciar qualquer conta (não há papel de admin).

| Método | Rota          | Descrição                                   | Body (JSON)                              |
|--------|---------------|-----------------------------------------------|-------------------------------------------|
| GET    | `/users`      | Lista usuários (aceita `?q=` por ID/username) | —                                         |
| GET    | `/users/:id`  | Busca um usuário pelo ID                      | —                                         |
| PUT    | `/users/:id`  | Atualiza dados do usuário e, opcionalmente, a senha | `{ "username": "", "password": "", "name": "", "email": "", "phone": "" }` |
| DELETE | `/users/:id`  | Exclui um usuário                             | —                                         |

`password_hash` nunca é retornado pela API. No `PUT`, `username`, `name`, `email` e `phone` são obrigatórios; `password` é opcional — se omitido ou vazio, a senha atual é mantida; se enviado, precisa ter no mínimo 6 caracteres. Criação de usuário usa o mesmo endpoint de `POST /auth/register` (reaproveitado pela tela de Usuários). `DELETE` bloqueia a exclusão do último usuário do sistema (`400`) e, se o usuário excluir a própria conta, o cookie do token é limpo automaticamente (resposta inclui `"selfDeleted": true`).

## Estrutura da tabela `products`

| Coluna       | Tipo          | Descrição                    |
|--------------|---------------|-------------------------------|
| id           | INT (PK, AI)  | Identificador do produto      |
| description  | VARCHAR(255)  | Descrição do produto          |
| quantity     | INT           | Quantidade em estoque         |
| price        | DECIMAL(10,2) | Valor do produto              |
| category     | VARCHAR(100)  | Categoria do produto (Hardware, Periféricos, Componentes, Armazenamento, Redes, Informática ou Outros) |
| created_by   | VARCHAR(100)  | Usuário que cadastrou (preenchido automaticamente a partir do token JWT) |
| created_at   | DATETIME      | Data de cadastro (automática) |

## Estrutura da tabela `users`

| Coluna        | Tipo          | Descrição                     |
|---------------|---------------|---------------------------------|
| id            | INT (PK, AI)  | Identificador do usuário        |
| username      | VARCHAR(100)  | Nome de usuário (único)         |
| password_hash | VARCHAR(255)  | Hash bcrypt da senha             |
| name          | VARCHAR(150)  | Nome completo                   |
| email         | VARCHAR(150)  | E-mail (único)                  |
| phone         | VARCHAR(20)   | Telefone                        |
| created_at    | DATETIME      | Data de cadastro (automática)   |

## Páginas do front-end

- `login.html` — login e cadastro de usuário (nome, e-mail, telefone), tela sem sidebar
- `index.html` — CRUD de produtos: busca por ID/descrição/usuário, filtro por categoria, ordenação dinâmica ASC/DESC clicando nos cabeçalhos das colunas ID, Data de Cadastro, Usuário, Descrição, Quantidade e Valor, cabeçalho fixo da tabela, estado vazio dedicado, e modal (sem navegação de página) para criar/editar — com seleção de categoria obrigatória
- `usuarios.html` — CRUD de usuários: listar, buscar por ID/username, ordenar por ID/Usuário/Data de Cadastro, criar, editar (username e/ou senha) e excluir

## Arquitetura do back-end

O back-end segue uma separação em camadas:

```
routes → controller → service → repository → banco de dados
```

- **routes:** define os endpoints HTTP e qual middleware/controller cada um chama
- **controller:** trata a requisição/resposta HTTP (status codes, JSON)
- **service:** camada intermediária de regra de negócio
- **repository:** único lugar que executa queries SQL
- **middlewares:** validação de dados (`validateProduct`, `validateAuth`, `validateRegister`, `validateUserUpdate`), autenticação (`requireAuth`), rota não encontrada (`notFound`) e tratamento central de erros (`errorHandler`)

## Testes

Testes unitários com **Jest**, cobrindo as camadas com lógica própria (não os controllers, que são só repasse HTTP fino):

- **middlewares** (`validateProduct`, `validateAuth`, `validateRegister`, `validateUserUpdate`, `requireAuth`): funções puras, testadas com `req`/`res`/`next` simulados
- **utils/jwt**: geração e verificação de token, incluindo rejeição de token corrompido ou assinado com outro segredo
- **repositories/productRepository**: monta o SQL corretamente a partir dos filtros (busca, categoria, ordenação) e protege a whitelist de colunas ordenáveis contra SQL injection — testado com a conexão do banco mockada (não bate no banco de verdade)
- **services/authService**: garante que a senha nunca é salva em texto puro e que login com usuário inexistente ou senha errada retorna `null`

Rodar os testes:

```bash
cd backend
npm test
```

## Diferenciais implementados

- Autenticação via JWT (cookie httpOnly), não sessão em memória
- Testes unitários (Jest) cobrindo validações, JWT e a lógica de repositórios/serviços
- Ordenação ASC/DESC dinâmica por ID, Data de Cadastro, Usuário, Descrição, Quantidade e Valor (produtos) e ID/Usuário/Data de Cadastro (usuários) — cabeçalhos clicáveis
- Filtro por categoria na listagem de produtos, combinável com a busca por texto
- Categorização de produtos (select fixo, sem digitação livre)
- CRUD completo de usuários (`usuarios.html`)
- Tela de login e cadastro de usuário
- Data de cadastro e usuário logado preenchidos automaticamente pelo sistema (não digitados manualmente)
- Separação em camadas (routes → controller → service → repository)
