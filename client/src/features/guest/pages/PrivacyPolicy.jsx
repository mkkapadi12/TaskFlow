import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { GUEST_ICONS } from '@/lib/icons/guest.icons';

const SECTION_ICONS = {
  informationWeCollect: GUEST_ICONS.EYE,
  howWeUse: GUEST_ICONS.LAYERS,
  dataSecurity: GUEST_ICONS.LOCK,
  dataSharing: GUEST_ICONS.USERS,
  notificationPreferences: GUEST_ICONS.BELL,
  dataRetention: GUEST_ICONS.CLOCK,
  yourRights: GUEST_ICONS.SHIELD_CHECK,
  cookies: GUEST_ICONS.FILE_TEXT,
  children: GUEST_ICONS.HEART,
  changes: GUEST_ICONS.SCROLL_TEXT,
  contact: GUEST_ICONS.MAIL,
};

const CARD_SECTIONS = [
  'informationWeCollect',
  'howWeUse',
  'dataSecurity',
  'dataSharing',
];

const LIST_SECTIONS = ['notificationPreferences', 'yourRights'];

const TEXT_SECTIONS = ['dataRetention', 'cookies', 'children', 'changes'];

const PrivacyPolicy = () => {
  const { t } = useTranslation('privacy');

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28 lg:px-8 lg:py-32">
        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 mx-auto max-w-3xl text-center motion-safe:duration-700">
          <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <GUEST_ICONS.SHIELD
              className="text-primary h-3.5 w-3.5"
              aria-hidden="true"
            />
            {t('hero.badge')}
          </span>

          <h1 className="mt-6 text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl md:text-6xl">
            {t('hero.title')}
            <span className="from-primary to-foreground bg-linear-to-r bg-clip-text text-transparent">
              {t('hero.titleHighlight')}
            </span>
          </h1>

          <p className="text-muted-foreground mx-auto mt-4 text-sm">
            {t('hero.lastUpdated')}
          </p>

          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
            {t('intro.text')}
          </p>
        </div>
      </section>

      {/* ── Card sections (info, usage, security, sharing) ─ */}
      {CARD_SECTIONS.map((sectionKey) => {
        const Icon = SECTION_ICONS[sectionKey];
        const itemKeys = Object.keys(
          t(`sections.${sectionKey}.items`, { returnObjects: true })
        );
        return (
          <section
            key={sectionKey}
            className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8"
          >
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm">
                <Icon className="text-primary h-3.5 w-3.5" aria-hidden="true" />
                {t(`sections.${sectionKey}.title`)}
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                {t(`sections.${sectionKey}.title`)}
              </h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-prose text-base leading-relaxed">
                {t(`sections.${sectionKey}.description`)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {itemKeys.map((itemKey) => (
                <div
                  key={itemKey}
                  className="group border-border bg-card hover:bg-accent/40 rounded-2xl border p-6 motion-safe:transition-colors motion-safe:duration-200"
                >
                  <h3 className="text-foreground mb-2 text-base font-semibold">
                    {t(`sections.${sectionKey}.items.${itemKey}.title`)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t(`sections.${sectionKey}.items.${itemKey}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* ── List sections (notifications, rights) ────────── */}
      {LIST_SECTIONS.map((sectionKey) => {
        const Icon = SECTION_ICONS[sectionKey];
        const items = t(`sections.${sectionKey}.items`, {
          returnObjects: true,
        });
        const itemEntries = Object.entries(items);
        return (
          <section
            key={sectionKey}
            className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8"
          >
            <div className="border-border bg-card/60 mx-auto max-w-3xl rounded-2xl border p-6 backdrop-blur-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                  {t(`sections.${sectionKey}.title`)}
                </h2>
              </div>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                {t(`sections.${sectionKey}.description`)}
              </p>
              <ul className="space-y-3">
                {itemEntries.map(([key, value]) => (
                  <li
                    key={key}
                    className="text-foreground flex items-start gap-3 text-sm leading-relaxed"
                  >
                    <GUEST_ICONS.CHECK
                      className="text-primary mt-0.5 h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
              {t(`sections.${sectionKey}.footer`, {
                defaultValue: '',
              }) && (
                <p className="text-muted-foreground mt-6 text-xs italic">
                  {t(`sections.${sectionKey}.footer`, {
                    defaultValue: '',
                  })}
                </p>
              )}
            </div>
          </section>
        );
      })}

      {/* ── Text-only sections (retention, cookies, children, changes) */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-10">
          {TEXT_SECTIONS.map((sectionKey) => {
            const Icon = SECTION_ICONS[sectionKey];
            return (
              <div
                key={sectionKey}
                className="border-border border-b pb-10 last:border-b-0 last:pb-0"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight sm:text-xl">
                    {t(`sections.${sectionKey}.title`)}
                  </h2>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(`sections.${sectionKey}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Contact CTA ───────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8 lg:pb-28">
        <div className="bg-card border-border mx-auto max-w-3xl rounded-2xl border p-8 text-center sm:p-12">
          <div className="bg-primary/10 text-primary mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl">
            <GUEST_ICONS.MAIL className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t('sections.contact.title')}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-prose text-base leading-relaxed">
            {t('sections.contact.description')}
          </p>
          <Button asChild className="mt-8 cursor-pointer" size="lg">
            <Link to="/contact">
              {t('sections.contact.cta')}
              <GUEST_ICONS.ARROW_RIGHT
                className="ml-2 h-4 w-4"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
