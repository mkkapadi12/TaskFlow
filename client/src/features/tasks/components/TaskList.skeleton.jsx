import { Skeleton } from '@/components/ui/skeleton';

const TaskListSkeleton = () => {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-22 w-full rounded-xl" />
      ))}
    </div>
  );
};

export default TaskListSkeleton;
