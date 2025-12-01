### 🏥 Insurance Claims Management System — Backend

This is the backend API for the Insurance Claims Management System (ICMS).
Built with Node.js + TypeScript + Express + TypeORM + PostgreSQL, it provides secure REST APIs for managing users, policies, claims, insurers, service providers (hospital/workshop), and agents/TPAs.

### 🚀 Overview

* Node.js + Express API server
* TypeScript for type safety
* PostgreSQL + TypeORM for data persistence
* JWT Authentication & Role-based Access Control (RBAC)
* REST APIs for customers, insurers, agents & service providers
* Modular architecture with services, controllers & entities

### ✨ Features
🔐 Authentication

* JWT-based login
* Role-based access control (customer, insurer, agent/TPA, service provider, admin)
* Secure password hashing with bcrypt
* Global error handling & validation

### 📂 Core Modules

* User Management — register, login, role-based profile access
* Policy Management — add, update, delete, list policies
* Claims Management — raise claim, approve/reject by insurer/TPA
* Insurer Management — manage insurance companies issuing policies
* Service Providers — hospital/workshop login for claim processing
* Agent/TPA Management — claim handling and approvals

### 🗝️ Role Permissions

| Feature / Action         | Admin | Customer | Insurer | Agent/TPA | Provider |
| ------------------------ | :---: | :------: | :-----: | :-------: | :------: |
| Register / Login         |   ✔   |     ✔    |    ✔    |     ✔     |     ✔    |
| Manage Users & Roles     |   ✔   |     ✖    |    ✖    |     ✖     |     ✖    |
| Buy Policies             |   ✖   |     ✔    |    ✖    |     ✖     |     ✖    |
| Issue Policies           |   ✖   |     ✖    |    ✔    |     ✖     |     ✖    |
| View Policies            |   ✔   |  ✔ (own) |    ✔    |     ✔     |     ✔    |
| Raise Claims             |   ✖   |     ✔    |    ✖    |     ✖     |     ✖    |
| Approve/Reject Claims    |   ✖   |     ✖    |    ✔    |     ✔     |     ✔    |
| Delete Policies / Claims |   ✔   |     ✖    |    ✔    |     ✖     |     ✖    |

### 🛠️ Tech Stack

* Node.js with Express
* TypeScript
* TypeORM (PostgreSQL)
* routing-controllers (decorator-based routing)
* typedi (dependency injection)
* class-validator & class-transformer
* bcrypt for password hashing
* jsonwebtoken for JWT auth
* Helmet, CORS, Compression for security & performance
* Winston / Morgan for logging

### 📂 Folder Structure

backend/
├── src/
│   ├── config/           # DB + environment config
│   ├── controllers/      # Route controllers
│   ├── entity/           # TypeORM entities
│   ├── middleware/       # Auth, logging, error handling
│   ├── services/         # Business logic
│   ├── utils/            # Helpers (ApiError, messages, etc.)
│   └── index.ts          # App entry
├── migrations/           # DB migrations
├── appData/              # Static storage (uploads, docs)
├── package.json
├── tsconfig.json
├── ormconfig.ts
└── .env.example

### ⚙️ Environment Variables

Create .env.local for development:

NODE_ENV=local
PORT=8000

*  Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_pg_username
DB_PASSWORD=your_pg_password
DB_DATABASE=insurance_db

* JWT
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRATION=1d

* CORS
CORS_ORIGIN=http://localhost:5173

### 📦 Installation & Run

1. Clone the repo

git clone https://github.com/your-username/insurance-claims-backend.git
cd insurance-claims-backend

2. Install dependencies
npm install

3. Setup environment
Create .env.local (see above)

4. Run migrations
npm run migration:run

5. Start in dev mode
npm run serve

Server runs at: http://localhost:8000

### 🔗 API Endpoints

* Auth
    * POST /api/user/add — register new user
    * POST /api/user/login — login

* Policy
    * GET /api/policy/list
    * POST /api/policy/add (insurer issues policy, customer buys policy)
    * PUT /api/policy/update?policyId=
    * DELETE /api/policy/delete?policyId=

* Claims
    * GET /api/claim/list
    * POST /api/claim/add (customer raises claim)
    * PUT /api/claim/update?claimId= (insurer/TPA updates status)
    * DELETE /api/claim/delete?claimId=

* Insurer / Providers
    * GET /api/insurer/list
    *  POST /api/insurer/add
    * GET /api/provider/list
    * POST /api/provider/add

### 🛡️ Security

* All protected routes require JWT:
* Authorization: Bearer <token>
* Roles enforced using @Authorized([role]) decorators
* Input validated with class-validator
* Secure headers with Helmet, restricted origins with CORS

### 📝 License

* Developed by Hariom Verma
* Insurance Claims Management System — Backend
