import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import PriorityBadge from '@/components/shared/PriorityBadge';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import DocumentList from '@/features/documents/components/DocumentList';
import DocumentUploader from '@/features/documents/components/DocumentUploader';
import AddMemberDialog from '@/features/project/components/AddMemberDialog';
import EditProjectDialog from '@/features/project/components/EditProjectDialog';
import RemoveMemberDialog from '@/features/project/components/RemoveMemberDialog';
import {
  useAddProjectMemberMutation,
  useGetProjectDetailsQuery,
  useRemoveProjectMemberMutation,
  useUpdateMemberRoleMutation,
  useUpdateProjectMutation,
} from '@/features/project/project.api';
import CreateTaskDialog from '@/features/tasks/components/CreateTaskDialog';
import KanbanBoard from '@/features/tasks/components/KanbanBoard';
import TaskDetailDialog from '@/features/tasks/components/TaskDetailDialog';
import { useDeleteTaskMutation } from '@/features/tasks/task.api';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { useAuth } from '@/hooks/useAuth';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { cn, formatDateDisplay } from '@/lib/utils';

import ProjectDetailsSkeleton from '../components/ProjectDetails.skeleton';

const ROLE_OPTIONS = ['ADMIN', 'MEMBER', 'OWNER'];

const STATUS_STYLES = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  INACTIVE: 'bg-gray-500/10 text-gray-600 border-gray-500/30',
};

