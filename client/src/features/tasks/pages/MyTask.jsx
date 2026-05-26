import { useState } from 'react';

import TaskFilters from '../components/TaskFilters';
import TaskHeader from '../components/TaskHeader';
import TaskList from '../components/TaskList';
import { useGetMyTasksQuery } from '../task.api';

const MyTask = () => {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  const { data: tasksData, isLoading } = useGetMyTasksQuery({
    search: searchQuery || undefined,
    priority: priorityFilter === 'ALL' ? undefined : priorityFilter,
    startDate: startDateFilter || undefined,
    endDate: endDateFilter || undefined,
  });

  const filteredTasks = tasksData?.data?.filter((task) => {
    const matchesStatus =
      statusFilter === 'ALL' || task.status === statusFilter;
    return matchesStatus;
  });

  return (
    <div className="container mx-auto px-3 py-5 sm:px-6 sm:py-8">
      <TaskHeader />

      <TaskFilters
        status={statusFilter}
        searchQuery={searchQuery}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearchQuery}
        priority={priorityFilter}
        onPriorityChange={setPriorityFilter}
        startDate={startDateFilter}
        onStartDateChange={setStartDateFilter}
        endDate={endDateFilter}
        onEndDateChange={setEndDateFilter}
      />

      <TaskList tasks={filteredTasks} isLoading={isLoading} />
    </div>
  );
};

export default MyTask;
