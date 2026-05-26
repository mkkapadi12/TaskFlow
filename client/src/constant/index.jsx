import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { GUEST_ICONS } from '@/lib/icons/guest.icons';

export const INFO_CARDS = [
  {
    icon: GUEST_ICONS.MAIL,
    title: 'Email Us',
    detail: 'support@taskflow.app',
    description: 'We respond within 24 hours',
  },
  {
    icon: GUEST_ICONS.MAP_PIN,
    title: 'Office',
    detail: 'San Francisco, CA',
    description: '123 Market Street, Suite 400',
  },
  {
    icon: GUEST_ICONS.PHONE,
    title: 'Phone',
    detail: '+1 (555) 123-4567',
    description: 'Mon – Fri, 9 AM – 6 PM PST',
  },
  {
    icon: GUEST_ICONS.CLOCK,
    title: 'Business Hours',
    detail: 'Mon – Fri',
    description: '9:00 AM – 6:00 PM PST',
  },
];

export const FEATURES = [
  {
    icon: GUEST_ICONS.ZAP,
    title: 'Lightning Fast',
    description:
      'Built for speed. Navigate your tasks and projects with zero friction and instant load times.',
  },
  {
    icon: GUEST_ICONS.SHIELD,
    title: 'Secure & Private',
    description:
      'Your data is encrypted and stored securely. We prioritize your privacy above everything else.',
  },
  {
    icon: GUEST_ICONS.CHECK,
    title: 'Stay Organized',
    description:
      'Powerful sorting, filtering, and categorization tools to keep your workflow crystal clear.',
  },
  {
    icon: GUEST_ICONS.USERS,
    title: 'Team Collaboration',
    description:
      'Invite teammates, assign tasks, and track progress together in real-time workspaces.',
  },
  {
    icon: GUEST_ICONS.CHART,
    title: 'Smart Analytics',
    description:
      'Visualize productivity trends and gain insights to optimize your work patterns.',
  },
  {
    icon: GUEST_ICONS.CLOCK,
    title: 'Time Tracking',
    description:
      'Built-in time tracking to monitor how long tasks take and improve your estimates.',
  },
];

export const STATS = [
  { value: '50K+', label: 'Active Users' },
  { value: '2M+', label: 'Tasks Completed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9★', label: 'User Rating' },
];

export const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: DASHBOARD_ICONS.LAYOUTDASHBOARD,
  },
  { to: '/calendar', label: 'Calendar', icon: DASHBOARD_ICONS.CALENDAR },
  {
    to: '/projects',
    label: 'Projects',
    icon: DASHBOARD_ICONS.SQUARESTACK,
  },
  {
    to: '/analytics',
    label: 'Analytics',
    icon: DASHBOARD_ICONS.TRENDINGUP,
  },
  {
    to: '/documents',
    label: 'Requirements',
    icon: DASHBOARD_ICONS.FILETEXT,
  },
  { to: '/tasks', label: 'Tasks', icon: DASHBOARD_ICONS.LISTCHECKS },
  { to: '/profile', label: 'Profile', icon: DASHBOARD_ICONS.USER },
  { to: '/settings', label: 'Settings', icon: DASHBOARD_ICONS.SETTINGS },
];

export const PAGE_TITLES = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    description: 'Track your progress and manage your tasks',
  },
  {
    path: '/profile',
    title: 'Profile',
    description: 'View and edit your profile',
  },
  {
    path: '/settings',
    title: 'Settings',
    description: 'Manage your application settings',
  },
  {
    path: '/calendar',
    title: 'Calendar',
    description: 'View your schedule and appointments',
  },
  {
    path: '/projects',
    title: 'Projects',
    description: 'View and manage your projects',
  },
  {
    path: '/analytics',
    title: 'Analytics',
    description:
      'Visualize productivity trends, workloads, and task efficiency',
  },
  {
    path: '/documents',
    title: 'Documents',
    description: 'View and manage your documents',
  },
  {
    path: '/tasks',
    title: 'Tasks',
    description: 'View and manage your tasks',
  },
];

