import { useState } from 'react';

import TaskFilters from '../components/TaskFilters';
import TaskHeader from '../components/TaskHeader';
import TaskList from '../components/TaskList';
import { useGetMyTasksQuery } from '../task.api';

const MyTask = () => {
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { data: tasksData, isLoading } = useGetMyTasksQuery();

  // Filter tasks on the client side if API doesn't support it directly for "my tasks"
  // (The API route /tasks/my usually returns all tasks for the user)
  const filteredTasks = tasksData?.data?.filter((task) => {
    if (statusFilter === 'ALL') return true;
    return task.status === statusFilter;
  });

  return (
    <div className="container mx-auto px-6 py-8">
      <TaskHeader />

      <TaskFilters status={statusFilter} onStatusChange={setStatusFilter} />

      <TaskList tasks={filteredTasks} isLoading={isLoading} />
    </div>
  );
};

export default MyTask;
