import { Skeleton } from '@/components/ui/skeleton';

const TaskCommentsSkeleton = () => {
  return (
    <div className="flex h-105 flex-col gap-4 py-4">
      <div className="h-full p-4">
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskCommentsSkeleton;
