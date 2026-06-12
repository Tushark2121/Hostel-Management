# 🏠 ResidenceX — Hostel Management System

A full-stack hostel management platform built with **Angular 18** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## 🗂 Project Structure

```
residencex/
├── backend/          Node.js + Express + MongoDB API
└── frontend/         Angular 18 standalone components
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`)

---

### 1️⃣ Backend Setup

```bash
cd backend
npm install

# (optional) edit .env to change MongoDB URI or JWT secret
# Default: mongodb://localhost:27017/residencex

# Seed the database with demo data
npm run seed

# Start the API server (port 3000)
npm run dev
```

The API will be available at `http://localhost:3000`

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install

# Start Angular dev server (port 4200)
npm start
```

Open `http://localhost:4200` in your browser.

---

## 🔐 Demo Credentials

| Role    | Username  | Password     |
|---------|-----------|--------------|
| Admin   | `admin`   | `admin123`   |
| Student | `student` | `student123` |

---

## 🧩 Features

### Admin Panel
| Module        | Features |
|---------------|----------|
| Dashboard     | Live stats, block occupancy charts, recent activity |
| Students      | Full CRUD, search/filter by block & fee status, auto-generate student IDs |
| Rooms         | Visual room grid, allot/vacate students, status tracking |
| Fees          | Monthly fee tracking, collect payments, send reminders |
| Complaints    | View all complaints, update status (open → in-progress → resolved) |
| Notice Board  | Post urgent/info/general notices, delete notices |
| Visitor Log   | Log visitors in/out, check-out tracking |
| Mess Menu     | View & edit weekly 7-day mess menu |
| Reports       | Block occupancy, fee collection, complaint resolution analytics |

### Student Panel
| Module      | Features |
|-------------|----------|
| My Profile  | Personal details, guardian info, fee & hostel stats |
| My Room     | Room details, roommates list, amenities |
| Fee Status  | Full payment history with status indicators |
| Complaints  | Raise complaints with category/priority, track status |
| Notice Board| View all hostel announcements |
| Mess Menu   | Weekly menu with today's highlight |
| My Visitors | View logged visitor history |

---

## 🛠 Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | Angular 18, standalone components, RxJS, Angular Router |
| Styling    | SCSS with CSS custom properties (design tokens) |
| HTTP       | Angular HttpClient + JWT interceptor |
| Backend    | Node.js, Express 4 |
| Database   | MongoDB 7+ with Mongoose 8 |
| Auth       | JWT (jsonwebtoken) + bcryptjs |
| Dev Tools  | nodemon, Angular CLI 18 |

---

## 🗄 MongoDB Collections

| Collection  | Description |
|-------------|-------------|
| `users`     | Auth accounts (admin + student logins) |
| `students`  | Student profiles and hostel info |
| `rooms`     | Room definitions, occupancy |
| `fees`      | Monthly fee records per student |
| `complaints`| Student-raised issues |
| `notices`   | Admin announcements |
| `visitors`  | Visitor log entries |
| `messes`    | Weekly mess menu |

---

## 🔌 API Endpoints

```
POST   /api/auth/login             Login
GET    /api/auth/me                Current user

GET    /api/dashboard/stats        Admin dashboard stats

GET    /api/students               List students (admin)
POST   /api/students               Create student (admin)
GET    /api/students/:id           Get student
PUT    /api/students/:id           Update student
DELETE /api/students/:id           Delete student (admin)

GET    /api/rooms                  List rooms
POST   /api/rooms/:id/allot        Allot room to student (admin)
POST   /api/rooms/:id/vacate       Remove student from room (admin)

GET    /api/fees                   List fees (admin)
GET    /api/fees/student/:id       Student's fee history
GET    /api/fees/summary/stats     Fee summary stats
POST   /api/fees/:id/pay           Collect payment (admin)

GET    /api/complaints             List complaints
POST   /api/complaints             Create complaint
PUT    /api/complaints/:id         Update status (admin)

GET    /api/notices                List notices
POST   /api/notices                Post notice (admin)
DELETE /api/notices/:id            Delete notice (admin)

GET    /api/visitors               List visitors
POST   /api/visitors               Log visitor (admin)
PUT    /api/visitors/:id/checkout  Check out visitor (admin)

GET    /api/mess                   Weekly menu
PUT    /api/mess/:id               Update menu item (admin)
```

---

## 🔧 Environment Variables (backend/.env)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/residencex
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

---

## 📦 Production Build

```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm run build
# Output: frontend/dist/residencex/
```
