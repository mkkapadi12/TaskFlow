# Docs Page — Override

> Overrides [`../MASTER.md`](../MASTER.md) and inherits patterns from [`landing.md`](./landing.md).

**Route:** `/docs` • **File:** [`client/src/features/guest/pages/Docs.jsx`](../../../client/src/features/guest/pages/Docs.jsx) • **Locale namespace:** `docs`

The current page **content is mostly accurate** (it describes the real REST API) — this override focuses on **style + accuracy fixes**, not a rewrite of the information architecture.

---

## 1. Color tokens — fix dark-mode-only palette

The current page hardcodes colors that only work in dark mode:

```diff
- TODO        bg-blue-500/20 text-blue-400       # invisible-ish in light mode
- IN_PROGRESS bg-amber-500/20 text-amber-400
- IN_REVIEW   bg-purple-500/20 text-purple-400   # MASTER uses amber for IN_REVIEW
- DONE        bg-emerald-500/20 text-emerald-400
- METHOD      bg-emerald-500/15 text-emerald-400 border-emerald-500/30  # same problem
- Auth badge  text-amber-400                     # only visible in dark
- Admin badge text-red-400
```

Replace with the MASTER §4 status palette **plus** explicit `dark:` variants so both modes work:

```js
const TASK_STATUS_STYLES = {
  TODO:        'bg-slate-100   text-slate-700   dark:bg-slate-800   dark:text-slate-300',
  IN_PROGRESS: 'bg-blue-100    text-blue-700    dark:bg-blue-950    dark:text-blue-300',
  IN_REVIEW:   'bg-amber-100   text-amber-800   dark:bg-amber-950   dark:text-amber-300',
  DONE:        'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
};

const METHOD_STYLES = {
  GET:    'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900',
  POST:   'bg-blue-100    text-blue-700    border-blue-200    dark:bg-blue-950    dark:text-blue-300    dark:border-blue-900',
  PUT:    'bg-amber-100   text-amber-800   border-amber-200   dark:bg-amber-950   dark:text-amber-300   dark:border-amber-900',
  PATCH:  'bg-purple-100  text-purple-700  border-purple-200  dark:bg-purple-950  dark:text-purple-300  dark:border-purple-900',
  DELETE: 'bg-red-100     text-red-700     border-red-200     dark:bg-red-950     dark:text-red-300     dark:border-red-900',
};
```

`Auth` / `Admin` tag chips also need `dark:` variants — use `bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300` and red equivalents.

---

## 2. Section order (unchanged)

```
1. Hero (badge / H1 / lead / CTAs to #quickstart and #api-reference)
2. Highlights strip (3 tiles: REST / JWT / OpenAPI)
3. Quick Start — 4 numbered cards with code blocks
4. API Reference — tabbed sections (auth / users / projects / tasks)
5. Authentication guide — flow + example request + roles
6. Workflow — status pipeline + 4 steps
7. Final CTA — primary → /register, secondary → /docs (i.e. just link API root /api/docs)
```

---

## 3. API Reference — add the endpoints that landed since the doc was written

The codebase now has these routes that aren't documented on the page:

| Group         | Method / path                                               | Description                                  |
|---------------|-------------------------------------------------------------|----------------------------------------------|
| Auth          | `POST /api/auth/forgot-password`                            | Email a 15-min reset link                    |
| Auth          | `POST /api/auth/reset-password`                             | Submit new password with the token           |
| Auth          | `POST /api/auth/change-password` (auth required)            | Change password from settings                |
| Notifications | `GET  /api/notifications/settings`                          | Get email preference toggles                 |
| Notifications | `PATCH /api/notifications/settings`                         | Update preferences (partial)                 |
| Documents     | `GET    /api/projects/:projectId/documents`                 | List project documents                       |
| Documents     | `POST   /api/projects/:projectId/documents`                 | Upload up to 5 documents (manager only)      |
| Documents     | `DELETE /api/projects/:projectId/documents/:documentId`     | Delete a document (manager only)             |

These should appear under the existing `auth`, plus two **new tabs** `notifications` and `documents`. Add the i18n keys in §5.

---

## 4. Styling fixes (apply throughout the page)

