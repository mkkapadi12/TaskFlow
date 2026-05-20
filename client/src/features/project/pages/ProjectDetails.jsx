import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useGetProjectDetailsQuery,
  useUpdateProjectMutation,
  useAddProjectMemberMutation,
  useUpdateMemberRoleMutation,
  useRemoveProjectMemberMutation,
} from "@/features/project/project.api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditProjectDialog from "@/features/project/components/EditProjectDialog";
import AddMemberDialog from "@/features/project/components/AddMemberDialog";
import CreateTaskDialog from "@/features/tasks/components/CreateTaskDialog";
import TaskDetailDialog from "@/features/tasks/components/TaskDetailDialog";
import { useAuth } from "@/hooks/useAuth";
import { DASHBOARD_ICONS } from "@/lib/icons/dashboard.icons";
import { formatDateDisplay } from "@/lib/utils";
import { ProjectDetailsSkeleton } from "@/skeleton/ProjectDetalsSkeleton";

const ROLE_OPTIONS = ["ADMIN", "MEMBER", "OWNER"];

const STATUS_STYLES = {
  ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  INACTIVE: "bg-gray-500/10 text-gray-600 border-gray-500/30",
};

const ROLE_STYLES = {
  OWNER: "bg-primary/15 text-primary border-primary/30",
  ADMIN: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  MEMBER: "bg-sky-500/10 text-sky-600 border-sky-500/30",
};

const TASK_STATUS_STYLES = {
  TODO: "bg-muted text-muted-foreground border-muted-foreground/30",
  IN_PROGRESS: "bg-primary/10 text-primary border-primary/30",
  IN_REVIEW: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  DONE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
};

