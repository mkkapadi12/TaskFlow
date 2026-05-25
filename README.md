<p align="center">
  <img src="client/public/logo.png" alt="TaskFlow Logo" width="80" />
</p>

<h1 align="center">TaskFlow</h1>
<p align="center"><em>Organize your work. Empower your team.</em></p>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img alt="MySQL" src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue" />
</p>

---

## What is TaskFlow?

**TaskFlow** is a full-stack project and task management platform built for teams that want clarity over chaos. It gives every team member a single place to track projects, assign tasks, review work, and communicate progress — all with role-based controls that keep ownership clear.

Whether you're a solo developer managing personal projects or a team lead coordinating across multiple workstreams, TaskFlow provides the structure you need without the overhead you don't.

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based registration and login with bcrypt password hashing
- Role-based access control: `ADMIN`, `OWNER`, `MEMBER`
- Password reset via secure email link (15-minute token)
- Change password from settings with current-password verification
- Protected routes — unauthenticated users are redirected automatically

### 👤 User Profiles
- View and update your profile (name, phone)
- Upload and replace your avatar (stored on Cloudinary)
- Email address displayed but cannot be changed (identity anchor)

### 📁 Project Management
- Create projects and automatically become the `OWNER`
- Invite team members by user ID with role assignment (`ADMIN` / `MEMBER`)
- Update member roles or remove members at any time
- View full project details — info, members list, and tasks — in one request
- Project status tracking: `ACTIVE` / `INACTIVE`

### ✅ Task Management
- Create tasks within projects, assign them to project members
- Four status stages: `TODO` → `IN_PROGRESS` → `IN_REVIEW` → `DONE`
- Four priority levels: `LOW`, `MEDIUM`, `HIGH`, `URGENT`
- Deadline tracking with overdue detection
- **Verification workflow**: assignee submits work (→ `IN_REVIEW`); owner approves (→ `DONE`) or rejects (→ `IN_PROGRESS`)
- Creator and assignee tracking on every task

### 📊 Personal Dashboard
- Overview of your projects, tasks, and overdue items
- Task status distribution chart (Pie chart via Recharts)
- Upcoming deadlines at a glance

### 📋 My Tasks
- See all tasks assigned to you across all projects
- Filter by status and search by task title or project name
- Click any task card to navigate directly to its project

### 🔔 Notification Preferences
- Control which emails you receive from TaskFlow per-account:
  - Welcome email on signup
  - Password reset / security emails
  - Added to a project notification
  - Removed from a project notification

### 🌙 Theming
- First-class dark mode and light mode support via `next-themes`
- Toggleable from the Settings page

---

## 🛠 Tech Stack

### Backend (`server/`)
| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express 5 |
| Database | MySQL 8 via `mysql2/promise` |
| All DB access | Stored Procedures only |
| Auth | `jsonwebtoken` + `bcryptjs` |
| Validation | `zod` |
| Security | `helmet`, `cors` |
| File uploads | `multer` + Cloudinary |
| Email | `nodemailer` (SMTP / Gmail) |
| API Docs | Swagger UI at `/api/docs` |
| Dev runner | `nodemon` |

