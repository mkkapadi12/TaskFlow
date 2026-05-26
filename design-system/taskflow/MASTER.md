# Design System — Master File

> **Hierarchy:** When building a specific page, first check `design-system/taskflow/pages/<page>.md`. If that file exists, its rules **override** this Master. Otherwise, follow the rules below.

**Project:** TaskFlow
**Category:** Productivity SaaS (project & task management)
**Style:** Flat Design — clean, professional, dashboard-first
**Stack:** React 19 + Vite 6 + Tailwind CSS v4 + shadcn/ui + next-themes (light/dark)
**Generated:** 2026-05-22 (regenerated from `ui-ux-pro-max` skill, reconciled with current codebase)

---

## 1. Source of Truth: shadcn Semantic Tokens

TaskFlow already exposes the full shadcn token set in [`client/src/index.css`](client/src/index.css) (OKLCH, light + `.dark` variants). **Always use the semantic Tailwind utility, never a raw hex literal.**

| Semantic role           | Utility class                       | Use for                                                             |
|-------------------------|-------------------------------------|---------------------------------------------------------------------|
| Page background         | `bg-background`                     | Top-level page surface                                              |
| Primary text            | `text-foreground`                   | Body copy, headings                                                 |
| Card surface            | `bg-card` / `text-card-foreground`  | Project cards, task cards, document rows                            |
| Popover / dropdown      | `bg-popover` / `text-popover-foreground` | DropdownMenu, Select, Combobox, Tooltip                        |
| Primary action          | `bg-primary` / `text-primary-foreground` | Main CTA buttons, focused tabs                                 |
| Secondary action        | `bg-secondary` / `text-secondary-foreground` | Secondary buttons, status pills                            |
| Muted surface           | `bg-muted` / `text-muted-foreground` | Skeletons, helper text, disabled                                  |
| Accent (hover)          | `bg-accent` / `text-accent-foreground` | Hover state on rows, list items                                 |
| Destructive             | `bg-destructive` / `text-destructive-foreground` | Delete buttons, error alerts                          |
| Border                  | `border-border`                     | Card borders, dividers — already applied globally to `*`            |
| Input border            | `border-input`                      | Form fields                                                         |
| Focus ring              | `ring-ring` (or `focus-visible:ring-ring/50`) | Keyboard focus indicators                                 |
| Sidebar                 | `bg-sidebar` / `text-sidebar-foreground` + `sidebar-accent`, `sidebar-border`, `sidebar-ring` | The persistent left sidebar in `AppLayout`     |

**Anti-pattern:** `bg-blue-500`, `text-gray-900`, `border-white/10` — these bypass dark mode and break theming.
**Correct:** `bg-primary text-primary-foreground`, `text-foreground`, `border-border`.

### Radius scale (already set in `@theme inline`)

`--radius` base = `0.625rem` (10 px). Tailwind utilities map as:
`rounded-sm` → 0.6× • `rounded-md` → 0.8× • `rounded-lg` → 1× • `rounded-xl` → 1.4× • `rounded-2xl` → 1.8×.
**Default for cards, dialogs, popovers: `rounded-xl`. Default for buttons/inputs: `rounded-md`.**

---

## 2. Typography

**Heading + body font:** `Geist Variable` (already loaded via `@fontsource-variable/geist`, set as `--font-sans`).
Geist is the same family Vercel/Linear use — it slots perfectly into the recommended SaaS mood (friendly, modern, professional, approachable). **Do not import a second font** — Plus Jakarta Sans was the skill's auto-pick but Geist already covers the same role.

| Use                  | Class                                                          |
|----------------------|----------------------------------------------------------------|
| Page H1              | `text-2xl font-semibold tracking-tight sm:text-3xl`            |
| Section heading      | `text-lg font-semibold tracking-tight sm:text-xl`              |
| Card title           | `text-base font-semibold`                                      |
| Stat Numbers         | `text-xl font-bold sm:text-2xl`                                |
| Body                 | `text-sm leading-relaxed` (16 px equivalent on mobile inputs)  |
| Helper / meta        | `text-xs text-muted-foreground`                                |
| Label                | `text-sm font-medium`                                          |
| Mono (IDs, code)     | `font-mono text-xs`                                            |

