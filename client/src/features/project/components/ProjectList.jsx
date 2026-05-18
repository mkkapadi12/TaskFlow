import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DASHBOARD_ICONS } from "@/lib/icons/dashboard.icons";
import { Link } from "react-router-dom";

const { SQUARESTACK: SquareStack, USERS: Users } = DASHBOARD_ICONS;

const ProjectList = ({ projects, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
        <SquareStack className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold">No projects found</h3>
        <p className="text-muted-foreground mt-1">
          Create a new project to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link key={project.id} to={`/projects/${project.id}`}>
          <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer">
            <CardHeader>
              <CardTitle className="group-hover:text-primary transition-colors">
                {project.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {project.description || "No description provided."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{project.memberCount || 0} Members</span>
                </div>
                <div className="flex items-center gap-1">
                  <SquareStack size={16} />
                  <span>{project.taskCount || 0} Tasks</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground/70">
              Created on {new Date(project.createdAt).toLocaleDateString()}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ProjectList;
