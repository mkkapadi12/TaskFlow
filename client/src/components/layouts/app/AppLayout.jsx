import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useGetProfileQuery } from '@/features/auth/auth.api';
import { useAuth } from '@/hooks/useAuth';
import { getSocket } from '@/lib/socket';

import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Fetch user profile once on mount — populates Redux store
  useGetProfileQuery();

  // Connect to socket and register user immediately when logged in
  useEffect(() => {
    if (user?.id) {
      getSocket(user.id);
    }
  }, [user]);

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
