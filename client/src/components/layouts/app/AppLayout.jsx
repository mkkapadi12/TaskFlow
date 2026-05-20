import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useGetProfileQuery } from '@/features/auth/auth.api';

import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch user profile once on mount — populates Redux store
  useGetProfileQuery();

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
