import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { GUEST_ICONS } from '@/lib/icons/guest.icons';

import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  const { t } = useTranslation();

  const highlights = [
    { icon: GUEST_ICONS.ROCKET, text: t('auth.registerHighlight1') },
    { icon: GUEST_ICONS.USERS, text: t('auth.registerHighlight2') },
    { icon: GUEST_ICONS.SHIELD_CHECK, text: t('auth.registerHighlight3') },
    { icon: GUEST_ICONS.CHECK, text: t('auth.registerHighlight4') },
  ];

  return (
    <div className="flex min-h-screen">
      {/* ── Left Branding Panel ── */}
      <div className="from-accent-foreground via-primary/90 to-primary relative hidden overflow-hidden bg-linear-to-br lg:flex lg:w-1/2">
        {/* Decorative orbs */}
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-0 left-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <div className="text-primary-foreground relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm transition-transform group-hover:scale-105">
              <GUEST_ICONS.ZAP className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </Link>

          {/* Center content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl leading-tight font-extrabold tracking-tight xl:text-5xl">
                {t('auth.startBuilding').split(' ').slice(0, 2).join(' ')}
                <br />
                {t('auth.startBuilding').split(' ').slice(2).join(' ')}
              </h1>
              <p className="text-primary-foreground/70 max-w-md text-lg leading-relaxed">
                {t('auth.startBuildingDesc')}
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-4">
              {highlights.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="text-primary-foreground/80 flex items-center gap-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-primary-foreground/40 text-xs">
            © {new Date().getFullYear()} TaskFlow. {t('auth.allRightsReserved')}
          </p>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="bg-background flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
        <div className="animate-in fade-in slide-in-from-right-8 fill-mode-both w-full max-w-md space-y-8 duration-700">
          {/* Mobile logo */}
          <div className="mb-4 flex items-center gap-2 lg:hidden">
            <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-xl">
              <GUEST_ICONS.ZAP className="text-primary-foreground h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">TaskFlow</span>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {t('auth.createAccount')}
            </h2>
            <p className="text-muted-foreground">
              {t('auth.fillDetails')}
            </p>
          </div>

          {/* Form */}
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