**Line length:** cap long-form text at `max-w-prose` (≈65–75 ch).
**Line height:** body uses `leading-relaxed` (1.625). Headings use Tailwind default (tight).

---

## 3. Layout & Spacing

### Containers

- **App content (authed pages, inside `AppLayout`):** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Marketing / guest pages:** `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Forms:** `max-w-md` (auth screens) or `max-w-2xl` (settings panels).

### Spacing scale (Tailwind defaults)

| Token  | Tailwind   | Use                                          |
|--------|------------|----------------------------------------------|
| xs     | `gap-1`    | Inline icon + label                          |
| sm     | `gap-2`    | Pills, button content                        |
| md     | `gap-4`    | Card content padding rows                    |
| lg     | `gap-6`    | Section padding inside containers            |
| xl     | `gap-8`    | Between major sections on a page             |
| 2xl    | `gap-12`   | Hero / above-the-fold vertical breathing room |

### Breakpoints (Tailwind defaults — design for all 4)

- 375 px (mobile)
- 768 px (`md`)
- 1024 px (`lg`)
- 1440 px (`xl`/`2xl`)

### Z-index scale (use these, never `z-[9999]`)

| Level | Use                                                |
|-------|----------------------------------------------------|
| `z-10` | Sticky page headers / inline overlays              |
| `z-20` | Persistent sidebar / app shell topbar              |
| `z-30` | Dropdowns, popovers, command menus                 |
| `z-40` | Toast / Sonner notifications                       |
| `z-50` | Dialogs, AlertDialogs, AlertDialog overlay         |

---

## 4. Color Strategy (TaskFlow-specific accents)

The current shadcn theme is essentially **monochrome neutral** (the OKLCH values are all chroma 0). Use that neutral palette for surfaces, then introduce **status accents** for task semantics only — this matches the Flat Design style and keeps the dashboard readable.

### Status accent palette (for badges, charts, pills)

Use these as Tailwind utilities with the listed `*-500` (or `dark:*-400`) variant:

| Semantic         | Light             | Dark               | Used in                                          |
|------------------|-------------------|--------------------|--------------------------------------------------|
| TODO             | `bg-slate-100 text-slate-700`     | `dark:bg-slate-800 dark:text-slate-300` | Task status pill |
| IN_PROGRESS      | `bg-blue-100 text-blue-700`       | `dark:bg-blue-950 dark:text-blue-300`   | Task status pill |
| IN_REVIEW        | `bg-amber-100 text-amber-800`     | `dark:bg-amber-950 dark:text-amber-300` | Task status pill, "Needs verification" badge |
| DONE             | `bg-emerald-100 text-emerald-700` | `dark:bg-emerald-950 dark:text-emerald-300` | Task status pill |
| Priority LOW     | `text-slate-600`                  | `dark:text-slate-400`                   | Priority icon       |
| Priority MEDIUM  | `text-blue-600`                   | `dark:text-blue-400`                    | Priority icon       |
| Priority HIGH    | `text-amber-600`                  | `dark:text-amber-400`                   | Priority icon       |
| Priority URGENT  | `text-red-600`                    | `dark:text-red-400`                     | Priority icon       |
| Overdue          | `text-destructive`                | `text-destructive`                      | Deadline text on overdue task |

Keep these tokens centralized in [`client/src/constant/index.jsx`](client/src/constant/index.jsx) (`STATUS_STYLES`, `PRIORITY_STYLES`) so they're swappable.

### Chart palette (Recharts) — important fix

`--chart-1` through `--chart-5` are currently all grayscale (`oklch(0.87 0 0)` → `oklch(0.269 0 0)`), which makes the planned status-distribution pie chart unreadable. Override the chart vars to a 5-color qualitative palette in `index.css`:

```css
:root {
  --chart-1: oklch(0.72 0.15 248);  /* blue   — IN_PROGRESS */
  --chart-2: oklch(0.76 0.14 80);   /* amber  — IN_REVIEW   */
  --chart-3: oklch(0.72 0.18 145);  /* green  — DONE        */
  --chart-4: oklch(0.66 0.02 250);  /* slate  — TODO        */
  --chart-5: oklch(0.62 0.20 28);   /* red    — overdue     */
}
.dark {
  --chart-1: oklch(0.74 0.15 248);
  --chart-2: oklch(0.78 0.14 80);
  --chart-3: oklch(0.74 0.18 145);
  --chart-4: oklch(0.70 0.02 250);
  --chart-5: oklch(0.68 0.20 28);
}
```

Recharts gets these via the shadcn `<ChartContainer chartConfig={...}>` wrapper. Define one `chartConfig` per chart instead of inline `fill` hex codes.

---

## 5. Component Specs

All components are built on shadcn primitives in [`client/src/components/ui/`](client/src/components/ui/) — use those, don't reinvent.

### Buttons — use `<Button variant=… size=…>`

| Variant       | When                                                  |
|---------------|-------------------------------------------------------|
| `default`     | Primary CTA on a page (one per surface)               |
| `secondary`   | Secondary action sitting next to the primary          |
| `outline`     | Tertiary action, dialog "Cancel", filter chips        |
| `ghost`       | Toolbar / table-row actions (icon-only friendly)      |
| `destructive` | Delete / remove member confirmations                  |
| `link`        | Inline navigation inside copy                         |

`size`: `default` (forms), `sm` (table rows / inline), `lg` (hero/landing), `icon` (square 9×9).
Always include `cursor-pointer` (already baked into the primitive) and never wrap a `<Button>` in an `<a>` — use `asChild` instead.

### Cards

```jsx
<Card className="rounded-xl">
  <CardHeader>
    <CardTitle>…</CardTitle>
    <CardDescription>…</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter className="justify-end gap-2">…</CardFooter>
