import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GUEST_ICONS } from "@/lib/icons/guest.icons";

const ErrorPage = () => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-6">
      {/* ── Animated background shapes ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Top-left glow */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
        {/* Bottom-right glow */}
        <div
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        {/* Center glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/3 blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {/* Floating dots */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-primary/20"
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
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/10 px-4 py-1.5 text-sm font-medium text-destructive shadow-sm mb-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
          </span>
          Page Not Found
        </div>

        {/* 404 Large number */}
        <div className="relative mb-6">
          <h1 className="text-[10rem] sm:text-[14rem] font-extrabold leading-none tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-primary/80 to-primary/10 select-none">
            404
          </h1>
          {/* Shadow text behind */}
          <h1
            className="absolute inset-0 text-[10rem] sm:text-[14rem] font-extrabold leading-none tracking-tighter text-primary/5 blur-sm select-none"
            aria-hidden="true"
          >
            404
          </h1>
        </div>

        {/* Glass card with error details */}
        <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-black/5 p-8 mb-8 w-full max-w-lg animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 fill-mode-both">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GUEST_ICONS.SPARKLES size={18} className="text-primary" />
            <h2 className="text-xl font-bold tracking-tight">
              Oops! Lost in space
            </h2>
            <GUEST_ICONS.SPARKLES size={18} className="text-primary" />
          </div>

          <p className="text-muted-foreground leading-relaxed mb-4">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back on track.
          </p>

          {/* Requested path display */}
          <div className="rounded-lg border border-border/50 bg-muted/50 px-4 py-2.5 font-mono text-sm text-muted-foreground break-all">
            <span className="text-destructive/80 font-semibold">GET</span>{" "}
            {location.pathname}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-400 fill-mode-both">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto h-13 px-8 text-base rounded-full shadow-xl shadow-primary/25 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 group"
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
            className="w-full sm:w-auto h-13 px-8 text-base rounded-full border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-muted hover:-translate-y-1 group"
          >
            <Link to="/login">
              Sign In
              <GUEST_ICONS.ARROW_RIGHT className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Footer text */}
        <p className="mt-12 text-xs text-muted-foreground/60 animate-in fade-in duration-1000 delay-700 fill-mode-both">
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
