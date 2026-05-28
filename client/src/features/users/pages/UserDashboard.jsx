import { useMemo } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import PriorityBadge from '@/components/shared/PriorityBadge';
import StatsCard from '@/components/shared/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { priorityColors } from '@/constant';
import { useGetMyProjectsQuery } from '@/features/project/project.api';
import {
  useGetMyTasksQuery,
  useGetOverdueTasksQuery,
} from '@/features/tasks/task.api';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { cn, formatDateDisplay, getRemainingDaysLabel } from '@/lib/utils';

const UserDashboard = () => {
  const { data: projectData, isLoading: projectsLoading } =
    useGetMyProjectsQuery();
  const { data: tasks, isLoading: tasksLoading } = useGetMyTasksQuery();
  const { data: overdueTasks, isLoading: overdueLoading } =
    useGetOverdueTasksQuery();

  const projects = projectData?.data;
  const tasksData = tasks?.data;
  const overdueTasksData = overdueTasks?.data;

  // Process data for chart
  const chartData = useMemo(() => {
    if (!Array.isArray(tasksData)) return [];
    const statusCounts = tasksData.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [tasksData]);

  const COLORS = ['#10b981', '#38bdf8', '#f59e0b', '#8b5cf6'];

  const DASHBOARD_DATA = [
    {
      title: 'Total Projects',
      value: projects?.length || 0,
      description: 'Active projects you are part of',
      icon: <DASHBOARD_ICONS.BRIEFCASE className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
      accentColor: 'sky',
    },
    {
      title: 'Total Tasks',
      value: tasks?.data?.length || 0,
      description: 'Tasks assigned to you',
      icon: (
        <DASHBOARD_ICONS.LISTCHECKS className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      ),
      accentColor: 'violet',
    },
    {
      title: 'Overdue Tasks',
      value: overdueTasksData?.length || 0,
      description: 'Tasks past their deadline',
      icon: (
        <DASHBOARD_ICONS.ALERTTRIANGLE className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      ),
      accentColor: 'destructive',
    },
  ];

  // Filter upcoming deadlines
  const upcomingTasks = useMemo(() => {
    if (!Array.isArray(tasksData)) return [];
    return tasksData
      .filter((task) => {
        if (!task.deadline) return false;
        const deadline = new Date(task.deadline);
        const now = new Date();
        return deadline > now && task.status !== 'DONE';
      })
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5);
  }, [tasksData]);

  if (projectsLoading || tasksLoading || overdueLoading) {
    return <div className="p-6">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-4 p-3 sm:space-y-6 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {DASHBOARD_DATA.map((item, index) => (
          <StatsCard
            key={index}
            title={item.title}
            value={item.value}
            description={item.description}
            icon={item.icon}
            accentColor={item.accentColor}
          />
        ))}
      </div>

      {/* Charts and Lists */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {/* Task Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center">
                No task data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="border-border/50 bg-card/50 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold tracking-tight sm:text-xl">
                Upcoming Deadlines
              </CardTitle>
              <p className="text-muted-foreground text-xs">
                Your near-term due dates
              </p>
            </div>
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
              <DASHBOARD_ICONS.CLOCK className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => {
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        'group border-border/40 flex items-center justify-between rounded-r-xl border border-l-4 p-3 backdrop-blur-sm transition-all duration-200 hover:-translate-x-0.5 hover:shadow-md',
                        task.priority === 'URGENT'
                          ? priorityColors.URGENT
                          : task.priority === 'HIGH'
                            ? priorityColors.HIGH
                            : task.priority === 'MEDIUM'
                              ? priorityColors.MEDIUM
                              : priorityColors.LOW
                      )}
                    >
                      <div className="min-w-0 flex-1 space-y-1 pr-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-foreground group-hover:text-primary max-w-40 truncate text-sm font-semibold transition-colors sm:max-w-xs">
                            {task.title}
                          </span>
                          {task.projectTitle && (
                            <span className="text-muted-foreground bg-background/50 border-border/30 rounded border px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase">
                              {task.projectTitle}
                            </span>
                          )}
                        </div>
                        <div className="text-muted-foreground flex items-center gap-3 text-[11px]">
                          <span className="flex items-center gap-1">
                            <DASHBOARD_ICONS.CLOCK className="text-primary h-3.5 w-3.5 opacity-60" />
                            {formatDateDisplay(task.deadline, 'short')}
                          </span>
                          <span className="text-foreground/80 flex items-center gap-1 font-semibold">
                            <DASHBOARD_ICONS.CALENDAR className="text-primary h-3.5 w-3.5 opacity-60" />
                            {getRemainingDaysLabel(task.deadline)}
                          </span>
                        </div>
                      </div>

                      <PriorityBadge
                        priority={task.priority}
                        size="sm"
                        className="shrink-0 text-[8px] font-bold tracking-wider uppercase"
                      />
                    </div>
                  );
                })
              ) : (
                <div className="text-muted-foreground border-border/40 flex h-36 items-center justify-center rounded-xl border border-dashed text-sm">
                  No upcoming deadlines found!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
