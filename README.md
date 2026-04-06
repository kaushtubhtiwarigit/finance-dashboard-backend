# 🏷️ Finance Dashboard Backend API

## 📌 Description

This is a backend system for a finance dashboard that allows users to manage financial records based on roles and access permissions.
It includes role-based access control, financial record management, and summary analytics APIs.

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

---

## 🚀 Features

- User authentication (JWT)
- Role-based access control (Admin, Analyst, Viewer)
- CRUD operations for financial records
- Filtering of records (type, category, date)
- Summary APIs (income, expense, net balance)
- Pagination
- Soft delete
- Input validation and error handling

---

## 🧑‍💼 Roles

| Role | Permissions |
|------|-------------|
| ADMIN | Full access — manage users and records |
| ANALYST | Can create, view, update, and delete records + access summary |
| VIEWER | Can only access summary APIs |

---

## 🔐 Authentication

All protected routes require a JWT token.

Header format:
```
Authorization: Bearer <token>
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint |
|--------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |

### Users _(ADMIN only)_
| Method | Endpoint |
|--------|----------|
| GET | `/api/users` |
| PUT | `/api/users/:id/role` |
| PUT | `/api/users/:id/status` |

### Records _(ANALYST / ADMIN)_
| Method | Endpoint |
|--------|----------|
| POST | `/api/records` |
| GET | `/api/records` |
| GET | `/api/records/:id` |
| PUT | `/api/records/:id` |
| DELETE | `/api/records/:id` |

### Summary _(All authenticated users)_
| Method | Endpoint |
|--------|----------|
| GET | `/api/summary` |
| GET | `/api/summary/category` |
| GET | `/api/summary/monthly` |

---

## 🔎 Filtering Example

```
GET /api/records?type=income&category=food
```

---

## 🛠️ Setup Instructions

1. Clone the repo
2. Run: `npm install`
3. Create a `.env` file based on `.env.example`
4. Add your values:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   PORT=5000
   JWT_EXPIRES_IN=100d
   BCRYPT_ROUNDS=10
   ```
5. Run: `npm start` or `npm run dev` for development

---

## 📬 Testing

APIs were tested using Postman. A Postman collection is included in the repo (`postman_collection.json`) for quick testing.

---

## 🧠 Assumptions

- Authentication is implemented using JWT
- Role is assigned at user creation (default: `VIEWER`)
- Soft delete is used instead of permanent deletion to preserve data integrity

---

## 🏗️ Design Decisions

- Used middleware for role-based access control to keep authorization logic reusable and decoupled from route handlers
- Separated controllers and services for maintainability — controllers handle HTTP, services handle business logic
- Used soft delete to preserve data integrity and allow potential record recovery
- Input validation handled via `express-validator` middleware before reaching controllers

---

## 📁 Project Structure

```
src/
├── config/         # Database connection
├── controllers/    # Route handlers
├── middleware/     # Auth, authorization, validation, logging
├── models/         # Mongoose schemas
├── routes/         # Express routers
├── services/       # Business logic
└── utils/          # Error handler
```

---


