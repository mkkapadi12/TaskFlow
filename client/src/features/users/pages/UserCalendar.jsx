import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { useGetMyTasksQuery } from "@/features/tasks/task.api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const UserCalendar = () => {
  const { data: tasks, isLoading } = useGetMyTasksQuery();
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (isLoading) return <div className="p-6">Loading calendar...</div>;

  const tasksWithDeadlines = Array.isArray(tasks) ? tasks.filter(task => task.deadline) : [];

  // Create modifiers for react-day-picker
  const taskDates = tasksWithDeadlines.map(task => new Date(task.deadline));
  
  const modifiers = {
    hasTask: taskDates,
  };

  const modifiersClassNames = {
    hasTask: "border-primary border-2 font-bold", // Highlight days with tasks
  };

  // Filter tasks for the selected date
  const selectedDateString = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  const tasksOnSelectedDate = tasksWithDeadlines.filter(task => {
    return task.deadline.startsWith(selectedDateString);
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
        <Card className="w-fit h-fit">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>
              Tasks for {selectedDate ? selectedDate.toLocaleDateString() : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasksOnSelectedDate.length > 0 ? (
                tasksOnSelectedDate.map(task => (
                  <div key={task.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">Status: {task.status}</p>
                    </div>
                    <Badge variant={task.priority === 'URGENT' || task.priority === 'HIGH' ? 'destructive' : 'secondary'}>
                      {task.priority}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No tasks due on this date</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserCalendar;