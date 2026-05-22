import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { GUEST_ICONS } from '@/lib/icons/guest.icons';
import { cn } from '@/lib/utils';

// ── Color palettes (MASTER §4 — dual light/dark) ──

const TASK_STATUS_STYLES = {
  TODO: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  IN_REVIEW:
    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  DONE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
};

const TASK_STATUSES = [
  { label: 'TODO', style: TASK_STATUS_STYLES.TODO },
  { label: 'IN_PROGRESS', style: TASK_STATUS_STYLES.IN_PROGRESS },
  { label: 'IN_REVIEW', style: TASK_STATUS_STYLES.IN_REVIEW },
  { label: 'DONE', style: TASK_STATUS_STYLES.DONE },
];

const METHOD_STYLES = {
  GET: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900',
  POST: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900',
  PUT: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900',
  PATCH:
    'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-900',
  DELETE:
    'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900',
};

// ── Sub-components ──

const MethodBadge = ({ method }) => (
  <span
    className={cn(
      'inline-flex min-w-[60px] items-center justify-center rounded-md border px-2 py-0.5 text-[11px] font-bold tracking-wider',
      METHOD_STYLES[method]
    )}
  >
    {method}
  </span>
);

const ChipBadge = ({ tone, icon: Icon, children }) => {
  const toneClasses = {
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium',
        toneClasses[tone]
      )}
    >
      <Icon size={10} aria-hidden="true" />
      {children}
    </span>
  );
};

