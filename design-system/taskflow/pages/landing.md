# Landing Page — Override

> Overrides [`design-system/taskflow/MASTER.md`](../MASTER.md) for the Home / landing page only.
> When the override is silent on a rule, fall back to the Master.

**Route:** `/` (rendered inside `GuestLayout`)
**File:** [`client/src/features/guest/pages/Home.jsx`](client/src/features/guest/pages/Home.jsx)
**Locale namespace:** `home` — keys must exist in `en` / `hi` / `gu`.

---

## 1. Honesty constraints (read first)

The previous Home page advertised features and metrics that don't exist:

| Removed                                      | Why                                                                 |
|----------------------------------------------|---------------------------------------------------------------------|
| "50K+ Active Users / 2M+ Tasks / 99.9% Uptime / 4.9★ Rating" | Fabricated — MASTER §6 says "skip social proof until real" |
| "Time Tracking" feature card                 | Listed as future in [`taskFlow.md`](../../../taskFlow.md) §7         |
| "Smart Analytics" feature card               | Same — dashboard charts are partial, no analytics page              |
| "Start **Free Trial**" CTA                   | TaskFlow has no trial / billing — it's free, not "trial"            |

Replace with truthful equivalents drawn from the actual implementation status:

| Added                          | Backed by                                                                 |
|--------------------------------|---------------------------------------------------------------------------|
| Verification workflow card     | `sp_VerifyTask` + `PATCH /tasks/:taskId/verify` — the product's hallmark  |
| Project documents card         | `/projects/:projectId/documents` + Cloudinary (shipped)                   |
| Multi-language card            | i18next setup (en / hi / gu) — actually shipped                           |
| How-it-works section           | Maps 1:1 to the real workflow: Create → Assign → Verify                   |

---

## 2. Section order (overrides MASTER §6)

```
1. Hero
   - Eyebrow badge (small, brand-tinted)
   - H1 headline + brand-gradient subhead
   - Lead paragraph
   - Primary CTA (→ /register) + Secondary CTA (→ /login)
   - NO stats bar (deleted)

2. Features grid (6 cards, 3 cols on lg, 2 on md, 1 on mobile)
   - Each card: icon tile (rounded-xl, bg-primary/10) + title + 1–2 line description
   - Cards are NOT links — they're informational

3. How it works (NEW — replaces social proof)
   - 3 numbered steps in a row on md+, stacked on mobile
   - Each step: numbered circle + title + body
   - Mirrors the real task lifecycle (Create → Assign → Verify)

4. Final CTA band
   - Contrasting card surface, repeats primary CTA (→ /register)
   - Secondary CTA goes to /docs (not /contact — docs is where curious visitors go)

5. (Footer comes from GuestLayout — out of scope here)
```

---

## 3. Spacing & container

| Surface                   | Rule                                                     |
|---------------------------|----------------------------------------------------------|
| Container                 | `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`                |
| Hero `<section>`          | `py-20 md:py-28 lg:py-32`                                |
| Features `<section>`      | `py-16 md:py-20`                                         |
| How-it-works `<section>`  | `py-16 md:py-20`                                         |
| Final CTA `<section>`     | `py-20 md:py-28`                                         |
| Gap between feature cards | `gap-6`                                                  |
| Gap between steps         | `gap-8 md:gap-6`                                         |

Ambient blob backdrops are already painted by `GuestLayout` — don't add new ones.

---

## 4. Typography overrides

Override MASTER §2 H1 sizing for the hero only (marketing license):

| Element              | Class                                                                       |
|----------------------|-----------------------------------------------------------------------------|
| Hero H1              | `text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]`  |
| Hero subhead span    | `bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent` |
| Hero lead `<p>`      | `text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl`      |
| Section H2           | `text-3xl sm:text-4xl font-bold tracking-tight`                             |
| Section eyebrow      | Pill badge — see §5                                                         |
| Feature card title   | `text-base font-semibold`                                                   |
| Feature card body    | `text-sm text-muted-foreground leading-relaxed`                             |
| Step number circle   | `text-lg font-bold` inside a 10×10 circle                                   |

**Cap at `text-6xl`.** The prior page used `text-8xl` which overflows in Hindi / Gujarati and breaks line balance on `md`.

---

## 5. Components & tokens

### Eyebrow / badge

```jsx
<span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
  <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
  {t('hero.badge')}
</span>
```

- Use the `Sparkles` icon from `guest.icons.jsx` (`GUEST_ICONS.SPARKLES`).
- For hero: include a small pulsing dot (`relative flex h-2 w-2` + `animate-ping`) as in the existing component — but wrap any `animate-ping` in `motion-safe:` per MASTER §10.

### Primary CTA — use shadcn `<Button asChild size="lg">`

```jsx
<Button asChild size="lg" className="h-12 rounded-full px-7 text-base">
  <Link to="/register">
    {t('hero.ctaStart')}
    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
  </Link>
</Button>
```

- **No `hover:scale-*`** (MASTER §12 / §10). The existing page used `hover:-translate-y-1` — keep it small (`motion-safe:hover:-translate-y-0.5`) or drop it entirely. Color shift is preferred.
- Don't apply colored shadow rings (`shadow-primary/25`) — clashes in dark mode.
- Secondary CTA: `variant="outline"` with the same rounded-full + h-12.

### Feature card