| Anti-pattern (current)                                     | Replace with                                                   |
|------------------------------------------------------------|----------------------------------------------------------------|
| `container mx-auto px-6`                                   | `mx-auto max-w-6xl px-4 sm:px-6 lg:px-8` (or `max-w-5xl` for inner panels) |
| `hover:-translate-y-1 hover:shadow-2xl` on cards           | `hover:bg-accent/40` + `motion-safe:transition-colors`         |
| `shadow-primary/25 shadow-xl`                              | Drop the colored shadow — default shadcn elevation is enough   |
| `bg-linear-to-br from-primary/10 via-card/80 to-accent/10` | `bg-gradient-to-br from-primary/5 via-card to-accent/5`        |
| `bg-card/50 border-border/50`                              | `bg-card border-border` (or `bg-card/60` when overlapping blobs) |
| Tab buttons: `bg-primary text-primary-foreground shadow-primary/25 shadow-lg` | `bg-primary text-primary-foreground` (no colored shadow) |
| Code block: `bg-background/80`                              | `bg-muted` (works in both modes, no transparency math)         |
| `text-amber-400` / `text-red-400` for auth/admin badges    | Add `dark:` variants per §1                                    |
| `text-muted-foreground/40` for big step numbers            | `text-muted-foreground` opacity is fine; drop `/40` shorthand  |

---

## 5. i18n key additions

Add **only the additive keys** (don't break the existing keys). Three locales:

```diff
+ "reference.sections.auth.endpoints.2"        # forgot-password
+ "reference.sections.auth.endpoints.3"        # reset-password
+ "reference.sections.auth.endpoints.4"        # change-password
+ "reference.sections.notifications.title"     # "Notifications"
+ "reference.sections.notifications.description"
+ "reference.sections.notifications.endpoints.0"  # GET settings
+ "reference.sections.notifications.endpoints.1"  # PATCH settings
+ "reference.sections.documents.title"         # "Documents"
+ "reference.sections.documents.description"
+ "reference.sections.documents.endpoints.0"   # list
+ "reference.sections.documents.endpoints.1"   # upload
+ "reference.sections.documents.endpoints.2"   # delete
```

`reference.sections.projects.endpoints` should also gain entries for member-role-update and member-remove if you want full coverage, but those are existing — out of scope for this pass.

---

## 6. Component patterns

### Code block

Keep the copy button. Use semantic tokens only:

```jsx
<pre className="rounded-xl border border-border bg-muted p-4 overflow-x-auto text-sm leading-relaxed">
  <code className="text-foreground">{children}</code>
</pre>
```

Copy button: ghost variant, top-right, only visible on `group-hover/code`:

```jsx
<button className="absolute top-2 right-2 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent motion-safe:transition-opacity opacity-0 group-hover/code:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50">
```

`focus-visible:opacity-100` matters — keyboard users need the button.

### Tab button (active vs inactive)

```jsx
className={cn(
  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium motion-safe:transition-colors",
  active
    ? "bg-primary text-primary-foreground"
    : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent/40"
)}
```

### Endpoint row

```jsx
<div className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 motion-safe:transition-colors hover:bg-accent/40 sm:flex-row sm:items-center sm:gap-4">
  <div className="flex items-center gap-3 sm:min-w-[280px]">
    <MethodBadge method={method} />
    <code className="text-foreground text-sm font-medium">{path}</code>
  </div>
  <p className="flex-1 text-sm text-muted-foreground">{desc}</p>
  <div className="flex items-center gap-2">
    {auth  && <ChipBadge tone="amber" icon={Lock}>  Auth  </ChipBadge>}
    {admin && <ChipBadge tone="red"   icon={Shield}>Admin</ChipBadge>}
  </div>
</div>
```

`ChipBadge` is a tiny inline helper (no need to extract to its own file).

---

## 7. Accessibility & motion

- [ ] All decorative icons `aria-hidden="true"`.
- [ ] Code blocks have a real `<pre><code>` so screen readers can read them.
- [ ] Copy button has `aria-label="Copy code"` and announces success ("Copied!") for screen readers via a polite live region OR by toggling the icon (current behavior is fine).
- [ ] Tab buttons use `role="tab"` if the page is converted to true ARIA tabs — otherwise keep as plain `<button>`s and don't claim tab semantics.
- [ ] `scroll-mt-20` on `#quickstart` and `#api-reference` — already correct, keep it.
- [ ] `motion-safe:` on every `transition-*` and the spinner.

---

## 8. CTA section

- Primary CTA → `/register` ("Create an account")
- Secondary CTA → `/api/docs` (the live Swagger UI) — not `/contact`. **External link**, so use `<a href="/api/docs" target="_blank" rel="noopener noreferrer">` not `<Link>`.
- Drop the colored CTA shadows and decorative `bg-linear-to-br` glow div.

---

## 9. Out of scope

- Live API search / filter — explicitly skip until needed.
- Code-block syntax highlighting — plain `<code>` is enough; Prism/Shiki adds bundle weight not justified by the audience.
- Versioning / changelog — no versioning scheme exists yet.
