import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const GuestLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/30 relative overflow-hidden">
      {/* ── Ambient glow blobs ── */}
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-accent/20 blur-[120px]" />

      {/* ── Header ── */}
      <Header navLinks={NAV_LINKS} />

      {/* ── Page content ── */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <Footer navLinks={NAV_LINKS} />
    </div>
  );
};

export default GuestLayout;
