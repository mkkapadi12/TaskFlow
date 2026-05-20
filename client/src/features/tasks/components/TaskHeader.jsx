
const TaskHeader = () => {
  return (
    <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Tasks</h1>
        <p className="text-muted-foreground mt-1">
          Track your assignments and daily to-dos.
        </p>
      </div>
    </div>
  );
};

export default TaskHeader;
