import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useVerifyTaskMutation,
} from '@/features/tasks/task.api';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { formatDateDisplay } from '@/lib/utils';

import TaskComments from './TaskComments';

const ACTIVE_STATUSES = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'IN_REVIEW', label: 'In Review' },
];

const formatDeadlineForInput = (deadline) => {
  if (!deadline) return '';
  return formatDateDisplay(deadline, 'calender', 'en-CA');
};

const TaskDetailDialog = ({
  task,
  isOpen,
  onClose,
  members = [],
  currentUserId,
  projectRole,
}) => {
  const isOwner = projectRole === 'OWNER';
  const isManager = isOwner || projectRole === 'ADMIN';
  const isAssignee = task && task.assigneeId === currentUserId;
  const canChangeStatus = isManager || isAssignee;
  const canVerify = isOwner && task?.status === 'IN_REVIEW';

  const UserIcon = DASHBOARD_ICONS.USER2 || 'span';
  const CalendarIcon = DASHBOARD_ICONS.CALENDAR || 'span';
  const PriorityIcon = DASHBOARD_ICONS.ALERTTRIANGLE || 'span';
  const StatusIcon = DASHBOARD_ICONS.LISTCHECKS || 'span';

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [updateStatus, { isLoading: isStatusUpdating }] =
    useUpdateTaskStatusMutation();
  const [verifyTask, { isLoading: isVerifying }] = useVerifyTaskMutation();

  useEffect(() => {
    if (task) {
      reset({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        deadline: formatDeadlineForInput(task.deadline),
        assigneeId: task.assigneeId ? String(task.assigneeId) : '',
      });
    }
  }, [task, reset]);

  if (!task) return null;

  const onSaveFields = async (data) => {
    try {
      await updateTask({
        taskId: task.id,
        projectId: task.projectId,
        title: data.title,
        description: data.description || null,
        priority: data.priority || null,
        deadline: data.deadline || null,
        assigneeId: data.assigneeId ? Number(data.assigneeId) : null,
      }).unwrap();
      toast.success('Task updated');
      onClose();
    } catch (err) {
      toast.error(err?.message || 'Failed to update task');
    }
  };

  const handleStatusChange = async (status) => {
    if (status === task.status) return;
    try {
      await updateStatus({
        taskId: task.id,
        projectId: task.projectId,
        status,
      }).unwrap();
      toast.success(`Status set to ${status.replace('_', ' ')}`);
    } catch (err) {
      toast.error(err?.message || 'Failed to update status');
    }
  };

  

  const handleVerify = async (approve) => {
    try {
      await verifyTask({
        taskId: task.id,
        projectId: task.projectId,
        approve,
      }).unwrap();
      toast.success(
        approve ? 'Task approved and marked DONE' : 'Task sent back'
      );
    } catch (err) {
      toast.error(err?.message || 'Failed to verify task');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border-border/80 flex h-[90vh] flex-col overflow-hidden border p-0 sm:max-w-4xl md:h-162.5">
        {/* Top Header */}
        <DialogHeader className="border-border/40 flex flex-row items-center justify-between gap-4 border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-normal tracking-wider uppercase">
              {isManager ? 'Edit Task' : 'Task Detail'}
            </span>
            <span className="text-muted-foreground/30">/</span>
            <Badge
              variant="outline"
              className="bg-muted/30 border-border/50 text-[10px] font-semibold uppercase"
            >
              {task.status?.replace('_', ' ')}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Content Body Layout */}
        <form
          onSubmit={handleSubmit(onSaveFields)}
          className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row"
        >
          {/* Left Main Content Pane */}
          <div className="flex min-h-0 flex-1 flex-col space-y-6 overflow-y-auto p-6">
            {/* Title Block */}
            <div className="space-y-1.5">
              <Label
                htmlFor="title"
                className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
              >
                Title
              </Label>
              <Input
                id="title"
                {...register('title', { required: true })}
                disabled={!isManager}
                placeholder="Task title..."
                className="placeholder:text-muted-foreground/40 border-none bg-transparent px-0 text-lg font-semibold tracking-tight shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-100"
              />
              {errors.title && (
                <p className="text-destructive text-xs">Title is required</p>
              )}
            </div>

            {/* Description Block */}
            <div className="space-y-1.5">
              <Label
                htmlFor="description"
                className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
              >
                Description
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                disabled={!isManager}
                placeholder="No description provided..."
                className="placeholder:text-muted-foreground/30 min-h-25 resize-none border-none bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-100"
              />
            </div>

            {/* Divider */}
            <div className="border-border/40 my-2 border-t" />

            {/* Activity / Comments Block */}
            <div className="min-h-0 flex-1">
              <TaskComments
                taskId={task.id}
                taskStatus={task.status}
                currentUserId={currentUserId}
                projectRole={projectRole}
              />
            </div>
          </div>

          {/* Right Inspector Sidebar Pane */}
          <div className="border-border/40 bg-muted/4 flex min-h-0 w-full flex-col justify-between gap-6 overflow-y-auto border-t p-6 md:w-80 md:border-t-0 md:border-l">
            <div className="space-y-5">
              <h4 className="text-muted-foreground/80 mb-2 text-xs font-bold tracking-wider uppercase">
                Attributes
              </h4>

              {/* Status Section */}
              {canChangeStatus && task.status !== 'DONE' && (
                <div className="space-y-1.5">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                    <StatusIcon className="h-3.5 w-3.5" />
                    <span>Status</span>
                  </div>
                  <Select
                    value={
                      ACTIVE_STATUSES.some((s) => s.value === task.status)
                        ? task.status
                        : undefined
                    }
                    onValueChange={handleStatusChange}
                    disabled={isStatusUpdating}
                  >
                    <SelectTrigger className="bg-background/50 border-border/60 hover:bg-background/80 h-9 w-full transition-colors">
                      <SelectValue placeholder="Move task" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVE_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isAssignee && !isManager && (
                    <p className="text-muted-foreground/80 text-[10px] leading-snug italic">
                      Move to "In Review" when you're ready for owner
                      verification.
                    </p>
                  )}
                </div>
              )}

              {/* Assignee Section */}
              <div className="space-y-1.5">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>Assignee</span>
                </div>
                <Controller
                  name="assigneeId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!isManager}
                    >
                      <SelectTrigger
                        id="assigneeId"
                        className="bg-background/50 border-border/60 hover:bg-background/80 h-9 w-full transition-colors"
                      >
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem
                            key={member.userId}
                            value={String(member.userId)}
                          >
                            {member.userName} ({member.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Priority Section */}
              <div className="space-y-1.5">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                  <PriorityIcon className="h-3.5 w-3.5" />
                  <span>Priority</span>
                </div>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!isManager}
                    >
                      <SelectTrigger
                        id="priority"
                        className="bg-background/50 border-border/60 hover:bg-background/80 h-9 w-full transition-colors"
                      >
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Deadline Section */}
              <div className="space-y-1.5">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  <span>Deadline</span>
                </div>
                <Input
                  id="deadline"
                  type="date"
                  min={new Date().toLocaleDateString('en-CA')}
                  {...register('deadline', {
                    validate: (value) =>
                      !value ||
                      value >= new Date().toLocaleDateString('en-CA') ||
                      'Deadline cannot be in the past',
                  })}
                  disabled={!isManager}
                  className="bg-background/50 border-border/60 hover:bg-background/80 h-9 w-full cursor-pointer transition-colors"
                />
                {errors.deadline && (
                  <p className="text-destructive text-[10px]">
                    {errors.deadline.message}
                  </p>
                )}
              </div>

              {/* Owner Verification Section */}
              {canVerify && (
                <div className="border-border/40 space-y-2 border-t pt-4">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                    <span>Owner Verification</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => handleVerify(true)}
                      disabled={isVerifying}
                      className="bg-primary hover:bg-primary/95 text-primary-foreground h-9 flex-1 rounded-lg text-xs font-semibold shadow-sm"
                    >
                      {isVerifying ? 'Saving...' : 'Approve & Close'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleVerify(false)}
                      disabled={isVerifying}
                      className="border-border/60 hover:bg-accent h-9 flex-1 rounded-lg text-xs font-semibold"
                    >
                      Send back
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Save Changes / Cancel buttons */}
            {isManager && (
              <div className="border-border/40 mt-auto flex items-center gap-2 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-border/60 hover:bg-accent h-9 flex-1 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-primary text-primary-foreground h-9 flex-1 rounded-lg text-xs font-semibold shadow-sm"
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailDialog;
