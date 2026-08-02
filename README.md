# LabSystem — CRUD de Produtos

Sistema de cadastro de produtos (Create, Read, Update, Delete), com autenticação por sessão.

**Repositório:** https://github.com/NathanSouza-hub/labsystem

## Tecnologias

- **Back-end:** Node.js + Express
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

Crie um arquivo `.env` dentro de `backend/` com suas credenciais do MySQL e as variáveis de sessão:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=product_management

SESSION_SECRET=uma_string_aleatoria_longa
FRONTEND_URL=http://localhost:5500
```

`FRONTEND_URL` deve apontar exatamente para a origem em que o front-end está rodando — é usada tanto no CORS quanto para os cookies de sessão funcionarem entre front e back.

Inicie o servidor:

```bash
node src/server.js
```

A API sobe em `http://localhost:3000`.

### 3. Front-end

O front-end é HTML/CSS/JS puro, sem build. Basta servir a pasta `frontend/` com qualquer servidor estático (ela consome a API em `http://localhost:3000`).

Exemplo usando a extensão **Live Server** do VS Code, ou:

```bash
cd frontend
npx http-server -p 5500
```

Depois acesse `http://localhost:5500/login.html`.

> O CORS está restrito à origem definida em `FRONTEND_URL` (não é mais `*`), pois a autenticação por sessão depende de cookies — o front-end precisa rodar exatamente nessa origem.

## Autenticação

O sistema usa sessão (cookie `connect.sid`, via `express-session`) com senhas criptografadas por `bcrypt`. Não existe usuário pré-cadastrado: crie o seu na própria tela de login (link "Ainda não tem conta? Cadastre-se").

As rotas de leitura de produtos (`GET`) continuam públicas. As rotas de escrita (`POST`, `PUT`, `DELETE`) exigem estar autenticado — sem sessão válida, retornam `401`.

| Método | Rota            | Descrição                              | Body (JSON)                              |
|--------|-----------------|------------------------------------------|-------------------------------------------|
| POST   | `/auth/register`| Cadastra um novo usuário                 | `{ "username": "", "password": "" }`     |
| POST   | `/auth/login`   | Autentica e inicia a sessão              | `{ "username": "", "password": "" }`     |
| POST   | `/auth/logout`  | Encerra a sessão atual                   | —                                         |
| GET    | `/auth/me`      | Retorna o usuário da sessão atual        | —                                         |

`password` deve ter no mínimo 6 caracteres. Requisições ao front-end para a API precisam enviar `credentials: "include"` para que o cookie de sessão seja incluído.

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

`created_by` e `created_at` **não são enviados pelo cliente**: o back-end preenche `created_by` automaticamente com o usuário autenticado na sessão no momento do cadastro, e `created_at` é preenchido pelo banco (`CURRENT_TIMESTAMP`). Na edição, `created_by` não muda — preserva o registro de quem originalmente cadastrou o produto.

`q` faz uma busca única por ID (match exato), descrição ou usuário (`LIKE`, parcial). `category` filtra por categoria exata, combinável com `q`. `sort` aceita `id`, `created_at`, `created_by`, `price`, `description` ou `quantity` (whitelist no back-end contra SQL injection); `order` aceita `asc` ou `desc`. Todos os filtros são combináveis entre si.

Exemplos: `GET /products?q=teclado` (busca por descrição/ID/usuário), `GET /products?category=Hardware` (filtra por categoria), `GET /products?q=mouse&category=Periféricos` (busca + categoria combinados), `GET /products?sort=price&order=desc` (ordena por valor, decrescente).

### Usuários

Base URL: `http://localhost:3000`. Todas as rotas exigem sessão autenticada — qualquer usuário logado pode gerenciar qualquer conta (não há papel de admin).

| Método | Rota          | Descrição                                   | Body (JSON)                              |
|--------|---------------|-----------------------------------------------|-------------------------------------------|
| GET    | `/users`      | Lista usuários (aceita `?q=` por ID/username) | —                                         |
| GET    | `/users/:id`  | Busca um usuário pelo ID                      | —                                         |
| PUT    | `/users/:id`  | Atualiza username e, opcionalmente, a senha   | `{ "username": "", "password": "" }`     |
| DELETE | `/users/:id`  | Exclui um usuário                             | —                                         |

`password_hash` nunca é retornado pela API. No `PUT`, `password` é opcional — se omitido ou vazio, a senha atual é mantida; se enviado, precisa ter no mínimo 6 caracteres. Criação de usuário usa o mesmo endpoint de `POST /auth/register` (reaproveitado pela tela de Usuários). `DELETE` bloqueia a exclusão do último usuário do sistema (`400`) e, se o usuário excluir a própria conta, a sessão é encerrada automaticamente (resposta inclui `"selfDeleted": true`).

## Estrutura da tabela `products`

| Coluna       | Tipo          | Descrição                    |
|--------------|---------------|-------------------------------|
| id           | INT (PK, AI)  | Identificador do produto      |
| description  | VARCHAR(255)  | Descrição do produto          |
| quantity     | INT           | Quantidade em estoque         |
| price        | DECIMAL(10,2) | Valor do produto              |
| category     | VARCHAR(100)  | Categoria do produto (Hardware, Periféricos, Componentes, Armazenamento, Redes, Informática ou Outros) |
| created_by   | VARCHAR(100)  | Usuário que cadastrou (preenchido automaticamente pela sessão) |
| created_at   | DATETIME      | Data de cadastro (automática) |

## Estrutura da tabela `users`

| Coluna        | Tipo          | Descrição                     |
|---------------|---------------|---------------------------------|
| id            | INT (PK, AI)  | Identificador do usuário        |
| username      | VARCHAR(100)  | Nome de usuário (único)         |
| password_hash | VARCHAR(255)  | Hash bcrypt da senha             |
| created_at    | DATETIME      | Data de cadastro (automática)   |

## Páginas do front-end

- `login.html` — login e cadastro de usuário (tela sem sidebar)
- `index.html` — CRUD de produtos: busca única por ID/descrição/usuário, ordenação dinâmica ASC/DESC clicando nos cabeçalhos das colunas ID, Data de Cadastro, Usuário e Valor, cabeçalho fixo da tabela, estado vazio dedicado, e modal (sem navegação de página) para criar/editar
- `usuarios.html` — CRUD de usuários: listar, buscar por ID/username, criar, editar (username e/ou senha) e excluir

## Arquitetura do back-end

O back-end segue uma separação em camadas:

```
routes → controller → service → repository → banco de dados
```

- **routes:** define os endpoints HTTP e qual middleware/controller cada um chama
- **controller:** trata a requisição/resposta HTTP (status codes, JSON)
- **service:** camada intermediária de regra de negócio
- **repository:** único lugar que executa queries SQL
- **middlewares:** validação de dados (`validateProduct`, `validateAuth`, `validateUserUpdate`), autenticação (`requireAuth`), rota não encontrada (`notFound`) e tratamento central de erros (`errorHandler`)

## Diferenciais implementados

- Ordenação ASC/DESC dinâmica por ID, Data de Cadastro, Usuário e Valor (cabeçalhos clicáveis na tela de produtos)
- Filtros na listagem de produtos e de usuários
- CRUD completo de usuários (`usuarios.html`)
- Tela de login e cadastro de usuário
- Data de cadastro e usuário logado preenchidos automaticamente pelo sistema (não digitados manualmente)
- Separação em camadas (routes → controller → service → repository)
