import React, { useState } from "react";
import ProjectHeader from "../components/ProjectHeader";
import ProjectList from "../components/ProjectList";
import CreateProjectDialog from "../components/CreateProjectDialog";
import {
  useGetMyProjectsQuery,
  useCreateProjectMutation,
} from "../project.api";
import { toast } from "sonner";

const ProjectPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: projectsData, isLoading, refetch } = useGetMyProjectsQuery();
  const [createProject] = useCreateProjectMutation();

  const handleCreateProject = async (data) => {
    try {
      await createProject(data).unwrap();
      toast.success("Project created successfully!");
      setIsDialogOpen(false);
      refetch(); // Refresh the list
    } catch (error) {
      toast.error(error.message || "Failed to create project");
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <ProjectHeader onCreateClick={() => setIsDialogOpen(true)} />

      <ProjectList projects={projectsData?.data} isLoading={isLoading} />

      <CreateProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreate={handleCreateProject}
      />
    </div>
  );
};

export default ProjectPage;
