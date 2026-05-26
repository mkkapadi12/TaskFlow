import { useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { formatDateDisplay } from '@/lib/utils';

import { useGetMyProjectsQuery } from '../../project/project.api';
import { useGetMyTasksQuery } from '../../tasks/task.api';
import ProfileForm from '../components/ProfileForm';
import { useGetProfileQuery, useUpdateProfileMutation } from '../user.api';

const ProfilePage = () => {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const { data: profileData, isLoading: isProfileLoading } =
    useGetProfileQuery();
  const { data: projectsData, isLoading: isProjectsLoading } =
    useGetMyProjectsQuery();
  const { data: tasksData, isLoading: isTasksLoading } = useGetMyTasksQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const handleSave = async (formData) => {
    try {
      const result = await updateProfile(formData).unwrap();
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const user = profileData?.user;
  const projectCount = projectsData?.data?.length || 0;
  const taskCount = tasksData?.data?.length || 0;

  return (
    <div className="container mx-auto px-3 py-5 sm:px-6 sm:py-8">
      <div className="mb-5 sm:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Account Settings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your profile information and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-8 lg:grid-cols-3">
        {/* Left Column: Summary */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-border/50 bg-card/50 overflow-hidden py-0 shadow-xl shadow-black/5 backdrop-blur-sm">
            <div className="flex h-24 flex-col items-center justify-center">
              <span className="text-muted-foreground text-xs sm:text-sm">
                Member since
              </span>{' '}
              <span className="text-base font-medium sm:text-lg">
                {formatDateDisplay(user?.createdAt, 'long')}
              </span>
            </div>
            <CardContent className="relative -mt-12 p-6 text-center">
              <div className="group relative mb-4 inline-flex">
                <Avatar className="border-background h-24 w-24 border-4 shadow-lg">
                  <AvatarImage src={user?.avatar} alt="Avatar" />
                  <AvatarFallback className="text-3xl font-semibold uppercase">
                    {user?.name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full border-4 border-transparent bg-black/60 text-white opacity-0 transition-all duration-200 group-hover:opacity-100"
                  title="View full-size photo"
                >
                  <DASHBOARD_ICONS.EYE size={18} className="mb-0.5" />
                  <span className="text-[10px] font-semibold tracking-wider uppercase">
                    View
                  </span>
                </div>
              </div>

              <h2 className="text-lg font-semibold sm:text-xl">
                {user?.name || 'User Name'}
              </h2>
              <p className="text-muted-foreground mb-3 text-xs sm:text-sm">
                {user?.email}
              </p>

              <div className="mb-4 flex justify-center gap-2">
                {user?.role && (
                  <Badge
                    variant="secondary"
                    className="gap-1 rounded-full px-3 py-1 text-xs"
                  >
                    <DASHBOARD_ICONS.SHIELD
                      size={12}
                      className="text-primary"
                    />
                    {user.role}
                  </Badge>
                )}
              </div>

              <div className="border-border/50 grid grid-cols-2 gap-4 border-t pt-4">
                <div className="text-center">
                  <div className="text-primary text-xl font-bold sm:text-2xl">
                    {isProjectsLoading ? (
                      <Skeleton className="mx-auto h-8 w-12" />
                    ) : (
                      projectCount
                    )}
                  </div>
                  <div className="text-muted-foreground mt-1 flex items-center justify-center gap-1 text-xs">
                    <DASHBOARD_ICONS.BRIEFCASE size={12} />
                    Projects
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-primary text-xl font-bold sm:text-2xl">
                    {isTasksLoading ? (
                      <Skeleton className="mx-auto h-8 w-12" />
                    ) : (
                      taskCount
                    )}
                  </div>
                  <div className="text-muted-foreground mt-1 flex items-center justify-center gap-1 text-xs">
                    <DASHBOARD_ICONS.LISTCHECKS size={12} />
                    Tasks
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 bg-card/50 h-full shadow-xl shadow-black/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold tracking-tight sm:text-xl">
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isProfileLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-11 w-full rounded-full" />
                </div>
              ) : (
                <ProfileForm
                  user={user}
                  onSave={handleSave}
                  isLoading={isUpdating}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
        <DialogContent className="bg-card border-border/50 flex max-w-md flex-col items-center justify-center p-6 sm:max-w-md">
          <DialogTitle className="sr-only">Profile Picture</DialogTitle>
          <Avatar className="bg-muted h-48 w-48 shrink-0 border shadow-lg">
            <AvatarImage src={user?.avatar} alt={user?.name || 'User Avatar'} />
            <AvatarFallback className="text-8xl font-bold uppercase">
              {user?.name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
