'use client';

import { useState, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

interface SessionLoadContextType {
  loadSession: (sessionId: string) => void;
}

const SessionLoadContext = createContext<SessionLoadContextType | null>(null);

export const useSessionLoad = () => {
  const context = useContext(SessionLoadContext);
  if (!context) throw new Error('useSessionLoad must be used within LayoutWrapper');
  return context;
};

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Don't show sidebar on login/auth pages
  const showSidebar = !pathname?.startsWith('/login') && !pathname?.startsWith('/signup');

  const loadSession = (sessionId: string) => {
    // This will be handled by the page component
    window.dispatchEvent(new CustomEvent('loadSession', { detail: { sessionId } }));
    setSidebarOpen(false);
  };

  return (
    <SessionLoadContext.Provider value={{ loadSession }}>
      {showSidebar && (
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          onLoadSession={loadSession}
        />
      )}
      <div className={showSidebar ? 'lg:pl-0' : ''}>
        <Header onMenuClick={() => setSidebarOpen(true)} showMenu={showSidebar} />
        {children}
      </div>
    </SessionLoadContext.Provider>
  );
}
