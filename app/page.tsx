'use client';

import { useState, useEffect } from 'react';
import WritingInterface from "@/components/WritingInterface";

export default function Home() {
  const [loadSessionId, setLoadSessionId] = useState<string | null>(null);

  useEffect(() => {
    const handleLoadSession = (event: any) => {
      setLoadSessionId(event.detail.sessionId);
    };

    window.addEventListener('loadSession', handleLoadSession);
    return () => window.removeEventListener('loadSession', handleLoadSession);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Write with mytone
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Your personal writing assistant that learns your unique style
          </p>
        </header>

        <WritingInterface 
          loadSessionId={loadSessionId}
          onSessionLoaded={() => setLoadSessionId(null)}
        />
      </div>
    </div>
  );
}
