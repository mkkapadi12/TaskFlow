import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';

const FullPageSpinner = () => {
  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md">
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex h-12 w-12 items-center justify-center">
          {/* Animated Spinner Ring */}
          <div className="border-muted absolute h-full w-full rounded-full border-4"></div>
          <div className="border-primary absolute h-full w-full animate-spin rounded-full border-4 border-t-transparent"></div>
          <DASHBOARD_ICONS.BRIEFCASE size={20} className="text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground animate-pulse text-xs font-medium tracking-wider uppercase">
          Loading TaskFlow...
        </p>
      </div>
    </div>
  );
};

export default FullPageSpinner;
