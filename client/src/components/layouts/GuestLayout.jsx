import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GUEST_ICONS } from "@/lib/icons/guest.icons";
import { ThemeToggle } from "@/helper/ThemeToggle";
const { DASHBOARD: LayoutDashboard, MENU: Menu, CLOSE: X } = GUEST_ICONS;

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const GuestLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/30 relative overflow-hidden">
      {/* ── Ambient glow blobs ── */}
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-accent/20 blur-[120px]" />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20">
              <LayoutDashboard size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
              TaskFlow
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              to="/login"
              className="hidden sm:inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </Link>

            <Button
              asChild
              className="hidden sm:inline-flex rounded-full px-5 shadow-md shadow-primary/20 transition-transform hover:-translate-y-0.5"
            >
              <Link to="/register">Sign up</Link>
            </Button>

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
            <div className="container mx-auto px-6 py-4 flex flex-col gap-2">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              <div className="border-t border-border/40 mt-2 pt-4 flex flex-col gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-xl"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link to="/login">Log in</Link>
                </Button>
                <Button
                  asChild
                  className="w-full rounded-xl shadow-md shadow-primary/20"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Page content ── */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-border/40 bg-background/40 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent text-primary-foreground">
                <LayoutDashboard size={16} strokeWidth={2.5} />
              </div>
              <span className="font-semibold tracking-tight">TaskFlow</span>
            </div>

            {/* Footer nav */}
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestLayout;
