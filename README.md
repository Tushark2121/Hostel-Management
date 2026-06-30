# 🏠 ResidenceX — Hostel Management System

ResidenceX is a full-stack hostel management platform that gives administrators a single dashboard to manage students, rooms, fees, complaints, visitors, notices, and mess menus — while giving students a self-service portal to track their own room, fees, and requests. It is built with **Angular 18** on the frontend and **Node.js, Express, and MongoDB (Mongoose)** on the backend, secured with JWT-based authentication and role-based access control.

---

## 🗂 Project Structure

```
residencex/
├── backend/                 Node.js + Express + MongoDB REST API
│   ├── models/               Mongoose schemas (User, Student, Room, Fee, Complaint, Notice, Visitor, Mess)
│   ├── routes/                Express route handlers, one file per resource
│   ├── middleware/         auth.js (JWT verification) and role.js (RBAC)
│   ├── seed.js                  Seeds the database with demo data
│   └── server.js               App entry point
│
└── frontend/                 Angular 18 standalone-component app
    └── src/app/
        ├── core/                  Services, guards, and the JWT HTTP interceptor
        ├── features/
        │   ├── auth/                Login
        │   ├── admin/             Admin dashboard, students, rooms, fees, complaints, visitors, notices, mess, reports
        │   └── student/            Student dashboard: room, fees, complaints, visitors, notices, mess, profile
        └── shared/                Reusable UI: sidebar, stat-card, toast
```

---

## ✨ Features

### Admin Portal
- **Dashboard** — live stats: total students, occupied rooms, open/urgent complaints, pending fees, defaulter count, visitors currently inside, and per-block occupancy percentages.
- **Student Management** — search/filter students by name, ID, block, or fee status; create student records with auto-generated student IDs and linked login accounts; update or remove students.
- **Room Management** — manage rooms across 3 blocks with type (Single/Double/Triple), capacity, amenities, and rent; allot or vacate students with automatic occupancy-status syncing.
- **Fee Management** — create fee records per student/month, record full or partial payments, auto-track payment status (paid/partial/unpaid/overdue), and view collection summaries with defaulters.
- **Complaints Management** — view all complaints with category/priority/status filters, update status (open → in-progress → resolved) with automatic resolution timestamps.
- **Visitor Log** — log visitor entries against a student, check visitors out, and view visit history.
- **Notices** — publish, edit, and delete general/urgent/info announcements.
- **Mess Menu** — manage a weekly breakfast/lunch/dinner menu.
- **Reports** — consolidated reporting view built on top of the dashboard/fee/student data.

### Student Portal
- View personal **room** allotment and roommate details.
- Track **fee** payment history and outstanding dues.
- Submit and track **complaints**.
- View **visitor** logs related to their own visits.
- Read hostel **notices** and the weekly **mess menu**.
- Manage personal **profile**.

### Platform-wide
- JWT authentication with role-based route guards (`admin` vs `student`) on both the API and the Angular router.
- Auto-generated, human-readable IDs (e.g. `STU2024001`, `C001`).
- Password hashing with bcrypt.
- Centralized error handling and request logging (morgan) on the backend.
- Toast notifications and a shared sidebar layout on the frontend.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 18 (standalone components), TypeScript, RxJS, SCSS |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose ODM |
| Auth | JSON Web Tokens (jsonwebtoken), bcryptjs for password hashing |
| Validation | express-validator |
| Dev Tools | nodemon, Angular CLI, morgan (HTTP logging) |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB running locally (default: `mongodb://localhost:27017`) or a MongoDB Atlas connection string

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

Configure environment variables in `backend/.env` (a default file is already included):

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/residencex
JWT_SECRET=residencex_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> ⚠️ Change `JWT_SECRET` before deploying to production.

Seed the database with demo data (admin user, student, rooms, fees, complaints, notices, visitors, mess menu):

```bash
npm run seed
```

Start the API server:

```bash
npm run dev      # with auto-reload via nodemon
# or
npm start        # plain node
```

The API will be available at `http://localhost:3000`. Health check: `GET http://localhost:3000/api/health`.

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start         # ng serve
```

The Angular app will be available at `http://localhost:4200` and is pre-configured (via `proxy.conf.json`) to proxy API calls to the backend on port 3000.

