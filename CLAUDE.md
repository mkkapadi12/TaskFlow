# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Two independent apps, each with its own `package.json` and `node_modules`:

- `client/` — React 19 + Vite SPA (port 5173)
- `server/` — Express 5 + MySQL API (port 5000)

`taskFlow.md` at the repo root is the canonical product/architecture doc — read it for the full domain model, route map, and implementation status. No formal tests exist in either app.

## Commands

Run all commands from the relevant subdirectory (`client/` or `server/`). The repo root has no scripts.

```bash
# Server (server/)
bun run dev           # nodemon index.js — http://localhost:5000, Swagger at /api/docs
bun start             # node index.js (production)

# Client (client/)
bun run dev           # vite — http://localhost:5173
bun run build         # vite build
bun run lint          # eslint .
bun run preview       # vite preview
```

Database bootstrap (MySQL must be running locally):

```bash
mysql -u root -p < server/database/create.sql
mysql -u root -p <db_name> < server/database/users.sql
mysql -u root -p <db_name> < server/database/project.sql
mysql -u root -p <db_name> < server/database/tasks.sql
mysql -u root -p <db_name> < server/database/notification.sql
mysql -u root -p <db_name> < server/database/task_comments.sql
mysql -u root -p <db_name> < server/database/project_docs.sql
```

`server/database/call.sql` is a scratch file for ad-hoc SP invocation — not part of bootstrap.

`.env` files are required in both `client/` and `server/` (templates in `.env.example`). The server validates required env vars at boot in `server/src/config/env.js` and exits if any are missing (`DATABASE_URL`, `DATABASE_NAME`, `JWT_SECRET`, `CLOUDINARY_*`). The client needs `VITE_API_URL` — Vite proxies `/api` → `VITE_API_URL` in `vite.config.js`, so client code always calls `/api/...` regardless of where the server lives.

## Architecture

### Server: all DB access goes through stored procedures

There is no ORM and no inline SQL in JS. Every read and write goes through `callProcedure(name, params)` (`server/src/config/callProcedure.js`), which wraps `pool.query("CALL sp_X(?,?,...)", params)`. SP definitions live in `server/database/*.sql`:

- `users.sql`, `project.sql`, `tasks.sql` — one file per domain
- `create.sql` — table schema (users, projects, project_members, tasks)
- `call.sql` — ad-hoc invocation scratch

**When adding a feature, add the SP first**, then expose it via a model method. Layer order: `routes → controllers → models → callProcedure → SP`.

The return shape from `callProcedure` is the raw `mysql2` result and differs by SP:

- Single-resultset SPs: `const [rows] = await callProcedure(...)` then `rows[0]` is the first row.
- Multi-resultset SPs (e.g. `sp_GetFullProjectDetails` returns project + members + tasks): destructure positionally — `const [projectRows, memberRows, taskRows] = await callProcedure(...)`. See `ProjectModel.getProjectDetailsById` for the pattern.

SPs use `SIGNAL SQLSTATE '45000'` for business-rule errors; `globalErrorHandler` (`server/src/middlewares/error.middleware.js`) maps those to 400 with the SQL message, and maps other `ER_*` codes (e.g. `ER_DUP_ENTRY` → 409).

### Server: auth and authorization

- `protect` middleware (`auth.middleware.js`) verifies the `Authorization: Bearer <jwt>` header, calls `sp_GetUserById`, and attaches the full user to `req.user`.
- `restrictTo("ADMIN", ...)` gates routes by the global `users.role` enum.
- For project-scoped permissions, models call one of three helpers from `server/src/utils/requireRole.js` — each checks the `project_members` join table via `sp_GetMemberRole` and throws 403 on failure:
  - `requireMembership` — any role (`OWNER` / `ADMIN` / `MEMBER`). Used for reads.
  - `requireManager` — `OWNER` or `ADMIN`. Used to gate task creation/edits.
  - `requireOwner` — `OWNER` only. Used for member management and task verification.
    Authorization checks happen in the **model layer**, not the route, because they depend on the SP result.
- Static routes must come before dynamic ones in route files (e.g. `/profile` before `/:id` in `user.routes.js`).

### Server: validation

`validate(zodSchema)` middleware (`middlewares/validate.middleware.js`) parses `req.body`, **replaces it with the parsed/coerced data**, and returns 400 with a field-keyed error array on failure. Always import schemas from `server/src/schema/`.

### Server: task workflow rules

The task status machine is enforced in the model layer and in `sp_VerifyTask`:

- `PUT /tasks/:taskId` (update) **ignores any `status` field** — fields like title, description, priority, deadline, and assignee only.
- `PATCH /tasks/:taskId/status` moves `TODO ↔ IN_PROGRESS ↔ IN_REVIEW` and is callable by the assignee or any project manager. It **cannot set `DONE`**.
- `PATCH /tasks/:taskId/verify` is the only path to `DONE`: owner-only, requires current status `IN_REVIEW`, body `{ approve: bool }`. Approve → `DONE`, reject → `IN_PROGRESS`. The SP `SIGNAL`s if the precondition fails.

### Server: emails and notifications

- Email delivery is in `services/email.service.js` (SMTP via Nodemailer; HTML in `templates/emails/`). In-app notification settings live in `services/notification.service.js` and `database/notification.sql`. Respect the per-user `notification_settings` toggles before sending any email triggered by a user-facing event.
- **Deadline Reminder Emails**: Scheduled as an hourly background service booted inside `index.js` (`reminder.service.js`). It automatically checks for uncompleted tasks due within 24 hours (`sp_GetUpcomingTaskReminders`) and sends alert emails using a custom template.
- **Project-Level Reminders Control**: Project owners can pause/resume reminders via the `allowReminders` field in `projects` (persisted as `TINYINT(1)` via `sp_UpdateProject`). This is configured in the responsive **Settings** tab in the client project details view.

### Client: RTK Query endpoint injection

`client/src/app/baseApi.js` creates a single `baseApi` with `tagTypes: ["User", "Project", "Task", "NotificationSettings", "Document", "Comment"]` and an empty `endpoints` object. Each feature **injects** its endpoints via `baseApi.injectEndpoints({ endpoints: builder => ... })` in `features/*/[domain].api.js`. There is no central registry of endpoints — to find one, search for `injectEndpoints` or the hook name.

The base query is a custom `axiosBaseQuery` that delegates to `client/src/lib/axios.js`. That axios instance:

- Sets `baseURL: "/api"` (relies on the Vite proxy).
- Attaches `Authorization: Bearer <token>` from `state.auth.token` on every request (lazy-imports the store to break the circular dep `store → baseApi → axios → store`).
- On 401 responses, dispatches `logout()` automatically.
- Deletes the JSON `Content-Type` header when `config.data` is `FormData` so axios can set the multipart boundary (used by avatar upload).

### Client: routing and layouts

`client/src/App.jsx` is the single source of truth for routes. The tree is two top-level groups:

- `<GuestRoute>` wraps public pages and the auth pages; it redirects authenticated users to `/dashboard`.
- `<ProtectedRoute>` + `<AppLayout>` wraps every authed page.

Auth state lives in `features/auth/auth.slice.js` and persists the JWT to `localStorage` under the key `token`. `AppLayout` calls `useGetProfileQuery()` once on mount to hydrate Redux from the token.

### Client: feature slicing

Each domain owns its folder under `client/src/features/<name>/`: `pages/`, `components/`, `*.api.js` (RTK Query injection), and optionally `*.slice.js`. Current domains: `auth`, `users`, `project`, `tasks`, `documents`, `notifications`, `admin`, `guest`. Shadcn primitives live in `client/src/components/ui/`; layout shells live in `client/src/components/layouts/{app,guest}/`; loading skeletons live in `client/src/skeleton/`.

Path alias: `@/*` → `client/src/*` (configured in both `jsconfig.json` and `vite.config.js` — keep them in sync).

### Client: i18n

Translations live in `client/src/i18n/` (`index.js` configures i18next; `locales/` holds per-language JSON; `languages.js` enumerates supported languages). Guest-facing pages are localized; consult the existing keys before adding new strings.

## Conventions

- **Client formatting**: Prettier config (`client/.prettierrc`) — double quotes, no semicolons, 2-space indent, ES5 trailing commas. There is no Prettier config on the server; match surrounding style there.
- **Client lint**: `bun run lint` in `client/` runs ESLint with React Hooks + React Refresh rules. The server has no lint script.
- **Imports**: server uses ESM (`"type": "module"`); every relative import needs the `.js` extension.
- **API response shape**: controllers return `{ success: boolean, message?: string, data?: any }`. Errors come back as `{ success: false, message }` (plus `errors: [{field, message}]` for Zod validation failures).
- **Swagger docs**: route annotations live in `server/src/docs/*.docs.js` (separate from route files); reusable schema components are in `server/src/schema/swagger.schemas.js`. The spec is served at `/api/docs`.
