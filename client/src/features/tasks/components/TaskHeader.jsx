import React from "react";

const TaskHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        <p className="text-muted-foreground mt-1">
          Track your assignments and daily to-dos.
        </p>
      </div>
    </div>
  );
};

export default TaskHeader;
