# TaskFlow

A full-stack task and project management platform that lets teams organize projects, assign tasks, manage members, and track progress with role-based access control.

> **Tagline:** *Organize your work. Empower your life.*

---

## 1. Project Overview

TaskFlow is a productivity workspace where users can:

- Sign up / log in with JWT-based authentication
- Manage their personal profile and avatar
- Create projects (admin) and invite members with roles
- Create, assign, prioritize, and track tasks within projects
- View overdue tasks and personal task lists
- Receive welcome / password reset emails via SMTP

The project is split into two cleanly separated apps:

```
D:\SQL
├── client/      → React 19 + Vite frontend
├── server/      → Express 5 + MySQL backend
└── README.md
```

---

## 2. Tech Stack

### Backend (`server/`)
| Concern              | Library                                     |
|----------------------|---------------------------------------------|
| Runtime              | Node.js (ES Modules, `"type": "module"`)    |
| HTTP framework       | Express 5                                   |
| Database             | MySQL via `mysql2/promise` (connection pool)|
| Auth                 | `jsonwebtoken` + `bcryptjs`                 |
| Validation           | `zod`                                       |
| Security             | `helmet`, `cors`                            |
| File uploads         | `multer` + Cloudinary                       |
| Email                | `nodemailer` (SMTP)                         |
| API Docs             | `swagger-jsdoc` + `swagger-ui-express` at `/api/docs` |
| Dev runner           | `nodemon`                                   |

### Frontend (`client/`)
| Concern              | Library                                     |
|----------------------|---------------------------------------------|
| Framework            | React 19                                    |
| Build tool           | Vite 8 (with React Compiler via Babel)      |
| Routing              | `react-router-dom` v7                       |
| State management     | Redux Toolkit + RTK Query (`baseApi`)       |
| HTTP client          | Axios (custom `axiosBaseQuery`)             |
| Forms                | `react-hook-form` + `@hookform/resolvers` + Zod |
| UI primitives        | shadcn/ui (Radix UI under the hood)         |
| Styling              | Tailwind CSS v4                             |
| Theming              | `next-themes` (dark/light)                  |
| Notifications        | `sonner`                                    |
| Charts               | `recharts`                                  |
| Date / calendar      | `date-fns`, `react-day-picker`              |
| Icons                | `lucide-react`                              |

---

## 3. Database Schema

Defined in `server/database/create.sql`. Tables:

| Table             | Purpose                                                              |
|-------------------|----------------------------------------------------------------------|
| `users`           | Accounts. Fields: `id`, `name`, `email` (unique), `password`, `role` (`USER` / `ADMIN`), `avatar`, `publicId` (Cloudinary), timestamps. |
| `projects`        | Projects owned by a user. Fields: `id`, `title`, `description`, `ownerId` → users, `status` (`ACTIVE` / `INACTIVE`). |
| `project_members` | Join table: which users belong to which projects with role `OWNER` / `ADMIN` / `MEMBER`. Unique `(projectId, userId)`. |
| `tasks`           | Tasks scoped to a project. Fields: `id`, `title`, `description`, `status` (`TODO`/`IN_PROGRESS`/`IN_REVIEW`/`DONE`), `priority` (`LOW`/`MEDIUM`/`HIGH`/`URGENT`), `deadline`, `projectId`, `assigneeId`, `creatorId`. |

All data access is funneled through **stored procedures** (called from `server/src/config/callProcedure.js`), defined in:

- `database/users.sql` — `sp_CreateUser`, `sp_GetUserById`, `sp_GetUserByEmail`, `sp_GetAllUsers`, `sp_UpdateUser`, `sp_DeleteUser`, `sp_SearchUser`, `sp_GetUserCount`, `sp_GetUsersByRole`, `sp_CheckUserExists`
- `database/project.sql` — `sp_CreateProject`, `sp_GetAllProjects`, `sp_GetProjectsByOwner`, `sp_GetProjectsByMember`, `sp_GetProjectById`, `sp_UpdateProject`, `sp_DeleteProject`, `sp_AddProjectMember`, `sp_GetProjectMembers`, `sp_UpdateMemberRole`, `sp_RemoveProjectMember`, `sp_GetMemberRole`, `sp_GetFullProjectDetails`
- `database/tasks.sql` — `sp_CreateTask`, `sp_GetTasksByProject`, `sp_GetTasksByAssignee`, `sp_GetTaskById`, `sp_UpdateTask`, `sp_DeleteTask`, `sp_GetOverdueTasks`

