import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useLayout } from '../../context/LayoutContext';

const Layout: React.FC = () => {
  const { navigationStyle } = useLayout();

  // Determine which nav to show based on user preference
  const showSidebar = navigationStyle === 'sidebar';
  const showBottomNav = navigationStyle === 'bottom-nav';

  return (
    <div className="min-h-screen bg-brand-bg flex">
      {/* Sidebar — only when user has chosen sidebar mode */}
      {showSidebar && (
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-grow min-w-0 transition-all duration-300 ${showBottomNav ? 'pb-24' : 'pb-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav — only when user has chosen bottom-nav mode */}
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default Layout;
