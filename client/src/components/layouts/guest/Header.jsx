import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import LanguageSwitcher from '@/helper/LanguageSwitcher';
import { ThemeToggle } from '@/helper/ThemeToggle';
import { GUEST_ICONS } from '@/lib/icons/guest.icons';

const Header = ({ navLinks }) => {
  const { t } = useTranslation();

  return (
    <header className="border-border/40 bg-background/60 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="from-primary to-accent text-primary-foreground shadow-primary/20 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br shadow-lg">
            <GUEST_ICONS.DASHBOARD size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-xl font-bold tracking-tight text-transparent">
              TaskFlow
            </span>
            <span className="text-primary -mt-1 flex items-center gap-1 text-[10px] font-medium">
              <GUEST_ICONS.SPARKLES size={10} />
              {t('header.nextGen')}
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`
              }
            >
              {t(`nav.${label.toLowerCase()}`)}
            </NavLink>
          ))}

          <Link
            to="/docs"
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-all"
          >
            {t('header.docs')}
            <Badge
              variant="outline"
              className="border-primary/30 text-primary h-4 px-1 py-0 text-[10px]"
            >
              {t('header.new')}
            </Badge>
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher compact />
          <ThemeToggle />

          <Link
            to="/login"
            className="text-muted-foreground hover:text-foreground hidden px-3 py-2 text-sm font-medium transition-colors sm:inline-flex"
          >
            {t('auth.login')}
          </Link>

          <Button
            asChild
            className="shadow-primary/20 hover:shadow-primary/25 hidden rounded-full px-5 shadow-lg transition-all hover:-translate-y-0.5 sm:inline-flex"
          >
            <Link to="/register">{t('header.getStarted')}</Link>
          </Button>

          {/* Mobile hamburger (Sheet Trigger) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full md:hidden"
                aria-label="Toggle menu"
              >
                <GUEST_ICONS.MENU size={20} />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-3/4 max-w-xs flex-col gap-6 p-6"
            >
              <SheetHeader className="p-0 text-left">
                <SheetTitle>
                  <Link to="/" className="flex items-center gap-2">
                    <div className="from-primary to-accent text-primary-foreground flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br">
                      <GUEST_ICONS.DASHBOARD size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-bold tracking-tight">
                      TaskFlow
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              {/* Nav Links */}
              <nav className="flex flex-col gap-1">
                {navLinks.map(({ to, label }) => {
                  const Icon =
                    label === 'Home'
                      ? GUEST_ICONS.HOME
                      : label === 'About'
                        ? GUEST_ICONS.INFO
                        : label === 'Contact'
                          ? GUEST_ICONS.MAIL
                          : GUEST_ICONS.DASHBOARD;

                  return (
                    <NavLink
                      key={to}
                      to={to}
                      end={to === '/'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                          isActive
                            ? 'text-primary bg-primary/10 font-semibold'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            size={18}
                            className={
                              isActive
                                ? 'text-primary'
                                : 'text-muted-foreground'
                            }
                          />
                          {t(`nav.${label.toLowerCase()}`)}
                        </>
                      )}
                    </NavLink>
                  );
                })}

                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50 flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <GUEST_ICONS.LIGHTBULB size={18} />
                    {t('nav.documentation')}
                  </div>
                  <Badge
                    variant="outline"
                    className="border-primary/30 text-primary text-[10px]"
                  >
                    {t('header.new')}
                  </Badge>
                </a>
              </nav>

              {/* Actions */}
              <div className="border-border/40 mt-auto flex flex-col gap-3 border-t pt-6">
                <LanguageSwitcher />
                <Button
                  asChild
                  variant="outline"
                  className="h-11 w-full justify-center rounded-xl"
                >
                  <Link to="/login">{t('auth.login')}</Link>
                </Button>
                <Button
                  asChild
                  className="shadow-primary/20 h-11 w-full justify-center rounded-xl shadow-lg"
                >
                  <Link to="/register">{t('header.getStarted')}</Link>
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