---

## 4. Backend Architecture

Layout under `server/src/`:

```
src/
├── app.js                 → Express app (helmet, cors, json, swagger, routes, error handler)
├── routes.js              → Mounts /auth, /users, /projects, /tasks under /api
├── config/
│   ├── env.js             → Loads + validates required env vars
│   ├── db.js              → MySQL pool (connectionLimit: 10)
│   ├── callProcedure.js   → Helper to invoke stored procedures
│   ├── cloudinary.js      → Cloudinary SDK init
│   ├── mailer.js          → Nodemailer transporter
│   └── swagger.js         → OpenAPI 3.0 spec generation
├── routes/                → auth | user | project | task route definitions
├── controllers/           → Thin controllers calling model methods
├── models/                → Business logic + SP invocation
├── middlewares/
│   ├── auth.middleware.js     → `protect` (JWT), `restrictTo(...roles)`
│   ├── validate.middleware.js → Zod schema validator
│   ├── upload.middleware.js   → Multer config for avatar upload
│   └── error.middleware.js    → Global error handler + `AppError`
├── schema/                → Zod request schemas + Swagger schemas
├── docs/                  → JSDoc-style Swagger annotations
├── services/email.service.js  → sendWelcomeEmail, sendPasswordResetEmail
├── templates/emails/      → welcome.js, passwordReset.js
└── utils/                 → sendEmail, uploadToCloudinary, requireRole
```

### REST API surface

Base URL: `http://localhost:5000/api`

#### Auth (`/auth`)
| Method | Path        | Description                              |
|--------|-------------|------------------------------------------|
| POST   | `/register` | Create user, send welcome email, return JWT |
| POST   | `/login`    | Validate credentials, return JWT         |

#### Users (`/users`) — JWT required
| Method | Path        | Access  | Description                       |
|--------|-------------|---------|-----------------------------------|
| GET    | `/`         | ADMIN   | List all users                    |
| GET    | `/profile`  | Self    | Get logged-in user profile        |
| PUT    | `/profile`  | Self    | Update profile + avatar (multipart) |
| GET    | `/:id`      | Auth    | Get user by id                    |
| DELETE | `/:id`      | (open)  | Delete user                       |

#### Projects (`/projects`) — JWT required
| Method | Path                                  | Access | Description                  |
|--------|---------------------------------------|--------|------------------------------|
| GET    | `/`                                   | ADMIN  | All projects                 |
| GET    | `/my`                                 | Auth   | Projects I'm a member of     |
| GET    | `/owner/:ownerId`                     | ADMIN  | Projects by owner            |
| POST   | `/create`                             | ADMIN  | Create project               |
| GET    | `/:projectId`                         | Auth   | Project details + members + tasks |
| PUT    | `/:projectId`                         | Auth   | Update project               |
| DELETE | `/:projectId`                         | Auth   | Delete project               |
| GET    | `/:projectId/members`                 | Auth   | List members                 |
| POST   | `/:projectId/add-member`              | ADMIN  | Add member                   |
| PATCH  | `/:projectId/member/:userId`          | Auth   | Update member role           |
| DELETE | `/:projectId/member/:userId`          | Auth   | Remove member                |

#### Tasks (`/tasks`) — JWT required
| Method | Path                       | Description                                  |
|--------|----------------------------|----------------------------------------------|
| POST   | `/`                        | Create task in a project                     |
| GET    | `/my`                      | Tasks assigned to me                         |
| GET    | `/overdue`                 | My overdue tasks                             |
| GET    | `/project/:projectId`      | Tasks for a project (optional `?status=`)    |
| GET    | `/:taskId`                 | Single task                                  |
| PUT    | `/:taskId`                 | Update task                                  |
| DELETE | `/:taskId`                 | Delete task                                  |

### Required environment variables (`server/.env`)
`PORT`, `NODE_ENV`, `CLIENT_URL`, `DATABASE_URL`, `DATABASE_NAME`, `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`.

---

## 5. Frontend Architecture

Layout under `client/src/`:

