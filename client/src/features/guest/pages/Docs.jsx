import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { GUEST_ICONS } from '@/lib/icons/guest.icons';

// ── Documentation data ──

const QUICK_START_STEPS = [
  {
    step: '01',
    icon: GUEST_ICONS.USER,
    title: 'Create an Account',
    description:
      "Sign up with your email and password. You'll receive a welcome email to confirm your account.",
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
    title: 'Authenticate',
    description:
      'Log in to receive your JWT token. Include it in the Authorization header for all subsequent requests.',
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
    title: 'Create a Project',
    description:
      "Start organizing your work by creating a project. You'll automatically become the project owner.",
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
    title: 'Add Tasks',
    description: `Create tasks within your project. Assign them to team members and set priorities and deadlines.`,
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
    title: 'Authentication',
    description: 'Register, login, and manage user sessions with JWT tokens.',
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/register',
        description: 'Create a new user account and receive a JWT token',
        auth: false,
      },
      {
        method: 'POST',
        path: '/api/auth/login',
        description: 'Authenticate and receive a JWT token',
        auth: false,
      },
    ],
  },
  {
    id: 'users',
    icon: GUEST_ICONS.USERS,
    title: 'Users',
    description: 'Manage user profiles, avatars, and account settings.',
    endpoints: [
      {
        method: 'GET',
        path: '/api/users/profile',
        description: `'Get the authenticated user's profile'`,
        auth: true,
      },
      {
        method: 'PUT',
        path: '/api/users/profile',
        description: 'Update profile information and avatar',
        auth: true,
      },
      {
        method: 'GET',
        path: '/api/users/:id',
        description: 'Get a specific user by ID',
        auth: true,
      },
      {
        method: 'GET',
        path: '/api/users/',
        description: 'List all users (Admin only)',
        auth: true,
        admin: true,
      },
    ],
  },
  {
    id: 'projects',
    icon: GUEST_ICONS.LAYERS,
    title: 'Projects',
    description:
      'Create and manage projects, invite members with role-based access.',
    endpoints: [
      {
        method: 'POST',
        path: '/api/projects/create',
        description: 'Create a new project',
        auth: true,
        admin: true,
      },
      {
        method: 'GET',
        path: '/api/projects/my',
        description: "List projects you're a member of",
        auth: true,
      },
      {
        method: 'GET',
        path: '/api/projects/:projectId',
        description: 'Get full project details with members and tasks',
        auth: true,
      },
      {
        method: 'PUT',
        path: '/api/projects/:projectId',
        description: 'Update project title, description, or status',
        auth: true,
      },
      {
        method: 'DELETE',
        path: '/api/projects/:projectId',
        description: 'Delete a project and all associated data',
        auth: true,
      },
      {
        method: 'POST',
        path: '/api/projects/:projectId/add-member',
        description: 'Add a member to the project',
        auth: true,
        admin: true,
      },
    ],
  },
  {
    id: 'tasks',
    icon: GUEST_ICONS.CHECK,
    title: 'Tasks',
    description:
      'Create, assign, and track tasks with status workflows and priority levels.',
    endpoints: [
      {
        method: 'POST',
        path: '/api/tasks/',
        description: 'Create a new task in a project',
        auth: true,
      },
      {
        method: 'GET',
        path: '/api/tasks/my',
        description: 'Get all tasks assigned to you',
        auth: true,
      },
      {
        method: 'GET',
        path: '/api/tasks/overdue',
        description: 'Get your overdue tasks',
        auth: true,
      },
      {
        method: 'GET',
        path: '/api/tasks/project/:projectId',
        description: 'List all tasks for a project',
        auth: true,
      },
      {
        method: 'PUT',
        path: '/api/tasks/:taskId',
        description: 'Update task fields (title, priority, deadline)',
        auth: true,
      },
      {
        method: 'PATCH',
        path: '/api/tasks/:taskId/status',
        description: 'Move task between statuses',
        auth: true,
      },
      {
        method: 'PATCH',
        path: '/api/tasks/:taskId/verify',
        description: 'Approve or reject a task in review (Owner only)',
        auth: true,
      },
      {
        method: 'DELETE',
        path: '/api/tasks/:taskId',
        description: 'Delete a task',
        auth: true,
      },
    ],
  },
];

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
  const [activeSection, setActiveSection] = useState('auth');

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both mx-auto max-w-3xl text-center duration-1000">
          <div className="border-primary/20 bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.BOOK_OPEN size={14} />
            Documentation
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Build with <span className="text-primary">TaskFlow API</span>
          </h1>

          <p className="text-muted-foreground mt-6 text-lg leading-relaxed sm:text-xl">
            Everything you need to integrate with TaskFlow. Explore our REST
            API, authentication guides, and workflow documentation to get
            started in minutes.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="shadow-primary/25 hover:shadow-primary/30 group h-13 rounded-full px-8 text-base shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
              <a href="#quickstart">
                <GUEST_ICONS.PLAY className="mr-2 h-4 w-4" />
                Quick Start
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
                API Reference
              </a>
            </Button>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="animate-in fade-in slide-in-from-bottom-12 fill-mode-both mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 delay-200 duration-1000 sm:grid-cols-3">
          {[
            {
              icon: GUEST_ICONS.ZAP,
              label: 'RESTful API',
              detail: 'Clean, intuitive endpoints',
            },
            {
              icon: GUEST_ICONS.SHIELD,
              label: 'JWT Auth',
              detail: 'Secure token-based access',
            },
            {
              icon: GUEST_ICONS.SERVER,
              label: 'OpenAPI 3.0',
              detail: 'Full Swagger documentation',
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
            Quick Start
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Up and running in <span className="text-primary">4 steps</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Follow these steps to start managing projects and tasks with the
            TaskFlow API.
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
            API Reference
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Complete <span className="text-primary">endpoint reference</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Explore all available endpoints organized by resource. All endpoints
            use the base URL{' '}
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
            Authentication
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Secure <span className="text-primary">token-based</span> auth
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            TaskFlow uses JWT (JSON Web Tokens) for authentication. Include your
            token in every request to access protected resources.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Auth flow card */}
          <div className="animate-in fade-in slide-in-from-left-8 fill-mode-both border-border/50 bg-card/50 rounded-2xl border p-6 backdrop-blur-sm duration-700 md:p-8">
            <h3 className="mb-6 text-lg font-bold">How Authentication Works</h3>
            <div className="space-y-4">
              {[
                {
                  num: '1',
                  title: 'Register or Login',
                  desc: 'Call the auth endpoint with your credentials',
                },
                {
                  num: '2',
                  title: 'Receive JWT Token',
                  desc: 'Server returns a signed JWT in the response',
                },
                {
                  num: '3',
                  title: 'Include in Requests',
                  desc: 'Add the token to the Authorization header',
                },
                {
                  num: '4',
                  title: 'Access Resources',
                  desc: 'Server validates the token and returns data',
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
              <h3 className="mb-4 text-lg font-bold">Example Request</h3>
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
                  Authorization Roles
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      role: 'OWNER',
                      desc: 'Full control — manage members, verify tasks',
                    },
                    {
                      role: 'ADMIN',
                      desc: 'Create projects, manage tasks and members',
                    },
                    {
                      role: 'MEMBER',
                      desc: 'View project, update assigned tasks',
                    },
                  ].map(({ role, desc }) => (
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
            Workflow
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Task <span className="text-primary">status workflow</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Tasks follow a structured workflow from creation to completion, with
            a verification step to ensure quality.
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
                  title: 'Task Creation',
                  desc: 'Owner or Admin creates a task and optionally assigns it to a project member. Status starts as TODO.',
                  icon: GUEST_ICONS.LAYERS,
                },
                {
                  title: 'Status Transitions',
                  desc: 'The assignee or any manager can move tasks through TODO → IN_PROGRESS → IN_REVIEW using the status endpoint.',
                  icon: GUEST_ICONS.ARROW_RIGHT,
                },
                {
                  title: 'Verification',
                  desc: 'Only the project Owner can approve (→ DONE) or reject (→ IN_PROGRESS) tasks that are IN_REVIEW.',
                  icon: GUEST_ICONS.SHIELD_CHECK,
                },
                {
                  title: 'Completion',
                  desc: 'DONE status is only reachable through the verify endpoint — it cannot be set directly.',
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
              Ready to start building?
            </h2>
            <p className="text-muted-foreground mx-auto max-w-xl text-lg">
              Create your free account and start integrating with the TaskFlow
              API in minutes. Full Swagger documentation available at{' '}
              <code className="bg-muted/50 rounded px-1.5 py-0.5 text-sm">
                /api/docs
              </code>
              .
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="shadow-primary/25 hover:shadow-primary/30 group h-13 rounded-full px-8 text-base shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <Link to="/register">
                  Get API Access
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
                  Contact Support
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
