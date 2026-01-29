'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSession?: (sessionId: string) => void;
}

export default function Sidebar({ isOpen, onClose, onLoadSession }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [sessions, setSessions] = useState<any>({
    today: [],
    yesterday: [],
    lastWeek: [],
    lastMonth: [],
    older: [],
  });

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/sessions/list?userId=user_chris');
        const data = await response.json();
        if (data.grouped) {
          setSessions(data.grouped);
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleSessionClick = (sessionId: string) => {
    if (onLoadSession) {
      onLoadSession(sessionId);
    }
  };

  const renderSessionGroup = (title: string, groupSessions: any[]) => {
    if (groupSessions.length === 0) return null;

    return (
      <div key={title} className="mb-4">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mb-2">
          {title}
        </h3>
        <div className="space-y-1">
          {groupSessions.map((session: any) => (
            <button
              key={session.id}
              onClick={() => handleSessionClick(session.id)}
              className="w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors text-left"
            >
              <div className="font-medium text-slate-900 dark:text-slate-50 truncate">
                {session.original_input.substring(0, 50)}...
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {session.mode} • {session.content_type}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="relative z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <Link href="/" onClick={onClose}>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              mytone
            </h2>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Session History */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mb-3">
              Session History
            </h2>
            {renderSessionGroup('Today', sessions.today)}
            {renderSessionGroup('Yesterday', sessions.yesterday)}
            {renderSessionGroup('Last 7 Days', sessions.lastWeek)}
            {renderSessionGroup('Last 30 Days', sessions.lastMonth)}
            {renderSessionGroup('Older', sessions.older)}
            {sessions.today.length === 0 &&
              sessions.yesterday.length === 0 &&
              sessions.lastWeek.length === 0 &&
              sessions.lastMonth.length === 0 &&
              sessions.older.length === 0 && (
                <div className="px-3 text-sm text-slate-500 dark:text-slate-400">
                  No sessions yet. Start writing to see your history!
                </div>
              )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
          <Link
            href="/settings"
            onClick={onClose}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === '/settings'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
          <Link
            href="/about"
            onClick={onClose}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === '/about'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About
          </Link>
          
          {/* User Profile */}
          <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                C
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                  Chris O'Connell
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
