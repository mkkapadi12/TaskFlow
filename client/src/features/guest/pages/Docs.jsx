import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { GUEST_ICONS } from '@/lib/icons/guest.icons';

// ── Documentation data constants ──

const TASK_STATUSES = [
  { label: 'TODO', color: 'bg-blue-500/20 text-blue-400' },
  { label: 'IN_PROGRESS', color: 'bg-amber-500/20 text-amber-400' },
  { label: 'IN_REVIEW', color: 'bg-purple-500/20 text-purple-400' },
  { label: 'DONE', color: 'bg-emerald-500/20 text-emerald-400' },
];

const METHOD_COLORS = {
  GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  POST: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  PUT: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  PATCH: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  DELETE: 'bg-red-500/15 text-red-400 border-red-500/30',
};

// ── Sub-components ──

const MethodBadge = ({ method }) => (
  <span
    className={`inline-flex min-w-[60px] items-center justify-center rounded-md border px-2 py-0.5 text-[11px] font-bold tracking-wider ${METHOD_COLORS[method]}`}
  >
    {method}
  </span>
);

const CodeBlock = ({ children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group/code relative">
      <pre className="bg-background/80 border-border/50 overflow-x-auto rounded-xl border p-4 text-sm leading-relaxed">
        <code className="text-muted-foreground">{children}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground absolute top-3 right-3 rounded-lg p-1.5 opacity-0 backdrop-blur-sm transition-all group-hover/code:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <GUEST_ICONS.CHECK size={14} />
        ) : (
          <GUEST_ICONS.COPY size={14} />
        )}
      </button>
    </div>
  );
};

// ── Main page ──

