import { useTranslation } from 'react-i18next';

import { GUEST_ICONS } from '@/lib/icons/guest.icons';

const About = () => {
  const { t } = useTranslation('about');

  const stats = [
    { stat: '2023', label: t('mission.stats.founded') },
    { stat: '15+', label: t('mission.stats.team') },
    { stat: '50K+', label: t('mission.stats.happyUsers') },
  ];

  const team = [
    { name: 'Alex Rivera', role: t('team.roles.ceo'), initials: 'AR' },
    { name: 'Sarah Chen', role: t('team.roles.designer'), initials: 'SC' },
    { name: 'Marcus Johnson', role: t('team.roles.engineer'), initials: 'MJ' },
    { name: 'Priya Patel', role: t('team.roles.pm'), initials: 'PP' },
  ];

  const values = [
    {
      icon: GUEST_ICONS.TARGET,
      title: t('values.list.0.title'),
      description: t('values.list.0.description'),
    },
    {
      icon: GUEST_ICONS.HEART,
      title: t('values.list.1.title'),
      description: t('values.list.1.description'),
    },
    {
      icon: GUEST_ICONS.LIGHTBULB,
      title: t('values.list.2.title'),
      description: t('values.list.2.description'),
    },
    {
      icon: GUEST_ICONS.SHIELD_CHECK,
      title: t('values.list.3.title'),
      description: t('values.list.3.description'),
    },
    {
      icon: GUEST_ICONS.ROCKET,
      title: t('values.list.4.title'),
      description: t('values.list.4.description'),
    },
    {
      icon: GUEST_ICONS.USERS,
      title: t('values.list.5.title'),
      description: t('values.list.5.description'),
    },
  ];

  return (
    <>
      {/* ── Mission Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both mx-auto max-w-3xl text-center duration-1000">
          <div className="border-primary/20 bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.TARGET size={14} />
            {t('mission.badge')}
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            {t('mission.title')}{' '}
            <span className="text-primary">{t('mission.titleHighlight')}</span>
          </h1>

          <p className="text-muted-foreground mt-6 text-lg leading-relaxed sm:text-xl">
            {t('mission.description')}
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map(({ stat, label }) => (
              <div
                key={label}
                className="border-border/50 bg-card/50 rounded-2xl border p-6 backdrop-blur-sm"
              >
                <p className="text-primary text-3xl font-bold">{stat}</p>
                <p className="text-muted-foreground mt-1 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both mx-auto mb-14 max-w-2xl text-center duration-700">
          <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.USERS size={14} />
            {t('team.badge')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('team.title')}{' '}
            <span className="text-primary">{t('team.titleHighlight')}</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            {t('team.description')}
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map(({ name, role, initials }, i) => (
            <div
              key={name}
              className="group border-border/50 bg-card/50 hover:border-primary/40 hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-8 fill-mode-both flex flex-col items-center rounded-2xl border p-6 text-center backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Avatar placeholder */}
              <div className="from-primary/20 to-accent/20 border-primary/30 group-hover:border-primary/60 mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 bg-linear-to-br transition-colors">
                <span className="text-primary text-xl font-bold">
                  {initials}
                </span>
              </div>
              <h3 className="text-base font-semibold">{name}</h3>
              <p className="text-muted-foreground mt-1 text-sm">{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values Section ── */}
      <section className="container mx-auto px-6 py-20 lg:py-28">
        <div className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both mx-auto mb-14 max-w-2xl text-center duration-700">
          <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.HEART size={14} />
            {t('values.badge')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('values.title')}{' '}
            <span className="text-primary">{t('values.titleHighlight')}</span>{' '}
            {t('values.titleEnd')}
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            {t('values.description')}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className="group border-border/50 bg-card/50 hover:border-primary/40 hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-8 fill-mode-both rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="bg-primary/10 text-primary group-hover:bg-primary/20 mb-5 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors">
                <Icon size={24} />
              </div>
              <h3 className="mb-2 text-lg font-bold">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default About;