export const VALUES = [
  {
    icon: GUEST_ICONS.TARGET,
    title: 'Focused Simplicity',
    description:
      'We strip away complexity so you can focus on what truly matters — getting things done.',
  },
  {
    icon: GUEST_ICONS.HEART,
    title: 'User First',
    description:
      'Every feature is built with empathy. We listen, iterate, and ship what our users need.',
  },
  {
    icon: GUEST_ICONS.LIGHTBULB,
    title: 'Continuous Innovation',
    description:
      'We push boundaries to deliver cutting-edge tools that redefine task management.',
  },
  {
    icon: GUEST_ICONS.SHIELD_CHECK,
    title: 'Trust & Security',
    description:
      'Your data integrity and privacy are non-negotiable. We encrypt and protect everything.',
  },
  {
    icon: GUEST_ICONS.ROCKET,
    title: 'Performance Driven',
    description:
      'Speed is a feature. We obsess over milliseconds so your workflow is never interrupted.',
  },
  {
    icon: GUEST_ICONS.USERS,
    title: 'Community Powered',
    description:
      'Built by the community, for the community. Your feedback shapes our roadmap.',
  },
];

export const TEAM = [
  {
    name: 'Alex Rivera',
    role: 'Founder & CEO',
    initials: 'AR',
  },
  {
    name: 'Sarah Chen',
    role: 'Lead Designer',
    initials: 'SC',
  },
  {
    name: 'Marcus Johnson',
    role: 'Full-Stack Engineer',
    initials: 'MJ',
  },
  {
    name: 'Priya Patel',
    role: 'Product Manager',
    initials: 'PP',
  },
];

export const statusConfig = {
  TODO: {
    label: 'To Do',
    className: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    dot: 'bg-sky-500',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    dot: 'bg-violet-500',
  },
  IN_REVIEW: {
    label: 'In Review',
    className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    dot: 'bg-amber-500',
  },
  DONE: {
    label: 'Done',
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
};

export const priorityConfig = {
  LOW: {
    label: 'Low',
    className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  MEDIUM: {
    label: 'Medium',
    className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  HIGH: {
    label: 'High',
    className: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  },
  URGENT: {
    label: 'Urgent',
    className: 'bg-red-500/10 text-red-500 border-red-500/20',
  },
};

export const EXT_COLORS = {
  // =========================
  // 📄 Text & Documents
  // =========================
  pdf: 'bg-blue-500/10 text-blue-500',

  doc: 'bg-blue-500/10 text-blue-500',
  docx: 'bg-blue-500/10 text-blue-500',

  txt: 'bg-blue-500/10 text-blue-500',

  md: 'bg-sky-500/10 text-sky-500',

  // =========================
  // 📊 Spreadsheets & Data
  // =========================
  xls: 'bg-emerald-500/10 text-emerald-500',
  xlsx: 'bg-emerald-500/10 text-emerald-500',

  csv: 'bg-emerald-500/10 text-emerald-500',
  tsv: 'bg-emerald-500/10 text-emerald-500',

  // =========================
  // 📽️ Presentations
  // =========================
  ppt: 'bg-orange-500/10 text-orange-500',
  pptx: 'bg-orange-500/10 text-orange-500',

  // =========================
  // 🖼️ Images & Media
  // =========================
  jpg: 'bg-pink-500/10 text-pink-500',
  jpeg: 'bg-pink-500/10 text-pink-500',
  png: 'bg-pink-500/10 text-pink-500',
  webp: 'bg-pink-500/10 text-pink-500',
  gif: 'bg-pink-500/10 text-pink-500',

  svg: 'bg-cyan-500/10 text-cyan-500',

  // =========================
  // ⚙️ Code & Config
  // =========================
  json: 'bg-yellow-500/10 text-yellow-500',

  js: 'bg-yellow-500/10 text-yellow-500',
  jsx: 'bg-yellow-500/10 text-yellow-500',
  ts: 'bg-yellow-500/10 text-yellow-500',
  tsx: 'bg-yellow-500/10 text-yellow-500',

  html: 'bg-yellow-500/10 text-yellow-500',
  css: 'bg-yellow-500/10 text-yellow-500',

  py: 'bg-yellow-500/10 text-yellow-500',

  // =========================
  // ⚙️ System / Executables
  // =========================
  exe: 'bg-zinc-500/10 text-zinc-500',
  dll: 'bg-zinc-500/10 text-zinc-500',
  bat: 'bg-zinc-500/10 text-zinc-500',
  sh: 'bg-zinc-500/10 text-zinc-500',

  // =========================
  // 📦 Archives
  // =========================
  zip: 'bg-stone-500/10 text-stone-500',
  rar: 'bg-stone-500/10 text-stone-500',
  tar: 'bg-stone-500/10 text-stone-500',
  '7z': 'bg-stone-500/10 text-stone-500',

  // =========================
  // ❓ Default
  // =========================
  default: 'bg-muted text-muted-foreground',
};
