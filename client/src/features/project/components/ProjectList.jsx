import { Link } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';

const ProjectList = ({ projects, isLoading, isFiltered }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

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
      {projects.map((project) => (
        <Link key={project.id} to={`/projects/${project.id}`}>
          <Card className="border-border/50 bg-card/50 hover:border-primary/30 hover:shadow-primary/5 group h-full cursor-pointer backdrop-blur-sm transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="group-hover:text-primary transition-colors">
                {project.title}
              </CardTitle>
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
              Created on {new Date(project.createdAt).toLocaleDateString()}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ProjectList;
