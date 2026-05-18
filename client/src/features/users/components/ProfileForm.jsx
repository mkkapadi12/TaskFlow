import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DASHBOARD_ICONS } from "@/lib/icons/dashboard.icons";

const { UPLOAD: Upload, LOADER2: Loader2 } = DASHBOARD_ICONS;

const ProfileForm = ({ user, onSave, isLoading }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setPreviewUrl(user.avatar || "");
    }
  }, [user]);

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
    formData.append("name", name);
    formData.append("phone", phone);
    if (avatar) {
      formData.append("avatar", avatar);
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-border/50 bg-muted flex items-center justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-muted-foreground">
              {name.charAt(0)?.toUpperCase() || "?"}
            </span>
          )}
        </div>

        <Label
          htmlFor="avatar-upload"
          className="cursor-pointer inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <Upload size={16} />
          Change Avatar
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          required
          className="border-border/50 bg-background/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email (Cannot be changed)</Label>
        <Input
          id="email"
          value={user?.email || ""}
          disabled
          className="border-border/50 bg-muted/50 text-muted-foreground cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Your Phone Number"
          className="border-border/50 bg-background/50"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
};

export default ProfileForm;
