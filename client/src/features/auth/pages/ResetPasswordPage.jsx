import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResetPasswordMutation } from '@/features/auth/auth.api';

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const password = watch('password');

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid or missing token');
      return;
    }
    try {
      const result = await resetPassword({
        token,
        password: data.password,
      }).unwrap();
      toast.success(result.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to reset password');
    }
  };

  if (!token) {
    return (
      <div className="bg-muted/50 flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive text-2xl font-bold">
              {t('auth.invalidLink')}
            </CardTitle>
            <CardDescription>{t('auth.invalidLinkDesc')}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="link" asChild className="w-full">
              <Link to="/login">{t('auth.backToLogin')}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {t('auth.resetPasswordTitle')}
          </CardTitle>
          <CardDescription>{t('auth.resetPasswordDesc')}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.newPasswordLabel')}</Label>
              <Input
                id="password"
                type="password"
                {...register('password', {
                  required: t('messages.required'),
                  minLength: {
                    value: 6,
                    message: t('auth.passwordRegPlaceholder'),
                  },
                })}
              />
              {errors.password && (
                <p className="text-destructive text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t('auth.confirmPasswordLabel')}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', {
                  required: t('messages.required'),
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('auth.resetting') : t('auth.resetPasswordBtn')}
            </Button>
            <Button variant="link" asChild className="w-full">
              <Link to="/login">{t('auth.backToLogin')}</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
