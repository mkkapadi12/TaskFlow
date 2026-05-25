import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GUEST_ICONS } from '@/lib/icons/guest.icons';
import { registerSchema } from '@/schemas/auth.schema';

import { useRegisterMutation } from '../auth.api';

const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    try {
      await registerUser(data).unwrap();
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="register-name" className="text-sm font-medium">
          {t('auth.fullNameLabel')}
        </Label>
        <div className="relative">
          <GUEST_ICONS.USER className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="register-name"
            placeholder={t('auth.fullNamePlaceholder')}
            className="h-11 pl-10"
            {...register('name')}
          />
        </div>
        {errors.name && (
          <p className="text-destructive mt-1 text-xs">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="register-email" className="text-sm font-medium">
          {t('auth.emailAddressLabel')}
        </Label>
        <div className="relative">
          <GUEST_ICONS.MAIL className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="register-email"
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
        <Label htmlFor="register-password" className="text-sm font-medium">
          {t('auth.passwordLabel')}
        </Label>
        <div className="relative">
          <GUEST_ICONS.SHIELD className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="register-password"
            type="password"
            placeholder={t('auth.passwordRegPlaceholder')}
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
            {t('auth.creatingAccount')}
          </span>
        ) : (
          t('auth.createAccountBtn')
        )}
      </Button>

      {/* Login link */}
      <p className="text-muted-foreground pt-2 text-center text-sm">
        {t('auth.alreadyAccount')}{' '}
        <Link
          to="/login"
          className="text-primary hover:text-primary/80 font-semibold underline underline-offset-4 transition-colors"
        >
          {t('auth.signIn')}
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
