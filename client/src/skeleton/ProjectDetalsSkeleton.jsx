import { Skeleton } from '@/components/ui/skeleton';

export const ProjectDetailsSkeleton = () => (
  <div className="container mx-auto space-y-6 px-6 py-8">
    <Skeleton className="h-10 w-40" />
    <Skeleton className="h-[160px] w-full rounded-xl" />
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
    </div>
    <Skeleton className="h-[300px] w-full rounded-xl" />
  </div>
);
