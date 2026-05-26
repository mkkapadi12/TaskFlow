import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetMyProjectsQuery } from '@/features/project/project.api';
import {
  useGetMyTasksQuery,
  useGetOverdueTasksQuery,
} from '@/features/tasks/task.api';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { cn } from '@/lib/utils';

const UserDashboard = () => {
  const { data: projectData, isLoading: projectsLoading } =
    useGetMyProjectsQuery();
  const { data: tasks, isLoading: tasksLoading } = useGetMyTasksQuery();
  const { data: overdueTasks, isLoading: overdueLoading } =
    useGetOverdueTasksQuery();

  const projects = projectData?.data;
  const tasksData = tasks?.data;
  const overdueTasksData = overdueTasks?.data;

  if (projectsLoading || tasksLoading || overdueLoading) {
    return <div className="p-6">Loading dashboard data...</div>;
  }

  // Process data for chart
  const statusCounts = Array.isArray(tasksData)
    ? tasksData.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {})
    : {};

  const chartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Helper to calculate relative remaining days label
  const getRemainingDaysLabel = (deadlineStr) => {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const dDate = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
    const nDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = dDate.getTime() - nDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Overdue';
    return `In ${diffDays} days`;
  };

  const COLORS = ['#10b981', '#38bdf8', '#f59e0b', '#8b5cf6'];

  // Filter upcoming deadlines
  const upcomingTasks = Array.isArray(tasksData)
    ? tasksData
        .filter((task) => {
          if (!task.deadline) return false;
          const deadline = new Date(task.deadline);
          const now = new Date();
          return deadline > now && task.status !== 'DONE';
        })
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5)
    : [];

  return (
    <div className="space-y-4 p-3 sm:space-y-6 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <DASHBOARD_ICONS.BRIEFCASE className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects?.length || 0}</div>
            <p className="text-muted-foreground text-xs">
              Active projects you are part of
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <DASHBOARD_ICONS.LISTCHECKS className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks?.data?.length || 0}</div>
            <p className="text-muted-foreground text-xs">
              Tasks assigned to you
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <DASHBOARD_ICONS.ALERTTRIANGLE className="text-destructive h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-2xl font-bold">
              {overdueTasksData?.length || 0}
            </div>
            <p className="text-muted-foreground text-xs">
              Tasks past their deadline
            </p>
          </CardContent>
        </Card>
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
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-xl">Upcoming Deadlines</CardTitle>
              <p className="text-muted-foreground text-xs">Your near-term due dates</p>
            </div>
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
              <DASHBOARD_ICONS.CLOCK className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => {
                  const priorityColors = {
                    LOW: 'border-l-blue-500 bg-blue-500/5 hover:bg-blue-500/10 text-blue-500 border-blue-500/20',
                    MEDIUM: 'border-l-amber-500 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 border-amber-500/20',
                    HIGH: 'border-l-orange-500 bg-orange-500/5 hover:bg-orange-500/10 text-orange-600 border-orange-500/20',
                    URGENT: 'border-l-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-600 border-red-500/20',
                  };

                  const priorityBadges = {
                    LOW: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
                    MEDIUM: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
                    HIGH: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
                    URGENT: 'bg-red-500/10 text-red-500 border-red-500/30',
                  };

                  return (
                    <div
                      key={task.id}
                      className={cn(
                        'group flex items-center justify-between border-l-4 rounded-r-xl border border-border/40 p-3 transition-all duration-200 hover:-translate-x-0.5 hover:shadow-md backdrop-blur-sm',
                        task.priority === 'URGENT' ? priorityColors.URGENT :
                        task.priority === 'HIGH' ? priorityColors.HIGH :
                        task.priority === 'MEDIUM' ? priorityColors.MEDIUM :
                        priorityColors.LOW
                      )}
                    >
                      <div className="space-y-1 min-w-0 flex-1 pr-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-semibold text-sm text-foreground truncate max-w-40 sm:max-w-xs group-hover:text-primary transition-colors">
                            {task.title}
                          </span>
                          {task.projectTitle && (
                            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider bg-background/50 border border-border/30 px-1.5 py-0.5 rounded">
                              {task.projectTitle}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <DASHBOARD_ICONS.CLOCK className="h-3.5 w-3.5 opacity-60 text-primary" />
                            {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-foreground/80">
                            <DASHBOARD_ICONS.CALENDAR className="h-3.5 w-3.5 opacity-60 text-primary" />
                            {getRemainingDaysLabel(task.deadline)}
                          </span>
                        </div>
                      </div>
                      
                      <Badge
                        variant="outline"
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase border shrink-0',
                          task.priority === 'URGENT' ? priorityBadges.URGENT :
                          task.priority === 'HIGH' ? priorityBadges.HIGH :
                          task.priority === 'MEDIUM' ? priorityBadges.MEDIUM :
                          priorityBadges.LOW
                        )}
                      >
                        {task.priority}
                      </Badge>
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
