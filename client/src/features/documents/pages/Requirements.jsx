import { useMemo } from 'react';

import StatsCard from '@/components/shared/StatsCard';
import { DASHBOARD_ICONS } from '@/lib/icons/dashboard.icons';
import { formatBytes } from '@/lib/utils';

import DocumentList from '../components/DocumentList';
import { useGetGlobalDocumentsQuery } from '../document.api';

const Requirements = () => {
  const { data, isLoading } = useGetGlobalDocumentsQuery();
  const docs = useMemo(() => data?.data || [], [data]);

  const stats = useMemo(() => {
    const totalSize = docs.reduce((acc, doc) => acc + (doc.size || 0), 0);
    const uniqueProjects = new Set(docs.map((doc) => doc.projectId)).size;
    return {
      totalSize: formatBytes(totalSize),
      totalFiles: docs.length,
      projectCount: uniqueProjects,
    };
  }, [docs]);

  return (
    <div className="container mx-auto space-y-6 px-3 py-5 sm:px-6 sm:py-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Requirements
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Centralized workspace for all project documents, specs, and resources.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <StatsCard
          title="Total Files"
          value={isLoading ? '—' : stats.totalFiles}
          icon={
            <DASHBOARD_ICONS.FILETEXT className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          }
          accentColor="sky"
        />
        <StatsCard
          title="Total Storage"
          value={isLoading ? '—' : stats.totalSize}
          icon={
            <DASHBOARD_ICONS.HARDDRIVE className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          }
          accentColor="violet"
        />
        <StatsCard
          title="Projects Count"
          value={isLoading ? '—' : stats.projectCount}
          icon={
            <DASHBOARD_ICONS.BRIEFCASE className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          }
          accentColor="emerald"
        />
      </div>

      {/* Requirements List Container */}
      <div className="border-border/50 bg-card/30 rounded-2xl border p-4 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-6">
        <DocumentList isManager={false} global={true} />
      </div>
    </div>
  );
};

export default Requirements;
