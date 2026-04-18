import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="p-4 m-2 flex h-screen overflow-hidden bg-dark">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto bg-linear-to-br from-dark via-dark to-dark-card/20 p-4 m-2 lg:p-6" key={location.pathname}>
          <div className="p-4 m-2 animate-fade-in max-w-full mx-auto page-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

