### 🚀 Hospital Insurance Claim Management System — Backend (SAAS Edition)

    This is the backend API for the Hospital Insurance Claim Management System (HICMS) — a full SAAS platform for hospitals, doctors, and staff to manage insurance policies, patient documents, claims, and subscription billing.

    Built using Node.js + TypeScript + Express + TypeORM + PostgreSQL, the system includes authentication, doctor/staff hierarchy, patient claim workflow, and SAAS subscription plans.

### 🌐 System Roles
| Role           | Description                                               |
| -------------- | --------------------------------------------------------- |
| **SuperAdmin** | Manages entire SAAS system, subscription plans, hospitals |
| **Doctor**     | Hospital owner/admin, manages staff, policies, all claims |
| **Staff**      | Uploads patient documents, files claims, updates details  |

❌ No customer, insurer, TPA, workshop — system simplified based on your new requirements.

### 🎯 Core Features

*   🔐 Authentication & Access Control

        JWT authentication
        Role-based permissions (SuperAdmin, Doctor, Staff)
        Secure bcrypt password hashing
        Middleware-based route protection

*   🏥 Hospital-Level Features

        Doctor creates/manage hospital
        Doctor onboard staff users
        Staff handles patient onboarding, document uploads, and claim initiation
        Doctor monitors all policies, claims, revenue, hospital-level analytics

*   📄 Policy Management

        Doctor (Admin) adds policies
        Staff assigns policies to patients
        Policy status track (Pending, Active, Rejected, Completed, etc.)

*   👨‍⚕️ Patient Management

        Staff registers patient
        Staff uploads patient insurance documents
        Doctor reviews

*   📁 Document Management

        Multiple document uploads
        Secure storage in appData/uploads
        Tracks document status: Uploaded → Verified → Rejected

*   🧾 Claims Workflow

        Staff submits claim
        Doctor validates and approves/rejects
        Real-time claim status history tracking (timeline)

*   💳 SAAS Subscription Management

        For Hospitals:
        Subscription plan creation (SuperAdmin)
        Monthly / Yearly plans
        Hospital subscription activation / expiry tracking

### 🛠 Tech Stack

    Node.js + Express
    TypeScript
    TypeORM (PostgreSQL)
    class-validator + DTOs
    typedi (Dependency Injection)
    JWT Authentication
    bcrypt password hashing
    Helmet, CORS
    Winston logging
    Multer for file uploads

### 📂 Final Folder Structure
    backend/
    ├── src/
    │   ├── config/             # DB & environment configuration
    │   ├── controllers/        # REST API controllers
    │   ├── entity/             # All TypeORM entities (User, Hospital, Policy...)
    │   ├── middleware/         # Auth, Error handler, Logger
    │   ├── services/           # Business logic per module
    │   ├── utils/              # Helpers (ApiError, JwtUtil, etc.)
    │   └── index.ts            # Application entry file
    ├── migrations/             # TypeORM migrations
    ├── appData/
    │   └── uploads/            # Uploaded patient documents
    ├── package.json
    ├── tsconfig.json
    ├── ormconfig.ts
    └── .env.example

### ⚙️ Environment Variables (.env.example)
    NODE_ENV=local
    PORT=8000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=hospital_claims

# JWT
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRATION=1d

# CORS
CORS_ORIGIN=http://localhost:5173

📦 Installation
1. Clone project
git clone https://github.com/your/hospital-claims-saas-backend.git
cd hospital-claims-saas-backend

2. Install dependencies
npm install

3. Setup environment

Create .env.local using .env.example.

4. Run migrations
npm run migration:run

5. Start server
npm run serve


Server runs at:

👉 http://localhost:8000

### 🔗 API Endpoints (Updated for SAAS Model)
    🔐 Auth
    Method	Endpoint	Role
    POST	/api/auth/register	SuperAdmin / Doctor
    POST	/api/auth/login	All

    🏥 Hospital
    Method	Endpoint	Role
    POST	/api/hospital/create	Doctor
    GET	/api/hospital/details	Doctor
    
    👨‍⚕️ Doctor
    Method	Endpoint	Role
    GET	/api/doctor/me	Doctor

    👨‍💼 Staff
    Method	Endpoint	Role
    POST	/api/staff/add	Doctor
    GET	/api/staff/list	Doctor

    🧑‍⚕️ Patient
    Method	Endpoint	Role
    POST	/api/patient/add	Staff
    GET	/api/patient/list	Staff / Doctor

    📁 Patient Documents
    Method	Endpoint	Role
    POST	/api/patient-document/upload	Staff
    GET	/api/patient-document/list	Doctor / Staff

    📝 Policy
    Method	Endpoint	Role
    POST	/api/policy/add	Doctor
    GET	/api/policy/list	Doctor / Staff

    🧾 Claim
    Method	Endpoint	Role
    POST	/api/claim/add	Staff
    GET	/api/claim/list	Doctor / Staff
    PUT	/api/claim/status/update	Doctor
    GET	/api/claim/history/:id	Doctor / Staff

### 💳 Subscription Plans (SAAS)

*   (SuperAdmin only)
        Method	Endpoint	Description
        POST	/api/subscription-plan/add	Create plan
        GET	/api/subscription-plan/list	List all plans

*   💼 Hospital Subscription
        Method	Endpoint	Role
        POST	/api/subscription/start	Doctor
        GET	/api/subscription/status	Doctor

*   🛡️ Security

        JWT required for all protected endpoints
        @Authorized([roles]) based access control
        Input validation using DTOs + class-validator
        Sanitized headers using Helmet
        Restricted CORS origin

*   👨‍💻 Developer

        Hariom Verma
        Hospital Insurance Claim Management System — SAAS Backend