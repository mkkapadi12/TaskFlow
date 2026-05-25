import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import DocumentList from '@/features/documents/components/DocumentList';
import DocumentUploader from '@/features/documents/components/DocumentUploader';
import AddMemberDialog from '@/features/project/components/AddMemberDialog';
import EditProjectDialog from '@/features/project/components/EditProjectDialog';
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
import { useAuth } from '@/hooks/useAuth';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { cn, formatDateDisplay } from '@/lib/utils';
import { ProjectDetailsSkeleton } from '@/skeleton/ProjectDetalsSkeleton';

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

const TASK_STATUS_STYLES = {
  TODO: 'bg-muted text-muted-foreground border-muted-foreground/30',
  IN_PROGRESS: 'bg-primary/10 text-primary border-primary/30',
  IN_REVIEW: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  DONE: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
};

const TASK_PRIORITY_STYLES = {
  LOW: 'bg-blue-500/10 text-blue-500',
  MEDIUM: 'bg-yellow-500/10 text-yellow-600',
  HIGH: 'bg-orange-500/10 text-orange-600',
  URGENT: 'bg-destructive/10 text-destructive',
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
      <div className="flex items-center justify-between gap-3">
        <Link to="/projects">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground h-9 px-3"
          >
            <DASHBOARD_ICONS.ARROWLEFT className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Link to={`/projects/${projectId}/analytics`}>
            <Button
              variant="outline"
              className="border-border/50 h-10 rounded-full hover:bg-muted/50"
            >
              <DASHBOARD_ICONS.TRENDINGUP className="mr-2 h-4 w-4 text-primary" />
              Analytics
            </Button>
          </Link>
          {isOwner && (
            <Button
              onClick={() => setIsEditOpen(true)}
              className="shadow-primary/20 hover:shadow-primary/25 h-10 rounded-full shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
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
              </div>
              <CardDescription className="text-base">
                {project.description || 'No description provided.'}
              </CardDescription>
            </div>

            <div className="border-border/50 bg-background/40 flex items-center gap-3 rounded-lg border p-3">
              <Avatar size="lg">
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
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center gap-2 p-3 text-center sm:flex-row sm:gap-4 sm:p-5 sm:text-left">
            <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11">
              <DASHBOARD_ICONS.USERS className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="w-full min-w-0">
              <div className="text-muted-foreground truncate text-[10px] tracking-wider uppercase sm:text-xs">
                Members
              </div>
              <div className="text-lg font-semibold sm:text-2xl">
                {project.memberCount ?? members.length}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center gap-2 p-3 text-center sm:flex-row sm:gap-4 sm:p-5 sm:text-left">
            <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11">
              <DASHBOARD_ICONS.LISTCHECKS className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="w-full min-w-0">
              <div className="text-muted-foreground truncate text-[10px] tracking-wider uppercase sm:text-xs">
                Tasks
              </div>
              <div className="text-lg font-semibold sm:text-2xl">
                {project.taskCount ?? tasks.length}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center gap-2 p-3 text-center sm:flex-row sm:gap-4 sm:p-5 sm:text-left">
            <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11">
              <DASHBOARD_ICONS.CALENDARDAYS className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="w-full min-w-0">
              <div className="text-muted-foreground truncate text-[10px] tracking-wider uppercase sm:text-xs">
                Created
              </div>
              <div className="mt-0.5 truncate text-[11px] font-medium sm:text-sm">
                {project.createdAt
                  ? formatDateDisplay(project.createdAt, 'short')
                  : '—'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="bg-card/30 border-border/40 mb-4 flex rounded-xl border p-1 backdrop-blur-md md:hidden">
        <button
          onClick={() => setActiveTab('tasks')}
          className={cn(
            'flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all',
            activeTab === 'tasks'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <DASHBOARD_ICONS.LISTCHECKS className="h-4 w-4" />
          Tasks
          <Badge
            variant="secondary"
            className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full p-0 px-1 text-[9px]"
          >
            {tasksWithProjectId.length}
          </Badge>
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={cn(
            'flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all',
            activeTab === 'members'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <DASHBOARD_ICONS.USERS className="h-4 w-4" />
          Members
          <Badge
            variant="secondary"
            className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full p-0 px-1 text-[9px]"
          >
            {members.length}
          </Badge>
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={cn(
            'flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all',
            activeTab === 'documents'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <DASHBOARD_ICONS.FILETEXT className="h-4 w-4" />
          Documents
        </button>
      </div>

      {/* Members */}
      <Card
        className={cn(
          'border-border/50 bg-card/50 backdrop-blur-sm',
          activeTab === 'members' ? 'block' : 'hidden md:block'
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
                className="border-border/50 w-full sm:w-auto shrink-0"
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
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar className="h-10 w-10 shrink-0">
                        {member.userAvatar && (
                          <AvatarImage src={member.userAvatar} />
                        )}
                        <AvatarFallback>
                          {member.userName?.charAt(0).toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="truncate text-sm font-semibold max-w-[150px] sm:max-w-none">
                            {member.userName}
                          </span>
                          {member.userId === user?.id && (
                            <Badge
                              variant="secondary"
                              className="text-[9px] uppercase tracking-wider px-1.5 py-0 rounded shrink-0 font-medium"
                            >
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="text-muted-foreground truncate text-[11px] mt-0.5 max-w-[200px] sm:max-w-none">
                          {member.userEmail}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-border/5 pt-2 sm:border-t-0 sm:pt-0 sm:justify-end shrink-0 w-full sm:w-auto">
                      <span className="sm:hidden text-xs text-muted-foreground font-medium">Role</span>
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
                              className="border-border/50 bg-background/50 w-[110px] text-xs px-2 h-8"
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
                              "border-none text-[9px] sm:text-xs font-semibold uppercase tracking-wider rounded-full px-2.5 py-0.5"
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
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0 shrink-0"
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
          'border-border/50 bg-card/50 backdrop-blur-sm',
          activeTab === 'tasks' ? 'block' : 'hidden md:block'
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
            <div className="flex items-center justify-between gap-2 w-full sm:w-auto shrink-0">
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
                  className="border-border/50 h-8 text-xs shrink-0"
                  size="sm"
                >
                  <DASHBOARD_ICONS.PLUS className="h-3.5 w-3.5 mr-1" />
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
                    className="hover:bg-muted/30 -mx-2 flex flex-col gap-2 rounded-lg px-2.5 py-3.5 cursor-pointer transition-all sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      {/* Row 1: Title + Badges (Priority, Verification) */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="text-sm font-semibold truncate max-w-[200px] sm:max-w-none">
                          {task.title}
                        </span>
                        {task.priority && (
                          <Badge
                            className={cn(
                              TASK_PRIORITY_STYLES[task.priority],
                              "border-none rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider shrink-0"
                            )}
                          >
                            {task.priority}
                          </Badge>
                        )}
                        {needsReview && (
                          <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-600 border-none rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider shrink-0"
                          >
                            Review
                          </Badge>
                        )}
                      </div>

                      {/* Row 2: Metadata (Assignee, Due Date) */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground mt-1">
                        <span className="truncate">
                          {task.assigneeName ? task.assigneeName.split(' ')[0] : 'Unassigned'}
                        </span>
                        {task.deadline && (
                          <>
                            <span className="opacity-40">•</span>
                            <span className="flex items-center gap-1">
                              <DASHBOARD_ICONS.CLOCK className="h-3 w-3 opacity-60 text-primary" />
                              {formatDateDisplay(task.deadline, 'short')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Row 3 on mobile / Right Column on desktop: Status Badge */}
                    <div className="flex items-center justify-between border-t border-border/5 pt-2 sm:border-t-0 sm:pt-0 shrink-0 w-full sm:w-auto mt-1 sm:mt-0">
                      <span className="sm:hidden text-xs text-muted-foreground font-medium">Status</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          TASK_STATUS_STYLES[task.status] || TASK_STATUS_STYLES.TODO,
                          "rounded-full border-none px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0"
                        )}
                      >
                        {task.status?.replace('_', ' ')}
                      </Badge>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card
        className={cn(
          'border-border/50 bg-card/50 backdrop-blur-sm',
          activeTab === 'documents' ? 'block' : 'hidden md:block'
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
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <Label htmlFor="remove-reason" className="text-sm">
              Reason{' '}
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
