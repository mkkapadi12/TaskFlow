import React from "react";
import { Button } from "@/components/ui/button";
import { DASHBOARD_ICONS } from "@/lib/icons/dashboard.icons";
import { useAuth } from "@/hooks/useAuth";

const ProjectHeader = ({ onCreateClick }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground mt-1">
          Manage your workspaces and track progress.
        </p>
      </div>

      {user?.role === "ADMIN" && (
        <Button
          onClick={onCreateClick}
          className="h-11 px-5 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25"
        >
          <DASHBOARD_ICONS.PLUS className="mr-2 h-5 w-5" />
          New Project
        </Button>
      )}
    </div>
  );
};

export default ProjectHeader;
