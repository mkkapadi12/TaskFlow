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
    // Simulate a short delay
    await new Promise((r) => setTimeout(r, 800));

    toast.success(t('toast.success'), {
      description: t('toast.description', { name: data.name, email: data.email }),
    });
    reset();
  };

  const infoCards = [
    {
      icon: GUEST_ICONS.MAIL,
      title: t('infoCards.list.0.title'),
      detail: 'support@taskflow.app',
      description: t('infoCards.list.0.description'),
    },
    {
      icon: GUEST_ICONS.MAP_PIN,
      title: t('infoCards.list.1.title'),
      detail: 'San Francisco, CA',
      description: t('infoCards.list.1.description'),
    },
    {
      icon: GUEST_ICONS.PHONE,
      title: t('infoCards.list.2.title'),
      detail: '+1 (555) 123-4567',
      description: t('infoCards.list.2.description'),
    },
    {
      icon: GUEST_ICONS.CLOCK,
      title: t('infoCards.list.3.title'),
      detail: t('infoCards.list.3.detail'),
      description: t('infoCards.list.3.description'),
    },
  ];

  return (
    <>
      {/* ── Header ── */}
      <section className="container mx-auto px-6 pt-20 pb-10 text-center lg:pt-28 lg:pb-14">
        <div className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both mx-auto max-w-2xl duration-1000">
          <div className="border-primary/20 bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <GUEST_ICONS.MESSAGE size={14} />
            {t('badge')}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            {t('title')} <span className="text-primary">{t('titleHighlight')}</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            {t('description')}
          </p>
        </div>
      </section>

      {/* ── Info Cards + Form ── */}
      <section className="container mx-auto px-6 pb-20 lg:pb-28">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Left — Info cards */}
          <div className="animate-in fade-in slide-in-from-left-8 fill-mode-both flex flex-col gap-4 duration-700 lg:col-span-2">
            {infoCards.map(({ icon: Icon, title, detail, description }, i) => (
              <div
                key={title}
                className="group border-border/50 bg-card/50 hover:border-primary/40 hover:shadow-primary/5 flex items-start gap-4 rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="bg-primary/10 text-primary group-hover:bg-primary/20 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-primary mt-0.5 text-sm font-medium">
                    {detail}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Contact form */}
          <div className="animate-in fade-in slide-in-from-right-8 fill-mode-both delay-100 duration-700 lg:col-span-3">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="border-border/50 bg-card/50 space-y-6 rounded-2xl border p-8 backdrop-blur-sm md:p-10"
            >
              <div className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">{t('form.nameLabel')}</Label>
                  <Input
                    id="name"
                    placeholder={t('form.namePlaceholder')}
                    aria-invalid={!!errors.name}
                    className="h-11"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-destructive mt-1 text-xs">
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
                    className="h-11"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-destructive mt-1 text-xs">
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
                    className="resize-none"
                    {...register('message')}
                  />
                  {errors.message && (
                    <p className="text-destructive mt-1 text-xs">
                      {errors.message.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="shadow-primary/20 hover:shadow-primary/30 h-12 w-full rounded-xl text-base shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <DASHBOARD_ICONS.LOADER2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('form.btnSending')}
                  </>
                ) : (
                  <>
                    <GUEST_ICONS.SEND className="mr-2 h-5 w-5" />
                    {t('form.btnSend')}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;

