import { Link } from 'react-router-dom';

import PriorityBadge from '@/components/shared/PriorityBadge';
import StatusBadge from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { statusConfig } from '@/constant';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { formatDateDisplay } from '@/lib/utils';

import TaskListSkeleton from './TaskList.skeleton';

const isOverdue = (deadline, status) => {
  if (!deadline || status === 'DONE') return false;
  return new Date(deadline) < new Date();
};

const TaskList = ({ tasks, isLoading }) => {
  if (isLoading) return <TaskListSkeleton />;

  if (!tasks || tasks.length === 0) {
    return (
      <div className="border-border/50 bg-card/50 rounded-2xl border py-14 text-center backdrop-blur-sm">
        <DASHBOARD_ICONS.LISTCHECKS className="text-muted-foreground/40 mx-auto mb-4 h-12 w-12" />
        <h3 className="text-lg font-semibold">No tasks found</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          You're all caught up! Or try changing the filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const status = statusConfig[task.status] ?? statusConfig.TODO;
        const overdue = isOverdue(task.deadline, task.status);

        return (
          <Link
            to={`/projects/${task?.projectId}`}
            key={task.id}
            className="block"
          >
            <Card className="border-border/50 bg-card/50 hover:border-primary/30 hover:shadow-primary/5 group cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left: title + description */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Status dot + title */}
                      <span
                        className={`mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full ${status.dot}`}
                      />
                      <h3 className="group-hover:text-primary text-sm font-semibold transition-colors sm:text-base">
                        {task.title}
                      </h3>

                      {/* Priority badge */}
                      {task.priority && (
                        <PriorityBadge priority={task.priority} size="sm" />
                      )}
                    </div>

                    {/* Description */}
                    {task.description && (
                      <p className="text-muted-foreground line-clamp-1 pl-4 text-xs sm:text-sm">
                        {task.description}
                      </p>
                    )}

                    {/* Meta row: project + creator */}
                    <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 pl-4 text-xs">
                      {task.projectTitle && (
                        <span className="flex items-center gap-1">
                          <DASHBOARD_ICONS.BRIEFCASE className="h-3 w-3 shrink-0" />
                          {task.projectTitle}
                        </span>
                      )}
                      {task.creatorName && (
                        <span className="flex items-center gap-1">
                          <DASHBOARD_ICONS.USER className="h-3 w-3 shrink-0" />
                          {task.creatorName.trim()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: status + deadline */}
                  <div className="flex flex-row flex-wrap items-center gap-2 sm:flex-col sm:items-end sm:gap-2">
                    {/* Status badge */}
                    <StatusBadge status={task.status} />

                    {/* Deadline */}
                    {task.deadline && (
                      <span
                        className={`flex items-center gap-1 text-xs ${
                          overdue
                            ? 'text-destructive font-medium'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <DASHBOARD_ICONS.CLOCK
                          className={`h-3 w-3 shrink-0 ${overdue ? 'text-destructive' : 'text-primary'}`}
                        />
                        {overdue ? 'Overdue · ' : 'Due · '}
                        {formatDateDisplay(task.deadline, 'short')}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default TaskList;
