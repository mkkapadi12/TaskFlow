import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { cn } from '@/lib/utils';

const ProfileForm = ({ user, onSave, isLoading }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user?.name?.trim() || '');
      setPhone(user?.phone || '');
      setAvatar(null);
      setPreviewUrl(user?.avatar || '');
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds the 5MB limit');
        return;
      }
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
      toast.success('Avatar ready to save');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds the 5MB limit');
        return;
      }
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
      toast.success('Avatar ready to save');
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
      {/* Avatar Upload (Compact with Drag & Drop) */}
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-border/50 bg-background/30 flex items-center gap-4 rounded-xl border p-4 backdrop-blur-sm transition-all duration-200',
          isDragging && 'border-primary bg-primary/5 scale-[1.01]'
        )}
      >
        <Avatar className="border-border/50 bg-muted h-16 w-16 shrink-0 border shadow-sm">
          <AvatarImage src={previewUrl} alt="Avatar" />
          <AvatarFallback className="text-xl font-bold uppercase">
            {name.charAt(0)?.toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Label
              htmlFor="avatar-upload"
              className="text-primary hover:text-primary/80 inline-flex cursor-pointer items-center gap-2 text-xs font-semibold transition-colors sm:text-sm"
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
            <span className="text-muted-foreground text-[11px] sm:text-xs">
              or drag & drop here
            </span>
          </div>
          <p className="text-muted-foreground mt-1 text-[11px] sm:text-xs">
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
          className="border-border/50 bg-background/50 h-10 text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          value={user?.email || ''}
          disabled
          className="border-border/50 bg-muted/50 text-muted-foreground h-10 cursor-not-allowed text-sm"
        />
        <p className="text-muted-foreground text-[11px] sm:text-xs">
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
          className="border-border/50 bg-background/50 h-10 text-sm font-normal"
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