```
src/
├── main.jsx                 → React root
├── App.jsx                  → createBrowserRouter route tree
├── index.css                → Tailwind base + theme tokens
├── app/
│   ├── store.js             → Redux store (baseApi + auth slice)
│   └── baseApi.js           → RTK Query base with axios baseQuery, tags: User/Project/Task
├── lib/
│   ├── axios.js             → Axios instance (interceptors, baseURL)
│   ├── utils.js             → `cn` (clsx + tailwind-merge)
│   └── icons/               → Centralized lucide-react icon maps
├── providers/
│   ├── AppProviders.jsx     → Wraps Redux + Theme + Router
│   └── ThemeProvider.jsx    → next-themes wrapper
├── components/
│   ├── layouts/
│   │   ├── app/             → AppLayout, Sidebar, Topbar (authenticated)
│   │   └── guest/           → GuestLayout, Header, Footer (public)
│   ├── routes/
│   │   ├── ProtectedRoute.jsx → Requires auth
│   │   └── GuestRoute.jsx     → Redirects authed users to /dashboard
│   └── ui/                  → shadcn primitives (button, card, dialog, …)
├── features/                → Feature-sliced modules
│   ├── auth/                → LoginPage, RegisterPage, slice, api
│   ├── users/               → ProfilePage, SettingPage, UserDashboard, UserCalendar
│   ├── project/             → ProjectPage, ProjectList, CreateProjectDialog
│   ├── tasks/               → MyTask, TaskList, TaskFilters, TaskHeader
│   └── guest/               → Home, About, Contact, ErrorPage
├── schemas/                 → Zod schemas (auth, user, contact)
├── hooks/                   → useAuth, use-mobile
├── helper/                  → ThemeToggle
└── constant/index.jsx       → FEATURES, STATS, NAV_ITEMS, PAGE_TITLES, INFO_CARDS
```

### Route map

| Route          | Guard            | Page                |
|----------------|------------------|---------------------|
| `/`            | Guest layout     | `Home`              |
| `/about`       | Guest layout     | `About`             |
| `/contact`     | Guest layout     | `Contact`           |
| `/login`       | Guest only       | `LoginPage`         |
| `/register`    | Guest only       | `RegisterPage`      |
| `/dashboard`   | Protected        | `UserDashboard` *(placeholder)* |
| `/profile`     | Protected        | `ProfilePage`       |
| `/settings`    | Protected        | `SettingPage` *(placeholder)* |
| `/calendar`    | Protected        | `UserCalendar` *(placeholder)* |
| `/projects`    | Protected        | `ProjectPage`       |
| `/tasks`       | Protected        | `MyTask`            |
| `*`            | —                | `ErrorPage`         |

### State / data flow

- **`auth` slice** persists JWT to `localStorage`, exposes `setCredentials`, `setUser`, `logout`.
- **RTK Query** endpoints inject into `baseApi` per feature:
  - `auth.api.js` → `register`, `login`, `getProfile`
  - `user.api.js` → `getProfile`, `updateProfile`
  - `project.api.js` → `getMyProjects`, `getProjectDetails`, `createProject`, `updateProject`, `deleteProject`, `getProjectMembers`, `addProjectMember`
  - `task.api.js` → `getMyTasks`, `getTasksByProject`, `getTaskById`, `createTask`, `updateTask`, `deleteTask`, `getOverdueTasks`
- `AppLayout` triggers `useGetProfileQuery()` once on mount to hydrate Redux with the user.

---

## 6. Current Implementation Status

### Implemented (working end-to-end)

**Auth**
- [x] User registration with bcrypt password hashing, duplicate-email check via SP
- [x] Login → JWT issuance (configurable `JWT_EXPIRES_IN`)
- [x] `protect` middleware verifies JWT and loads user
- [x] `restrictTo("ADMIN")` role guard
- [x] Welcome email on signup (Nodemailer + HTML template)
- [x] Password reset email template (template exists, route not yet wired)

**Users**
- [x] Get / update own profile (incl. avatar upload to Cloudinary)
- [x] Admin: list all users, search, count, by-role
- [x] Profile page UI with avatar, role badge, project/task counts

**Projects**
- [x] CRUD with stored procedures
- [x] Auto-add owner as `OWNER` member on creation
- [x] Add / remove / update-role for members
- [x] "My projects" list view with member & task counts
- [x] Full project details query (project + members + tasks in one call)
- [x] `ProjectPage` with list, header, create dialog

