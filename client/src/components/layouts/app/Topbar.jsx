import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PAGE_TITLES } from '@/constant';
import { logout } from '@/features/auth/auth.slice';
import { ThemeToggle } from '@/helper/ThemeToggle';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { useAuth } from '@/hooks/useAuth';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { GUEST_ICONS } from '@/lib/icons/guest.icons';

const Topbar = ({ onMenuClick }) => {
  const location = useLocation();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const confirm = useAlertDialog();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Derive page info — fallback for dynamic routes like /projects/:id
  const currentPage =
    PAGE_TITLES.find((p) => p.path === location.pathname) ||
    (location.pathname.startsWith('/projects/')
      ? {
          title: 'Projects',
          description: `Manage your projects`,
        }
      : { title: 'Page', description: '' });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    const isConfirmed = await confirm({
      title: 'Sign Out',
      description:
        'Are you sure you want to sign out of your TaskFlow account?',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      media: <DASHBOARD_ICONS.LOGOUT className="text-destructive h-6 w-6" />,
      mediaClassName: 'bg-destructive/10 text-destructive',
      variant: 'destructive',
    });
    if (isConfirmed) {
      dispatch(logout());
    }
  };

  return (
    <header className="border-border/40 bg-background/80 sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-xl md:px-6">
      {/* Left — hamburger + title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <GUEST_ICONS.MENU size={20} />
        </Button>
        <div>
          <h1 className="text-base leading-none font-semibold tracking-tight">
            {currentPage.title}
          </h1>
          {currentPage.description && (
            <p className="text-muted-foreground mt-0.5 text-xs">
              {currentPage.description}
            </p>
          )}
        </div>
      </div>

      {/* Right — theme toggle + avatar dropdown */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* User avatar dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="hover:bg-muted flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold uppercase">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-30 truncate text-sm font-medium sm:block">
              {user?.name || 'User'}
            </span>
            <DASHBOARD_ICONS.CHEVRONDOWN
              size={14}
              className={`text-muted-foreground hidden transition-transform sm:block ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="border-border bg-popover animate-in fade-in slide-in-from-top-2 absolute right-0 z-50 mt-2 w-48 rounded-xl border p-1 shadow-lg duration-150">
              <div className="border-border mb-1 border-b px-3 py-2">
                <p className="truncate text-sm font-medium">
                  {user?.name || 'User'}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {user?.email || ''}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
              >
                <DASHBOARD_ICONS.LOGOUT size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