</Card>
```
- Default surface: `bg-card text-card-foreground border-border`.
- Hover on interactive cards: `hover:bg-accent/40 transition-colors duration-200`. **Do not use `hover:scale-*`** — it triggers layout shift inside grids.

### Inputs (always inside `<Form>` + `<FormField>`)

Use shadcn's `<Form>` from `client/src/components/ui/form.jsx`, paired with `react-hook-form` and `zodResolver`. The schema lives in `client/src/schemas/`. Pattern:

```jsx
<FormField control={form.control} name="email" render={({ field }) => (
  <FormItem>
    <FormLabel>Email</FormLabel>
    <FormControl><Input {...field} /></FormControl>
    <FormMessage />
  </FormItem>
)} />
```

Anti-pattern: `useState` per field + `<Input value={email} onChange={…}>` — bypasses validation and accessibility wiring.

### Dialogs vs AlertDialog vs Sheet

- **Dialog** — create/edit forms (CreateProjectDialog, CreateTaskDialog, TaskDetailDialog).
- **AlertDialog** — destructive confirmations (delete project, delete document, remove member). Already used in `DocumentList`.
- **Sheet** — long-form side panels (mobile filters, multi-step task detail on small screens).
- **Drawer** — bottom sheet on touch devices for one-handed reach.

Overlay z-index is `z-50` (set by shadcn).

### Tables

For the project's task list, member list, and document list, prefer shadcn `<Table>` over div-grids when sortable/scannable. Wrap in `<div className="rounded-xl border border-border overflow-hidden">` to clip the header.

### Skeletons

[`client/src/skeleton/`](client/src/skeleton/) holds page-level skeletons. Use `<Skeleton>` from `@/components/ui/skeleton`. Match the real layout dimensions to prevent content-jumping.

### Toasts — Sonner

Already wired. Use `toast.success(...)`, `toast.error(...)`. Don't render inline error alerts for transient feedback — reserve `<Alert variant="destructive">` for persistent errors that need acknowledgment.

---

## 6. Page Pattern — Landing (Guest Pages)

**Pattern: Hero + Features + CTA** (replaces the skill's "Portfolio Grid" default which doesn't fit a productivity SaaS).

```
1. Hero ............. Headline ("Organize your work. Empower your team.") + sub +
                      primary CTA (Get Started → /register) + secondary (Sign in)
                      + product screenshot/illustration on the right (md:flex)
