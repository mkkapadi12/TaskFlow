import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useGetMyProjectsQuery,
  useGetProjectDetailsQuery,
} from '@/features/project/project.api';
import TaskDetailDialog from '@/features/tasks/components/TaskDetailDialog';
import { useGetMyTasksQuery } from '@/features/tasks/task.api';
import { useAuth } from '@/hooks/useAuth';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { cn, formatDateDisplay } from '@/lib/utils';

const TASK_PRIORITY_STYLES = {
  LOW: 'bg-blue-500/10 text-blue-500',
  MEDIUM: 'bg-yellow-500/10 text-yellow-600',
  HIGH: 'bg-orange-500/10 text-orange-600',
  URGENT: 'bg-destructive/10 text-destructive',
};

const CHART_COLORS = {
  TODO: '#38bdf8', // sky-400
  IN_PROGRESS: '#8b5cf6', // violet-500
  IN_REVIEW: '#f59e0b', // amber-500
  DONE: '#10b981', // emerald-500
  LOW: '#3b82f6', // blue-500
  MEDIUM: '#eab308', // yellow-500
  HIGH: '#f97316', // orange-500
  URGENT: '#ef4444', // red-500
};

const AdvancedAnalytics = () => {
  const { projectId } = useParams();
  const { user } = useAuth();

  // Filters
  const [selectedProjId, setSelectedProjId] = useState(projectId || 'all');
  const [timeframe, setTimeframe] = useState('30'); // '7', '30', '90', 'all'
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // API Queries
  const { data: projectsRes, isLoading: projectsLoading } =
    useGetMyProjectsQuery();
  const { data: myTasksRes, isLoading: myTasksLoading } = useGetMyTasksQuery();

  // If a specific project is selected, fetch all its tasks and members
  const isSpecificProj = selectedProjId !== 'all';
  const { data: projDetailsRes, isLoading: projDetailsLoading } =
    useGetProjectDetailsQuery(selectedProjId, { skip: !isSpecificProj });

  // Active Task Detail Query (for modal re-assignment members)
  const allTasksList = useMemo(() => {
    if (isSpecificProj) {
      return projDetailsRes?.data?.tasks || [];
    }
    return myTasksRes?.data || [];
  }, [isSpecificProj, projDetailsRes, myTasksRes]);

  const activeTask = useMemo(() => {
    return allTasksList.find((t) => t.id === selectedTaskId);
  }, [allTasksList, selectedTaskId]);

  const { data: activeTaskProjDetails } = useGetProjectDetailsQuery(
    activeTask?.projectId,
    { skip: !activeTask?.projectId }
  );

  const activeMembers = useMemo(() => {
    return activeTaskProjDetails?.data?.members || [];
  }, [activeTaskProjDetails]);

  const projects = projectsRes?.data || [];

  const isLoading =
    projectsLoading || myTasksLoading || (isSpecificProj && projDetailsLoading);

  // Calculations
  const analyticsData = useMemo(() => {
    const rawTasks = isSpecificProj
      ? projDetailsRes?.data?.tasks || []
      : myTasksRes?.data || [];

    // Filter by timeframe
    const now = new Date();
    const startDate =
      timeframe === 'all'
        ? null
        : new Date(now.setDate(now.getDate() - parseInt(timeframe)));

    const tasks = rawTasks.filter((t) => {
      if (!startDate) return true;
      const tDate = new Date(t.createdAt);
      return tDate >= startDate;
    });

    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'DONE').length;
    const inReview = tasks.filter((t) => t.status === 'IN_REVIEW').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todo = tasks.filter((t) => t.status === 'TODO').length;
    const active = total - done;

    // Overdue tasks
    const overdue = tasks.filter((t) => {
      if (!t.deadline || t.status === 'DONE') return false;
      return new Date(t.deadline) < new Date();
    });

    // Completion rate
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    // Avg Cycle Time (days between created and last updated/completed)
    const completedTasks = tasks.filter((t) => t.status === 'DONE');
    let avgCycleTime = 0;
    if (completedTasks.length > 0) {
      const totalTime = completedTasks.reduce((acc, t) => {
        const diff =
          new Date(t.updatedAt || t.createdAt) - new Date(t.createdAt);
        return acc + diff / (1000 * 60 * 60 * 24);
      }, 0);
      avgCycleTime = Math.max(1, Math.round(totalTime / completedTasks.length));
    }

    // Chart 1: Task Velocity (created vs completed daily)
    const dailyMap = {};
    tasks.forEach((t) => {
      const createdStr = new Date(t.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
      if (!dailyMap[createdStr]) {
        dailyMap[createdStr] = { date: createdStr, Created: 0, Completed: 0 };
      }
      dailyMap[createdStr].Created += 1;

      if (t.status === 'DONE') {
        const completedStr = new Date(
          t.updatedAt || t.createdAt
        ).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        });
        if (!dailyMap[completedStr]) {
          dailyMap[completedStr] = {
            date: completedStr,
            Created: 0,
            Completed: 0,
          };
        }
        dailyMap[completedStr].Completed += 1;
      }
    });

    const velocityData = Object.values(dailyMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-10); // last 10 days for cleaner view

    // Chart 2: Priority breakdown
    const priorities = { LOW: 0, MEDIUM: 0, HIGH: 0, URGENT: 0 };
    tasks.forEach((t) => {
      if (priorities[t.priority] !== undefined) {
        priorities[t.priority] += 1;
      }
    });
    const priorityData = Object.entries(priorities).map(([name, value]) => ({
      name,
      value,
    }));

    // Chart 3: Workload Distribution (members)
    const workloadMap = {};
    tasks.forEach((t) => {
      const name = t.assigneeName ? t.assigneeName : 'Unassigned';
      if (!workloadMap[name]) {
        workloadMap[name] = {
          name,
          Todo: 0,
          InProgress: 0,
          InReview: 0,
          Done: 0,
        };
      }
      if (t.status === 'TODO') workloadMap[name].Todo += 1;
      else if (t.status === 'IN_PROGRESS') workloadMap[name].InProgress += 1;
      else if (t.status === 'IN_REVIEW') workloadMap[name].InReview += 1;
      else if (t.status === 'DONE') workloadMap[name].Done += 1;
    });
    const workloadData = Object.values(workloadMap);

    // Top performers (users by tasks completed)
    const performersMap = {};
    completedTasks.forEach((t) => {
      const name = t.assigneeName || 'Unassigned';
      if (!performersMap[name]) {
        performersMap[name] = { name, count: 0, avatar: null };
      }
      performersMap[name].count += 1;
    });
    const topPerformers = Object.values(performersMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total,
      done,
      inReview,
      inProgress,
      todo,
      active,
      overdue,
      completionRate,
      avgCycleTime,
      velocityData,
      priorityData,
      workloadData,
      topPerformers,
    };
  }, [isSpecificProj, projDetailsRes, myTasksRes, timeframe]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <DASHBOARD_ICONS.LOADER2 className="text-primary mx-auto h-8 w-8 animate-spin" />
          <p className="text-muted-foreground mt-2 text-sm font-medium">
            Aggregating analytics data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-3 py-5 sm:space-y-6 sm:px-6 sm:py-8">
      {/* Filters Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Analytics
          </h1>
          <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
            Visualize productivity trends, workloads, and task efficiency.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Project Selector */}
          <Select value={selectedProjId} onValueChange={setSelectedProjId}>
            <SelectTrigger className="border-border/50 bg-card/40 w-45 backdrop-blur-sm sm:w-55">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent className="bg-card/95 border-border/50 backdrop-blur-sm">
              <SelectItem value="all">All Projects (Personal)</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Timeframe Selector */}
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="border-border/50 bg-card/40 w-32.5 backdrop-blur-sm sm:w-37.5">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent className="bg-card/95 border-border/50 backdrop-blur-sm">
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {/* KPI 1: Completion Rate */}
        <Card className="border-border/50 bg-card/50 group relative overflow-hidden backdrop-blur-sm transition-colors hover:border-emerald-500/20">
          <CardContent className="flex items-center justify-between p-4 sm:p-5">
            <div className="space-y-1">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                Completion Rate
              </span>
              <div className="text-2xl font-extrabold text-emerald-500 sm:text-3xl">
                {analyticsData.completionRate}%
              </div>
              <p className="text-muted-foreground text-[10px]">
                {analyticsData.done} of {analyticsData.total} tasks completed
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <DASHBOARD_ICONS.CHECKCIRCLE className="h-5 w-5" />
            </div>
          </CardContent>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-500/30 transition-colors group-hover:bg-emerald-500" />
        </Card>

        {/* KPI 2: Active Tasks */}
        <Card className="border-border/50 bg-card/50 group hover:border-primary/20 relative overflow-hidden backdrop-blur-sm transition-colors">
          <CardContent className="flex items-center justify-between p-4 sm:p-5">
            <div className="space-y-1">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                Active Volume
              </span>
              <div className="text-primary text-2xl font-extrabold sm:text-3xl">
                {analyticsData.active}
              </div>
              <p className="text-muted-foreground text-[10px]">
                Tasks currently in work cycle
              </p>
            </div>
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
              <DASHBOARD_ICONS.LISTCHECKS className="h-5 w-5" />
            </div>
          </CardContent>
          <div className="bg-primary/30 group-hover:bg-primary absolute inset-x-0 bottom-0 h-0.5 transition-colors" />
        </Card>

        {/* KPI 3: Overdue Risks */}
        <Card className="border-border/50 bg-card/50 group hover:border-destructive/20 relative overflow-hidden backdrop-blur-sm transition-colors">
          <CardContent className="flex items-center justify-between p-4 sm:p-5">
            <div className="space-y-1">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                Overdue Risks
              </span>
              <div
                className={cn(
                  'text-2xl font-extrabold sm:text-3xl',
                  analyticsData.overdue.length > 0
                    ? 'text-destructive animate-pulse'
                    : 'text-muted-foreground'
                )}
              >
                {analyticsData.overdue.length}
              </div>
              <p className="text-muted-foreground text-[10px]">
                Incomplete past deadline
              </p>
            </div>
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full',
                analyticsData.overdue.length > 0
                  ? 'bg-destructive/15 text-destructive'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <DASHBOARD_ICONS.ALERTTRIANGLE className="h-5 w-5" />
            </div>
          </CardContent>
          <div className="bg-border/30 group-hover:bg-destructive absolute inset-x-0 bottom-0 h-0.5 transition-colors" />
        </Card>

        {/* KPI 4: Cycle Time */}
        <Card className="border-border/50 bg-card/50 group relative overflow-hidden backdrop-blur-sm transition-colors hover:border-amber-500/20">
          <CardContent className="flex items-center justify-between p-4 sm:p-5">
            <div className="space-y-1">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                Avg Lead Time
              </span>
              <div className="text-2xl font-extrabold text-amber-500 sm:text-3xl">
                {analyticsData.avgCycleTime > 0
                  ? `${analyticsData.avgCycleTime} Days`
                  : '—'}
              </div>
              <p className="text-muted-foreground text-[10px]">
                Duration from created to done
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
              <DASHBOARD_ICONS.CLOCK className="h-5 w-5" />
            </div>
          </CardContent>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-500/30 transition-colors group-hover:bg-amber-500" />
        </Card>
      </div>

      {/* Recharts Chart Panels */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Chart 1: Task Velocity Trend */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Velocity Trend
            </CardTitle>
            <CardDescription className="text-xs">
              Chronological creation vs completion frequency.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.velocityData.length > 0 ? (
              <div className="h-65 w-full sm:h-75">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.velocityData}>
                    <defs>
                      <linearGradient
                        id="colorCreated"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={CHART_COLORS.IN_PROGRESS}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor={CHART_COLORS.IN_PROGRESS}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorCompleted"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={CHART_COLORS.DONE}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor={CHART_COLORS.DONE}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="date"
                      stroke="rgba(255,255,255,0.4)"
                      fontSize={10}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.4)"
                      fontSize={10}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(23, 23, 23, 0.95)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="Created"
                      stroke={CHART_COLORS.IN_PROGRESS}
                      fillOpacity={1}
                      fill="url(#colorCreated)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="Completed"
                      stroke={CHART_COLORS.DONE}
                      fillOpacity={1}
                      fill="url(#colorCompleted)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-muted-foreground border-border/40 flex h-65 items-center justify-center rounded-lg border border-dashed text-xs sm:h-75">
                Insufficient timeline data to map trend
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chart 2: Resource Workload Distribution */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Workload Allocation
            </CardTitle>
            <CardDescription className="text-xs">
              Distribution of active and completed tasks among members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.workloadData.length > 0 ? (
              <div className="h-65 w-full sm:h-75">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.workloadData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="rgba(255,255,255,0.4)"
                      fontSize={10}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.4)"
                      fontSize={10}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(23, 23, 23, 0.95)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="Todo"
                      name="To Do"
                      stackId="a"
                      fill={CHART_COLORS.TODO}
                    />
                    <Bar
                      dataKey="InProgress"
                      name="In Progress"
                      stackId="a"
                      fill={CHART_COLORS.IN_PROGRESS}
                    />
                    <Bar
                      dataKey="InReview"
                      name="In Review"
                      stackId="a"
                      fill={CHART_COLORS.IN_REVIEW}
                    />
                    <Bar
                      dataKey="Done"
                      name="Completed"
                      stackId="a"
                      fill={CHART_COLORS.DONE}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-muted-foreground border-border/40 flex h-65 items-center justify-center rounded-lg border border-dashed text-xs sm:h-75">
                No active member task assignments found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chart 3: Priority Spread */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Priority Spread
            </CardTitle>
            <CardDescription className="text-xs">
              Distribution of tasks based on criticality indicators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.total > 0 ? (
              <div className="flex h-65 w-full items-center justify-center sm:h-75">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.priorityData.filter(
                        (d) => d.value > 0
                      )}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {analyticsData.priorityData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[entry.name] || '#8884d8'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(23, 23, 23, 0.95)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-muted-foreground border-border/40 flex h-65 items-center justify-center rounded-lg border border-dashed text-xs sm:h-75">
                No task priority metrics available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chart 4: Status Workflow Funnel */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Workflow Progression
            </CardTitle>
            <CardDescription className="text-xs">
              Task volumes grouped by current layout column stages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.total > 0 ? (
              <div className="h-65 w-full sm:h-75">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={[
                      { name: 'To Do', Count: analyticsData.todo },
                      { name: 'In Progress', Count: analyticsData.inProgress },
                      { name: 'In Review', Count: analyticsData.inReview },
                      { name: 'Done', Count: analyticsData.done },
                    ]}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="rgba(255,255,255,0.4)"
                      fontSize={10}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.4)"
                      fontSize={10}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(23, 23, 23, 0.95)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar
                      dataKey="Count"
                      fill={CHART_COLORS.IN_PROGRESS}
                      barSize={35}
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      type="monotone"
                      dataKey="Count"
                      stroke={CHART_COLORS.DONE}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-muted-foreground border-border/40 flex h-65 items-center justify-center rounded-lg border border-dashed text-xs sm:h-75">
                No active tasks to compile workflow stages
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Insights Row: Overdue Risk Tasks and Top Performers */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Risk Items Column */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <DASHBOARD_ICONS.ALERTTRIANGLE className="text-destructive h-5 w-5 shrink-0" />
              High-Risk Attention Items
            </CardTitle>
            <CardDescription className="text-xs">
              List of overdue, uncompleted tasks needing immediate action. Click
              to edit.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {analyticsData.overdue.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-border/50 text-muted-foreground border-b text-[10px] font-semibold tracking-wider uppercase">
                      <th className="px-4 py-3">Task Title</th>
                      <th className="px-4 py-3">Assignee</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3 text-right">Deadline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/50 divide-y">
                    {analyticsData.overdue.map((task) => (
                      <tr
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className="hover:bg-muted/30 group cursor-pointer transition-colors"
                      >
                        <td className="group-hover:text-primary max-w-37.5 truncate px-4 py-3.5 font-medium transition-colors sm:max-w-50">
                          {task.title}
                        </td>
                        <td className="text-muted-foreground px-4 py-3.5">
                          {task.assigneeName ? task.assigneeName : 'Unassigned'}
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge
                            className={cn(
                              TASK_PRIORITY_STYLES[task.priority],
                              'shrink-0 rounded-full border-none px-2 py-0 text-[9px] font-semibold tracking-wider uppercase'
                            )}
                          >
                            {task.priority}
                          </Badge>
                        </td>
                        <td className="text-destructive px-4 py-3.5 text-right font-semibold">
                          {formatDateDisplay(task.deadline, 'short')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-muted-foreground border-border/40 m-4 flex h-37.5 items-center justify-center rounded-lg border border-dashed text-xs">
                🎉 Awesome! No high-risk overdue tasks found!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Performers Column */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Top Performers
            </CardTitle>
            <CardDescription className="text-xs">
              Contributors with the most tasks completed in this range.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.topPerformers.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.topPerformers.map((performer, index) => (
                  <div
                    key={performer.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground w-4 text-sm font-bold">
                        #{index + 1}
                      </div>
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-emerald-500/10 text-xs font-bold text-emerald-500 uppercase">
                          {performer.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="max-w-25 truncate text-sm font-semibold sm:max-w-none">
                        {performer.name}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-500/10 font-extrabold text-emerald-600"
                    >
                      {performer.count} Done
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground border-border/40 flex h-37.5 items-center justify-center rounded-lg border border-dashed text-xs">
                No completions to score performances
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Task Details Dialog Modal Integration */}
      <TaskDetailDialog
        task={activeTask}
        isOpen={!!activeTask}
        onClose={() => setSelectedTaskId(null)}
        members={activeMembers}
        currentUserId={user?.id}
        projectRole={
          activeTaskProjDetails?.data?.members?.find(
            (m) => m.userId === user?.id
          )?.role
        }
      />
    </div>
  );
};

export default AdvancedAnalytics;
