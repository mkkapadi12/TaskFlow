import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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
import { useForgotPasswordMutation } from '@/features/auth/auth.api';
import { useAuth } from '@/hooks/useAuth';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isAuthenticated } = useAuth();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit = async (data) => {
    try {
      const result = await forgotPassword(data).unwrap();
      toast.success(result.message);
      if (result.data?.resetUrl) {
        console.log('Reset URL (Dev mode):', result.data.resetUrl);
      }
    } catch (err) {
      toast.error(err.data?.message || 'Failed to send reset link');
    }
  };

  return (
    <div className="bg-muted/50 flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {t('auth.forgotPasswordTitle')}
          </CardTitle>
          <CardDescription>{t('auth.forgotPasswordDesc')}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                {...register('email', { required: t('messages.required') })}
              />
              {errors.email && (
                <p className="text-destructive text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('auth.sending') : t('auth.sendResetLink')}
            </Button>
            {isAuthenticated ? (
              <Button variant="link" asChild className="w-full">
                <Link to="/dashboard">{t('auth.backToDashboard')}</Link>
              </Button>
            ) : (
              <Button variant="link" asChild className="w-full">
                <Link to="/login">{t('auth.backToLogin')}</Link>
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
