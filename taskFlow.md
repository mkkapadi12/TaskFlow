# TaskFlow

A full-stack task and project management platform that lets teams organize projects, assign tasks, manage members, upload project documents, and track progress with role-based access control.

> **Tagline:** *Organize your work. Empower your life.*

---

## 1. Project Overview

TaskFlow is a productivity workspace where users can:

- Sign up / log in with JWT-based authentication
- Recover access via a password-reset email link and change their password from settings
- Manage their personal profile and avatar (Cloudinary-hosted)
- Create projects (admin) and invite members with project-scoped roles
- Create, assign, prioritize, and track tasks within projects
- Upload and manage project documents (PDF, Office, images, plain text) up to 20 MB
- View overdue tasks and personal task lists across all projects
- Receive welcome / password-reset / member-added / member-removed emails via SMTP,
  gated by per-user notification preferences
- Use the guest pages in English, Hindi, or Gujarati (i18next)

The project is split into two cleanly separated apps:

```
TaskFlow/
├── client/      → React 19 + Vite frontend
├── server/      → Express 5 + MySQL backend
├── CLAUDE.md
├── README.md
└── taskFlow.md  (this file — canonical architecture doc)
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
| File uploads         | `multer` (memory storage) + Cloudinary      |
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
| Internationalization | `i18next` + `react-i18next` + `i18next-browser-languagedetector` |
| Notifications        | `sonner`                                    |
| Charts               | `recharts`                                  |
| Date / calendar      | `date-fns`, `react-day-picker`              |
| Icons                | `lucide-react`                              |

The Vite dev server binds to `0.0.0.0:5173` so the app is reachable from any device on the LAN (useful for mobile testing). Vite proxies `/api` → `VITE_API_URL`.

---

## 3. Database Schema

Defined in `server/database/create.sql`. Tables:

| Table                   | Purpose                                                              |
|-------------------------|----------------------------------------------------------------------|
| `users`                 | Accounts. Fields: `id`, `name`, `email` (unique), `password`, `role` (`USER` / `ADMIN`), `avatar`, `publicId` (Cloudinary), `phone`, timestamps. |
| `projects`              | Projects owned by a user. Fields: `id`, `title`, `description`, `ownerId` → users, `status` (`ACTIVE` / `INACTIVE`). |
| `project_members`       | Join table: which users belong to which projects with role `OWNER` / `ADMIN` / `MEMBER`. Unique `(projectId, userId)`. |
| `tasks`                 | Tasks scoped to a project. Fields: `id`, `title`, `description`, `status` (`TODO`/`IN_PROGRESS`/`IN_REVIEW`/`DONE`), `priority` (`LOW`/`MEDIUM`/`HIGH`/`URGENT`), `deadline`, `projectId`, `assigneeId`, `creatorId`. |
| `notification_settings` | Per-user email preference toggles. Fields: `userId` (unique), `welcome`, `passwordReset`, `memberAdded`, `memberRemoved` (all `TINYINT(1)`, default 1). |
| `project_documents`     | Per-project file metadata. Fields: `id`, `projectId`, `uploadedBy`, `name`, `url`, `publicId`, `size`, `mimeType`, `createdAt`. Actual files live on Cloudinary. |

All data access is funneled through **stored procedures** (called from `server/src/config/callProcedure.js`), organized per domain:

- `database/users.sql` — `sp_CreateUser`, `sp_GetUserById`, `sp_GetUserByEmail`, `sp_GetAllUsers`, `sp_UpdateUser`, `sp_DeleteUser`, `sp_SearchUser`, `sp_GetUserCount`, `sp_GetUsersByRole`, `sp_CheckUserExists`, `sp_UpdatePassword`, `sp_ChangePassword`
- `database/project.sql` — `sp_CreateProject`, `sp_GetAllProjects`, `sp_GetProjectsByOwner`, `sp_GetProjectsByMember`, `sp_GetProjectById`, `sp_UpdateProject`, `sp_DeleteProject`, `sp_AddProjectMember`, `sp_GetProjectMembers`, `sp_UpdateMemberRole`, `sp_RemoveProjectMember`, `sp_GetMemberRole`, `sp_GetFullProjectDetails`
- `database/tasks.sql` — `sp_CreateTask`, `sp_GetTasksByProject`, `sp_GetTasksByAssignee`, `sp_GetTaskById`, `sp_UpdateTask`, `sp_DeleteTask`, `sp_GetOverdueTasks`, `sp_VerifyTask` (owner-only `IN_REVIEW` → `DONE` / `IN_PROGRESS` transition, SIGNALs 45000 if precondition fails)
- `database/notification.sql` — `sp_GetNotificationSettings` (returns a virtual default row when no record exists yet), `sp_UpdateNotificationSettings` (upsert)
- `database/project_docs.sql` — `sp_CreateProjectDocument`, `sp_GetProjectDocuments`, `sp_GetProjectDocumentById`, `sp_DeleteProjectDocument`
- `database/call.sql` — ad-hoc invocation scratch (not part of bootstrap)

---

## 4. Backend Architecture

Layout under `server/src/`:

```
src/
├── app.js                     → Express app (helmet, cors, json, swagger, routes, error handler)
├── routes.js                  → Mounts /auth, /users, /projects, /tasks,
│                                /notifications/settings, /projects/:projectId/documents under /api
├── config/
│   ├── env.js                 → Loads + validates required env vars
│   ├── db.js                  → MySQL pool (connectionLimit: 10)
│   ├── callProcedure.js       → Helper to invoke stored procedures
│   ├── cloudinary.js          → Cloudinary SDK init
│   ├── mailer.js              → Nodemailer transporter
│   └── swagger.js             → OpenAPI 3.0 spec generation
├── routes/                    → auth | user | project | task | notification | document
├── controllers/               → Thin controllers calling model methods
├── models/                    → Business logic + SP invocation (auth, user, project, task, document)
├── middlewares/
│   ├── auth.middleware.js     → `protect` (JWT), `restrictTo(...roles)`
│   ├── validate.middleware.js → Zod schema validator
│   ├── upload.middleware.js   → Multer: default `upload` for avatars (5 MB image)
│   │                            and named export `uploadDoc` for documents (20 MB, doc/office/image)
│   └── error.middleware.js    → Global error handler + `AppError`
├── schema/                    → Zod request schemas + Swagger components
├── docs/                      → JSDoc-style Swagger annotations per domain
├── services/
│   ├── email.service.js       → sendWelcomeEmail, sendPasswordResetEmail,
│   │                            sendProjectMemberAddedEmail, sendProjectMemberRemovedEmail
│   │                            (each gated by getNotificationSettings)
│   └── notification.service.js → getNotificationSettings / updateNotificationSettings
├── templates/emails/          → welcome.js, passwordReset.js, addMember.js, removeMember.js
└── utils/                     → sendEmail, uploadToCloudinary (image + raw doc), requireRole
```

### Authorization tiers

Project-scoped permission checks live in `server/src/utils/requireRole.js` and are invoked from the **model layer**:

- `requireMembership(projectId, userId)` — any role (`OWNER` / `ADMIN` / `MEMBER`). Used for reads and for users moving their own task status.
- `requireManager(projectId, userId)` — `OWNER` or `ADMIN`. Used to gate task create/edit and document upload/delete.
- `requireOwner(projectId, userId)` — `OWNER` only. Used for member management and task verification.

Global role (`users.role`) is gated separately at the route via `restrictTo("ADMIN")`.

### REST API surface

Base URL: `http://localhost:5000/api`

