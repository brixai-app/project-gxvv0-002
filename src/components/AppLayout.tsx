import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopNavBar from './TopNavBar';
import SideBarNav from './SideBarNav';
import { cn } from '@/lib/utils';

export interface AppLayoutProps {
  initialSidebarOpen?: boolean;
}

export function AppLayout({ initialSidebarOpen = true }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(initialSidebarOpen);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="flex h-screen w-full flex-col bg-[#FFFFFF] text-[#0B1220]">
      <TopNavBar onToggleSidebar={handleToggleSidebar} />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="hidden border-r border-[#B0B8C1] bg-[#F6F8FB] md:block">
          <SideBarNav isOpen={true} onClose={handleCloseSidebar} />
        </div>
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-40 w-64 bg-[#F6F8FB] shadow-lg md:hidden"
            >
              <SideBarNav isOpen={sidebarOpen} onClose={handleCloseSidebar} />
            </motion.aside>
          )}
        </AnimatePresence>
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            onClick={handleCloseSidebar}
          />
        )}
        <main
          className={cn(
            'relative flex-1 overflow-y-auto bg-[#FFFFFF] px-4 pb-6 pt-20',
            'sm:px-6 lg:px-10'
          )}
        >
          <motion.div
            key={location?.pathname ?? 'app-content'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mx-auto flex w-full max-w-6xl flex-col gap-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;