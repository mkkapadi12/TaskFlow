import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import { GUEST_ICONS } from "@/lib/icons/guest.icons";

const {
  CHECK: CheckCircle,
  ZAP: Zap,
  SHIELD_CHECK: ShieldCheck,
  USERS: Users,
} = GUEST_ICONS;

const HIGHLIGHTS = [
  { icon: Zap, text: "Real-time project tracking" },
  { icon: Users, text: "Seamless team collaboration" },
  { icon: ShieldCheck, text: "Secure role-based access" },
  { icon: CheckCircle, text: "Smart task management" },
];

const LoginPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-primary via-primary/90 to-accent-foreground">
        {/* Decorative orbs */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-primary-foreground w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center transition-transform group-hover:scale-105">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </Link>

          {/* Center content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
                Welcome back to
                <br />
                your workspace
              </h1>
              <p className="text-lg text-primary-foreground/70 max-w-md leading-relaxed">
                Pick up right where you left off. Your projects, tasks, and team
                are waiting.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-4">
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 text-primary-foreground/80"
                >
                  <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center bg-background px-6 py-12 lg:px-12">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 fill-mode-both">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">TaskFlow</span>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Sign in</h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
