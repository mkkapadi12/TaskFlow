import { useTranslation } from 'react-i18next';

import { GUEST_ICONS } from '@/lib/icons/guest.icons';

const FACTS = [
  { key: 'opensource', icon: GUEST_ICONS.CODE },
  { key: 'solo', icon: GUEST_ICONS.USER },
  { key: 'feedback', icon: GUEST_ICONS.MESSAGE },
];

const VALUES = [
  { key: '0', icon: GUEST_ICONS.TARGET },
  { key: '1', icon: GUEST_ICONS.HEART },
  { key: '2', icon: GUEST_ICONS.LIGHTBULB },
  { key: '3', icon: GUEST_ICONS.SHIELD_CHECK },
  { key: '4', icon: GUEST_ICONS.ROCKET },
  { key: '5', icon: GUEST_ICONS.USERS },
];

const About = () => {
  const { t } = useTranslation('about');

  return (
    <>
      {/* ── Mission ────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28 lg:px-8 lg:py-32">
        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 mx-auto max-w-3xl text-center motion-safe:duration-700">
          <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <GUEST_ICONS.TARGET
              className="text-primary h-3.5 w-3.5"
              aria-hidden="true"
            />
            {t('mission.badge')}
          </span>

          <h1 className="mt-6 text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl md:text-6xl">
            {t('mission.title')}{' '}
            <span className="from-primary to-foreground bg-gradient-to-r bg-clip-text text-transparent">
              {t('mission.titleHighlight')}
            </span>
          </h1>

          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
            {t('mission.description')}
          </p>
        </div>
      </section>

      {/* ── Built in the open ──────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <GUEST_ICONS.CODE
              className="text-primary h-3.5 w-3.5"
              aria-hidden="true"
            />
            {t('facts.badge')}
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t('facts.title')}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-prose text-base leading-relaxed">
            {t('facts.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FACTS.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="border-border bg-card/60 rounded-2xl border p-6 backdrop-blur-sm"
            >
              <div className="bg-primary/10 text-primary mb-4 flex h-11 w-11 items-center justify-center rounded-xl">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mb-1.5 text-base font-semibold">
                {t(`facts.list.${key}.title`)}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(`facts.list.${key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8 lg:pb-28">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <GUEST_ICONS.HEART
              className="text-primary h-3.5 w-3.5"
              aria-hidden="true"
            />
            {t('values.badge')}
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t('values.title')}{' '}
            <span className="text-primary">{t('values.titleHighlight')}</span>{' '}
            {t('values.titleEnd')}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-prose text-base leading-relaxed">
            {t('values.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VALUES.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="group border-border bg-card hover:bg-accent/40 rounded-2xl border p-6 motion-safe:transition-colors motion-safe:duration-200"
            >
              <div className="bg-primary/10 text-primary group-hover:bg-primary/15 mb-4 flex h-11 w-11 items-center justify-center rounded-xl motion-safe:transition-colors">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mb-1.5 text-base font-semibold">
                {t(`values.list.${key}.title`)}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(`values.list.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default About;