**Tasks**
- [x] CRUD with stored procedures
- [x] Status (`TODO`/`IN_PROGRESS`/`IN_REVIEW`/`DONE`) + Priority (`LOW`/`MEDIUM`/`HIGH`/`URGENT`)
- [x] Assignee + creator tracking
- [x] Overdue tasks query
- [x] "My tasks" page with client-side status filter
- [x] Task list cards with status/priority badges + deadlines

**Infra / DX**
- [x] Helmet + CORS configured for client origin
- [x] Global error handler (`AppError` + `globalErrorHandler`)
- [x] Zod request validation middleware
- [x] Swagger UI at `/api/docs`
- [x] MySQL connection pool with startup health check
- [x] Env validation at boot
- [x] Vite + React Compiler + Tailwind v4 + shadcn

### Partially implemented / placeholders

- [ ] `UserDashboard` — placeholder (returns `<div>UserDashboard</div>`)
- [ ] `UserCalendar` — placeholder
- [ ] `SettingPage` — placeholder
- [ ] Project detail route (`/projects/:id`) — `ProjectList` links to it but no route exists in `App.jsx`
- [ ] Task detail / edit UI — backend supports it, no frontend page
- [ ] Password reset flow — template ready, no controller/route/UI
- [ ] Refresh tokens / token rotation — only single access token today
- [ ] Recent layout refactor in progress (`git status` shows new `layouts/app/`, `layouts/guest/` replacing older flat files)

---

## 7. Future / Planned Implementation

Based on UI scaffolding, marketing copy on `Home`, and SPs already in the database, the following are intended next:

### Near-term
1. **Build out the Dashboard** — leverage `recharts`, surface counts (projects, tasks, overdue), recent activity, upcoming deadlines.
2. **Project detail page** at `/projects/:projectId` consuming `useGetProjectDetailsQuery` — members list, task board grouped by status (Kanban), add/remove members UI.
3. **Task detail dialog / page** with edit form (status, priority, assignee dropdown, deadline picker via `react-day-picker`).
4. **Calendar view** that maps tasks with `deadline` onto a month grid (`react-day-picker` already installed).
5. **Settings page** — theme toggle, notification preferences, password change.
6. **Password reset flow** — request endpoint, `sendPasswordResetEmail` wired, token verification SP, reset UI.

### Mid-term
7. **Task search & advanced filters** — by priority, assignee, deadline range.
8. **Project status toggle** (`ACTIVE` / `INACTIVE`) from UI.
9. **Member role management UI** (update OWNER/ADMIN/MEMBER) — backend ready.
10. **Notifications** — email on task assignment / deadline approaching (extend `email.service.js`).
11. **Time tracking** — `Home` markets this; would require a new `task_time_entries` table + SPs.
12. **Analytics page** — productivity trends (also marketed on Home).

### Long-term / nice-to-have
13. **Real-time collaboration** (Socket.IO) — live task moves, presence indicators.
14. **Comments / activity log** on tasks.
15. **File attachments** on tasks (Cloudinary already wired for avatars).
16. **Refresh tokens + httpOnly cookies** instead of JWT in `localStorage`.
17. **Audit log table** for admin actions.
18. **Rate limiting** (`express-rate-limit`) on auth endpoints.
19. **Test suite** — neither client nor server has tests yet.
20. **CI / deployment pipelines** — no workflow files present.

---

## 8. Running the Project Locally

```bash
# 1. Database
mysql -u root -p < server/database/create.sql
mysql -u root -p <db_name> < server/database/users.sql
mysql -u root -p <db_name> < server/database/project.sql
mysql -u root -p <db_name> < server/database/tasks.sql

# 2. Backend
cd server
cp .env.example .env   # then fill in credentials
npm install
npm run dev            # http://localhost:5000 (Swagger: /api/docs)

# 3. Frontend
cd client
cp .env.example .env
npm install
npm run dev            # http://localhost:5173
```

---

## 9. Conventions & Notes

- **All DB writes go through stored procedures.** When adding a feature, add the SP first (`server/database/*.sql`), then expose via `callProcedure`.
- **Feature-sliced frontend**: each feature owns its `*.api.js`, `*.slice.js` (if needed), `pages/`, `components/`.
- **Path alias**: `@/*` → `client/src/*` (configured in `jsconfig.json` + Vite).
- **Static routes before dynamic** — see `user.routes.js` (`/profile` before `/:id`).
- **Auth header**: `Authorization: Bearer <jwt>`; token currently lives in `localStorage` (`token` key).
