import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { GUEST_ICONS } from '@/lib/icons/guest.icons';
import { contactSchema } from '@/schemas/contact.schema';

const CHANNELS = [
  {
    key: 'github',
    icon: GUEST_ICONS.GITHUB,
    hrefFromDetail: (detail) =>
      detail.startsWith('http') ? detail : `https://${detail}`,
    external: true,
  },
  {
    key: 'email',
    icon: GUEST_ICONS.MAIL,
    hrefFromDetail: (detail) => `mailto:${detail}`,
    external: false,
  },
];

const Contact = () => {
  const { t } = useTranslation('contact');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success(t('toast.success'), {
      description: t('toast.description', { name: data.name }),
    });
    reset();
  };

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-20 pb-10 sm:px-6 md:pt-28 md:pb-14 lg:px-8">
        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 mx-auto max-w-2xl text-center motion-safe:duration-700">
          <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <GUEST_ICONS.MESSAGE
              className="text-primary h-3.5 w-3.5"
              aria-hidden="true"
            />
            {t('badge')}
          </span>
          <h1 className="mt-6 text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl md:text-6xl">
            {t('title')}{' '}
            <span className="from-primary to-foreground bg-gradient-to-r bg-clip-text text-transparent">
              {t('titleHighlight')}
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
            {t('description')}
          </p>
        </div>
      </section>

      {/* ── Channels + Form ────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left — Channels */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div>
              <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm">
                <GUEST_ICONS.SPARKLES
                  className="text-primary h-3.5 w-3.5"
                  aria-hidden="true"
                />
                {t('channels.badge')}
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">
                {t('channels.title')}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {t('channels.description')}
              </p>
            </div>

            {CHANNELS.map(({ key, icon: Icon, hrefFromDetail, external }) => {
              const detail = t(`channels.list.${key}.detail`);
              return (
                <a
                  key={key}
                  href={hrefFromDetail(detail)}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="group border-border bg-card hover:bg-accent/40 flex items-start gap-4 rounded-2xl border p-5 motion-safe:transition-colors motion-safe:duration-200"
                >
                  <div className="bg-primary/10 text-primary group-hover:bg-primary/15 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl motion-safe:transition-colors">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {t(`channels.list.${key}.title`)}
                    </p>
                    <p className="text-primary mt-1 text-sm font-medium break-all">
                      {detail}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      {t(`channels.list.${key}.description`)}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Right — Form */}
          <div className="lg:col-span-3">
            <div className="border-border bg-card rounded-2xl border p-6 md:p-8">
              <h2 className="text-lg font-semibold">{t('form.title')}</h2>

              <div
                role="status"
                className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4"
              >
                <GUEST_ICONS.INFO
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
                  aria-hidden="true"
                />
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t('form.demoNote')}
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-5"
                noValidate
              >
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">{t('form.nameLabel')}</Label>
                  <Input
                    id="name"
                    placeholder={t('form.namePlaceholder')}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className="h-11"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p
                      id="name-error"
                      className="text-destructive mt-1 text-xs"
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">{t('form.emailLabel')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('form.emailPlaceholder')}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className="h-11"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      className="text-destructive mt-1 text-xs"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">{t('form.messageLabel')}</Label>
                  <Textarea
                    id="message"
                    placeholder={t('form.messagePlaceholder')}
                    rows={5}
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? 'message-error' : undefined
                    }
                    className="resize-none"
                    {...register('message')}
                  />
                  {errors.message && (
                    <p
                      id="message-error"
                      className="text-destructive mt-1 text-xs"
                    >
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="h-12 w-full rounded-xl text-base"
                >
                  {isSubmitting ? (
                    <>
                      <DASHBOARD_ICONS.LOADER2
                        className="mr-2 h-4 w-4 motion-safe:animate-spin"
                        aria-hidden="true"
                      />
                      {t('form.btnSending')}
                    </>
                  ) : (
                    <>
                      <GUEST_ICONS.SEND
                        className="mr-2 h-4 w-4"
                        aria-hidden="true"
                      />
                      {t('form.btnSend')}
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
