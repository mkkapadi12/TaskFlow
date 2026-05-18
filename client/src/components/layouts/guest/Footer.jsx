import React from "react";
import { Link } from "react-router-dom";
import { GUEST_ICONS } from "@/lib/icons/guest.icons";

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-border/40 bg-card/30 backdrop-blur-md">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20">
                <GUEST_ICONS.DASHBOARD size={18} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl tracking-tight">TaskFlow</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Streamline your workflow, collaborate with your team, and achieve
              your goals with our professional task management platform.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {/* <Twitter size={18} /> */}
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <GUEST_ICONS.GITHUB size={18} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {/* <Linkedin size={18} /> */}
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {/* <Facebook size={18} /> */}
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-foreground/90">
              Product
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Roadmap
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-foreground/90">
              Company
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/about"
                  className="hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-foreground/90">
              Legal
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/" className="hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
