<div align="center">

# 💰 FinanceFlow — Gerenciador de Despesas Full Stack

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens)](https://jwt.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Aplicação full stack para gestão de despesas e receitas pessoais.**  
Autenticação JWT, CRUD completo, dashboard com gráficos, exportação CSV.

[🌐 Frontend Demo](https://financeflow.vercel.app) · [📡 API Docs](#api) · [📧 Contato](mailto:danielamarallopescosta@gmail.com)

</div>

---

## ✨ Funcionalidades

**Autenticação**
- Registro e login com JWT (7 dias de validade)
- Proteção de rotas no frontend e backend
- Persistência de sessão via `localStorage`

**Transações**
- CRUD completo de despesas e receitas
- 9 categorias com emojis e cores
- Filtros por tipo e data
- Paginação server-side (10 por página)

**Dashboard**
- Cards de resumo: receitas, despesas, saldo
- Gráfico de área — despesas dos últimos 30 dias (Recharts)
- Gráfico de pizza — distribuição por categoria
- Filtro por mês/ano

**Extras**
- Exportação para CSV
- Dark / Light Mode
- Validação server-side (express-validator) + client-side
- Error handling global no backend
- Responsivo — mobile-first

---

## 🛠️ Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS + React Router v6 |
| HTTP Client | Axios com interceptors JWT |
| Gráficos | Recharts |
| Backend | Node.js + Express.js |
| Banco de dados | MongoDB + Mongoose |
| Autenticação | JWT + bcryptjs |
| Validação | express-validator |
| Logging | Morgan |

---

## 📁 Estrutura

```
expense-tracker/
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── server.js              # Entry point — Express + MongoDB
│       ├── models/
│       │   ├── User.js            # Schema + bcrypt pre-save hook
│       │   └── Expense.js         # Schema com índices para performance
│       ├── controllers/
│       │   ├── authController.js  # register, login, getMe
│       │   ├── expenseController.js # CRUD + filtros + paginação
│       │   └── summaryController.js # Agregações MongoDB
│       ├── routes/
│       │   ├── auth.js
│       │   ├── expenses.js
│       │   └── summary.js
│       ├── middleware/
│       │   ├── auth.js            # JWT protect middleware
│       │   ├── validate.js        # express-validator handler
│       │   └── errorHandler.js    # Global error handler
│       └── utils/jwt.js
│
└── frontend/
    ├── package.json
    ├── vite.config.js             # Proxy /api → backend
    ├── .env.example
    └── src/
        ├── App.jsx                # Rotas + guards PrivateRoute/PublicRoute
        ├── api/axios.js           # Instância Axios + interceptors
        ├── context/AuthContext.jsx
        ├── hooks/useExpenses.js
        ├── utils/format.js        # formatCurrency, formatDate, CATEGORIES
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── Dashboard.jsx
        └── components/
            ├── Navbar.jsx
            ├── ExpenseCard.jsx
            ├── ExpenseForm.jsx
            ├── SummaryChart.jsx   # AreaChart + PieChart
            └── ui/ Toast, Modal, Spinner
```

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Conta no [MongoDB Atlas](https://mongodb.com/atlas) (free tier)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edite .env com sua MONGODB_URI e JWT_SECRET
npm run dev
# API rodando em http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
# Crie .env com: VITE_API_URL=http://localhost:5000/api
npm run dev
# App em http://localhost:5173
```

---

## 📡 API Endpoints {#api}

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/register` | ❌ | Cria conta |
| POST | `/api/auth/login`    | ❌ | Login → retorna JWT |
| GET  | `/api/auth/me`       | ✅ | Usuário autenticado |
| GET  | `/api/expenses`      | ✅ | Lista com filtros e paginação |
| POST | `/api/expenses`      | ✅ | Cria transação |
| PUT  | `/api/expenses/:id`  | ✅ | Atualiza transação |
| DELETE | `/api/expenses/:id` | ✅ | Remove transação |
| GET  | `/api/summary`       | ✅ | Agregações por mês |

---

## 🌐 Deploy

**Frontend → Vercel**
```bash
cd frontend && npm run build
# Importe o repositório em vercel.com
# Variável de ambiente: VITE_API_URL=https://sua-api.render.com/api
```

**Backend → Render**
1. Crie um Web Service no [render.com](https://render.com)
2. Build command: `npm install`
3. Start command: `node src/server.js`
4. Adicione as variáveis de ambiente do `.env`

---

## 📝 Commits sugeridos

```
feat: scaffold backend Express + MongoDB + JWT
feat: add User model with bcrypt password hashing
feat: add Expense model with compound index
feat: add auth routes (register, login, me)
feat: add expense CRUD with pagination and filters
feat: add summary aggregation pipeline
feat: scaffold React frontend with Vite + Tailwind
feat: add AuthContext with JWT persistence
feat: add Dashboard with summary cards and charts
feat: add ExpenseForm with client-side validation
feat: add CSV export
style: responsive layout and dark mode
docs: complete README with API reference
```

---

## ✅ Checklist antes de publicar

- [ ] Criar conta no MongoDB Atlas e obter connection string
- [ ] Definir `JWT_SECRET` com string aleatória longa (32+ chars)
- [ ] Configurar variáveis de ambiente no Render e Vercel
- [ ] Testar register → login → CRUD → logout
- [ ] Testar em mobile
- [ ] Atualizar links de demo no README

---

## 🔮 Melhorias futuras

- [ ] Metas de gasto por categoria
- [ ] Importar CSV/OFX bancário
- [ ] Relatório PDF mensal
- [ ] Notificações de limite de gastos
- [ ] Contas compartilhadas (família/casal)
- [ ] Testes com Jest + Supertest (backend)
- [ ] Testes E2E com Playwright

---

## 📄 Licença

MIT — Daniel Costa · [danielamarallopescosta@gmail.com](mailto:danielamarallopescosta@gmail.com)
