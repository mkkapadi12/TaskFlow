import { useState } from 'react';

import TaskFilters from '../components/TaskFilters';
import TaskHeader from '../components/TaskHeader';
import TaskList from '../components/TaskList';
import { useGetMyTasksQuery } from '../task.api';

const MyTask = () => {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: tasksData, isLoading } = useGetMyTasksQuery();

  const filteredTasks = tasksData?.data?.filter((task) => {
    const matchesStatus =
      statusFilter === 'ALL' || task.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      task.projectTitle
        .toLowerCase()
        .trim()
        .includes(searchQuery.toLowerCase().trim()) ||
      task.title
        .toLowerCase()
        .trim()
        .includes(searchQuery.toLowerCase().trim());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container mx-auto px-3 py-5 sm:px-6 sm:py-8">
      <TaskHeader />

      <TaskFilters
        status={statusFilter}
        searchQuery={searchQuery}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearchQuery}
      />

      <TaskList tasks={filteredTasks} isLoading={isLoading} />
    </div>
  );
};

export default MyTask;
