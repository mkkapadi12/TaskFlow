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

  // Colors aligned with the app's status/accent palette:
  // emerald (DONE), sky (TODO), amber (IN_REVIEW), violet (IN_PROGRESS)
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
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-muted-foreground text-sm">
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        task.priority === 'URGENT' || task.priority === 'HIGH'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No upcoming deadlines</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
