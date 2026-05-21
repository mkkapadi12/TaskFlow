import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useChangePasswordMutation } from '@/features/auth/auth.api';
import { useAuth } from '@/hooks/useAuth';

const SettingPage = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [changePasswordForm, setChangePasswordForm] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const password = watch('newPassword');

  const onSubmit = async (data) => {
    try {
      const response = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      toast.success(response.message || 'Password changed successfully!');
      setChangePasswordForm(false);
      reset();
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || 'Failed to change password'
      );
    }
  };

  return (
    <div className="space-y-4 p-3 sm:space-y-6 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Settings
        </h1>
      </div>

      <div className="grid gap-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how TaskFlow looks on your device.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-muted-foreground text-sm">
                  Toggle between light and dark themes.
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={(checked) =>
                  setTheme(checked ? 'dark' : 'light')
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Account (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
              />
              <p className="text-muted-foreground text-xs">
                Email cannot be changed.
              </p>
            </div>
            {changePasswordForm && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-card animate-in fade-in-50 mt-4 space-y-4 rounded-xl border p-4 shadow-sm duration-200 sm:p-6"
              >
                <div className="flex items-center gap-2 border-b border-dashed pb-2">
                  <ShieldCheck className="text-primary h-5 w-5" />
                  <span className="text-sm font-semibold">Security Update</span>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-primary text-xs hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="text-muted-foreground absolute left-3 h-4 w-4" />
                    <Input
                      id="currentPassword"
                      type={showCurrent ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="bg-muted/20 pr-10 pl-9 transition-all focus-visible:ring-1"
                      {...register('currentPassword', {
                        required: 'Current Password is required',
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="text-muted-foreground hover:text-foreground absolute right-3 cursor-pointer transition-colors focus:outline-none"
                    >
                      {showCurrent ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-destructive text-xs">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative flex items-center">
                    <KeyRound className="text-muted-foreground absolute left-3 h-4 w-4" />
                    <Input
                      id="newPassword"
                      type={showNew ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="bg-muted/20 pr-10 pl-9 transition-all focus-visible:ring-1"
                      {...register('newPassword', {
                        required: 'New Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="text-muted-foreground hover:text-foreground absolute right-3 cursor-pointer transition-colors focus:outline-none"
                    >
                      {showNew ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-destructive text-xs">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative flex items-center">
                    <KeyRound className="text-muted-foreground absolute left-3 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="bg-muted/20 pr-10 pl-9 transition-all focus-visible:ring-1"
                      {...register('confirmPassword', {
                        required: 'Confirm Password is required',
                        validate: (value) =>
                          value === password || 'Passwords do not match',
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-muted-foreground hover:text-foreground absolute right-3 cursor-pointer transition-colors focus:outline-none"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-destructive text-xs">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    className="w-fit gap-2 font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-fit"
                    onClick={() => {
                      setChangePasswordForm(false);
                      reset();
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
            {!changePasswordForm && (
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  className="w-fit gap-2"
                  onClick={() => setChangePasswordForm(true)}
                >
                  <KeyRound className="h-4 w-4" />
                  Change Password
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure how you receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notif">Email Notifications</Label>
                <p className="text-muted-foreground text-sm">
                  Receive emails about task assignments and deadlines.
                </p>
              </div>
              <Switch id="email-notif" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notif">Push Notifications</Label>
                <p className="text-muted-foreground text-sm">
                  Receive push notifications on your device.
                </p>
              </div>
              <Switch id="push-notif" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingPage;