### Frontend (`client/`)
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 6 |
| Routing | `react-router-dom` v7 |
| State | Redux Toolkit + RTK Query |
| HTTP | Axios with custom `axiosBaseQuery` |
| Forms | `react-hook-form` + Zod |
| UI | shadcn/ui (Radix UI primitives) |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Notifications | Sonner (toast) |
| Calendar | `react-day-picker` + `date-fns` |
| Icons | Lucide React |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MySQL** 8.x running locally
- **Cloudinary** account (free tier works)
- **Gmail** account with an [App Password](https://support.google.com/accounts/answer/185833) for SMTP

### 1. Clone & Install

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow

# Install root workspace dependencies
bun install
```

### 2. Set Up the Database

Open MySQL Workbench (or your preferred client) and run the SQL files in order:

```bash
mysql -u root -p < server/database/create.sql
mysql -u root -p your_db < server/database/users.sql
mysql -u root -p your_db < server/database/project.sql
mysql -u root -p your_db < server/database/tasks.sql
mysql -u root -p your_db < server/database/notification.sql
```

### 3. Configure Environment Variables

**Server:**
```bash
cd server
cp .env.example .env
# Edit .env and fill in your database, JWT, Cloudinary, and SMTP credentials
```

**Client:**
```bash
cd client
cp .env.example .env
# VITE_API_URL is already set to http://localhost:5000 by default
```

### 4. Run the Development Servers

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd server
bun run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd client
bun run dev
```

Visit `http://localhost:5173` to open the app.  
Swagger API docs are available at `http://localhost:5000/api/docs`.

---

## 🔑 Environment Variables Reference

### Server (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Port the server listens on (default: `5000`) |
| `NODE_ENV` | Yes | `development` or `production` |
| `CLIENT_URL` | Yes | Frontend origin for CORS and reset-link emails |
| `DATABASE_URL` | Yes | Full MySQL connection URL |
| `DATABASE_NAME` | Yes | MySQL database name |
| `DATABASE_HOST` | Yes | MySQL host (usually `localhost`) |
| `DATABASE_USER` | Yes | MySQL user |
| `DATABASE_PASSWORD` | Yes | MySQL password |
| `DATABASE_PORT` | Yes | MySQL port (default: `3306`) |
| `JWT_SECRET` | Yes | Long random string for signing JWTs |
| `JWT_EXPIRES_IN` | Yes | Token lifetime e.g. `7d`, `30d` |
| `CLOUDINARY_CLOUD_NAME` | Yes | From your Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Yes | From your Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Yes | From your Cloudinary dashboard |
| `SMTP_HOST` | Yes | SMTP server host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | Yes | SMTP port (`587` for TLS) |
| `SMTP_USER` | Yes | Your email address |
| `SMTP_PASS` | Yes | Gmail App Password (not your login password) |
| `MAIL_FROM` | Yes | Sender name + address, e.g. `"TaskFlow <you@gmail.com>"` |

### Client (`client/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend base URL (default: `http://localhost:5000`) |

---

## 🗄 Database Design

All data access is routed exclusively through **MySQL stored procedures** — no raw SQL in application code.

| Table | Purpose |
|---|---|
| `users` | Accounts with name, email, hashed password, role, avatar |
| `projects` | Projects owned by a user, with status and timestamps |
| `project_members` | Many-to-many: users ↔ projects with `OWNER/ADMIN/MEMBER` role |
| `tasks` | Tasks scoped to a project with status, priority, assignee, deadline |
| `notification_settings` | Per-user email preference toggles |

---

## 📡 API Overview

Base URL: `http://localhost:5000/api`

| Group | Routes |
|---|---|
| **Auth** | `POST /auth/register`, `POST /auth/login`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `POST /auth/change-password` |
| **Users** | `GET /users/profile`, `PUT /users/profile`, `GET /users/:id`, `GET /users` (admin), `DELETE /users/:id` |
| **Projects** | Full CRUD + member management under `/projects` |
| **Tasks** | Full CRUD + status transitions + verification under `/tasks` |
| **Notifications** | `GET /notifications/settings`, `PATCH /notifications/settings` |

> Full interactive documentation: **`http://localhost:5000/api/docs`**

---

## 🏗 Project Structure

```
taskflow/
├── client/                   → React frontend
│   └── src/
│       ├── app/              → Redux store + RTK Query base
│       ├── components/       → Layouts, routes, shadcn UI
│       ├── features/         → Feature-sliced modules (auth, users, projects, tasks)
│       ├── hooks/            → useAuth, use-mobile
│       ├── lib/              → Axios instance, utilities, icons
│       └── constant/         → App-wide constants, status/priority configs
│
└── server/                   → Express backend
    ├── database/             → SQL files (schema + stored procedures)
    └── src/
        ├── config/           → DB pool, env, Cloudinary, Swagger
        ├── controllers/      → Route handlers
        ├── models/           → Business logic (calls stored procedures)
        ├── middlewares/      → Auth, validation, upload, error handling
        ├── routes/           → Express routers
        ├── services/         → Email + notification services
        └── templates/        → HTML email templates
```

---

## 🔄 Task Workflow

```
Create Task (Owner/Admin)
       │
       ▼
    [ TODO ]
       │  Assignee or Manager
       ▼
 [ IN_PROGRESS ]
       │  Assignee or Manager
       ▼
  [ IN_REVIEW ]  ◄── "Needs Verification" badge shown to Owner
       │
  ┌────┴────┐
  │         │
Owner     Owner
Approves  Rejects
  │         │
  ▼         ▼
[ DONE ] [IN_PROGRESS]
```

> `DONE` is **only** reachable through the owner's verification step — never by direct status update.

---

## 🔮 Future Roadmap

### Near-term
- **Kanban board** on project detail page — drag and drop tasks between status columns
- **Calendar view** — map tasks with deadlines onto a monthly grid
- **Task search & advanced filters** — filter by priority, assignee, or deadline range
- **Project status toggle** (`ACTIVE` / `INACTIVE`) from the UI
- **Member role management UI** — update member roles visually

### Mid-term
- **Time tracking** — log hours spent on tasks
- **Analytics page** — productivity trends, completion rates, team performance
- **Task comments & activity log** — threaded discussion per task
- **File attachments** on tasks (Cloudinary already integrated)
- **Deadline reminder emails** — notify assignees before tasks become overdue

### Long-term
- **Real-time collaboration** with Socket.IO — live task updates, presence indicators
- **Refresh tokens + httpOnly cookies** — replace `localStorage` JWT storage
- **Rate limiting** on auth endpoints (`express-rate-limit`)
- **Audit log** — admin-visible history of all project and task changes
- **Test suite** — unit + integration tests for both client and server
- **CI/CD pipelines** — automated testing and deployment workflows

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

> **Convention**: All database changes must go through stored procedures. Add the SP to the relevant `server/database/*.sql` file before writing application code.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">Built with ❤️ using React, Express, and MySQL</p>