#### Auth (`/auth`)
| Method | Path                | Description                                                |
|--------|---------------------|------------------------------------------------------------|
| POST   | `/register`         | Create user, send welcome email (if opted in), return JWT  |
| POST   | `/login`            | Validate credentials, return JWT                           |
| POST   | `/forgot-password`  | Email a 15-minute reset link (in dev, returns the link in `data`) |
| POST   | `/reset-password`   | Body `{ token, password }`. Verify JWT, hash new password  |
| POST   | `/change-password`  | Auth required. Body `{ currentPassword, newPassword, confirmPassword }` |

#### Users (`/users`) — JWT required
| Method | Path        | Access  | Description                       |
|--------|-------------|---------|-----------------------------------|
| GET    | `/`         | ADMIN   | List all users                    |
| GET    | `/profile`  | Self    | Get logged-in user profile        |
| PUT    | `/profile`  | Self    | Update profile + avatar (multipart, field `avatar`) |
| GET    | `/:id`      | Auth    | Get user by id                    |
| DELETE | `/:id`      | (open)  | Delete user                       |

#### Projects (`/projects`) — JWT required
| Method | Path                                  | Access | Description                  |
|--------|---------------------------------------|--------|------------------------------|
| GET    | `/`                                   | ADMIN  | All projects                 |
| GET    | `/my`                                 | Auth   | Projects I'm a member of     |
| GET    | `/owner/:ownerId`                     | ADMIN  | Projects by owner            |
| POST   | `/create`                             | ADMIN  | Create project               |
| GET    | `/:projectId`                         | Auth   | Project details + members + tasks (multi-resultset SP) |
| PUT    | `/:projectId`                         | Auth   | Update project               |
| DELETE | `/:projectId`                         | Auth   | Delete project               |
| GET    | `/:projectId/members`                 | Auth   | List members                 |
| POST   | `/:projectId/add-member`              | ADMIN  | Add member (triggers `memberAdded` email) |
| PATCH  | `/:projectId/member/:userId`          | Auth   | Update member role           |
| DELETE | `/:projectId/member/:userId`          | Auth   | Remove member. Body `{ reason }` is forwarded to the `memberRemoved` email template. |

