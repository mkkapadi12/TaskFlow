import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';

const ProfileForm = ({ user, onSave, isLoading }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (user) {
      setName(user?.name?.trim() || '');
      setPhone(user?.phone || '');
      setAvatar(null);
      setPreviewUrl(user?.avatar || '');
    }
  }, [user]);

  console.log(user);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    if (avatar) {
      formData.append('avatar', avatar);
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Upload (Compact) */}
      <div className="border-border/50 bg-background/30 flex items-center gap-4 rounded-xl border p-4 backdrop-blur-sm">
        <div className="border-border/50 bg-muted relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground text-xl font-bold">
              {name.charAt(0)?.toUpperCase() || '?'}
            </span>
          )}
        </div>

        <div className="flex-1">
          <Label
            htmlFor="avatar-upload"
            className="text-primary hover:text-primary/80 inline-flex cursor-pointer items-center gap-2 text-sm transition-colors"
          >
            <DASHBOARD_ICONS.UPLOAD size={16} />
            Change Avatar
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </Label>
          <p className="text-muted-foreground mt-1 text-xs">
            Only .jpg, .jpeg, .png or .webp format. Maximum file size: 5MB.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          required
          className="border-border/50 bg-background/50 h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          value={user?.email || ''}
          disabled
          className="border-border/50 bg-muted/50 text-muted-foreground h-11 cursor-not-allowed"
        />
        <p className="text-muted-foreground text-xs">
          Email cannot be changed. Contact support if needed.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Your Phone Number"
          required
          className="border-border/50 bg-background/50 h-11"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="shadow-primary/20 h-11 w-full rounded-full shadow-lg transition-all hover:-translate-y-0.5"
      >
        {isLoading ? (
          <>
            <DASHBOARD_ICONS.LOADER2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  );
};

export default ProfileForm;
