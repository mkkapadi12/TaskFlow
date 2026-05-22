import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
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

const ACTIVE_STATUSES = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'IN_REVIEW', label: 'In Review' },
];

const formatDeadlineForInput = (deadline) => {
  if (!deadline) return '';
  return new Date(deadline)
    .toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, '-');
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

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();
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
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isManager ? 'Edit Task' : 'Task'}
            <Badge variant="outline" className="text-[10px] uppercase">
              {task.status?.replace('_', ' ')}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSaveFields)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('title', { required: true })}
              disabled={!isManager}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              disabled={!isManager}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!isManager}
                  >
                    <SelectTrigger id="priority">
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

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
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
              />
              {errors.deadline && (
                <p className="text-destructive text-xs">{errors.deadline.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigneeId">Assignee</Label>
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!isManager}
                >
                  <SelectTrigger id="assigneeId">
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

          {isManager && (
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save changes'}
              </Button>
            </DialogFooter>
          )}
        </form>

        {(canChangeStatus || canVerify) && (
          <div className="border-border/50 space-y-4 border-t pt-4">
            {canChangeStatus && task.status !== 'DONE' && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={
                    ACTIVE_STATUSES.some((s) => s.value === task.status)
                      ? task.status
                      : undefined
                  }
                  onValueChange={handleStatusChange}
                  disabled={isStatusUpdating}
                >
                  <SelectTrigger>
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
                  <p className="text-muted-foreground text-xs">
                    Move to "In Review" when you're ready for the owner to
                    verify.
                  </p>
                )}
              </div>
            )}

            {canVerify && (
              <div className="space-y-2">
                <Label>Owner verification</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => handleVerify(true)}
                    disabled={isVerifying}
                    className="flex-1"
                  >
                    {isVerifying ? '...' : 'Approve & mark DONE'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleVerify(false)}
                    disabled={isVerifying}
                    className="flex-1"
                  >
                    Send back
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailDialog;
