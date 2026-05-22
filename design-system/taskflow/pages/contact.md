# Contact Page — Override

> Overrides [`../MASTER.md`](../MASTER.md) and inherits patterns from [`landing.md`](./landing.md).

**Route:** `/contact` • **File:** [`client/src/features/guest/pages/Contact.jsx`](../../../client/src/features/guest/pages/Contact.jsx) • **Locale namespace:** `contact`

---

## 1. Honesty constraints

The previous Contact page advertised a physical office, a phone number, and a 24-hour SLA — none of which exist for TaskFlow. It also rendered a form that **looked like** it sent a message but only showed a toast.

| Removed                                              | Why                                                          |
|------------------------------------------------------|--------------------------------------------------------------|
| `support@taskflow.app` (fake domain)                 | Not a real inbox                                             |
| `123 Market Street, Suite 400` / `San Francisco, CA` | No physical office                                           |
| `+1 (555) 123-4567` / "Mon – Fri, 9 AM – 6 PM PST"   | No phone, no business hours                                  |
| "We respond within 24 hours" copy                    | No SLA exists                                                |

Replaced with truthful channels:

| Added                                            | Backed by                                                  |
|--------------------------------------------------|------------------------------------------------------------|
| **GitHub issues** as the primary channel         | This is an open-source repo — issues are how feedback is tracked |
| **Email** (the project owner's address)          | Real, but never invented — see §6 for how to wire it       |
| **Note that the form is a demo**                 | The form currently only shows a Sonner toast, no SMTP send |

---

## 2. Section order

```
1. Header band ........ Eyebrow + H1 + lead (one column, centered, no fake stats).
2. Two-column layout:
   - LEFT (lg:col-span-2)  Channels list (GitHub + Email). Each link clickable.
   - RIGHT (lg:col-span-3) Contact form (RHF + zod). Surrounded by a "demo" banner
                           that admits the form is illustrative until SMTP is wired.
```

---

## 3. Form behavior

The form **stays** as a UI demo. To remove the lie, we:

- Add a small `<Alert>`-style banner on top: "Heads up — this form is a UI demo. The fastest way to reach us is GitHub issues / email below."
- Keep the success toast on submit, but change the toast description so it doesn't claim "we'll get back to you at {email}".
- Keep RHF + `zodResolver(contactSchema)`. Don't change [`client/src/schemas/contact.schema.js`](../../../client/src/schemas/contact.schema.js).

> When SMTP for the contact form actually lands, delete the banner and update the toast copy — not before.

---

## 4. Spacing & tokens

| Surface              | Rule                                                          |
|----------------------|---------------------------------------------------------------|
| Container            | `mx-auto max-w-6xl px-4 sm:px-6 lg:px-8`                      |
| Header section       | `pt-20 pb-10 md:pt-28 md:pb-14`                               |
| Content section      | `pb-20 md:pb-28`                                              |
| Two-column grid      | `grid grid-cols-1 gap-8 lg:grid-cols-5`                       |
| Form card padding    | `p-6 md:p-8`                                                  |
| Form card surface    | `rounded-2xl border border-border bg-card`                    |

---

## 5. Component patterns

### Channel item (replaces fake info-card)

```jsx
<a
  href={href}
  target="_blank"   // for external links
  rel="noopener noreferrer"
  className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors duration-200 hover:bg-accent/40 motion-safe:transition-colors"
>
  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
    <Icon className="h-5 w-5" aria-hidden="true" />
  </div>
  <div>
    <p className="text-sm font-semibold">{title}</p>
    <p className="mt-1 text-sm text-primary font-medium break-all">{detail}</p>
    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
  </div>
</a>
```

`break-all` on the email so long addresses don't overflow on mobile.

### Demo banner (top of form)

```jsx
<div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
  <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
  <p className="text-sm text-muted-foreground leading-relaxed">{t('form.demoNote')}</p>
</div>
```

Use `text-amber-600 dark:text-amber-400` (works in both modes — MASTER §4 status palette).

### Form fields

Use the existing `<Input>`, `<Label>`, `<Textarea>` shadcn primitives wired to RHF via `register()`. Don't switch to `<Form>`/`<FormField>` yet — the primitive isn't installed in `client/src/components/ui/`. Improve accessibility:

- `aria-invalid={!!errors.field}` on every input
- `aria-describedby="<id>-error"` when errors exist, pointing to the error `<p id="<id>-error">`
- Error messages: `text-destructive text-xs mt-1`

### Submit button

```jsx
<Button type="submit" disabled={isSubmitting} size="lg" className="h-12 w-full rounded-xl text-base">
  {isSubmitting
    ? (<><Loader2 className="mr-2 h-4 w-4 motion-safe:animate-spin" aria-hidden="true"/> {t('form.btnSending')}</>)
    : (<><Send className="mr-2 h-4 w-4" aria-hidden="true"/> {t('form.btnSend')}</>)}
</Button>
```

No `shadow-primary/30 hover:shadow-2xl`. Just the default shadcn button surface.

---

## 6. i18n keys to add / change

Need to keep the existing `infoCards.list.0..3` shape working **or** replace it with a new `channels` map. **New map** is cleaner — let the old keys stay in the JSON for back-compat (never rendered).

```diff
- "infoCards.list.*" (Email Us @ support@taskflow.app / Office / Phone / Business Hours)
                                   # not rendered — kept for back-compat

+ "channels.badge"                  # "Channels"
+ "channels.title"                  # "Talk to the maintainers"
+ "channels.description"
+ "channels.list.github.title"      # "GitHub Issues"
+ "channels.list.github.detail"     # the repo URL (placeholder if unknown)
+ "channels.list.github.description"
+ "channels.list.email.title"       # "Email"
+ "channels.list.email.detail"      # owner's email (or leave a placeholder for now)
+ "channels.list.email.description"
+ "form.demoNote"                   # "Heads up — this form is a UI demo until SMTP is wired up. Reach us via GitHub or email."

- "toast.description"               # OLD: "Thanks {name}, we'll get back to you at {email} soon."
+ "toast.description"               # NEW: "Thanks {name} — for a real response, please open a GitHub issue or email us."
```

The actual values for `channels.list.github.detail` and `channels.list.email.detail` should be filled in by the maintainer. The implementation will render whatever string the JSON contains, so leaving them as `"https://github.com/your-username/taskflow"` (already in `README.md`) and a project email is the minimum viable truth.

---

## 7. Accessibility

- [ ] All form inputs have a `<Label htmlFor=…>`.
- [ ] `aria-invalid` + `aria-describedby` wired to error elements.
- [ ] Demo banner uses semantic `<Alert role="status">`-style affordances (or just a `<div>` with sufficient contrast).
- [ ] Channel links are `<a>` with `rel="noopener noreferrer"` for `target="_blank"`.
- [ ] Submit button: `disabled` during submit; loading icon has `aria-hidden`; visible label change ("Sending..." / "Send Message").
- [ ] Keyboard: tab order header → channel 1 → channel 2 → form fields → submit.
- [ ] Light + dark — the demo-banner border/icon must remain visible in both.
