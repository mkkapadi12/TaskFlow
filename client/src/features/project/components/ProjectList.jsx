import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { formatDateDisplay } from '@/lib/utils';

import ProjectListSkeleton from './ProjectList.skeleton';

const ProjectList = ({ projects, isLoading, isFiltered }) => {
  if (isLoading) return <ProjectListSkeleton />;

  if (!projects || projects.length === 0) {
    return (
      <div className="border-border/50 bg-card/50 rounded-2xl border py-12 text-center backdrop-blur-sm">
        <DASHBOARD_ICONS.SQUARESTACK className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
        <h3 className="text-lg font-semibold">No projects found</h3>
        <p className="text-muted-foreground mt-1">
          {isFiltered
            ? 'No projects match your active filters. Try clearing them.'
            : 'Create a new project to get started.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const isArchived = project.status === 'ARCHIVED';

        return (
          <Link key={project.id} to={`/projects/${project.id}`}>
            <Card
              className={`border-border/50 bg-card/50 hover:border-primary/30 hover:shadow-primary/5 group h-full cursor-pointer backdrop-blur-sm transition-all hover:shadow-lg ${
                isArchived ? 'opacity-65' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle
                    className={`group-hover:text-primary transition-colors ${isArchived ? 'text-muted-foreground' : ''}`}
                  >
                    {project.title}
                  </CardTitle>
                  {isArchived && (
                    <Badge
                      variant="outline"
                      className="shrink-0 gap-1 border-amber-500/30 bg-amber-500/10 text-xs text-amber-600"
                    >
                      <DASHBOARD_ICONS.ARCHIVE className="h-3 w-3" />
                      Archived
                    </Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-2">
                  {project.description || 'No description provided.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <DASHBOARD_ICONS.USERS size={16} />
                    <span>{project.memberCount || 0} Members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DASHBOARD_ICONS.SQUARESTACK size={16} />
                    <span>{project.taskCount || 0} Tasks</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-muted-foreground/70 text-xs">
                {isArchived && project.archivedAt
                  ? `Archived on ${formatDateDisplay(project.archivedAt, 'dd/mm/yyyy')}`
                  : `Created on ${formatDateDisplay(project.createdAt, 'dd/mm/yyyy')}`}
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default ProjectList;
