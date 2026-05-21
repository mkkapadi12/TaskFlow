import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';

const statusColors = {
  TODO: 'bg-muted text-muted-foreground border-muted-foreground/20',
  IN_PROGRESS: 'bg-primary/10 text-primary border-primary/20',
  DONE: 'bg-green-500/10 text-green-500 border-green-500/20',
};

const priorityColors = {
  LOW: 'bg-blue-500/10 text-blue-500',
  MEDIUM: 'bg-yellow-500/10 text-yellow-500',
  HIGH: 'bg-destructive/10 text-destructive',
};

const TaskList = ({ tasks, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-[80px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="border-border/50 bg-card/50 rounded-2xl border py-12 text-center backdrop-blur-sm">
        <DASHBOARD_ICONS.LISTCHECKS className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
        <h3 className="text-lg font-semibold">No tasks found</h3>
        <p className="text-muted-foreground mt-1">
          You're all caught up! Or try changing the filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className="border-border/50 bg-card/50 hover:border-primary/30 hover:shadow-primary/5 cursor-pointer backdrop-blur-sm transition-all hover:shadow-lg"
        >
          <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-medium">{task.title}</h3>
                {task.priority && (
                  <Badge
                    className={`${
                      priorityColors[task.priority]
                    } rounded-full border-transparent px-2 py-0.5 text-xs`}
                  >
                    {task.priority}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground line-clamp-1 text-sm">
                {task.description || 'No description.'}
              </p>
            </div>

            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              {task.deadline && (
                <div className="flex items-center gap-1">
                  <DASHBOARD_ICONS.CLOCK size={14} className="text-primary" />
                  <span>
                    Due: {new Date(task.deadline).toLocaleDateString()}
                  </span>
                </div>
              )}

              <Badge
                className={`${
                  statusColors[task.status] || statusColors.TODO
                } rounded-full border px-2.5 py-0.5 text-xs`}
              >
                {task.status?.replace('_', ' ') || 'TO DO'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskList;
