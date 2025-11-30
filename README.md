# 🛍️ Frontend – Ana Paula Pratas (E-commerce)

Este repositório contém o **frontend completo** do e-commerce da loja **Ana Paula Pratas**, desenvolvido em **React com Next.js**, totalmente integrado à API externa via chamadas HTTP.

O foco deste projeto é oferecer uma experiência moderna, rápida e intuitiva para clientes e administradores da loja.

---

## 🚀 Tecnologias Utilizadas

- **Next.js (React Framework)**
- **React Hooks (useState, useEffect, useCallback)**
- **CSS Modules**
- **Fetch API**
- **LocalStorage (persistência de usuário/token)**
- **Env via NEXT_PUBLIC_\***
- **Módulos de serviço próprios (services/api.js & services/storage.js)**

---

## ✨ Principais Funcionalidades

### 👤 Autenticação do Usuário
- Login e cadastro com JWT  
- Armazenamento seguro do token no localStorage  
- **Redirecionamento automático para login quando o token expira**  
- Atualização automática do estado global ao deslogar  

---
# 🛍️ Frontend — Ana Paula Prata (E-commerce)

**Projeto:** Frontend da loja Ana Paula Prata, construído com Next.js e React. Fornece telas públicas (cliente) e painel administrativo, consumindo APIs externas para autenticação, produtos, pedidos e pagamentos.

**Status:** Em desenvolvimento

**Última atualização:** 30/11/2025

---

**Tecnologias**
- **Framework:** `Next.js` (React)
- **Linguagem:** `JavaScript` (React 19)
- **Estilização:** CSS Modules
- **Gerenciamento de rotas:** `next/router` (e rotas dinâmicas)
- **Serviços personalizados:** `services/api.js`, `services/storage.js`

---

**Funcionalidades Principais**
- **Autenticação:** Login e cadastro com JWT, token em `localStorage` e redirecionamento ao expirar.
- **Cliente:** Home, categorias, página de produto, busca, carrinho persistente, finalização de compra e histórico de pedidos.
- **Admin:** CRUD de produtos (com upload de imagens), listagem e gerenciamento de pedidos, painel de usuários (telas protegidas por `role=admin`).

---

**Pré-requisitos**
- Node.js 18+ recomendado
- `npm` (ou `yarn`)

**Instalação**
1. Instale as dependências:

```powershell
npm install
# ou
yarn install
```

2. Crie o arquivo de ambiente com base no modelo:

```powershell
copy .env.example .env.local
# Em PowerShell, você pode usar: Copy-Item .env.example .env.local
```

Edite `.
env.local` e defina as variáveis necessárias (exemplos abaixo).

---

**Variáveis de ambiente (exemplo)**
- **`NEXT_PUBLIC_API_URL`**: URL base da API (ex.: `https://api.sualoja.com`)
- **`NEXT_PUBLIC_URL_MELHOR_ENVIO`**: endpoint do serviço de frete (se aplicável)
- **`NEXT_PUBLIC_GOOGLE_AUTH_URL`**: URL de autenticação via Google (se usado)
- **`NEXT_PUBLIC_FRONTEND_URL`**: URL do frontend (ex.: `http://localhost:3000`)

> O projeto espera variáveis `NEXT_PUBLIC_*` para expor valores ao cliente.

---

**Scripts (conforme `package.json`)**
- **`dev`**: executa em modo desenvolvimento
- **`build`**: gera o build de produção
- **`start`**: inicia o servidor de produção
- **`lint`**: executa o linter (ESLint)

Comandos rápidos:

```powershell
npm run dev
npm run build
npm start
npm run lint
```

---

**Estrutura de Pastas (resumo)**
- **`/pages`**: rotas do Next.js (páginas públicas e admin)
- **`/components`**: componentes reutilizáveis (`Header.js`, `Footer.js`, etc.)
- **`/services`**: `api.js` (cliente HTTP) e `storage.js` (wrapper de localStorage)
- **`/styles`**: módulos CSS (`*.module.css`)
- **`/public`**: assets públicos (imagens)

Exemplo de caminhos importantes:
- `pages/login.js` — tela de login
- `pages/admin/produtos.js` — listagem de produtos (admin)
- `services/api.js` — funções para comunicação com a API

---

**Boas práticas e observações**
- As rotas administrativas são protegidas; verifique o campo `role` do usuário.
- Tokens são armazenados em `localStorage` via `services/storage.js`.
- Ajuste variáveis `NEXT_PUBLIC_*` antes de subir para produção.

---

**Contribuição**
- Abra issues para bugs e melhorias.
- Para contribuições: crie um branch, implemente e abra um Pull Request descrevendo as mudanças.

---

**Licença e Uso**
- Este frontend foi desenvolvido para uso da loja Ana Paula Prata.
- Uso, redistribuição ou comercialização sem autorização é proibido.

---

**Autor**
- Desenvolvido por `Gilmar Alves de Oliveira`.

---

