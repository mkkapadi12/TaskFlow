import { Link } from 'react-router-dom';

import { GUEST_ICONS } from '@/lib/icons/guest.icons';

const Footer = () => {
  return (
    <footer className="border-border/40 bg-card/30 relative z-10 border-t backdrop-blur-md">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="from-primary to-accent text-primary-foreground shadow-primary/20 flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br shadow-lg">
                <GUEST_ICONS.DASHBOARD size={18} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight">TaskFlow</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm text-sm">
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
            <h3 className="text-foreground/90 mb-4 text-sm font-semibold">
              Product
            </h3>
            <ul className="text-muted-foreground space-y-3 text-sm">
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
            <h3 className="text-foreground/90 mb-4 text-sm font-semibold">
              Company
            </h3>
            <ul className="text-muted-foreground space-y-3 text-sm">
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
            <h3 className="text-foreground/90 mb-4 text-sm font-semibold">
              Legal
            </h3>
            <ul className="text-muted-foreground space-y-3 text-sm">
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

        <div className="border-border/40 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
          <div className="text-muted-foreground flex items-center gap-6 text-sm">
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