#### Tasks (`/tasks`) — JWT required
| Method | Path                       | Access            | Description                                  |
|--------|----------------------------|-------------------|----------------------------------------------|
| POST   | `/`                        | OWNER / ADMIN     | Create task and (optionally) assign to a project member |
| GET    | `/my`                      | Self              | Tasks assigned to me                         |
| GET    | `/overdue`                 | Self              | My overdue tasks                             |
| GET    | `/project/:projectId`      | Project member    | Tasks for a project (optional `?status=`)    |
| GET    | `/:taskId`                 | Project member    | Single task                                  |
| PUT    | `/:taskId`                 | OWNER / ADMIN     | Update task fields (title/desc/priority/deadline/assignee). **Status is ignored.** |
| PATCH  | `/:taskId/status`          | Assignee or OWNER / ADMIN | Move `TODO ↔ IN_PROGRESS ↔ IN_REVIEW`. **Cannot set `DONE`.** |
| PATCH  | `/:taskId/verify`          | OWNER             | Body `{ approve: bool }`. Approve → `DONE`, reject → `IN_PROGRESS`. Requires current status `IN_REVIEW`. |
| DELETE | `/:taskId`                 | Creator or OWNER  | Delete task                                  |

#### Notifications (`/notifications/settings`) — JWT required
| Method | Path | Description                                                                |
|--------|------|----------------------------------------------------------------------------|
| GET    | `/`  | Return the user's email preference toggles (defaults to all-enabled if no row yet) |
| PATCH  | `/`  | Body of any subset of `{ welcome, passwordReset, memberAdded, memberRemoved }`. Each field accepts `0`/`1` and is partial-update via SP. |

