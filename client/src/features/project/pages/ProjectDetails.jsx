import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProjectDetailsQuery } from "@/features/project/project.api";
import { useUpdateTaskMutation } from "@/features/tasks/task.api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core";
import TaskDetailDialog from "@/features/tasks/components/TaskDetailDialog";
import { formatDateDisplay } from "@/lib/utils";

const COLUMNS = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

const KanbanColumn = ({ status, tasks, onTaskClick }) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className="bg-muted/50 p-4 rounded-lg min-h-[500px] w-full space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          {status.replace("_", " ")}
        </h2>
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <KanbanTask
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </div>
    </div>
  );
};

const KanbanTask = ({ task, onClick }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id.toString(),
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="touch-none"
    >
      <Card
        className="cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing"
        onClick={onClick}
      >
        <CardHeader className="p-3">
          <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 flex justify-between items-center">
          <Badge
            variant={
              task.priority === "URGENT" || task.priority === "HIGH"
                ? "destructive"
                : "secondary"
            }
          >
            {task.priority}
          </Badge>
          {task.deadline && (
            <span className="text-xs text-muted-foreground">
              {formatDateDisplay(task.deadline)}
            </span>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ProjectDetails = () => {
  const { projectId } = useParams();
  const {
    data: resData,
    isLoading,
    isError,
  } = useGetProjectDetailsQuery(projectId);
  const data = resData?.data;
  const [updateTask] = useUpdateTaskMutation();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) return <div className="p-6">Loading project details...</div>;
  if (isError || !data)
    return (
      <div className="p-6 text-destructive">Error loading project details.</div>
    );

  const project = data;
  const tasks = data.tasks || [];
  const members = data.members || [];

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    const task = tasks.find((t) => t.id.toString() === taskId);
    if (task && task.status !== newStatus) {
      updateTask({ taskId, status: newStatus, projectId });
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {project?.title}
          </h1>
          <p className="text-muted-foreground">{project?.description}</p>
        </div>

        {/* Members */}
        <div className="flex flex-col items-end gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Team Members
          </span>
          <div className="flex -space-x-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground border-2 border-background text-xs font-medium"
                title={`${member.userName} (${member.role})`}
              >
                {member?.userName?.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasks.filter((t) => t.status === status)}
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>
      </DndContext>

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        task={selectedTask}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        members={members}
      />
    </div>
  );
};

export default ProjectDetails;