2. Social proof ..... Logo strip or "Trusted by N teams" (skip until real)
3. Key features ..... 3–6 feature cards (icon + title + 1-line) using Lucide icons
4. How it works ..... 3-step diagram (Create project → Assign tasks → Verify)
5. Final CTA ........ Contrasting band, repeat primary CTA, secondary link to /docs
6. Footer ........... Compact, language switcher, theme toggle
```

- **Primary CTA placement:** Hero (sticky in nav on scroll) + bottom band. CTA color = `bg-primary` (currently near-black) on light, near-white on dark; contrast ratio is ≥7:1 by default.
- **Section padding:** `py-16 md:py-24` for hero and CTA, `py-12 md:py-16` for everything else.
- **Container:** `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`.

The existing `Home`, `About`, `Contact`, `Docs` pages are localized via i18next — when adding new copy, put strings in `client/src/i18n/locales/{en,hi,gu}/<namespace>.json` first.

---

## 7. Page Pattern — Authed App (Dashboard + Feature Pages)

**Pattern: App Shell with persistent sidebar.**

- Sidebar at `z-20`, collapsed-to-icons on `<lg`, hidden on mobile and replaced by a `Sheet` trigger from the topbar.
- Topbar at `z-20`, sticky, contains: title, search (when applicable), avatar/notifications dropdown.
- Content area is the scroll container — page-level skeletons live here, not on the shell.

### Dashboard (`/dashboard`) — recommended composition

1. **Greeting band** — "Welcome back, {name}" + today's date.
2. **Stat tiles** (4 wide on `lg`, 2 on `md`, 1 on mobile): My projects • My tasks • In review • Overdue. Each tile = `<Card>` with icon + number + delta.
3. **Two-column split** (`lg:grid-cols-3` → status pie spans 1, upcoming deadlines list spans 2):
   - **Task status distribution** — Recharts donut using the chart palette in §4. Labels via legend, never floating slice labels (a11y).
   - **Upcoming deadlines** — list of 5 most-imminent assigned tasks, each linking to its project.
4. **Recent activity** — last 5 status changes / verifications across my projects (when activity log lands).

### Forms (settings, profile, auth)

- Vertical, single-column, label-above-input. Use shadcn `<Form>` + zod resolver everywhere.
- Submit button anchored bottom-right of the card on desktop, full-width on mobile.

---

## 8. Interaction & Motion

| Concern              | Rule                                                                            |
|----------------------|---------------------------------------------------------------------------------|
| Hover                | `transition-colors duration-200` on color/bg changes only. No `scale` shifts.   |
| Focus                | Always visible. Inputs/buttons inherit shadcn's `focus-visible:ring-ring/50`.   |
| Loading              | Skeletons for entire-page loads; `<Button>`'s built-in disabled+spinner for async actions; never freeze the UI. |
| Toasts               | Use Sonner. Success: 3s. Error: 5s + manual dismiss for actionable errors.      |
| Reduced motion       | Wrap any non-essential `transition`/`animate` in `motion-safe:` so it respects `prefers-reduced-motion`. |
| Touch targets        | Minimum 44×44 px (= `min-h-11 min-w-11`) for any standalone interactive element.|
| Click target inflation | Use `before:absolute before:inset-0` to enlarge click area on cards without inflating the visual.    |

---

## 9. Charts & Data Visualization (Recharts via shadcn)

| Data shape                                | Best chart       | Notes                                                      |
|-------------------------------------------|------------------|------------------------------------------------------------|
| Task status distribution (part-to-whole)  | **Donut**        | Use ≤5 slices, legend on right, labels in `text-muted-foreground`. Provide an accessible `<Table>` alternative beneath the chart. |
| Tasks over time (trend)                   | Line / Area      | One series per status if needed; stacked area only with 3–4 statuses max. |
| Tasks per project (comparison)            | Horizontal bar   | Vertical bars run out of label room on mobile.            |
| Per-user load                             | Stacked bar      | Bar per user, segments = status. Use chart palette in §4.  |

Avoid pie if items > 5 (skill flagged this), avoid 3D charts, avoid dual y-axes.

---

## 10. Accessibility (Non-negotiable)

- **Contrast:** body text ≥ 4.5:1, large text ≥ 3:1. Light mode `text-muted-foreground` is borderline — never use it for primary body copy, only meta.
- **Form labels:** every `<Input>` has a paired `<FormLabel>` (use shadcn `<FormField>` wiring).
- **Icon-only buttons:** add `aria-label`. Decorative icons get `aria-hidden="true"`.
- **Keyboard nav:** Tab order must match visual order. Don't `outline-none` without a focus replacement.
- **Color is never the only signal:** status pills carry **text + color**, never color alone.
- **`prefers-reduced-motion`:** all motion behind `motion-safe:`.
- **Live regions:** route async errors / Sonner toasts through `aria-live="polite"` (Sonner does this by default).
- **Locale direction:** the LANGUAGES list reserves `dir: 'ltr'` — preserve the field if RTL is added.

---

## 11. Pre-Delivery Checklist

Run through this before every UI PR:

- [ ] All colors use semantic shadcn tokens (`bg-card`, `text-foreground`, `border-border`), no raw hex/`gray-*` literals
- [ ] No emoji used as a UI icon (Lucide via `client/src/lib/icons/` instead)
- [ ] All clickable elements have `cursor-pointer` (shadcn primitives do already)
- [ ] Transitions are `duration-200`, color/bg/opacity only — no `hover:scale-*`
- [ ] Focus rings visible (`focus-visible:ring-ring/50`) on every interactive element
- [ ] Tab order matches visual order, no positive `tabIndex`
- [ ] Status / priority pills use the §4 palette (carry text label, not color alone)
- [ ] Pages tested at 375 / 768 / 1024 / 1440 — no horizontal scroll on 375
- [ ] Both light AND dark mode verified (text contrast holds on both)
- [ ] Forms use `<Form>` + `react-hook-form` + `zodResolver`; errors render via `<FormMessage>`
- [ ] Async actions disable + spinner the button; the page shows a skeleton, not blank
- [ ] Sonner toast for transient feedback; `<Alert>` only for persistent / actionable errors
- [ ] New strings on guest pages added to all three locales (`en` / `hi` / `gu`)
- [ ] No fixed `z-[9999]` — use the §3 scale
- [ ] Lighthouse / `aria-` attributes on icon-only buttons

---

## 12. Anti-Patterns (Forbidden)

- ❌ Raw color hex in JSX (`#0D9488`, `text-gray-400`) — use semantic tokens
- ❌ Inline `fill="#xxx"` on Recharts — define a `chartConfig`
- ❌ Emojis as icons (`🚀`, `⚙️`, `📁`)
- ❌ `hover:scale-105` on grid cards (layout shift inside CSS grid)
- ❌ `bg-white/10` borders/cards in light mode (invisible)
- ❌ `outline-none` without `focus-visible:ring-*` replacement
- ❌ Status conveyed by color alone (always include the label)
- ❌ `useState` + `<Input>` for forms (use `<Form>` + RHF)
- ❌ Long onboarding flows — the skill explicitly flags this for productivity tools
- ❌ Blocking the UI during async (no skeleton, no spinner)
- ❌ Arbitrary z-index values (`z-[9999]`) — use the §3 scale

---

## 13. Page-Specific Overrides

Drop a Markdown file in [`design-system/taskflow/pages/`](design-system/taskflow/pages/) named after the route slug (`dashboard.md`, `project-details.md`, `landing.md`, …). Anything in that file overrides the Master for that page only. Recommended first overrides to author:

- `landing.md` — Home/About/Contact/Docs marketing copy specifics, hero illustration spec
- `dashboard.md` — exact stat-tile order, chart config snippet
- `project-details.md` — tab layout (Overview / Tasks / Members / Documents), kanban switch
- `auth.md` — Login / Register / Forgot / Reset — single-column rules, brand mark placement