const TASK_PRIORITY_STYLES = {
  LOW: "bg-blue-500/10 text-blue-500",
  MEDIUM: "bg-yellow-500/10 text-yellow-600",
  HIGH: "bg-orange-500/10 text-orange-600",
  URGENT: "bg-destructive/10 text-destructive",
};

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { user } = useAuth();

  const {
    data: resData,
    isLoading,
    isError,
  } = useGetProjectDetailsQuery(projectId);

  const [updateProject, { isLoading: isUpdatingProject }] =
    useUpdateProjectMutation();
  const [addProjectMember, { isLoading: isAddingMember }] =
    useAddProjectMemberMutation();
  const [updateMemberRole] = useUpdateMemberRoleMutation();
  const [removeProjectMember] = useRemoveProjectMemberMutation();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [removeReason, setRemoveReason] = useState("");
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  if (isLoading) return <ProjectDetailsSkeleton />;

  if (isError || !resData?.data) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="py-10 text-center">
            <DASHBOARD_ICONS.ALERTTRIANGLE className="mx-auto h-10 w-10 text-destructive mb-3" />
            <p className="text-destructive font-medium">
              Unable to load project details.
            </p>
            <Link to="/projects">
              <Button variant="outline" className="mt-4 border-border/50">
                <DASHBOARD_ICONS.ARROWLEFT className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const project = resData.data;
  const members = project.members || [];
  const tasks = project.tasks || [];
  const isOwner = user?.id === project.ownerId;
  const existingMemberIds = members.map((m) => m.userId);

  const currentMembership = members.find((m) => m.userId === user?.id);
  const projectRole = currentMembership?.role;
  const isManager = projectRole === "OWNER" || projectRole === "ADMIN";
  const tasksWithProjectId = tasks.map((t) => ({
    ...t,
    projectId: Number(projectId),
  }));
  const selectedTask = tasksWithProjectId.find((t) => t.id === selectedTaskId);

  const handleSaveProject = async (payload) => {
    try {
      await updateProject({ projectId, ...payload }).unwrap();
      toast.success("Project updated successfully");
      setIsEditOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update project");
    }
  };

  const handleAddMember = async ({ userId, role }) => {
    try {
      await addProjectMember({ projectId, userId, role }).unwrap();
      toast.success("Member added successfully");
      setIsAddMemberOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add member");
    }
  };

  const handleRoleChange = async (member, role) => {
    if (role === member.role) return;
    try {
      await updateMemberRole({
        projectId,
        userId: member.userId,
        role,
      }).unwrap();
      toast.success(`Role updated to ${role}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update role");
    }
  };

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;
    try {
      await removeProjectMember({
        projectId,
        userId: memberToRemove.userId,
        reason: removeReason.trim(),
      }).unwrap();
      toast.success("Member removed");
      setMemberToRemove(null);
      setRemoveReason("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to remove member");
    }
  };

  const handleRemoveDialogChange = (next) => {
    if (!next) {
      setMemberToRemove(null);
      setRemoveReason("");
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Back nav */}
      <div className="flex items-center justify-between gap-3">
        <Link to="/projects">
          <Button
            variant="ghost"
            className="h-9 px-3 text-muted-foreground hover:text-foreground"
          >
            <DASHBOARD_ICONS.ARROWLEFT className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
        {isOwner && (
          <Button
            onClick={() => setIsEditOpen(true)}
            className="h-10 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25"
          >
            <DASHBOARD_ICONS.PENCIL className="mr-2 h-4 w-4" />
            Edit Project
          </Button>
        )}
      </div>

      {/* Project header card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <CardTitle className="text-3xl font-bold tracking-tight">
                  {project.title}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={
                    STATUS_STYLES[project.status] || STATUS_STYLES.ARCHIVED
                  }
                >
                  {(project.status || "—").replace("_", " ")}
                </Badge>
              </div>
              <CardDescription className="text-base">
                {project.description || "No description provided."}
              </CardDescription>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/40 p-3">
              <Avatar size="lg">
                <AvatarFallback>
                  {project.ownerName?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Owner
                </div>
                <div className="text-sm font-medium truncate">
                  {project.ownerName}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {project.ownerEmail}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <DASHBOARD_ICONS.USERS className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Members
              </div>
              <div className="text-2xl font-semibold">
                {project.memberCount ?? members.length}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <DASHBOARD_ICONS.LISTCHECKS className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Tasks
              </div>
              <div className="text-2xl font-semibold">
                {project.taskCount ?? tasks.length}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <DASHBOARD_ICONS.CALENDARDAYS className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Created
              </div>
              <div className="text-sm font-medium">
                {project.createdAt ? formatDateDisplay(project.createdAt) : "—"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Members */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Project Members</CardTitle>
              <CardDescription>
                {isOwner
                  ? "Manage who has access to this project."
                  : "People with access to this project."}
              </CardDescription>
            </div>
            {isOwner && (
              <Button
                onClick={() => setIsAddMemberOpen(true)}
                variant="outline"
                className="border-border/50"
              >
                <DASHBOARD_ICONS.PLUS className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-10 rounded-lg border border-dashed border-border/50">
              <DASHBOARD_ICONS.USERS className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No members yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border/50">
              {members.map((member) => {
                const isMemberOwner = member.role === "OWNER";
                const canManage = isOwner && !isMemberOwner;

                return (
                  <li
                    key={member.id}
                    className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <Avatar size="lg">
                      {member.userAvatar && (
                        <AvatarImage src={member.userAvatar} />
                      )}
                      <AvatarFallback>
                        {member.userName?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium truncate">
                          {member.userName}
                        </span>
                        {member.userId === user?.id && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] uppercase"
                          >
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {member.userEmail}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {canManage ? (
                        <Select
                          value={member.role}
                          onValueChange={(role) =>
                            handleRoleChange(member, role)
                          }
                        >
                          <SelectTrigger
                            size="sm"
                            className="w-[120px] border-border/50 bg-background/50"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            className="bg-card/95 backdrop-blur-sm border-border/50"
                          >
                            {ROLE_OPTIONS.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          variant="outline"
                          className={
                            ROLE_STYLES[member.role] || ROLE_STYLES.MEMBER
                          }
                        >
                          {member.role}
                        </Badge>
                      )}

                      {canManage && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMemberToRemove(member)}
                          className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          aria-label={`Remove ${member.userName}`}
                        >
                          <DASHBOARD_ICONS.TRASH2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Tasks */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Tasks</CardTitle>
              <CardDescription>
                {isManager
                  ? "Assign work to members and verify completed tasks."
                  : "Tasks in this project."}
              </CardDescription>
            </div>
            {isManager && (
              <Button
                onClick={() => setIsCreateTaskOpen(true)}
                variant="outline"
                className="border-border/50"
              >
                <DASHBOARD_ICONS.PLUS className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {tasksWithProjectId.length === 0 ? (
            <div className="text-center py-10 rounded-lg border border-dashed border-border/50">
              <DASHBOARD_ICONS.LISTCHECKS className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No tasks yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border/50">
              {tasksWithProjectId.map((task) => {
                const needsReview =
                  isOwner && task.status === "IN_REVIEW";
                return (
                  <li
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 cursor-pointer hover:bg-muted/30 -mx-2 px-2 rounded-md transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium truncate">
                          {task.title}
                        </span>
                        {task.priority && (
                          <Badge
                            className={`${
                              TASK_PRIORITY_STYLES[task.priority]
                            } border-transparent text-[10px] uppercase`}
                          >
                            {task.priority}
                          </Badge>
                        )}
                        {needsReview && (
                          <Badge
                            variant="outline"
                            className="border-amber-500/40 text-amber-600 text-[10px] uppercase"
                          >
                            Needs verification
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate mt-0.5">
                        {task.assigneeName
                          ? `Assigned to ${task.assigneeName}`
                          : "Unassigned"}
                        {task.deadline &&
                          ` · Due ${formatDateDisplay(task.deadline)}`}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        TASK_STATUS_STYLES[task.status] ||
                        TASK_STATUS_STYLES.TODO
                      }
                    >
                      {task.status?.replace("_", " ")}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <EditProjectDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        project={project}
        onSave={handleSaveProject}
        isSaving={isUpdatingProject}
      />

      <AddMemberDialog
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        existingMemberIds={existingMemberIds}
        onAdd={handleAddMember}
        isSaving={isAddingMember}
      />

      <CreateTaskDialog
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        projectId={projectId}
        members={members}
      />

      <TaskDetailDialog
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTaskId(null)}
        members={members}
        currentUserId={user?.id}
        projectRole={projectRole}
      />

      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={handleRemoveDialogChange}
      >
        <AlertDialogContent className="border-border/50 bg-card/95 backdrop-blur-sm sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member?</AlertDialogTitle>
            <AlertDialogDescription>
              {memberToRemove
                ? `${memberToRemove.userName} will lose access to this project. They'll receive an email notification.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <Label htmlFor="remove-reason" className="text-sm">
              Reason{" "}
              <span className="text-muted-foreground">
                (shared in the email)
              </span>
            </Label>
            <Textarea
              id="remove-reason"
              value={removeReason}
              onChange={(e) => setRemoveReason(e.target.value)}
              placeholder="Why are you removing this member?"
              className="border-border/50 bg-background/50 min-h-[88px]"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectDetails;