#### Project Documents (`/projects/:projectId/documents`) — JWT required, nested router with `mergeParams`
| Method | Path                | Access                  | Description                                                  |
|--------|---------------------|-------------------------|--------------------------------------------------------------|
| GET    | `/`                 | Project member          | List all documents on the project (newest first), with uploader info |
| POST   | `/`                 | OWNER / ADMIN           | Multipart upload, field `documents`, up to 5 files × 20 MB. Streams each buffer to Cloudinary as `resource_type: raw` and persists metadata via `sp_CreateProjectDocument`. |
| DELETE | `/:documentId`      | OWNER / ADMIN (of project that owns the doc) | Deletes from Cloudinary first, then drops the DB row. |

### Required environment variables (`server/.env`)
`PORT`, `NODE_ENV`, `CLIENT_URL`, `DATABASE_URL`, `DATABASE_NAME`, `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`.

`env.js` boot-checks `DATABASE_URL`, `DATABASE_NAME`, `JWT_SECRET`, and the Cloudinary keys; the process exits if any are missing.

### Email delivery and notification gating

`services/email.service.js` exposes four senders, and each one first calls `getNotificationSettings(userId)` and short-circuits if the user has opted out of that category:

| Sender                              | Toggle key       | Trigger                                  |
|-------------------------------------|------------------|------------------------------------------|
| `sendWelcomeEmail`                  | `welcome`        | After successful registration            |
| `sendPasswordResetEmail`            | `passwordReset`  | After `/auth/forgot-password`            |
| `sendProjectMemberAddedEmail`       | `memberAdded`    | After a member is added to a project     |
| `sendProjectMemberRemovedEmail`     | `memberRemoved`  | After a member is removed (includes optional `reason`) |

