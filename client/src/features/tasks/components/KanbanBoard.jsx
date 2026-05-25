import { useState } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { priorityConfig, statusConfig } from '@/constant';
import {
  useUpdateTaskStatusMutation,
  useVerifyTaskMutation,
} from '@/features/tasks/task.api';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { formatDateDisplay } from '@/lib/utils';

const COLUMNS = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

const KanbanBoard = ({
  tasks = [],
  isOwner,
  isManager,
  currentUserId,
  onSelectTask,
}) => {
  const [updateStatus, { isLoading: isStatusUpdating }] =
    useUpdateTaskStatusMutation();
  const [verifyTask, { isLoading: isVerifying }] = useVerifyTaskMutation();

  const [verifyDialogState, setVerifyDialogState] = useState({
    isOpen: false,
    taskId: null,
  });

  const getAssigneeInitials = (assigneeName) => {
    if (!assigneeName) return '?';
    return assigneeName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isOverdue = (deadline, status) => {
    if (!deadline || status === 'DONE') return false;
    return new Date(deadline) < new Date();
  };

  const handleDrop = async (taskId, sourceStatus, targetStatus) => {
    if (sourceStatus === targetStatus) return;

    // 1. Check if the task is already completed
    if (sourceStatus === 'DONE') {
      toast.error('Completed tasks cannot be moved back to active columns.');
      return;
    }

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const isAssignee = task.assigneeId === currentUserId;
    const canChangeStatus = isManager || isAssignee;

    // 2. Check general permissions
    if (!canChangeStatus) {
      toast.error('You are not authorized to update this task.');
      return;
    }

    // 3. Drop into DONE (Verification Workflow)
    if (targetStatus === 'DONE') {
      if (!isOwner) {
        toast.error('Only the project owner can verify tasks to completion.');
        return;
      }
      if (sourceStatus !== 'IN_REVIEW') {
        toast.error("Only tasks in 'In Review' status can be verified.");
        return;
      }

      // Open verify verification dialog
      setVerifyDialogState({
        isOpen: true,
        taskId: taskId,
      });
      return;
    }

    // 4. Drop into active status (TODO, IN_PROGRESS, IN_REVIEW)
    try {
      await updateStatus({
        taskId,
        projectId: task.projectId,
        status: targetStatus,
      }).unwrap();
      toast.success(`Task moved to ${statusConfig[targetStatus].label}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update task status');
    }
  };

  const handleVerify = async (approve) => {
    const { taskId } = verifyDialogState;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      await verifyTask({
        taskId,
        projectId: task.projectId,
        approve,
      }).unwrap();

      toast.success(
        approve
          ? 'Task approved and marked DONE'
          : 'Task rejected and sent back to In Progress'
      );
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to verify task');
    } finally {
      setVerifyDialogState({ isOpen: false, taskId: null });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 overflow-x-auto pb-4 md:grid-cols-4">
      {COLUMNS.map((columnId) => {
        const column = statusConfig[columnId];
        const columnTasks = tasks.filter((t) => t.status === columnId);

        return (
          <div
            key={columnId}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => {
              e.currentTarget.classList.add('bg-muted/20');
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('bg-muted/20');
            }}
            onDrop={(e) => {
              e.currentTarget.classList.remove('bg-muted/20');
              const taskId = Number(e.dataTransfer.getData('taskId'));
              const sourceStatus = e.dataTransfer.getData('sourceStatus');
              handleDrop(taskId, sourceStatus, columnId);
            }}
            className="border-border/40 bg-card/20 min-h-125 rounded-xl border p-3 transition-colors duration-200"
          >
            {/* Column Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${column.dot}`} />
                <h4 className="text-sm font-semibold tracking-wide">
                  {column.label}
                </h4>
              </div>
              <Badge variant="secondary" className="px-2 py-0 text-xs">
                {columnTasks.length}
              </Badge>
            </div>

            {/* Column Body / Cards */}
            <div className="space-y-2">
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => {
                  const priority = priorityConfig[task.priority];
                  const overdue = isOverdue(task.deadline, task.status);
                  const needsReview = isOwner && task.status === 'IN_REVIEW';

                  return (
                    <Card
                      key={task.id}
                      draggable={!isStatusUpdating && !isVerifying}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('taskId', task.id.toString());
                        e.dataTransfer.setData('sourceStatus', task.status);
                        e.currentTarget.style.opacity = '0.4';
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                      onClick={() => onSelectTask(task.id)}
                      className="border-border/50 bg-background/50 hover:border-primary/30 hover:shadow-primary/5 group cursor-pointer backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <CardContent className="space-y-3 p-3">
                        {/* Title and Priority */}
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="group-hover:text-primary line-clamp-2 text-sm font-semibold transition-colors">
                              {task.title}
                            </h5>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {priority && (
                              <Badge
                                variant="outline"
                                className={`${priority.className} rounded-full border-none px-2 py-0 text-[9px] font-semibold tracking-wider uppercase`}
                              >
                                {priority.label}
                              </Badge>
                            )}
                            {needsReview && (
                              <Badge
                                variant="outline"
                                className="rounded-full border-none bg-amber-500/10 px-2 py-0 text-[9px] font-semibold tracking-wider text-amber-600 uppercase"
                              >
                                Needs review
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        {task.description && (
                          <p className="text-muted-foreground line-clamp-2 text-xs">
                            {task.description}
                          </p>
                        )}

                        {/* Card Footer Meta */}
                        <div className="border-border/30 flex items-center justify-between border-t pt-2.5">
                          {/* Deadline */}
                          {task.deadline ? (
                            <span
                              className={`flex items-center gap-1 text-[10px] ${
                                overdue
                                  ? 'text-destructive font-medium'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              <DASHBOARD_ICONS.CLOCK
                                className={`h-3 w-3 shrink-0 ${
                                  overdue ? 'text-destructive' : 'text-primary'
                                }`}
                              />
                              {formatDateDisplay(task.deadline, 'short')}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/50 text-[10px]">
                              No due date
                            </span>
                          )}

                          {/* Assignee Avatar */}
                          <div className="flex items-center gap-1.5">
                            <Avatar size="sm" className="h-5 w-5">
                              {task.assigneeAvatar && (
                                <AvatarImage src={task.assigneeAvatar} />
                              )}
                              <AvatarFallback className="bg-muted text-muted-foreground text-[8px] font-bold">
                                {getAssigneeInitials(task.assigneeName)}
                              </AvatarFallback>
                            </Avatar>
                            {task.assigneeName && (
                              <span className="text-muted-foreground max-w-15 truncate text-[10px]">
                                {task.assigneeName}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="border-border/20 text-muted-foreground/30 flex h-25 items-center justify-center rounded-xl border-2 border-dashed text-xs">
                  Empty column
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Verify approval confirmation alert dialog */}
      <AlertDialog
        open={verifyDialogState.isOpen}
        onOpenChange={(next) =>
          !next && setVerifyDialogState({ isOpen: false, taskId: null })
        }
      >
        <AlertDialogContent className="border-border/50 bg-card/95 backdrop-blur-sm sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Verify Completed Task</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to approve this task and mark it as completed, or
              reject it and send it back to the active board?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <AlertDialogCancel className="border-border/50 mt-0 sm:mr-auto">
              Cancel
            </AlertDialogCancel>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <AlertDialogAction
                onClick={() => handleVerify(false)}
                variant="outline"
                className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
              >
                Send Back
              </AlertDialogAction>
              <AlertDialogAction
                onClick={() => handleVerify(true)}
                variant="default"
              >
                Approve Task
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default KanbanBoard;
