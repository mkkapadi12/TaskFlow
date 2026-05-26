import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Calendar, CalendarDayButton } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { priorityConfig, statusConfig } from '@/constant';
import { useGetProjectDetailsQuery } from '@/features/project/project.api';
import TaskDetailDialog from '@/features/tasks/components/TaskDetailDialog';
import { useGetMyTasksQuery } from '@/features/tasks/task.api';
import { useAuth } from '@/hooks/useAuth';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { cn, formatDateDisplay } from '@/lib/utils';

const UserCalendar = () => {
  const { user } = useAuth();
  const { data: tasksData, isLoading } = useGetMyTasksQuery();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const tasks = tasksData?.data;

  // Fetch project members dynamically when a task is clicked
  const selectedTask = Array.isArray(tasks)
    ? tasks.find((t) => t.id === selectedTaskId)
    : null;

  const { data: projectDetailsData } = useGetProjectDetailsQuery(
    selectedTask?.projectId,
    { skip: !selectedTask?.projectId }
  );

  const members = projectDetailsData?.data?.members || [];
  const currentMembership = members.find((m) => m.userId === user?.id);
  const projectRole = currentMembership?.role;

  if (isLoading) return <div className="p-6">Loading calendar...</div>;

  const tasksWithDeadlines = Array.isArray(tasks)
    ? tasks.filter((task) => task.deadline)
    : [];

  // Helper to format date for key-matching without timezone shift
  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dateVal = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${dateVal}`;
  };

  // Custom DayButton renderer to show priority dots
  const MyCustomDayButton = ({
    day,
    modifiers,
    locale,
    className,
    ...props
  }) => {
    const dateString = formatDateKey(day.date);
    const dayTasks = tasksWithDeadlines.filter((task) =>
      formatDateKey(new Date(task.deadline)) === dateString
    );

    return (
      <CalendarDayButton
        day={day}
        modifiers={modifiers}
        locale={locale}
        className={cn(
          'relative flex aspect-square size-auto w-full min-w-(--cell-size) flex-col items-center justify-between pb-1',
          className
        )}
        {...props}
      >
        <span className="mt-1">{day.date.getDate()}</span>
        {dayTasks.length > 0 && (
          <div className="z-20 mt-auto flex justify-center gap-0.5 pb-0.5">
            {dayTasks.slice(0, 3).map((task) => {
              const priorityDotColor =
                task.priority === 'URGENT' || task.priority === 'HIGH'
                  ? 'bg-rose-500 animate-pulse'
                  : task.priority === 'MEDIUM'
                    ? 'bg-amber-500'
                    : 'bg-sky-500';
              return (
                <span
                  key={task.id}
                  className={cn('h-1 w-1 rounded-full', priorityDotColor)}
                />
              );
            })}
          </div>
        )}
      </CalendarDayButton>
    );
  };

  console.log(selectedDate);

  // Filter tasks for the selected date
  const selectedDateString = selectedDate ? formatDateKey(selectedDate) : '';
  const tasksOnSelectedDate = tasksWithDeadlines.filter((task) => {
    return formatDateKey(new Date(task.deadline)) === selectedDateString;
  });

  return (
    <div className="space-y-4 p-3 sm:space-y-6 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Calendar
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr]">
        {/* Calendar Card */}
        <Card className="border-border/50 bg-card/50 h-fit w-full py-0 backdrop-blur-sm sm:w-fit">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              components={{
                DayButton: MyCustomDayButton,
              }}
              className="w-full rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Tasks List Card */}
        <Card className="border-border/50 bg-card/50 flex-1 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">
              Tasks for{' '}
              {selectedDate
                ? formatDateDisplay(selectedDate, 'short')
                : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasksOnSelectedDate.length > 0 ? (
                tasksOnSelectedDate.map((task) => {
                  const status = statusConfig[task.status] ?? statusConfig.TODO;
                  const priority = priorityConfig[task.priority];

                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      className="border-border/50 bg-background/50 hover:border-primary/30 hover:shadow-primary/5 group cursor-pointer rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        {/* Title & Description */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-block h-2 w-2 shrink-0 rounded-full ${status.dot}`}
                            />
                            <h3 className="group-hover:text-primary text-sm font-semibold transition-colors sm:text-base">
                              {task.title}
                            </h3>
                            {priority && (
                              <Badge
                                variant="outline"
                                className={`${priority.className} rounded-full border-none px-2 py-0 text-[10px] font-semibold tracking-wider uppercase`}
                              >
                                {priority.label}
                              </Badge>
                            )}
                          </div>

                          {task.description && (
                            <p className="text-muted-foreground line-clamp-1 pl-4 text-xs sm:text-sm">
                              {task.description}
                            </p>
                          )}

                          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 pl-4 text-xs">
                            {task.projectTitle && (
                              <span className="flex items-center gap-1">
                                <DASHBOARD_ICONS.BRIEFCASE className="h-3.5 w-3.5 shrink-0" />
                                {task.projectTitle}
                              </span>
                            )}
                            {task.assigneeName && (
                              <span className="flex items-center gap-1">
                                <DASHBOARD_ICONS.USER className="h-3.5 w-3.5 shrink-0" />
                                Assigned to {task.assigneeName}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex flex-row flex-wrap items-center gap-2 sm:flex-col sm:items-end sm:gap-2">
                          <Badge
                            variant="outline"
                            className={`${status.className} rounded-full border-none px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase`}
                          >
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="border-border/40 rounded-2xl border border-dashed py-14 text-center">
                  <DASHBOARD_ICONS.LISTCHECKS className="text-muted-foreground/30 mx-auto mb-4 h-12 w-12" />
                  <h3 className="text-lg font-semibold">No tasks due</h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    No tasks are scheduled for this date.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task detail editor dialog popup */}
      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          isOpen={!!selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          members={members}
          currentUserId={user?.id}
          projectRole={projectRole}
        />
      )}
    </div>
  );
};

export default UserCalendar;