A `null`/missing `userId` is treated as a system email and always sends.

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
│   └── baseApi.js           → RTK Query base with axios baseQuery.
│                              tagTypes: User / Project / Task / NotificationSettings / Document
├── lib/
│   ├── axios.js             → Axios instance (interceptors, baseURL "/api", 401 → logout,
│   │                          strips JSON Content-Type for FormData)
│   ├── utils.js             → `cn` (clsx + tailwind-merge)
│   └── icons/               → Centralized lucide-react icon maps
├── i18n/
│   ├── index.js             → i18next init: detector → localStorage → navigator
│   ├── languages.js         → LANGUAGES list (en / hi / gu) with flag + native name
│   └── locales/{en,hi,gu}/  → Namespace JSON: common, home, about, contact, docs, error
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
│   ├── auth/                → LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage,
│   │                          slice + api (register, login, getProfile, forgot/reset/change password)
│   ├── users/               → ProfilePage, SettingPage, UserDashboard, UserCalendar
│   ├── project/             → Projects (list), ProjectDetails, CreateProjectDialog
│   ├── tasks/               → MyTask, TaskList, TaskFilters, TaskHeader, dialogs
│   ├── documents/           → DocumentList, DocumentUploader, document.api.js
│   ├── notifications/       → notification.api.js (UI consumed inside SettingPage)
│   ├── admin/               → (placeholder folder, reserved for future admin tooling)
│   └── guest/               → Home, About, Contact, Docs, ErrorPage
├── skeleton/                → Loading skeletons (e.g. ProjectDetalsSkeleton)
├── schemas/                 → Zod schemas (auth, user, contact)
├── hooks/                   → useAuth, use-mobile
├── helper/                  → ThemeToggle
└── constant/index.jsx       → FEATURES, STATS, NAV_ITEMS, PAGE_TITLES, INFO_CARDS
```

### Route map

| Route                       | Guard            | Page                |
|-----------------------------|------------------|---------------------|
| `/`                         | Guest layout     | `Home`              |
| `/about`                    | Guest layout     | `About`             |
| `/contact`                  | Guest layout     | `Contact`           |
| `/docs`                     | Guest layout     | `Docs`              |
| `/login`                    | Guest only       | `LoginPage`         |
| `/register`                 | Guest only       | `RegisterPage`      |
| `/forgot-password`          | Public (no guard)| `ForgotPasswordPage`|
| `/reset-password`           | Public (no guard)| `ResetPasswordPage` (reads `?token=`) |
| `/dashboard`                | Protected        | `UserDashboard`     |
| `/profile`                  | Protected        | `ProfilePage`       |
| `/settings`                 | Protected        | `SettingPage`       |
| `/calendar`                 | Protected        | `UserCalendar`      |
| `/projects`                 | Protected        | `Projects`          |
| `/projects/:projectId`      | Protected        | `ProjectDetails` (tabs: overview, tasks, members, documents) |
| `/tasks`                    | Protected        | `MyTask`            |
| `*`                         | —                | `ErrorPage`         |

### State / data flow

- **`auth` slice** persists JWT to `localStorage`, exposes `setCredentials`, `setUser`, `logout`. On 401 from any request, the axios interceptor dispatches `logout()` automatically.
- **RTK Query** endpoints inject into `baseApi` per feature — there is no central endpoints file:
  - `auth.api.js` → `register`, `login`, `getProfile`, `forgotPassword`, `resetPassword`, `changePassword`
  - `user.api.js` → `getProfile`, `updateProfile`
  - `project.api.js` → `getMyProjects`, `getProjectDetails`, `createProject`, `updateProject`, `deleteProject`, `getProjectMembers`, `addProjectMember`, `updateMemberRole`, `removeProjectMember`
  - `task.api.js` → `getMyTasks`, `getTasksByProject`, `getTaskById`, `createTask`, `updateTask`, `updateTaskStatus`, `verifyTask`, `deleteTask`, `getOverdueTasks`
  - `document.api.js` → `getDocuments`, `uploadDocuments` (FormData), `deleteDocument`
  - `notification.api.js` → `getNotificationSettings`, `updateNotificationSettings`
- `AppLayout` triggers `useGetProfileQuery()` once on mount to hydrate Redux with the user.

### Internationalization

`i18next` is initialized in [`src/i18n/index.js`](client/src/i18n/index.js) with three locales — English (`en`), Hindi (`hi`), Gujarati (`gu`) — and six namespaces per locale: `common`, `home`, `about`, `contact`, `docs`, `error`. Detection order is `localStorage` (key `language`) → browser. Fallback is `en`. Guest-facing pages are localized; the authed app currently uses English copy. Add new strings to the existing namespace JSON files before introducing new ones.

---

## 6. Current Implementation Status

### Implemented (working end-to-end)

**Auth**
- [x] User registration with bcrypt password hashing, duplicate-email check via SP
- [x] Login → JWT issuance (configurable `JWT_EXPIRES_IN`)
- [x] `protect` middleware verifies JWT and loads user
- [x] `restrictTo("ADMIN")` global-role guard
- [x] **Forgot-password** — emails a 15-minute JWT reset link; in dev, the link is also returned in the response body for testing
- [x] **Reset-password** — `/reset-password?token=...` page verifies token and updates the password
- [x] **Change-password** from settings with current-password verification
- [x] Welcome email on signup (Nodemailer + HTML template), gated by `welcome` toggle

**Users**
- [x] Get / update own profile (name + phone + avatar)
- [x] Avatar upload to Cloudinary (5 MB image limit, jpeg/png/webp)
- [x] Admin: list all users, search, count, by-role
- [x] Profile page UI with avatar, role badge, project/task counts
- [x] Settings page (theme toggle, language switcher, password change, notification preferences)

**Projects**
- [x] CRUD with stored procedures
- [x] Auto-add owner as `OWNER` member on creation
- [x] Add / remove / update-role for members
- [x] "My projects" list view with member & task counts
- [x] Full project details query (project + members + tasks in one multi-resultset call)
- [x] `Projects` and `ProjectDetails` pages with header, create dialog, members panel
- [x] Member added / removed emails (gated by `memberAdded` / `memberRemoved` toggles); removal supports a `reason` body field forwarded to the email template

**Tasks**
- [x] CRUD with stored procedures
- [x] Status (`TODO`/`IN_PROGRESS`/`IN_REVIEW`/`DONE`) + Priority (`LOW`/`MEDIUM`/`HIGH`/`URGENT`)
- [x] Assignee + creator tracking
- [x] Overdue tasks query
- [x] "My tasks" page with client-side status filter + search
- [x] Task list cards with status/priority badges + deadlines
- [x] Create / edit tasks restricted to project OWNER/ADMIN; assignee must be a project member
- [x] Verify workflow: assignee moves task to `IN_REVIEW`; OWNER approves (→ `DONE`) or sends back (→ `IN_PROGRESS`) via `sp_VerifyTask`
- [x] Task UI inside `ProjectDetails`: tasks list, "Needs verification" pill for owners on `IN_REVIEW` tasks, `CreateTaskDialog`, `TaskDetailDialog` with role-aware controls

**Documents**
- [x] Per-project document upload (multer memory storage → Cloudinary `resource_type: raw`)
- [x] Up to 5 files per request, 20 MB each; PDF / Word / Excel / PowerPoint / Markdown / plain text / images allowed
- [x] Document list with uploader, size, mime type; alert-dialog confirm before delete
- [x] Manager-only (OWNER/ADMIN) upload and delete; any project member can list

**Notifications**
- [x] Per-user toggles for welcome / password-reset / member-added / member-removed
- [x] SP returns a virtual default row (all enabled) if the user has never saved settings — no FK insert side-effects
- [x] Partial PATCH semantics (`null` fields preserve existing values)

**Internationalization**
- [x] English / Hindi / Gujarati locales for guest-facing pages with `i18next` + browser detector
- [x] Language preference persisted to `localStorage`

**Infra / DX**
- [x] Helmet + CORS configured for `CLIENT_URL`
- [x] Global error handler (`AppError` + `globalErrorHandler`) maps `SIGNAL 45000` → 400 and `ER_DUP_ENTRY` → 409
- [x] Zod request validation middleware (replaces `req.body` with parsed/coerced data)
- [x] Swagger UI at `/api/docs`
- [x] MySQL connection pool with startup health check
- [x] Env validation at boot
- [x] Vite + React Compiler + Tailwind v4 + shadcn
- [x] Vite dev server on `0.0.0.0` for LAN access (mobile testing)

### Partially implemented / placeholders

- [ ] `UserDashboard` — basic page exists; richer analytics (Recharts pie, upcoming-deadlines feed) is partial
- [ ] `UserCalendar` — placeholder, no task-deadline overlay yet
- [ ] `admin/` feature folder — reserved for future admin tooling, currently empty
- [ ] i18n for authed pages — only guest pages have translations today

---

## 7. Future / Planned Implementation

### Near-term
1. **Kanban board** on the project detail page — group tasks by status, drag/drop status changes (still subject to the verify rules: assignee may not drop into `DONE`).
2. **Calendar view** that maps tasks with `deadline` onto a month grid (`react-day-picker` already installed).
3. **Dashboard charts** — surface project / task / overdue counts and trend charts via Recharts.
4. **Task search & advanced filters** — by priority, assignee, deadline range.
5. **Project status toggle** (`ACTIVE` / `INACTIVE`) from the UI.
6. **Member role management UI** — backend ready; needs the visual control on members panel.

### Mid-term
7. **Task comments & activity log** — threaded discussion per task.
8. **Deadline reminder emails** — notify assignees before tasks become overdue (extend `email.service.js`).
9. **Task file attachments** — reuse the Cloudinary raw-upload path from documents.
10. **Time tracking** — `Home` markets this; would require a `task_time_entries` table + SPs.
11. **Analytics page** — productivity trends, completion rates, team performance.
12. **i18n coverage** for authed pages (currently only guest pages are translated).

### Long-term / nice-to-have
13. **Real-time collaboration** (Socket.IO) — live task moves, presence indicators.
14. **Refresh tokens + httpOnly cookies** instead of JWT in `localStorage`.
15. **Audit log table** for admin actions.
16. **Rate limiting** (`express-rate-limit`) on auth endpoints.
17. **Test suite** — neither client nor server has tests yet.
18. **CI / deployment pipelines** — no workflow files present.

---

## 8. Running the Project Locally

```bash
# 1. Database (run in order)
mysql -u root -p < server/database/create.sql
mysql -u root -p <db_name> < server/database/users.sql
mysql -u root -p <db_name> < server/database/project.sql
mysql -u root -p <db_name> < server/database/tasks.sql
mysql -u root -p <db_name> < server/database/notification.sql
mysql -u root -p <db_name> < server/database/project_docs.sql

