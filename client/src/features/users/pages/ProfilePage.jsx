import { useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
    <div className="container px-3 py-5 mx-auto sm:px-6 sm:py-8">
      <div className="mb-5 sm:mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Account Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your profile information and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-8 lg:grid-cols-3">
        {/* Left Column: Summary */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="py-0 overflow-hidden shadow-xl border-border/50 bg-card/50 shadow-black/5 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center h-24 ">
              <span className="text-sm text-muted-foreground">
                Member since
              </span>{' '}
              <span className="text-lg">
                {formatDateDisplay(user?.createdAt, 'long')}
              </span>
            </div>
            <CardContent className="relative p-6 -mt-12 text-center">
              <div className="relative group inline-flex mb-4">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={user?.avatar} alt="Avatar" />
                  <AvatarFallback className="text-3xl font-bold uppercase">
                    {user?.name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute inset-0 rounded-full flex flex-col items-center justify-center text-white transition-all duration-200 opacity-0 cursor-pointer bg-black/60 group-hover:opacity-100 border-4 border-transparent"
                  title="View full-size photo"
                >
                  <DASHBOARD_ICONS.EYE size={18} className="mb-0.5" />
                  <span className="text-[10px] font-semibold tracking-wider uppercase">
                    View
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-semibold">
                {user?.name || 'User Name'}
              </h2>
              <p className="mb-3 text-sm text-muted-foreground">
                {user?.email}
              </p>

              <div className="flex justify-center gap-2 mb-4">
                {user?.role && (
                  <Badge
                    variant="secondary"
                    className="gap-1 px-3 py-1 rounded-full"
                  >
                    <DASHBOARD_ICONS.SHIELD
                      size={12}
                      className="text-primary"
                    />
                    {user.role}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {isProjectsLoading ? (
                      <Skeleton className="w-12 h-8 mx-auto" />
                    ) : (
                      projectCount
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
                    <DASHBOARD_ICONS.BRIEFCASE size={12} />
                    Projects
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {isTasksLoading ? (
                      <Skeleton className="w-12 h-8 mx-auto" />
                    ) : (
                      taskCount
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
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
          <Card className="h-full shadow-xl border-border/50 bg-card/50 shadow-black/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isProfileLoading ? (
                <div className="space-y-6">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full rounded-full h-11" />
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
        <DialogContent className="max-w-md p-6 bg-card border-border/50 sm:max-w-md flex items-center justify-center">
          <Avatar className="h-48 w-48 border shrink-0 shadow-lg bg-muted">
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