const ROLE_STYLES = {
  OWNER: 'bg-primary/15 text-primary border-primary/30',
  ADMIN: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
  MEMBER: 'bg-sky-500/10 text-sky-600 border-sky-500/30',
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
  const [deleteTask] = useDeleteTaskMutation();
  const confirm = useAlertDialog();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [removeReason, setRemoveReason] = useState('');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [activeTab, setActiveTab] = useState('tasks');

  if (isLoading) return <ProjectDetailsSkeleton />;

  if (isError || !resData?.data) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="py-10 text-center">
            <DASHBOARD_ICONS.ALERTTRIANGLE className="text-destructive mx-auto mb-3 h-10 w-10" />
            <p className="text-destructive font-medium">
              Unable to load project details.
            </p>
            <Link to="/projects">
              <Button variant="outline" className="border-border/50 mt-4">
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
  const isManager = projectRole === 'OWNER' || projectRole === 'ADMIN';
  const tasksWithProjectId = tasks.map((t) => ({
    ...t,
    projectId: Number(projectId),
  }));
  const selectedTask = tasksWithProjectId.find((t) => t.id === selectedTaskId);

  const handleSaveProject = async (payload) => {
    try {
      const result = await updateProject({ projectId, ...payload }).unwrap();
      toast.success(result?.message || 'Project updated successfully');
      setIsEditOpen(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update project');
    }
  };

  const handleAddMember = async ({ userId, role }) => {
    try {
      await addProjectMember({ projectId, userId, role }).unwrap();
      toast.success('Member added successfully');
      setIsAddMemberOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add member');
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
      toast.error(err?.data?.message || 'Failed to update role');
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
      toast.success('Member removed');
      setMemberToRemove(null);
      setRemoveReason('');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to remove member');
    }
  };

  const handleRemoveDialogChange = (next) => {
    if (!next) {
      setMemberToRemove(null);
      setRemoveReason('');
    }
  };

  return (
    <div className="container mx-auto space-y-4 px-3 py-5 sm:space-y-6 sm:px-6 sm:py-8">
      {/* Back nav */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Link to="/projects">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground -ml-3 h-9 px-3 sm:ml-0"
          >
            <DASHBOARD_ICONS.ARROWLEFT className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
          <Link
            to={`/projects/${projectId}/analytics`}
            className="flex-1 sm:flex-none"
          >
            <Button
              variant="outline"
              className="border-border/50 hover:bg-muted/50 h-10 w-full rounded-full sm:w-auto"
            >
              <DASHBOARD_ICONS.TRENDINGUP className="text-primary mr-2 h-4 w-4" />
              Analytics
            </Button>
          </Link>
          {isOwner && (
            <Button
              onClick={() => setIsEditOpen(true)}
              className="shadow-primary/20 hover:shadow-primary/25 h-10 w-full flex-1 rounded-full shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:w-auto sm:flex-none"
            >
              <DASHBOARD_ICONS.PENCIL className="mr-2 h-4 w-4" />
              Edit Project
            </Button>
          )}
        </div>
      </div>

      {/* Project header card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle className="text-3xl font-bold tracking-tight">
                  {project.title}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={
                    STATUS_STYLES[project.status] || STATUS_STYLES.ARCHIVED
                  }
                >
                  {(project.status || '—').replace('_', ' ')}
                </Badge>
                {project.allowReminders === 1 ||
                project.allowReminders === true ? (
                  <Badge
                    variant="outline"
                    className="flex shrink-0 items-center gap-1 border-sky-500/30 bg-sky-500/10 text-sky-600"
                  >
                    <DASHBOARD_ICONS.CLOCK className="h-3 w-3" />
                    Reminders Active
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-muted text-muted-foreground border-muted-foreground/30 flex shrink-0 items-center gap-1"
                  >
                    <DASHBOARD_ICONS.CLOSE className="h-3 w-3" />
                    Reminders Muted
                  </Badge>
                )}
              </div>
              <CardDescription className="text-base">
                {project.description || 'No description provided.'}
              </CardDescription>
            </div>

            <div className="border-border/50 bg-background/40 flex items-center gap-3 rounded-lg border p-3">
              <Avatar size="lg" className="h-12 w-12">
                <AvatarImage src={project?.ownerAvatar} />
                <AvatarFallback>
                  {project.ownerName?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="text-muted-foreground text-xs tracking-wider uppercase">
                  Owner
                </div>
                <div className="truncate text-sm font-medium">
                  {project.ownerName}
                </div>
                <div className="text-muted-foreground truncate text-xs">
                  {project.ownerEmail}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <StatsCard
          title="Members"
          value={project.memberCount ?? members.length}
          icon={<DASHBOARD_ICONS.USERS className="h-4 w-4 sm:h-5 sm:w-5" />}
          variant="minimal"
          accentColor="primary"
        />
        <StatsCard
          title="Tasks"
          value={project.taskCount ?? tasks.length}
          icon={
            <DASHBOARD_ICONS.LISTCHECKS className="h-4 w-4 sm:h-5 sm:w-5" />
          }
          variant="minimal"
          accentColor="primary"
        />
        <StatsCard
          title="Created"
          value={
            project.createdAt
              ? formatDateDisplay(project.createdAt, 'short')
              : '—'
          }
          icon={
            <DASHBOARD_ICONS.CALENDARDAYS className="h-4 w-4 sm:h-5 sm:w-5" />
          }
          variant="minimal"
          accentColor="primary"
        />
      </div>

      {/* Unified Tab Switcher */}
      <div
        className={cn(
          'bg-card/30 border-border/40 flex w-full flex-nowrap overflow-x-auto rounded-xl border p-1 backdrop-blur-md',
          isManager ? 'max-w-full' : 'max-w-full'
        )}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <button
          onClick={() => setActiveTab('tasks')}
          className={cn(
            'flex min-w-25 flex-1 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all sm:min-w-0 sm:text-sm',
            activeTab === 'tasks'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <DASHBOARD_ICONS.LISTCHECKS className="h-4 w-4 shrink-0" />
          Tasks
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full p-0 px-1 text-[10px]"
          >
            {tasksWithProjectId.length}
          </Badge>
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={cn(
            'flex min-w-27.5 flex-1 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all sm:min-w-0 sm:text-sm',
            activeTab === 'members'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <DASHBOARD_ICONS.USERS className="h-4 w-4 shrink-0" />
          Members
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full p-0 px-1 text-[10px]"
          >
            {members.length}
          </Badge>
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={cn(
            'flex min-w-27.5 flex-1 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all sm:min-w-0 sm:text-sm',
            activeTab === 'documents'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <DASHBOARD_ICONS.FILETEXT className="h-4 w-4 shrink-0" />
          Documents
        </button>
        {isManager && (
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              'flex min-w-25 flex-1 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all sm:min-w-0 sm:text-sm',
              activeTab === 'settings'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <DASHBOARD_ICONS.SETTINGS className="h-4 w-4 shrink-0" />
            Settings
          </button>
        )}
      </div>

      {/* Members */}
      <Card
        className={cn(
          'border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200',
          activeTab === 'members'
            ? 'animate-in fade-in block duration-200'
            : 'hidden'
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl">Project Members</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {isOwner
                  ? 'Manage who has access to this project.'
                  : 'People with access to this project.'}
              </CardDescription>
            </div>
            {isOwner && (
              <Button
                onClick={() => setIsAddMemberOpen(true)}
                variant="outline"
                className="border-border/50 w-full shrink-0 sm:w-auto"
                size="sm"
              >
                <DASHBOARD_ICONS.PLUS className="mr-1.5 h-3.5 w-3.5" />
                Add Member
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="border-border/50 rounded-lg border border-dashed py-10 text-center">
              <DASHBOARD_ICONS.USERS className="text-muted-foreground/50 mx-auto mb-3 h-10 w-10" />
              <p className="text-muted-foreground text-sm">No members yet.</p>
            </div>
          ) : (
            <ul className="divide-border/50 divide-y">
              {members.map((member) => {
                const isMemberOwner = member.role === 'OWNER';
                const canManage = isOwner && !isMemberOwner;

                return (
                  <li
                    key={member.id}
                    className="flex flex-col gap-2.5 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        {member.userAvatar && (
                          <AvatarImage src={member.userAvatar} />
                        )}
                        <AvatarFallback>
                          {member.userName?.charAt(0).toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="max-w-37.5 truncate text-sm font-semibold sm:max-w-none">
                            {member.userName}
                          </span>
                          {member.userId === user?.id && (
                            <Badge
                              variant="secondary"
                              className="shrink-0 rounded px-1.5 py-0 text-[9px] font-medium tracking-wider uppercase"
                            >
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="text-muted-foreground mt-0.5 max-w-50 truncate text-[11px] sm:max-w-none">
                          {member.userEmail}
                        </div>
                      </div>
                    </div>

                    <div className="border-border/5 flex w-full shrink-0 items-center justify-between gap-2 border-t pt-2 sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0">
                      <span className="text-muted-foreground text-xs font-medium sm:hidden">
                        Role
                      </span>
                      <div className="flex items-center gap-1.5">
                        {canManage ? (
                          <Select
                            value={member.role}
                            onValueChange={(role) =>
                              handleRoleChange(member, role)
                            }
                          >
                            <SelectTrigger
                              size="sm"
                              className="border-border/50 bg-background/50 h-8 w-27.5 px-2 text-xs"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent
                              position="popper"
                              className="bg-card/95 border-border/50 backdrop-blur-sm"
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
                            className={cn(
                              ROLE_STYLES[member.role] || ROLE_STYLES.MEMBER,
                              'rounded-full border-none px-2.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase sm:text-xs'
                            )}
                          >
                            {member.role}
                          </Badge>
                        )}

                        {canManage && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMemberToRemove(member)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0 p-0"
                            aria-label={`Remove ${member.userName}`}
                          >
                            <DASHBOARD_ICONS.TRASH2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Tasks */}
      <Card
        className={cn(
          'border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200',
          activeTab === 'tasks'
            ? 'animate-in fade-in block duration-200'
            : 'hidden'
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl">Tasks</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {isManager
                  ? 'Assign work to members and verify completed tasks.'
                  : 'Tasks in this project.'}
              </CardDescription>
            </div>
            <div className="flex w-full shrink-0 items-center justify-between gap-2 sm:w-auto">
              <div className="bg-background/50 border-border/50 flex items-center rounded-lg border p-0.5">
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-7 px-2.5 text-xs"
                >
                  List
                </Button>
                <Button
                  variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('kanban')}
                  className="h-7 px-2.5 text-xs"
                >
                  Kanban
                </Button>
              </div>
              {isManager && (
                <Button
                  onClick={() => setIsCreateTaskOpen(true)}
                  variant="outline"
                  className="border-border/50 h-8 shrink-0 text-xs"
                  size="sm"
                >
                  <DASHBOARD_ICONS.PLUS className="mr-1 h-3.5 w-3.5" />
                  <span>Create Task</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tasksWithProjectId.length === 0 ? (
            <div className="border-border/50 rounded-lg border border-dashed py-10 text-center">
              <DASHBOARD_ICONS.LISTCHECKS className="text-muted-foreground/50 mx-auto mb-3 h-10 w-10" />
              <p className="text-muted-foreground text-sm">No tasks yet.</p>
            </div>
          ) : viewMode === 'kanban' ? (
            <KanbanBoard
              tasks={tasksWithProjectId}
              isOwner={isOwner}
              isManager={isManager}
              currentUserId={user?.id}
              onSelectTask={setSelectedTaskId}
            />
          ) : (
            <ul className="divide-border/50 divide-y">
              {tasksWithProjectId.map((task) => {
                const needsReview = isOwner && task.status === 'IN_REVIEW';
                return (
                  <li
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="hover:bg-muted/30 -mx-2 flex cursor-pointer flex-col gap-2 rounded-lg px-2.5 py-3.5 transition-all sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      {/* Row 1: Title + Badges (Priority, Verification) */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="max-w-50 truncate text-sm font-semibold sm:max-w-none">
                          {task.title}
                        </span>
                        {task.priority && (
                          <PriorityBadge
                            priority={task.priority}
                            size="sm"
                            className="shrink-0 text-[9px] tracking-wider uppercase"
                          />
                        )}
                        {needsReview && (
                          <Badge
                            variant="outline"
                            className="shrink-0 rounded-full border-none bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-amber-600 uppercase"
                          >
                            Review
                          </Badge>
                        )}
                      </div>

                      {/* Row 2: Metadata (Assignee, Due Date) */}
                      <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]">
                        <span className="truncate">
                          {task.assigneeName ? task.assigneeName : 'Unassigned'}
                        </span>
                        {task.deadline && (
                          <>
                            <span className="opacity-40">•</span>
                            <span className="flex items-center gap-1">
                              <DASHBOARD_ICONS.CLOCK className="text-primary h-3 w-3 opacity-60" />
                              {formatDateDisplay(task.deadline, 'short')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Row 3 on mobile / Right Column on desktop: Status Badge */}
                    <div className="border-border/5 mt-1 flex w-full shrink-0 items-center justify-between border-t pt-2 sm:mt-0 sm:w-auto sm:border-t-0 sm:pt-0">
                      <span className="text-muted-foreground text-xs font-medium sm:hidden">
                        Status
                      </span>
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          status={task.status}
                          size="sm"
                          className="shrink-0 text-[9px] font-bold tracking-wider uppercase"
                        />
                        {isManager && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async (e) => {
                              e.stopPropagation();
                              const isConfirmed = await confirm({
                                title: 'Delete task?',
                                description: (
                                  <span>
                                    Are you sure you want to permanently delete
                                    task{' '}
                                    <span className="text-foreground font-medium">
                                      {task.title}
                                    </span>
                                    ? This action cannot be undone.
                                  </span>
                                ),
                                confirmText: 'Delete',
                                cancelText: 'Cancel',
                                media: (
                                  <DASHBOARD_ICONS.TRASH2 className="text-destructive h-6 w-6" />
                                ),
                                mediaClassName:
                                  'bg-destructive/10 text-destructive',
                                variant: 'destructive',
                              });
                              if (isConfirmed) {
                                try {
                                  await deleteTask({
                                    taskId: task.id,
                                    projectId: Number(projectId),
                                  }).unwrap();
                                  if (selectedTaskId === task.id) {
                                    setSelectedTaskId(null);
                                  }
                                  toast.success('Task deleted');
                                } catch (err) {
                                  toast.error(
                                    err?.message || 'Failed to delete task'
                                  );
                                }
                              }
                            }}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 w-7 shrink-0 rounded-lg p-0 transition-colors"
                            aria-label={`Delete task ${task.title}`}
                          >
                            <DASHBOARD_ICONS.TRASH2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* documents */}
      <Card
        className={cn(
          'border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200',
          activeTab === 'documents'
            ? 'animate-in fade-in block duration-200'
            : 'hidden'
        )}
      >
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Documents</CardTitle>
              <CardDescription>
                {isManager
                  ? 'Upload and manage project files.'
                  : 'Project files and resources.'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isManager && <DocumentUploader projectId={projectId} />}
          <DocumentList projectId={projectId} isManager={isManager} />
        </CardContent>
      </Card>

      {/* settings */}
      {isManager && (
        <Card
          className={cn(
            'border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200',
            activeTab === 'settings'
              ? 'animate-in fade-in block duration-200'
              : 'hidden'
          )}
        >
          <CardHeader>
            <div>
              <CardTitle className="text-xl">Project Settings</CardTitle>
              <CardDescription>
                Configure project settings and preferences.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-border/50 bg-background/30 flex items-center justify-between rounded-xl border p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <DASHBOARD_ICONS.CLOCK className="h-4 w-4 text-sky-500" />
                  Task Deadline Reminders
                </div>
                <div className="text-muted-foreground text-xs">
                  Send automatic email notifications to assignees 24 hours
                  before tasks become overdue.
                </div>
              </div>
              <Switch
                id="tab-reminders"
                checked={
                  project.allowReminders === 1 ||
                  project.allowReminders === true
                }
                disabled={isUpdatingProject}
                onCheckedChange={async (checked) => {
                  try {
                    await updateProject({
                      projectId,
                      allowReminders: checked ? 1 : 0,
                    }).unwrap();
                    toast.success(
                      checked
                        ? 'Deadline reminders enabled'
                        : 'Deadline reminders muted'
                    );
                  } catch (err) {
                    toast.error(
                      err?.message || 'Failed to update reminder settings'
                    );
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

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

      <RemoveMemberDialog
        member={memberToRemove}
        isOpen={!!memberToRemove}
        onOpenChange={handleRemoveDialogChange}
        reason={removeReason}
        onReasonChange={setRemoveReason}
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
};

export default ProjectDetails;
