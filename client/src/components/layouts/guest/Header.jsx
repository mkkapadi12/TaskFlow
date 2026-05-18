import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GUEST_ICONS } from "@/lib/icons/guest.icons";
import { ThemeToggle } from "@/helper/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = ({ navLinks }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20">
            <GUEST_ICONS.DASHBOARD size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
              TaskFlow
            </span>
            <span className="text-[10px] text-primary font-medium -mt-1 flex items-center gap-1">
              <GUEST_ICONS.SPARKLES size={10} />
              Next Gen
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <a
            href="#"
            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all flex items-center gap-1"
          >
            Docs
            <Badge
              variant="outline"
              className="text-[10px] px-1 py-0 h-4 border-primary/30 text-primary"
            >
              New
            </Badge>
          </a>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            to="/login"
            className="hidden sm:inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground px-3 py-2"
          >
            Log in
          </Link>

          <Button
            asChild
            className="hidden sm:inline-flex rounded-full px-5 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/25"
          >
            <Link to="/register">Get Started</Link>
          </Button>

          {/* Mobile hamburger (Sheet Trigger) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full"
                aria-label="Toggle menu"
              >
                <GUEST_ICONS.MENU size={20} />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-3/4 max-w-xs p-6 flex flex-col gap-6"
            >
              <SheetHeader className="p-0 text-left">
                <SheetTitle>
                  <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent text-primary-foreground">
                      <GUEST_ICONS.DASHBOARD size={18} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-lg tracking-tight">
                      TaskFlow
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              {/* Nav Links */}
              <nav className="flex flex-col gap-1">
                {navLinks.map(({ to, label }) => {
                  const Icon =
                    label === "Home"
                      ? GUEST_ICONS.HOME
                      : label === "About"
                        ? GUEST_ICONS.INFO
                        : label === "Contact"
                          ? GUEST_ICONS.MAIL
                          : GUEST_ICONS.DASHBOARD;

                  return (
                    <NavLink
                      key={to}
                      to={to}
                      end={to === "/"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? "text-primary bg-primary/10 font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            size={18}
                            className={
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground"
                            }
                          />
                          {label}
                        </>
                      )}
                    </NavLink>
                  );
                })}

                <a
                  href="#"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors justify-between"
                >
                  <div className="flex items-center gap-3">
                    <GUEST_ICONS.LIGHTBULB size={18} />
                    Documentation
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-primary/30 text-primary"
                  >
                    New
                  </Badge>
                </a>
              </nav>

              {/* Actions */}
              <div className="border-t border-border/40 mt-auto pt-6 flex flex-col gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-xl h-11 justify-center"
                >
                  <Link to="/login">Log in</Link>
                </Button>
                <Button
                  asChild
                  className="w-full rounded-xl h-11 justify-center shadow-lg shadow-primary/20"
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