const CodeBlock = ({ children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group/code relative">
      <pre className="border-border bg-muted overflow-x-auto rounded-xl border p-4 text-sm leading-relaxed">
        <code className="text-foreground">{children}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/50 absolute top-2 right-2 rounded-md p-1.5 opacity-0 group-hover/code:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 motion-safe:transition-opacity"
        aria-label="Copy code"
      >
        {copied ? (
          <GUEST_ICONS.CHECK size={14} aria-hidden="true" />
        ) : (
          <GUEST_ICONS.COPY size={14} aria-hidden="true" />
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
        {
          method: 'POST',
          path: '/api/auth/forgot-password',
          description: t('reference.sections.auth.endpoints.2'),
          auth: false,
        },
        {
          method: 'POST',
          path: '/api/auth/reset-password',
          description: t('reference.sections.auth.endpoints.3'),
          auth: false,
        },
        {
          method: 'POST',
          path: '/api/auth/change-password',
          description: t('reference.sections.auth.endpoints.4'),
          auth: true,
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
    {
      id: 'notifications',
      icon: GUEST_ICONS.BELL,
      title: t('reference.sections.notifications.title'),
      description: t('reference.sections.notifications.description'),
      endpoints: [
        {
          method: 'GET',
          path: '/api/notifications/settings',
          description: t('reference.sections.notifications.endpoints.0'),
          auth: true,
        },
        {
          method: 'PATCH',
          path: '/api/notifications/settings',
          description: t('reference.sections.notifications.endpoints.1'),
          auth: true,
        },
      ],
    },
    {
      id: 'documents',
      icon: GUEST_ICONS.FILE_TEXT,
      title: t('reference.sections.documents.title'),
      description: t('reference.sections.documents.description'),
      endpoints: [
        {
          method: 'GET',
          path: '/api/projects/:projectId/documents',
          description: t('reference.sections.documents.endpoints.0'),
          auth: true,
        },
        {
          method: 'POST',
          path: '/api/projects/:projectId/documents',
          description: t('reference.sections.documents.endpoints.1'),
          auth: true,
          admin: true,
        },
        {
          method: 'DELETE',
          path: '/api/projects/:projectId/documents/:documentId',
          description: t('reference.sections.documents.endpoints.2'),
          auth: true,
          admin: true,
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
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both mx-auto max-w-3xl text-center duration-1000">
          <div className="border-primary/20 bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.BOOK_OPEN size={14} aria-hidden="true" />
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
              className="group h-13 rounded-full px-8 text-base"
            >
              <a href="#quickstart">
                <GUEST_ICONS.PLAY className="mr-2 h-4 w-4" aria-hidden="true" />
                {t('hero.btnQuickstart')}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border bg-card hover:bg-accent/40 h-13 rounded-full px-8 text-base motion-safe:transition-colors"
            >
              <a href="#api-reference">
                <GUEST_ICONS.CODE className="mr-2 h-4 w-4" aria-hidden="true" />
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
              className="border-border bg-card flex items-center gap-4 rounded-2xl border p-5"
            >
              <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                <Icon size={20} aria-hidden="true" />
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
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both mx-auto mb-14 max-w-2xl text-center duration-700">
          <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.ROCKET size={14} aria-hidden="true" />
            {t('quickstart.badge')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('quickstart.title')}{' '}
            <span className="text-primary">
              {t('quickstart.titleHighlight')}
            </span>
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
                className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both group border-border bg-card hover:bg-accent/40 rounded-2xl border motion-safe:transition-colors"
                style={{
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '500ms',
                }}
              >
                <div className="flex flex-col gap-6 p-6 md:flex-row md:p-8">
                  {/* Step indicator */}
                  <div className="flex shrink-0 items-start gap-4 md:flex-col md:items-center">
                    <div className="border-border bg-muted group-hover:border-primary/40 flex h-14 w-14 items-center justify-center rounded-2xl border motion-safe:transition-colors">
                      <Icon
                        size={24}
                        className="text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <span className="text-muted-foreground text-3xl font-black">
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
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both mx-auto mb-14 max-w-2xl text-center duration-700">
          <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.CODE size={14} aria-hidden="true" />
            {t('reference.badge')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('reference.title')}{' '}
            <span className="text-primary">
              {t('reference.titleHighlight')}
            </span>
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
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium motion-safe:transition-colors',
                  activeSection === id
                    ? 'bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:bg-accent/40 hover:text-foreground border'
                )}
              >
                <Icon size={16} aria-hidden="true" />
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
                <div className="border-border bg-card mb-4 rounded-2xl border p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                      <Icon size={20} aria-hidden="true" />
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
                        className="group border-border bg-card hover:bg-accent/40 flex flex-col gap-3 rounded-xl border p-4 motion-safe:transition-colors sm:flex-row sm:items-center sm:gap-4"
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
                            <ChipBadge tone="amber" icon={GUEST_ICONS.LOCK}>
                              Auth
                            </ChipBadge>
                          )}
                          {admin && (
                            <ChipBadge tone="red" icon={GUEST_ICONS.SHIELD}>
                              Admin
                            </ChipBadge>
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
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both mx-auto mb-14 max-w-2xl text-center duration-700">
          <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.SHIELD_CHECK size={14} aria-hidden="true" />
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
          <div className="animate-in fade-in slide-in-from-left-8 fill-mode-both border-border bg-card rounded-2xl border p-6 duration-700 md:p-8">
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
                  <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold">
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
            <div className="border-border bg-card rounded-2xl border p-6 md:p-8">
              <h3 className="mb-4 text-lg font-bold">
                {t('auth.exampleRequest')}
              </h3>
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
                      className="bg-muted flex items-center gap-3 rounded-lg p-2.5"
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
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both mx-auto mb-14 max-w-2xl text-center duration-700">
          <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.TERMINAL size={14} aria-hidden="true" />
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
          <div className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both border-border bg-card rounded-2xl border p-6 duration-700 md:p-8">
            <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
              {TASK_STATUSES.map(({ label, style }, i) => (
                <div key={label} className="flex items-center gap-3">
                  <span
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-bold',
                      style
                    )}
                  >
                    {label}
                  </span>
                  {i < TASK_STATUSES.length - 1 && (
                    <GUEST_ICONS.CHEVRON_RIGHT
                      size={16}
                      className="text-muted-foreground"
                      aria-hidden="true"
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
                  className="hover:bg-accent/40 flex items-start gap-4 rounded-xl p-3 motion-safe:transition-colors"
                >
                  <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                    <Icon size={18} aria-hidden="true" />
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
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="border-border bg-card relative mx-auto max-w-4xl overflow-hidden rounded-3xl border p-12 text-center md:p-16">
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
                className="group h-13 rounded-full px-8 text-base"
              >
                <Link to="/register">
                  {t('cta.btnStart')}
                  <GUEST_ICONS.ARROW_RIGHT
                    className="ml-2 h-5 w-5 group-hover:translate-x-1 motion-safe:transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border hover:bg-accent/40 h-13 rounded-full px-8 text-base motion-safe:transition-colors"
              >
                <a href="/api/docs" target="_blank" rel="noopener noreferrer">
                  <GUEST_ICONS.EXTERNAL_LINK
                    className="mr-2 h-4 w-4"
                    aria-hidden="true"
                  />
                  {t('cta.btnDocs')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Docs;
