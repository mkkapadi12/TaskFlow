# About Page — Override

> Overrides [`../MASTER.md`](../MASTER.md) and inherits styling defaults from [`landing.md`](./landing.md) (eyebrow, card, CTA patterns).

**Route:** `/about` • **File:** [`client/src/features/guest/pages/About.jsx`](../../../client/src/features/guest/pages/About.jsx) • **Locale namespace:** `about`

---

## 1. Honesty constraints

The previous About page invented data that doesn't exist:

| Removed                                                  | Why                                                              |
|----------------------------------------------------------|------------------------------------------------------------------|
| "Founded 2023 / 15+ Team Members / 50K+ Happy Users"     | No company, no team, no real users yet. MASTER §6: skip until real. |
| Team members (Alex Rivera, Sarah Chen, Marcus Johnson, Priya Patel) | Fabricated. Fake faces undermine trust on a real product. |

Replaced with truthful sections:

| Added                          | Backed by                                                                  |
|--------------------------------|----------------------------------------------------------------------------|
| **Built in the open** band     | TaskFlow is open-source code in this repo, not a SaaS company             |
| **What's inside** highlights   | Real stack: React 19, Express 5, MySQL stored-procedure layer, JWT, i18n  |

The Values section stays — those are aspirational principles, not factual claims about scale.

---

## 2. Section order

```
1. Mission .......... Hero-style intro (eyebrow + H1 + lead). No fake stat tiles.
2. Built in the open  3 short tiles: open-source / single-developer project /
                     feedback-driven roadmap. Each is a fact, not a number.
3. Values ........... 6-card grid (kept from before, unchanged copy).
4. (No team section)  Removed. If a real "Maintainers" section ever lands,
                     bring it back behind real data.
```

---

## 3. Spacing & tokens

Same container + spacing as [`landing.md`](./landing.md):

| Surface             | Rule                                                  |
|---------------------|-------------------------------------------------------|
| Container           | `mx-auto max-w-6xl px-4 sm:px-6 lg:px-8`              |
| Hero section        | `py-20 md:py-28 lg:py-32`                             |
| Built-in-the-open   | `py-16 md:py-20`                                      |
| Values section      | `py-16 md:py-20 lg:pb-28`                             |

---

## 4. Typography overrides

| Element              | Class                                                                       |
|----------------------|-----------------------------------------------------------------------------|
| Hero H1              | `text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]`  |
| Section H2           | `text-3xl sm:text-4xl font-bold tracking-tight`                             |
| Card title           | `text-base font-semibold` (value cards) / `text-sm font-semibold` (facts)   |
| Card body            | `text-sm text-muted-foreground leading-relaxed`                             |

---

## 5. Component patterns

Reuse the **eyebrow badge**, **feature card**, and **`Button asChild`** patterns documented in [`landing.md`](./landing.md). No new components.

- **Facts tile** (replaces fake stat tile):
  ```jsx
  <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
    <Icon className="h-5 w-5 text-primary mb-3" aria-hidden="true" />
    <p className="text-sm font-semibold">{title}</p>
    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{body}</p>
  </div>
  ```
- Same anti-patterns as MASTER §12: no `hover:scale-*`, no raw hex, no layout-shifting hovers.

---

## 6. i18n keys to add / change

`about.json` — all three locales. Remove `mission.stats.*` and the whole `team` block from rendering (keep keys for back-compat). Add:

```diff
- "mission.stats"                # not rendered (kept for back-compat OK)
- "team.*"                       # not rendered (kept for back-compat OK)
+ "facts.badge"                  # "Built in the open"
+ "facts.title"                  # "Honest about where we are"
+ "facts.description"
+ "facts.list.opensource.title"
+ "facts.list.opensource.body"   # "TaskFlow is open-source — the code is the product."
+ "facts.list.solo.title"
+ "facts.list.solo.body"         # "Built and maintained by a single developer."
+ "facts.list.feedback.title"
+ "facts.list.feedback.body"     # "Roadmap shaped by user issues, not surveys."
```

---

## 7. Accessibility checklist

- [ ] One `<h1>`. Section heads `<h2>`. Card titles `<h3>` (or `<p>` if non-heading).
- [ ] All decorative icons `aria-hidden="true"`.
- [ ] `motion-safe:` on every transition / animate.
- [ ] No card pretends to be clickable (no `cursor-pointer`).
- [ ] Light + dark verified — borders visible, text contrast ≥ 4.5:1.
