import { Outlet } from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const GuestLayout = () => {
  return (
    <div className="bg-background text-foreground selection:bg-primary/30 relative flex min-h-screen flex-col overflow-hidden">
      {/* ── Ambient glow blobs ── */}
      <div className="bg-primary/20 pointer-events-none absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full blur-[120px]" />
      <div className="bg-accent/20 pointer-events-none absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full blur-[120px]" />

      {/* ── Header ── */}
      <Header navLinks={NAV_LINKS} />

      {/* ── Page content ── */}
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <Footer navLinks={NAV_LINKS} />
    </div>
  );
};

export default GuestLayout;
