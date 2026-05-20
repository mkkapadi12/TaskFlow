import { useTheme } from 'next-themes';

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
import { useAuth } from '@/hooks/useAuth';

const SettingPage = () => {
  const { theme, setTheme } = useTheme();

  const { user } = useAuth();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
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
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Button variant="outline" className="w-fit">
                Change Password
              </Button>
            </div>
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
