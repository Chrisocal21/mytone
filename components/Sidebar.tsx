'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Session {
  id: string;
  mode: string;
  content_type: string;
  original_input: string;
  ai_output: string;
  final_output: string | null;
  created_at: string;
  updated_at: string;
}

interface GroupedSessions {
  today: Session[];
  yesterday: Session[];
  lastWeek: Session[];
  lastMonth: Session[];
  older: Session[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [sessions, setSessions] = useState<GroupedSessions | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions/list?userId=user_chris');
      if (response.ok) {
        const data = await response.json();
        setSessions(data.grouped);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPreviewText = (session: Session) => {
    const text = session.original_input || session.ai_output;
    return text.length > 50 ? text.substring(0, 50) + '...' : text;
  };

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case 'email':
        return '✉️';
      case 'text':
        return '💬';
      case 'note':
        return '📝';
      default:
        return '📄';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const renderSessionGroup = (title: string, sessions: Session[]) => {
    if (!sessions || sessions.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-3">
          {title}
        </h3>
        <div className="space-y-1">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={onClose}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
            >
              <div className="flex items-start gap-2">
                <span className="text-lg mt-0.5">{getContentIcon(session.content_type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-700 dark:text-slate-300 truncate">
                    {getPreviewText(session)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {formatTime(session.created_at)} · {session.mode}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className="relative">
        {/* Hamburger Button - Always visible, slides with sidebar */}
        <button
          onClick={onClose}
          className={`fixed top-4 z-50 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 ease-in-out ${
            isOpen ? 'left-[272px]' : 'left-4'
          }`}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-50 transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } w-64 flex flex-col`}
        >
          {/* Header */}
          <div className="h-16 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4">
            <Link href="/" className="text-xl font-bold text-slate-900 dark:text-slate-50">
              mytone
            </Link>
          </div>

          {/* New Chat Button */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <Link
              href="/"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Session
            </Link>
          </div>

          {/* Session History */}
          <div className="flex-1 overflow-y-auto py-4">
            {loading ? (
              <div className="px-3 text-sm text-slate-500 dark:text-slate-400">
                Loading sessions...
              </div>
            ) : sessions ? (
              <>
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
              </>
            ) : (
              <div className="px-3 text-sm text-slate-500 dark:text-slate-400">
                Failed to load sessions
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-3 space-y-1">
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
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    Sign out
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
