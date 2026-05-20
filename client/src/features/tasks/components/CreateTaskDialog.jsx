import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useCreateTaskMutation } from '@/features/tasks/task.api';

const CreateTaskDialog = ({ open, onOpenChange, projectId, members = [] }) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
      deadline: '',
      assigneeId: '',
    },
  });

  const handleClose = (next) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const onSubmit = async (data) => {
    try {
      await createTask({
        projectId: Number(projectId),
        title: data.title,
        description: data.description || null,
        priority: data.priority || null,
        deadline: data.deadline || null,
        assigneeId: data.assigneeId ? Number(data.assigneeId) : null,
      }).unwrap();
      toast.success('Task created');
      handleClose(false);
    } catch (err) {
      toast.error(err?.message || 'Failed to create task');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Assign work to a project member.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('title', { required: true })}
              placeholder="What needs to be done?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Additional context (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="priority">
                      <SelectValue />
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
              <Input id="deadline" type="date" {...register('deadline')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigneeId">Assignee</Label>
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="assigneeId">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.userId} value={String(m.userId)}>
                        {m.userName} ({m.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
