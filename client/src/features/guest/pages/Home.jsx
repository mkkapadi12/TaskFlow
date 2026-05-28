import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { GUEST_ICONS } from '@/lib/icons/guest.icons';

const FEATURES = [
  { key: 'fast', icon: GUEST_ICONS.ZAP },
  { key: 'secure', icon: GUEST_ICONS.SHIELD },
  { key: 'organized', icon: GUEST_ICONS.CHECK },
  { key: 'team', icon: GUEST_ICONS.USERS },
  { key: 'documents', icon: GUEST_ICONS.FILE_CODE },
  { key: 'verify', icon: GUEST_ICONS.SHIELD_CHECK },
];

const STEP_KEYS = ['create', 'assign', 'verify'];

const Home = () => {
  const { t } = useTranslation('home');

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28 lg:px-8 lg:py-32">
        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 mx-auto max-w-3xl text-center motion-safe:duration-700">
          <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="bg-primary absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping" />
              <span className="bg-primary relative inline-flex h-2 w-2 rounded-full" />
            </span>
            {t('hero.badge')}
          </span>

          <h1 className="mt-6 text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl md:text-6xl">
            {t('hero.title')}{' '}
            <span className="from-primary to-foreground bg-linear-to-r bg-clip-text text-transparent">
              {t('hero.subtitle')}
            </span>
          </h1>

          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
            {t('hero.description')}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-full px-7 text-base motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 sm:w-auto"
            >
              <Link to="/register">
                {t('hero.ctaStart')}
                <GUEST_ICONS.ARROW_RIGHT
                  className="ml-2 h-4 w-4"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-full px-7 text-base sm:w-auto"
            >
              <Link to="/login">{t('hero.ctaLogin')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <GUEST_ICONS.SPARKLES
              className="text-primary h-3.5 w-3.5"
              aria-hidden="true"
            />
            {t('features.badge')}
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t('features.title')}
            <span className="text-primary">{t('features.titleHighlight')}</span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-prose text-base leading-relaxed">
            {t('features.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="group border-border bg-card hover:bg-accent/40 rounded-2xl border p-6 motion-safe:transition-colors motion-safe:duration-200"
            >
              <div className="bg-primary/10 text-primary group-hover:bg-primary/15 mb-4 flex h-11 w-11 items-center justify-center rounded-xl motion-safe:transition-colors">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mb-1.5 text-base font-semibold">
                {t(`features.list.${key}.title`)}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(`features.list.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <GUEST_ICONS.LIGHTBULB
              className="text-primary h-3.5 w-3.5"
              aria-hidden="true"
            />
            {t('howItWorks.badge')}
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t('howItWorks.title')}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-prose text-base leading-relaxed">
            {t('howItWorks.description')}
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEP_KEYS.map((step, idx) => (
            <li
              key={step}
              className="border-border bg-card/60 relative rounded-2xl border p-6 backdrop-blur-sm"
            >
              <div className="bg-primary text-primary-foreground mb-4 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                {idx + 1}
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                {t(`howItWorks.steps.${step}.title`)}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(`howItWorks.steps.${step}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="border-border from-primary/5 via-card to-accent/5 relative overflow-hidden rounded-3xl border bg-linear-to-br p-10 text-center md:p-14">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('ctaSection.title')}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base leading-relaxed">
            {t('ctaSection.description')}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-full px-7 text-base motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 sm:w-auto"
            >
              <Link to="/register">
                {t('ctaSection.btnStart')}
                <GUEST_ICONS.ARROW_RIGHT
                  className="ml-2 h-4 w-4"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-full px-7 text-base sm:w-auto"
            >
              <Link to="/docs">{t('ctaSection.btnDocs')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