### 3️⃣ Demo Credentials (after seeding)

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |
| Student | `student` | `student123` |

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api`. Endpoints marked **🔒** require a valid JWT (`Authorization: Bearer <token>`); endpoints marked **🛡 admin** additionally require the `admin` role.

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Log in with username + password, returns JWT and user profile |
| GET 🔒 | `/auth/me` | Get the currently authenticated user's profile |

### Students
| Method | Endpoint | Description |
|---|---|---|
| GET 🔒🛡 | `/students` | List students (filter by `search`, `block`, `feeStatus`) |
| GET 🔒 | `/students/:id` | Get a single student |
| POST 🔒🛡 | `/students` | Create a student (auto-generates `studentId`; optionally creates a linked login) |
| PUT 🔒 | `/students/:id` | Update a student |
| DELETE 🔒🛡 | `/students/:id` | Delete a student (and remove from their room) |

### Rooms
| Method | Endpoint | Description |
|---|---|---|
| GET 🔒 | `/rooms` | List rooms (filter by `block`, `status`) |
| GET 🔒 | `/rooms/:id` | Get a single room with occupant details |
| POST 🔒🛡 | `/rooms` | Create a room |
| PUT 🔒🛡 | `/rooms/:id` | Update a room |
| POST 🔒🛡 | `/rooms/:id/allot` | Allot a student to the room (handles capacity check and previous-room cleanup) |
| POST 🔒🛡 | `/rooms/:id/vacate` | Remove a student from the room |
| DELETE 🔒🛡 | `/rooms/:id` | Delete a room |

### Fees
| Method | Endpoint | Description |
|---|---|---|
| GET 🔒🛡 | `/fees` | List fee records (filter by `status`, `month`) |
| GET 🔒 | `/fees/student/:studentId` | List fee records for a specific student |
| POST 🔒🛡 | `/fees` | Create a fee record |
| PUT 🔒🛡 | `/fees/:id` | Update a fee record |
| POST 🔒🛡 | `/fees/:id/pay` | Record a payment (auto-updates status to `partial`/`paid`) |
| GET 🔒🛡 | `/fees/summary/stats` | Get total collected, total pending, and defaulter count |

### Complaints
| Method | Endpoint | Description |
|---|---|---|
| GET 🔒 | `/complaints` | List complaints (admins see all; students see only their own; filter by `status`, `category`) |
| GET 🔒 | `/complaints/:id` | Get a single complaint |
| POST 🔒 | `/complaints` | Submit a complaint |
| PUT 🔒🛡 | `/complaints/:id` | Update status/details (auto-stamps `resolvedAt`/`resolvedBy` on resolution) |
| DELETE 🔒🛡 | `/complaints/:id` | Delete a complaint |

### Visitors
| Method | Endpoint | Description |
|---|---|---|
| GET 🔒 | `/visitors` | List visitor logs (students see only their own) |
| POST 🔒🛡 | `/visitors` | Log a new visitor entry |
| PUT 🔒🛡 | `/visitors/:id/checkout` | Mark a visitor as checked out |
| DELETE 🔒🛡 | `/visitors/:id` | Delete a visitor log entry |

### Notices
| Method | Endpoint | Description |
|---|---|---|
| GET 🔒 | `/notices` | List all notices |
| POST 🔒🛡 | `/notices` | Create a notice |
| PUT 🔒🛡 | `/notices/:id` | Update a notice |
| DELETE 🔒🛡 | `/notices/:id` | Delete a notice |

### Mess
| Method | Endpoint | Description |
|---|---|---|
| GET 🔒 | `/mess` | Get the weekly mess menu (sorted Monday–Sunday) |
| PUT 🔒🛡 | `/mess/:id` | Update a day's menu |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET 🔒🛡 | `/dashboard/stats` | Aggregate stats: student count, room occupancy, complaints, pending fees, defaulters, visitors inside, per-block occupancy |

### Misc
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | API health check |

---

## 🗄 Data Model Overview

| Model | Key Fields |
|---|---|
| **User** | username, email, password (hashed), role (`admin`/`student`), studentRef |
| **Student** | studentId, name, email, phone, course, year, rollNumber, block, room, guardian, status, feeStatus |
| **Room** | number, block, floor, type, capacity, occupants[], status, amenities[], monthlyRent |
| **Fee** | student, amount, month, dueDate, paidDate, status, paidAmount, remarks |
| **Complaint** | complaintId, student, title, category, priority, status, description, resolvedAt/By |
| **Notice** | title, body, type, postedBy |
| **Visitor** | name, relation, phone, student, inTime, outTime, status, loggedBy |
| **Mess** | day, breakfast, lunch, dinner, weekLabel |

---

## 🔐 Authentication & Authorization Flow

1. User logs in via `POST /api/auth/login` with username/password.
2. Backend verifies the password hash and issues a JWT containing `id`, `username`, `role`, and (for students) `studentId`.
3. The Angular `jwt.interceptor.ts` attaches the token to every outgoing request as a `Bearer` header.
4. The backend's `auth.js` middleware verifies the token on protected routes; `role.js` middleware restricts admin-only routes.
5. On the frontend, `auth.guard.ts` and `role.guard.ts` protect Angular routes so students can't navigate into admin views and vice versa.

---

## 📦 Building for Production

```bash
# Frontend production build
cd frontend
npm run build
# Output: frontend/dist/

# Backend
cd backend
NODE_ENV=production npm start
```

Serve the Angular `dist/` build with a static file server or reverse proxy (e.g. Nginx) and point it at the backend API, or serve it from Express by adding a static middleware in `server.js`.

---

## 📄 License

This project was built for academic/portfolio purposes as part of a B.Tech IT curriculum project.
