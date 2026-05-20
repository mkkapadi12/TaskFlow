
const TaskHeader = () => {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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
