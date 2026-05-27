import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileSkeleton = () => {
  return (
    <div className="container mx-auto animate-pulse px-3 py-5 sm:px-6 sm:py-8">
      {/* Header */}
      <div className="mb-5 sm:mb-8">
        <Skeleton className="h-8 w-48 sm:h-9" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-8 lg:grid-cols-3">
        {/* Left Column: Summary Card */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-border/50 bg-card/50 overflow-hidden py-0 shadow-xl shadow-black/5 backdrop-blur-sm">
            <div className="flex h-24 flex-col items-center justify-center gap-1.5">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
            <CardContent className="relative -mt-12 flex flex-col items-center p-6 text-center">
              {/* Avatar Skeleton */}
              <div className="relative mb-4">
                <Skeleton className="border-background h-24 w-24 rounded-full border-4" />
              </div>

              {/* Name and Email */}
              <Skeleton className="mb-2 h-6 w-36" />
              <Skeleton className="mb-4 h-4 w-48" />

              {/* Badge */}
              <Skeleton className="mb-6 h-6 w-20 rounded-full" />

              {/* Stats Grid */}
              <div className="border-border/50 grid w-full grid-cols-2 gap-4 border-t pt-4">
                <div className="flex flex-col items-center gap-1">
                  <Skeleton className="h-7 w-10" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Skeleton className="h-7 w-10" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Form Card */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 bg-card/50 h-full shadow-xl shadow-black/5 backdrop-blur-sm">
            <CardHeader className="p-6 pb-0">
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Form inputs skeletons */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="pt-2">
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
