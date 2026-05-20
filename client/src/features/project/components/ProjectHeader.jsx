
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';

const ProjectHeader = ({ onCreateClick }) => {
  const { user } = useAuth();

  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground mt-1">
          Manage your workspaces and track progress.
        </p>
      </div>

      {user?.role === 'ADMIN' && (
        <Button
          onClick={onCreateClick}
          className="shadow-primary/20 hover:shadow-primary/25 h-11 rounded-full px-5 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <DASHBOARD_ICONS.PLUS className="mr-2 h-5 w-5" />
          New Project
        </Button>
      )}
    </div>
  );
};

export default ProjectHeader;
