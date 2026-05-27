import { Skeleton } from '@/components/ui/skeleton';

const ProjectListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-45 w-full rounded-xl" />
      ))}
    </div>
  );
};

export default ProjectListSkeleton;
