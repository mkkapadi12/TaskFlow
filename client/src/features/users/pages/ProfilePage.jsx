import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';

import { useGetMyProjectsQuery } from '../../project/project.api';
import { useGetMyTasksQuery } from '../../tasks/task.api';
import ProfileForm from '../components/ProfileForm';
import { useGetProfileQuery, useUpdateProfileMutation } from '../user.api';

const ProfilePage = () => {
  const { data: profileData, isLoading: isProfileLoading } =
    useGetProfileQuery();
  const { data: projectsData, isLoading: isProjectsLoading } =
    useGetMyProjectsQuery();
  const { data: tasksData, isLoading: isTasksLoading } = useGetMyTasksQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const handleSave = async (formData) => {
    try {
      await updateProfile(formData).unwrap();
      toast.success('Profile updated successfully!');
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
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Account Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile information and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-8 lg:grid-cols-3">
        {/* Left Column: Summary */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-border/50 bg-card/50 overflow-hidden shadow-xl shadow-black/5 backdrop-blur-sm">
            <div className="from-primary/20 to-primary/5 h-24 bg-linear-to-r" />
            <CardContent className="relative -mt-12 p-6 text-center">
              <div className="border-background bg-muted mb-4 inline-flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 shadow-lg">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground text-3xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-semibold">
                {user?.name || 'User Name'}
              </h2>
              <p className="text-muted-foreground mb-3 text-sm">
                {user?.email}
              </p>

              <div className="mb-4 flex justify-center gap-2">
                {user?.role && (
                  <Badge
                    variant="secondary"
                    className="gap-1 rounded-full px-3 py-1"
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
                  <div className="text-primary text-2xl font-bold">
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
                  <div className="text-primary text-2xl font-bold">
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
              <CardTitle>Profile Information</CardTitle>
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
    </div>
  );
};

export default ProfilePage;
