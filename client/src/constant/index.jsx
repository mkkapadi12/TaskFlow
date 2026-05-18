import { DASHBOARD_ICONS } from "@/lib/icons/dashboard.icons";
import { GUEST_ICONS } from "@/lib/icons/guest.icons";

export const INFO_CARDS = [
  {
    icon: GUEST_ICONS.MAIL,
    title: "Email Us",
    detail: "support@taskflow.app",
    description: "We respond within 24 hours",
  },
  {
    icon: GUEST_ICONS.MAP_PIN,
    title: "Office",
    detail: "San Francisco, CA",
    description: "123 Market Street, Suite 400",
  },
  {
    icon: GUEST_ICONS.PHONE,
    title: "Phone",
    detail: "+1 (555) 123-4567",
    description: "Mon – Fri, 9 AM – 6 PM PST",
  },
  {
    icon: GUEST_ICONS.CLOCK,
    title: "Business Hours",
    detail: "Mon – Fri",
    description: "9:00 AM – 6:00 PM PST",
  },
];

export const FEATURES = [
  {
    icon: GUEST_ICONS.ZAP,
    title: "Lightning Fast",
    description:
      "Built for speed. Navigate your tasks and projects with zero friction and instant load times.",
  },
  {
    icon: GUEST_ICONS.SHIELD,
    title: "Secure & Private",
    description:
      "Your data is encrypted and stored securely. We prioritize your privacy above everything else.",
  },
  {
    icon: GUEST_ICONS.CHECK,
    title: "Stay Organized",
    description:
      "Powerful sorting, filtering, and categorization tools to keep your workflow crystal clear.",
  },
  {
    icon: GUEST_ICONS.USERS,
    title: "Team Collaboration",
    description:
      "Invite teammates, assign tasks, and track progress together in real-time workspaces.",
  },
  {
    icon: GUEST_ICONS.CHART,
    title: "Smart Analytics",
    description:
      "Visualize productivity trends and gain insights to optimize your work patterns.",
  },
  {
    icon: GUEST_ICONS.CLOCK,
    title: "Time Tracking",
    description:
      "Built-in time tracking to monitor how long tasks take and improve your estimates.",
  },
];

export const STATS = [
  { value: "50K+", label: "Active Users" },
  { value: "2M+", label: "Tasks Completed" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "User Rating" },
];

export const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: DASHBOARD_ICONS.LAYOUTDASHBOARD,
  },
  { to: "/calendar", label: "Calendar", icon: DASHBOARD_ICONS.CALENDAR },
  {
    to: "/projects",
    label: "Projects",
    icon: DASHBOARD_ICONS.SQUARESTACK,
  },
  { to: "/tasks", label: "Tasks", icon: DASHBOARD_ICONS.LISTCHECKS },
  { to: "/profile", label: "Profile", icon: DASHBOARD_ICONS.USER },
  { to: "/settings", label: "Settings", icon: DASHBOARD_ICONS.SETTINGS },
];

export const PAGE_TITLES = [
  {
    path: "/dashboard",
    title: "Dashboard",
    description: "Track your progress and manage your tasks",
  },
  {
    path: "/profile",
    title: "Profile",
    description: "View and edit your profile",
  },
  {
    path: "/settings",
    title: "Settings",
    description: "Manage your application settings",
  },
  {
    path: "/calendar",
    title: "Calendar",
    description: "View your schedule and appointments",
  },
  {
    path: "/projects",
    title: "Projects",
    description: "View and manage your projects",
  },
  {
    path: "/tasks",
    title: "Tasks",
    description: "View and manage your tasks",
  },
];

export const VALUES = [
  {
    icon: GUEST_ICONS.TARGET,
    title: "Focused Simplicity",
    description:
      "We strip away complexity so you can focus on what truly matters — getting things done.",
  },
  {
    icon: GUEST_ICONS.HEART,
    title: "User First",
    description:
      "Every feature is built with empathy. We listen, iterate, and ship what our users need.",
  },
  {
    icon: GUEST_ICONS.LIGHTBULB,
    title: "Continuous Innovation",
    description:
      "We push boundaries to deliver cutting-edge tools that redefine task management.",
  },
  {
    icon: GUEST_ICONS.SHIELD_CHECK,
    title: "Trust & Security",
    description:
      "Your data integrity and privacy are non-negotiable. We encrypt and protect everything.",
  },
  {
    icon: GUEST_ICONS.ROCKET,
    title: "Performance Driven",
    description:
      "Speed is a feature. We obsess over milliseconds so your workflow is never interrupted.",
  },
  {
    icon: GUEST_ICONS.USERS,
    title: "Community Powered",
    description:
      "Built by the community, for the community. Your feedback shapes our roadmap.",
  },
];

export const TEAM = [
  {
    name: "Alex Rivera",
    role: "Founder & CEO",
    initials: "AR",
  },
  {
    name: "Sarah Chen",
    role: "Lead Designer",
    initials: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "Full-Stack Engineer",
    initials: "MJ",
  },
  {
    name: "Priya Patel",
    role: "Product Manager",
    initials: "PP",
  },
];
