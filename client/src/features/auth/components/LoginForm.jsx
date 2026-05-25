import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GUEST_ICONS } from '@/lib/icons/guest.icons';
import { loginSchema } from '@/schemas/auth.schema';

import { useLoginMutation } from '../auth.api';

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      await login(data).unwrap();
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-sm font-medium">
          {t('auth.emailAddressLabel')}
        </Label>
        <div className="relative">
          <GUEST_ICONS.MAIL className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="login-email"
            type="email"
            placeholder={t('auth.emailPlaceholder')}
            className="h-11 pl-10"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-destructive mt-1 text-xs">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password" className="text-sm font-medium">
            {t('auth.passwordLabel')}
          </Label>
          <Link
            to="/forgot-password"
            className="text-primary text-sm font-medium underline-offset-4 hover:underline"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>
        <div className="relative">
          <GUEST_ICONS.SHIELD className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="login-password"
            type="password"
            placeholder={t('auth.passwordPlaceholder')}
            className="h-11 pl-10"
            {...register('password')}
          />
        </div>
        {errors.password && (
          <p className="text-destructive mt-1 text-xs">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="shadow-primary/20 hover:shadow-primary/30 h-11 w-full rounded-lg text-sm font-semibold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
            {t('auth.signingIn')}
          </span>
        ) : (
          t('auth.signIn')
        )}
      </Button>

      {/* Register link */}
      <p className="text-muted-foreground pt-2 text-center text-sm">
        {t('auth.noAccount')}{' '}
        <Link
          to="/register"
          className="text-primary hover:text-primary/80 font-semibold underline underline-offset-4 transition-colors"
        >
          {t('auth.createOne')}
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
