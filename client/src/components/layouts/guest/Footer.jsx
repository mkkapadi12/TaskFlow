import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { GUEST_ICONS } from '@/lib/icons/guest.icons';

const Footer = () => {
  const { t } = useTranslation();

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
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <GUEST_ICONS.TWITTER size={18} />
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
                <GUEST_ICONS.LINKEDIN size={18} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <GUEST_ICONS.FACEBOOK size={18} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-foreground/90 mb-4 text-sm font-semibold">
              {t('footer.product')}
            </h3>
            <ul className="text-muted-foreground space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  {t('footer.features')}
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  {t('footer.pricing')}
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  {t('footer.roadmap')}
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  {t('footer.changelog')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-foreground/90 mb-4 text-sm font-semibold">
              {t('footer.company')}
            </h3>
            <ul className="text-muted-foreground space-y-3 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-foreground transition-colors"
                >
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  {t('footer.careers')}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  {t('footer.blog')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-foreground/90 mb-4 text-sm font-semibold">
              {t('footer.legal')}
            </h3>
            <ul className="text-muted-foreground space-y-3 text-sm">
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  {t('footer.termsOfService')}
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  {t('footer.cookiePolicy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border/40 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} TaskFlow.{' '}
            {t('footer.allRightsReserved')}
          </p>
          <div className="text-muted-foreground flex items-center gap-6 text-sm">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/" className="hover:text-foreground transition-colors">
              {t('footer.terms')}
            </Link>
            <Link to="/" className="hover:text-foreground transition-colors">
              {t('footer.cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