```jsx
<div className="group rounded-2xl border border-border bg-card p-6 transition-colors duration-200 hover:bg-accent/40">
  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
    <Icon className="h-5 w-5" aria-hidden="true" />
  </div>
  <h3 className="mb-1.5 text-base font-semibold">{title}</h3>
  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
</div>
```

- Six cards, grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.
- No `cursor-pointer` (cards aren't clickable).
- No `hover:shadow-2xl` (heavy + breaks dark mode parity).

### How-it-works step

```jsx
<div className="relative rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
    {n}
  </div>
  <h3 className="mb-2 text-lg font-semibold">{title}</h3>
  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
</div>
```

- 3 columns on `md`, stacked on mobile.
- Numbers come from a `[1, 2, 3]` map — don't translate `1`/`2`/`3` (digits don't need localization).

### Final CTA band

```jsx
<div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-card to-accent/5 p-10 md:p-14 text-center">
  …
</div>
```

- Subtle gradient using primary/accent at low opacity (avoid the prior `from-primary/10 via-card/80 to-accent/10` which crushes contrast in dark mode).
- Center the H2 + lead + two CTAs.
- Secondary CTA → `/docs`.

---

## 6. Feature set (honest, 6 cards)

The labels and descriptions live in [`client/src/i18n/locales/{en,hi,gu}/home.json`](../../../client/src/i18n/locales/) under `features.list`. Six keys, six icons:

| Key            | Icon (`GUEST_ICONS`) | English title              | What it maps to in the codebase                       |
|----------------|----------------------|----------------------------|-------------------------------------------------------|
| `fast`         | `ZAP`                | Lightning Fast             | Vite + React 19 + RTK Query cache                     |
| `secure`       | `SHIELD`             | Secure & Private           | JWT + bcrypt, 3-tier project roles                    |
| `organized`    | `CHECK`              | Stay Organized             | Projects + status + priority                          |
| `team`         | `USERS`              | Team Collaboration         | `project_members`, invitations, owner/admin/member    |
| `documents`    | `FILE_CODE`          | Centralized Documents      | `project_documents` + Cloudinary uploads              |
| `verify`       | `SHIELD_CHECK`       | Verified by Owner          | `sp_VerifyTask` workflow                              |

`FILE_CODE` already exists in `guest.icons.jsx`. `SHIELD_CHECK` too. No new icon imports needed.

**Note:** the older `analytics` and `time` keys can stay in the JSON for backward compatibility, but the new Home only renders the six above.

---

## 7. How-it-works (3 steps)

Locale namespace: `home.howItWorks`. Three step keys: `create`, `assign`, `verify`. Each has `title` and `description`.

| Step | English title              | Body (short)                                                        |
|------|----------------------------|---------------------------------------------------------------------|
| 1    | Create a project           | Set up a workspace, invite your team, and assign roles.             |
| 2    | Assign work                | Break work into tasks with priorities and deadlines.                |
| 3    | Review & verify            | The assignee submits for review; the owner approves to mark it done.|

---

## 8. Accessibility checklist (page-specific)

- [ ] All decorative icons have `aria-hidden="true"` (Lucide accepts it on the rendered `<svg>` indirectly via `aria-hidden`)
- [ ] `<h1>` appears once. Section heads are `<h2>`, feature/step titles are `<h3>`.
- [ ] CTA `<Button asChild>` wraps a `<Link>` — don't nest `<a>` inside `<button>`.
- [ ] `motion-safe:` on every `animate-*`, `transition-transform`, and translate-y hover.
- [ ] Hero gradient text still has a fallback solid color (the span renders `text-transparent` — confirm a sighted user without gradient support sees primary color; that's handled by `text-primary` as the underlying color or by ensuring browsers we target support `bg-clip-text`).
- [ ] Cards are `<div>`, not `<button>` — they aren't interactive.
- [ ] Tab order: header → hero CTA primary → hero CTA secondary → feature cards skipped (non-interactive) → final CTA primary → final CTA secondary → footer.

---

## 9. i18n keys to add / change

`home.json` in all three locales must add these new keys and remove the obsolete ones:

```diff
- "stats": {...}                         # entire block removed from rendering
- "features.list.analytics"              # not rendered (keep for back-compat OK)
- "features.list.time"                   # not rendered (keep for back-compat OK)
+ "features.list.documents.title"        # "Centralized Documents"
+ "features.list.documents.description"
+ "features.list.verify.title"           # "Verified by Owner"
+ "features.list.verify.description"
+ "howItWorks.badge"                     # "How it works"
+ "howItWorks.title"                     # "From idea to done in three steps"
+ "howItWorks.description"
+ "howItWorks.steps.create.title"
+ "howItWorks.steps.create.description"
+ "howItWorks.steps.assign.title"
+ "howItWorks.steps.assign.description"
+ "howItWorks.steps.verify.title"
+ "howItWorks.steps.verify.description"
- "ctaSection.btnStart": "Start Free Trial"
+ "ctaSection.btnStart": "Get Started Free"
- "ctaSection.btnContact": "Contact Us"
+ "ctaSection.btnDocs": "Read the Docs"
```

---

## 10. Out of scope for this override

- Header / Footer (handled by `GuestLayout` — separate override file if needed).
- The /about, /contact, /docs pages (separate overrides if they get redesigned).
- Adding logo strip / customer testimonials — explicitly skipped per MASTER §6 ("skip until real").
