import { Link, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { GUEST_ICONS } from '@/lib/icons/guest.icons';

const ErrorPage = () => {
  const location = useLocation();

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* ── Animated background shapes ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Top-left glow */}
        <div className="bg-primary/5 absolute -top-32 -left-32 h-96 w-96 animate-pulse rounded-full blur-3xl" />
        {/* Bottom-right glow */}
        <div
          className="bg-primary/5 absolute -right-32 -bottom-32 h-96 w-96 animate-pulse rounded-full blur-3xl"
          style={{ animationDelay: '1s' }}
        />
        {/* Center glow */}
        <div
          className="bg-primary/3 absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full blur-[120px]"
          style={{ animationDelay: '2s' }}
        />

        {/* Floating dots */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-primary/20 absolute h-1.5 w-1.5 rounded-full"
            style={{
              top: `${15 + i * 14}%`,
              left: `${10 + i * 15}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* ── Grid overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Main content ── */}
      <div className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both relative z-10 flex max-w-2xl flex-col items-center text-center duration-1000">
        {/* Badge */}
        <div className="border-destructive/20 bg-destructive/10 text-destructive mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="bg-destructive absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
            <span className="bg-destructive relative inline-flex h-2 w-2 rounded-full" />
          </span>
          Page Not Found
        </div>

        {/* 404 Large number */}
        <div className="relative mb-6">
          <h1 className="from-primary/80 to-primary/10 bg-linear-to-b bg-clip-text text-[10rem] leading-none font-extrabold tracking-tighter text-transparent select-none sm:text-[14rem]">
            404
          </h1>
          {/* Shadow text behind */}
          <h1
            className="text-primary/5 absolute inset-0 text-[10rem] leading-none font-extrabold tracking-tighter blur-sm select-none sm:text-[14rem]"
            aria-hidden="true"
          >
            404
          </h1>
        </div>

        {/* Glass card with error details */}
        <div className="border-border/50 bg-card/50 animate-in fade-in slide-in-from-bottom-12 fill-mode-both mb-8 w-full max-w-lg rounded-2xl border p-8 shadow-xl shadow-black/5 backdrop-blur-sm delay-200 duration-1000">
          <div className="mb-4 flex items-center justify-center gap-2">
            <GUEST_ICONS.SPARKLES size={18} className="text-primary" />
            <h2 className="text-xl font-bold tracking-tight">
              Oops! Lost in space
            </h2>
            <GUEST_ICONS.SPARKLES size={18} className="text-primary" />
          </div>

          <p className="text-muted-foreground mb-4 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back on track.
          </p>

          {/* Requested path display */}
          <div className="border-border/50 bg-muted/50 text-muted-foreground rounded-lg border px-4 py-2.5 font-mono text-sm break-all">
            <span className="text-destructive/80 font-semibold">GET</span>{' '}
            {location.pathname}
          </div>
        </div>

        {/* Action buttons */}
        <div className="animate-in fade-in slide-in-from-bottom-16 fill-mode-both flex flex-col items-center justify-center gap-4 delay-400 duration-1000 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="shadow-primary/25 hover:shadow-primary/30 group h-13 w-full rounded-full px-8 text-base shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl sm:w-auto"
          >
            <Link to="/">
              <GUEST_ICONS.HOME className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-border/50 bg-background/50 hover:bg-muted group h-13 w-full rounded-full px-8 text-base backdrop-blur-sm transition-all hover:-translate-y-1 sm:w-auto"
          >
            <Link to="/login">
              Sign In
              <GUEST_ICONS.ARROW_RIGHT className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Footer text */}
        <p className="text-muted-foreground/60 animate-in fade-in fill-mode-both mt-12 text-xs delay-700 duration-1000">
          TaskFlow &mdash; Organize your work. Empower your life.
        </p>
      </div>

      {/* ── Float keyframes (injected via style tag) ── */}
      <style>{`
        @keyframes float {
          from { transform: translateY(0px); }
          to   { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;