# 2. Backend
cd server
cp .env.example .env   # then fill in credentials
npm install
npm run dev            # http://localhost:5000 (Swagger: /api/docs)

# 3. Frontend
cd client
cp .env.example .env
npm install
npm run dev            # http://localhost:5173 (also reachable on LAN IP:5173)
```

---

## 9. Conventions & Notes

- **All DB access goes through stored procedures.** When adding a feature, add the SP first (`server/database/*.sql`), then expose via `callProcedure` from a model method. Layer order: `routes → controllers → models → callProcedure → SP`.
- **Feature-sliced frontend**: each feature owns its `*.api.js`, `*.slice.js` (if needed), `pages/`, `components/`.
- **Path alias**: `@/*` → `client/src/*` (configured in `jsconfig.json` + `vite.config.js` — keep them in sync).
- **Static routes before dynamic** — see `user.routes.js` (`/profile` before `/:id`).
- **Auth header**: `Authorization: Bearer <jwt>`; token currently lives in `localStorage` under key `token`.
- **API response shape**: controllers return `{ success: boolean, message?: string, data?: any }`. Validation errors come back as `{ success: false, message, errors: [{ field, message }] }`.
- **`callProcedure` return shapes** — raw `mysql2` results, varies by SP:
  - Single-resultset SPs: `const [rows] = await callProcedure(...)` → `rows[0]` is the first row.
  - Multi-resultset SPs (e.g. `sp_GetFullProjectDetails`): destructure positionally — `const [projectRows, memberRows, taskRows] = await callProcedure(...)`.
- **Authorization tiers** (`server/src/utils/requireRole.js`):
  - `requireMembership` — any row in `project_members` (OWNER / ADMIN / MEMBER).
  - `requireManager` — `OWNER` or `ADMIN`. Used to gate task creation/edits and document upload/delete.
  - `requireOwner` — `OWNER` only. Used for member management and task verification.
- **Task workflow** (enforced in `server/src/models/task.model.js` and `sp_VerifyTask`):
  1. Owner/Admin creates a task and (optionally) assigns it to a project member.
  2. Assignee or any manager moves status through `TODO` → `IN_PROGRESS` → `IN_REVIEW` via `PATCH /tasks/:taskId/status`.
  3. Owner approves via `PATCH /tasks/:taskId/verify` with `{ approve: true }` (→ `DONE`) or rejects with `{ approve: false }` (→ `IN_PROGRESS`). The SP refuses if the task isn't currently `IN_REVIEW`.
  4. `DONE` is reachable **only** through the verify endpoint; the generic `PUT /tasks/:taskId` ignores any `status` field.
- **Email gating**: every sender in `email.service.js` calls `getNotificationSettings(userId)` first and short-circuits if the user has opted out — respect this when adding new email triggers.
- **Uploads**:
  - Avatars use the default `upload` (memory storage, 5 MB image filter) → `uploadToCloudinary` as an image.
  - Documents use the named `uploadDoc` (20 MB, broader mimetype allowlist) → `uploadDocToCloudinary` as `resource_type: raw`.
  - Axios strips the JSON `Content-Type` automatically when `config.data` is `FormData`, so callers don't need to set it.
