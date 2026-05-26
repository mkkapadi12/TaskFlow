import { useState } from 'react';
import { toast } from 'sonner';

import CreateProjectDialog from '../components/CreateProjectDialog';
import ProjectFilters from '../components/ProjectFilters';
import ProjectHeader from '../components/ProjectHeader';
import ProjectList from '../components/ProjectList';
import {
  useCreateProjectMutation,
  useGetMyProjectsQuery,
} from '../project.api';

const Projects = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: projectsData, isLoading, refetch } = useGetMyProjectsQuery();
  const [createProject] = useCreateProjectMutation();

  const handleCreateProject = async (data) => {
    try {
      await createProject(data).unwrap();
      toast.success('Project created successfully!');
      setIsDialogOpen(false);
      refetch(); // Refresh the list
    } catch (error) {
      toast.error(error.message || 'Failed to create project');
    }
  };

  const filteredProjects = Array.isArray(projectsData?.data)
    ? projectsData.data.filter((project) => {
        const matchesStatus =
          statusFilter === 'ALL' || project.status === statusFilter;
        const matchesSearch =
          project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (project.description &&
            project.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
      })
    : [];

  return (
    <div className="container mx-auto px-3 py-5 sm:px-6 sm:py-8">
      <ProjectHeader onCreateClick={() => setIsDialogOpen(true)} />

      <ProjectFilters
        status={statusFilter}
        searchQuery={searchQuery}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearchQuery}
      />

      <ProjectList
        projects={filteredProjects}
        isLoading={isLoading}
        isFiltered={statusFilter !== 'ALL' || searchQuery.trim() !== ''}
      />

      <CreateProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreate={handleCreateProject}
      />
    </div>
  );
};

export default Projects;
