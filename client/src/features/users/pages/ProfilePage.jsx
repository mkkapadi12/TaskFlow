import React from "react";
import ProfileForm from "../components/ProfileForm";
import { useGetProfileQuery, useUpdateProfileMutation } from "../user.api";
import { useGetMyProjectsQuery } from "../../project/project.api";
import { useGetMyTasksQuery } from "../../tasks/task.api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DASHBOARD_ICONS } from "@/lib/icons/dashboard.icons";

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
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const user = profileData?.user;
  const projectCount = projectsData?.data?.length || 0;
  const taskCount = tasksData?.data?.length || 0;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile information and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-black/5 overflow-hidden">
            <div className="h-24 bg-linear-to-r from-primary/20 to-primary/5" />
            <CardContent className="p-6 -mt-12 text-center relative">
              <div className="inline-flex h-24 w-24 rounded-full border-4 border-background bg-muted items-center justify-center overflow-hidden shadow-lg mb-4">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-muted-foreground">
                    {user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-semibold">
                {user?.name || "User Name"}
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
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
                      <Skeleton className="h-8 w-12 mx-auto" />
                    ) : (
                      projectCount
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <DASHBOARD_ICONS.BRIEFCASE size={12} />
                    Projects
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {isTasksLoading ? (
                      <Skeleton className="h-8 w-12 mx-auto" />
                    ) : (
                      taskCount
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
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
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-black/5 h-full">
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
