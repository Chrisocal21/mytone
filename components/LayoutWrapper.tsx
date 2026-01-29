'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Don't show sidebar on login/auth pages
  const showSidebar = !pathname?.startsWith('/login') && !pathname?.startsWith('/signup');

  return (
    <>
      {showSidebar && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(!sidebarOpen)} />
      )}
      <div className={showSidebar ? 'lg:pl-0' : ''}>
        <Header />
        {children}
      </div>
    </>
  );
}