const Docs = () => {
  const { t } = useTranslation('docs');
  const [activeSection, setActiveSection] = useState('auth');

  const QUICK_START_STEPS = [
    {
      step: '01',
      icon: GUEST_ICONS.USER,
      title: t('quickstart.steps.0.title'),
      description: t('quickstart.steps.0.description'),
      code: `POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}`,
    },
    {
      step: '02',
      icon: GUEST_ICONS.KEY,
      title: t('quickstart.steps.1.title'),
      description: t('quickstart.steps.1.description'),
      code: `POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}

// Response: { "token": "eyJhbGci..." }`,
    },
    {
      step: '03',
      icon: GUEST_ICONS.LAYERS,
      title: t('quickstart.steps.2.title'),
      description: t('quickstart.steps.2.description'),
      code: `POST /api/projects/create
Authorization: Bearer <token>
{
  "title": "My First Project",
  "description": "A new project"
}`,
    },
    {
      step: '04',
      icon: GUEST_ICONS.CHECK,
      title: t('quickstart.steps.3.title'),
      description: t('quickstart.steps.3.description'),
      code: `POST /api/tasks
Authorization: Bearer <token>
{
  "title": "Design homepage",
  "projectId": 1,
  "assigneeId": 2,
  "priority": "HIGH",
  "deadline": "2026-06-01"
}`,
    },
  ];

  const API_SECTIONS = [
    {
      id: 'auth',
      icon: GUEST_ICONS.LOCK,
      title: t('reference.sections.auth.title'),
      description: t('reference.sections.auth.description'),
      endpoints: [
        {
          method: 'POST',
          path: '/api/auth/register',
          description: t('reference.sections.auth.endpoints.0'),
          auth: false,
        },
        {
          method: 'POST',
          path: '/api/auth/login',
          description: t('reference.sections.auth.endpoints.1'),
          auth: false,
        },
      ],
    },
    {
      id: 'users',
      icon: GUEST_ICONS.USERS,
      title: t('reference.sections.users.title'),
      description: t('reference.sections.users.description'),
      endpoints: [
        {
          method: 'GET',
          path: '/api/users/profile',
          description: t('reference.sections.users.endpoints.0'),
          auth: true,
        },
        {
          method: 'PUT',
          path: '/api/users/profile',
          description: t('reference.sections.users.endpoints.1'),
          auth: true,
        },
        {
          method: 'GET',
          path: '/api/users/:id',
          description: t('reference.sections.users.endpoints.2'),
          auth: true,
        },
        {
          method: 'GET',
          path: '/api/users/',
          description: t('reference.sections.users.endpoints.3'),
          auth: true,
          admin: true,
        },
      ],
    },
    {
      id: 'projects',
      icon: GUEST_ICONS.LAYERS,
      title: t('reference.sections.projects.title'),
      description: t('reference.sections.projects.description'),
      endpoints: [
        {
          method: 'POST',
          path: '/api/projects/create',
          description: t('reference.sections.projects.endpoints.0'),
          auth: true,
          admin: true,
        },
        {
          method: 'GET',
          path: '/api/projects/my',
          description: t('reference.sections.projects.endpoints.1'),
          auth: true,
        },
        {
          method: 'GET',
          path: '/api/projects/:projectId',
          description: t('reference.sections.projects.endpoints.2'),
          auth: true,
        },
        {
          method: 'PUT',
          path: '/api/projects/:projectId',
          description: t('reference.sections.projects.endpoints.3'),
          auth: true,
        },
        {
          method: 'DELETE',
          path: '/api/projects/:projectId',
          description: t('reference.sections.projects.endpoints.4'),
          auth: true,
        },
        {
          method: 'POST',
          path: '/api/projects/:projectId/add-member',
          description: t('reference.sections.projects.endpoints.5'),
          auth: true,
          admin: true,
        },
      ],
    },
    {
      id: 'tasks',
      icon: GUEST_ICONS.CHECK,
      title: t('reference.sections.tasks.title'),
      description: t('reference.sections.tasks.description'),
      endpoints: [
        {
          method: 'POST',
          path: '/api/tasks/',
          description: t('reference.sections.tasks.endpoints.0'),
          auth: true,
        },
        {
          method: 'GET',
          path: '/api/tasks/my',
          description: t('reference.sections.tasks.endpoints.1'),
          auth: true,
        },
        {
          method: 'GET',
          path: '/api/tasks/overdue',
          description: t('reference.sections.tasks.endpoints.2'),
          auth: true,
        },
        {
          method: 'GET',
          path: '/api/tasks/project/:projectId',
          description: t('reference.sections.tasks.endpoints.3'),
          auth: true,
        },
        {
          method: 'PUT',
          path: '/api/tasks/:taskId',
          description: t('reference.sections.tasks.endpoints.4'),
          auth: true,
        },
        {
          method: 'PATCH',
          path: '/api/tasks/:taskId/status',
          description: t('reference.sections.tasks.endpoints.5'),
          auth: true,
        },
        {
          method: 'PATCH',
          path: '/api/tasks/:taskId/verify',
          description: t('reference.sections.tasks.endpoints.6'),
          auth: true,
        },
        {
          method: 'DELETE',
          path: '/api/tasks/:taskId',
          description: t('reference.sections.tasks.endpoints.7'),
          auth: true,
        },
      ],
    },
  ];

  const authRoles = [
    {
      role: t('auth.roles.owner.role'),
      desc: t('auth.roles.owner.desc'),
    },
    {
      role: t('auth.roles.admin.role'),
      desc: t('auth.roles.admin.desc'),
    },
    {
      role: t('auth.roles.member.role'),
      desc: t('auth.roles.member.desc'),
    },
  ];

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both mx-auto max-w-3xl text-center duration-1000">
          <div className="border-primary/20 bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.BOOK_OPEN size={14} />
            {t('hero.badge')}
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            {t('hero.title')}{' '}
            <span className="text-primary">{t('hero.titleHighlight')}</span>
          </h1>

          <p className="text-muted-foreground mt-6 text-lg leading-relaxed sm:text-xl">
            {t('hero.description')}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="shadow-primary/25 hover:shadow-primary/30 group h-13 rounded-full px-8 text-base shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
              <a href="#quickstart">
                <GUEST_ICONS.PLAY className="mr-2 h-4 w-4" />
                {t('hero.btnQuickstart')}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border/50 bg-background/50 hover:bg-muted h-13 rounded-full px-8 text-base backdrop-blur-sm transition-all hover:-translate-y-1"
            >
              <a href="#api-reference">
                <GUEST_ICONS.CODE className="mr-2 h-4 w-4" />
                {t('hero.btnReference')}
              </a>
            </Button>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="animate-in fade-in slide-in-from-bottom-12 fill-mode-both mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 delay-200 duration-1000 sm:grid-cols-3">
          {[
            {
              icon: GUEST_ICONS.ZAP,
              label: t('highlights.rest.label'),
              detail: t('highlights.rest.detail'),
            },
            {
              icon: GUEST_ICONS.SHIELD,
              label: t('highlights.jwt.label'),
              detail: t('highlights.jwt.detail'),
            },
            {
              icon: GUEST_ICONS.SERVER,
              label: t('highlights.openapi.label'),
              detail: t('highlights.openapi.detail'),
            },
          ].map(({ icon: Icon, label, detail }) => (
            <div
              key={label}
              className="border-border/50 bg-card/50 flex items-center gap-4 rounded-2xl border p-5 backdrop-blur-sm"
            >
              <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-muted-foreground text-xs">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick Start Section ── */}
      <section
        id="quickstart"
        className="container mx-auto scroll-mt-20 px-6 py-20 lg:py-28"
      >
        <div className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both mx-auto mb-14 max-w-2xl text-center duration-700">
          <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.ROCKET size={14} />
            {t('quickstart.badge')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('quickstart.title')}{' '}
            <span className="text-primary">{t('quickstart.titleHighlight')}</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            {t('quickstart.description')}
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-6">
          {QUICK_START_STEPS.map(
            ({ step, icon: Icon, title, description, code }, i) => (
              <div
                key={step}
                className="group border-border/50 bg-card/50 hover:border-primary/40 hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-8 fill-mode-both rounded-2xl border backdrop-blur-sm transition-all duration-500 hover:shadow-xl"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex flex-col gap-6 p-6 md:flex-row md:p-8">
                  {/* Step indicator */}
                  <div className="flex shrink-0 items-start gap-4 md:flex-col md:items-center">
                    <div className="from-primary/20 to-accent/20 border-primary/30 group-hover:border-primary/60 flex h-14 w-14 items-center justify-center rounded-2xl border bg-linear-to-br transition-colors">
                      <Icon size={24} className="text-primary" />
                    </div>
                    <span className="text-muted-foreground/40 text-3xl font-black">
                      {step}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold">{title}</h3>
                      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                        {description}
                      </p>
                    </div>
                    <CodeBlock>{code}</CodeBlock>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ── API Reference Section ── */}
      <section
        id="api-reference"
        className="container mx-auto scroll-mt-20 px-6 py-20 lg:py-28"
      >
        <div className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both mx-auto mb-14 max-w-2xl text-center duration-700">
          <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.CODE size={14} />
            {t('reference.badge')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('reference.title')}{' '}
            <span className="text-primary">{t('reference.titleHighlight')}</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            {t('reference.description')}{' '}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">/api</code>
            .
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          {/* Tab navigation */}
          <div className="animate-in fade-in fill-mode-both mb-8 flex flex-wrap justify-center gap-2 duration-500">
            {API_SECTIONS.map(({ id, icon: Icon, title }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeSection === id
                    ? 'bg-primary text-primary-foreground shadow-primary/25 shadow-lg'
                    : 'bg-card/50 text-muted-foreground hover:text-foreground border-border/50 hover:bg-muted/50 border'
                }`}
              >
                <Icon size={16} />
                {title}
              </button>
            ))}
          </div>

          {/* Active section content */}
          {API_SECTIONS.filter(({ id }) => id === activeSection).map(
            ({ id, icon: Icon, title, description, endpoints }) => (
              <div
                key={id}
                className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500"
              >
                {/* Section header card */}
                <div className="border-border/50 bg-card/50 mb-4 rounded-2xl border p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Endpoints list */}
                <div className="space-y-2">
                  {endpoints.map(
                    ({ method, path, description: desc, auth, admin }) => (
                      <div
                        key={`${method}-${path}`}
                        className="group border-border/50 bg-card/30 hover:bg-card/60 hover:border-primary/30 flex flex-col gap-3 rounded-xl border p-4 backdrop-blur-sm transition-all sm:flex-row sm:items-center sm:gap-4"
                      >
                        <div className="flex items-center gap-3 sm:min-w-[280px]">
                          <MethodBadge method={method} />
                          <code className="text-foreground text-sm font-medium">
                            {path}
                          </code>
                        </div>
                        <p className="text-muted-foreground flex-1 text-sm">
                          {desc}
                        </p>
                        <div className="flex items-center gap-2">
                          {auth && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                              <GUEST_ICONS.LOCK size={10} />
                              Auth
                            </span>
                          )}
                          {admin && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400">
                              <GUEST_ICONS.SHIELD size={10} />
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ── Authentication Guide Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both mx-auto mb-14 max-w-2xl text-center duration-700">
          <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.SHIELD_CHECK size={14} />
            {t('auth.badge')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('auth.title')}{' '}
            <span className="text-primary">{t('auth.titleHighlight')}</span>{' '}
            {t('auth.titleEnd')}
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            {t('auth.description')}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Auth flow card */}
          <div className="animate-in fade-in slide-in-from-left-8 fill-mode-both border-border/50 bg-card/50 rounded-2xl border p-6 backdrop-blur-sm duration-700 md:p-8">
            <h3 className="mb-6 text-lg font-bold">{t('auth.flowTitle')}</h3>
            <div className="space-y-4">
              {[
                {
                  num: '1',
                  title: t('auth.flow.0.title'),
                  desc: t('auth.flow.0.desc'),
                },
                {
                  num: '2',
                  title: t('auth.flow.1.title'),
                  desc: t('auth.flow.1.desc'),
                },
                {
                  num: '3',
                  title: t('auth.flow.2.title'),
                  desc: t('auth.flow.2.desc'),
                },
                {
                  num: '4',
                  title: t('auth.flow.3.title'),
                  desc: t('auth.flow.3.desc'),
                },
              ].map(({ num, title, desc }) => (
                <div key={num} className="flex items-start gap-4">
                  <div className="from-primary/20 to-primary/5 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br text-sm font-bold">
                    {num}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-muted-foreground text-xs">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code example card */}
          <div className="animate-in fade-in slide-in-from-right-8 fill-mode-both delay-100 duration-700">
            <div className="border-border/50 bg-card/50 rounded-2xl border p-6 backdrop-blur-sm md:p-8">
              <h3 className="mb-4 text-lg font-bold">{t('auth.exampleRequest')}</h3>
              <CodeBlock>
                {`// Include the JWT token in headers
fetch('/api/projects/my', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <your-token>'
  }
})
.then(res => res.json())
.then(data => console.log(data));`}
              </CodeBlock>

              <div className="mt-6">
                <h4 className="mb-3 text-sm font-semibold">
                  {t('auth.rolesTitle')}
                </h4>
                <div className="space-y-2">
                  {authRoles.map(({ role, desc }) => (
                    <div
                      key={role}
                      className="bg-muted/30 flex items-center gap-3 rounded-lg p-2.5"
                    >
                      <span className="bg-primary/15 text-primary rounded-md px-2 py-0.5 text-xs font-bold">
                        {role}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Task Workflow Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both mx-auto mb-14 max-w-2xl text-center duration-700">
          <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.TERMINAL size={14} />
            {t('workflow.badge')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('workflow.title')}{' '}
            <span className="text-primary">{t('workflow.titleHighlight')}</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            {t('workflow.description')}
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          {/* Status flow */}
          <div className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both border-border/50 bg-card/50 rounded-2xl border p-6 backdrop-blur-sm duration-700 md:p-8">
            <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
              {TASK_STATUSES.map(({ label, color }, i) => (
                <div key={label} className="flex items-center gap-3">
                  <span
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold ${color}`}
                  >
                    {label}
                  </span>
                  {i < TASK_STATUSES.length - 1 && (
                    <GUEST_ICONS.CHEVRON_RIGHT
                      size={16}
                      className="text-muted-foreground/40"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {[
                {
                  title: t('workflow.steps.0.title'),
                  desc: t('workflow.steps.0.desc'),
                  icon: GUEST_ICONS.LAYERS,
                },
                {
                  title: t('workflow.steps.1.title'),
                  desc: t('workflow.steps.1.desc'),
                  icon: GUEST_ICONS.ARROW_RIGHT,
                },
                {
                  title: t('workflow.steps.2.title'),
                  desc: t('workflow.steps.2.desc'),
                  icon: GUEST_ICONS.SHIELD_CHECK,
                },
                {
                  title: t('workflow.steps.3.title'),
                  desc: t('workflow.steps.3.desc'),
                  icon: GUEST_ICONS.CHECK,
                },
              ].map(({ title, desc, icon: Icon }, i) => (
                <div
                  key={i}
                  className="hover:bg-muted/20 flex items-start gap-4 rounded-xl p-3 transition-colors"
                >
                  <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="border-primary/20 from-primary/10 via-card/80 to-accent/10 relative mx-auto max-w-4xl overflow-hidden rounded-3xl border bg-linear-to-br p-12 text-center md:p-16">
          {/* Glow effect */}
          <div className="from-primary/5 pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br to-transparent" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {t('cta.title')}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-xl text-lg">
              {t('cta.description')}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="shadow-primary/25 hover:shadow-primary/30 group h-13 rounded-full px-8 text-base shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <Link to="/register">
                  {t('cta.btnStart')}
                  <GUEST_ICONS.ARROW_RIGHT className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border/50 hover:bg-muted h-13 rounded-full px-8 text-base transition-all hover:-translate-y-1"
              >
                <Link to="/contact">
                  <GUEST_ICONS.MESSAGE className="mr-2 h-4 w-4" />
                  {t('cta.btnContact')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Docs;
