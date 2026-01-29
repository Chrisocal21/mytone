'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SystemStatus {
  openai: boolean;
  database: boolean;
  userProfile: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  communicationStyle: string;
}

interface PatternCategory {
  pattern_category: string;
  count: number;
}

interface LearningProgress {
  percentage: number;
  totalSessions: number;
  sessionsWithFeedback: number;
  totalPatterns: number;
  averageConfidence: number;
  patternsByCategory: PatternCategory[];
}

interface SettingsStats {
  systemStatus: SystemStatus;
  userProfile: UserProfile;
  learningProgress: LearningProgress;
}

export default function SettingsPage() {
  const [stats, setStats] = useState<SettingsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoCopy, setAutoCopy] = useState(false);
  const [defaultMode, setDefaultMode] = useState<'professional' | 'casual'>('professional');
  const [defaultContentType, setDefaultContentType] = useState<'email' | 'text' | 'note'>('email');

  useEffect(() => {
    fetchStats();
    // Load preferences from localStorage
    const savedAutoCopy = localStorage.getItem('autoCopy') === 'true';
    const savedMode = localStorage.getItem('defaultMode') as 'professional' | 'casual' || 'professional';
    const savedContentType = localStorage.getItem('defaultContentType') as 'email' | 'text' | 'note' || 'email';
    
    setAutoCopy(savedAutoCopy);
    setDefaultMode(savedMode);
    setDefaultContentType(savedContentType);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/settings/stats?userId=user_chris');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoCopyToggle = () => {
    const newValue = !autoCopy;
    setAutoCopy(newValue);
    localStorage.setItem('autoCopy', String(newValue));
  };

  const handleDefaultModeChange = (mode: 'professional' | 'casual') => {
    setDefaultMode(mode);
    localStorage.setItem('defaultMode', mode);
  };

  const handleDefaultContentTypeChange = (type: 'email' | 'text' | 'note') => {
    setDefaultContentType(type);
    localStorage.setItem('defaultContentType', type);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            ← Back to Writing
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your mytone configuration and view learning progress
          </p>
        </div>

        <div className="grid gap-6">
          {/* System Status */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              System Status
            </h2>
            <div className="space-y-3">
              <StatusItem 
                label="OpenAI API" 
                status={stats?.systemStatus.openai || false}
                description="AI text processing"
              />
              <StatusItem 
                label="Database" 
                status={stats?.systemStatus.database || false}
                description="Session storage & learning"
              />
              <StatusItem 
                label="User Profile" 
                status={stats?.systemStatus.userProfile || false}
                description="Communication preferences loaded"
              />
            </div>
          </div>

          {/* Learning Progress */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Learning Progress
            </h2>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Overall Learning Progress
                </span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {stats?.learningProgress.percentage || 0}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats?.learningProgress.percentage || 0}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard 
                label="Total Sessions"
                value={stats?.learningProgress.totalSessions || 0}
              />
              <StatCard 
                label="With Feedback"
                value={stats?.learningProgress.sessionsWithFeedback || 0}
              />
              <StatCard 
                label="Patterns Learned"
                value={stats?.learningProgress.totalPatterns || 0}
              />
              <StatCard 
                label="Avg Confidence"
                value={`${stats?.learningProgress.averageConfidence || 0}%`}
              />
            </div>

            {/* Pattern Categories */}
            {stats?.learningProgress.patternsByCategory && stats.learningProgress.patternsByCategory.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Pattern Breakdown
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {stats.learningProgress.patternsByCategory.map((category) => (
                    <div 
                      key={category.pattern_category}
                      className="flex justify-between items-center px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg"
                    >
                      <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                        {category.pattern_category.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-50">
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats?.learningProgress.totalSessions === 0 && (
              <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                No writing sessions yet. Start writing to begin learning your style!
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              User Profile
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Name</span>
                <span className="font-medium text-slate-900 dark:text-slate-50">
                  {stats?.userProfile.name}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Email</span>
                <span className="font-medium text-slate-900 dark:text-slate-50">
                  {stats?.userProfile.email}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600 dark:text-slate-400">Communication Style</span>
                <span className="font-medium text-slate-900 dark:text-slate-50">
                  {stats?.userProfile.communicationStyle}
                </span>
              </div>
            </div>
          </div>

          {/* Writing Preferences */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Writing Preferences
            </h2>
            
            <div className="space-y-6">
              {/* Default Mode */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Default Mode
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDefaultModeChange('professional')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      defaultMode === 'professional'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Professional
                  </button>
                  <button
                    onClick={() => handleDefaultModeChange('casual')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      defaultMode === 'casual'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Casual
                  </button>
                </div>
              </div>

              {/* Default Content Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Default Content Type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDefaultContentTypeChange('email')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      defaultContentType === 'email'
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Email
                  </button>
                  <button
                    onClick={() => handleDefaultContentTypeChange('text')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      defaultContentType === 'text'
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Text
                  </button>
                  <button
                    onClick={() => handleDefaultContentTypeChange('note')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      defaultContentType === 'note'
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Note
                  </button>
                </div>
              </div>

              {/* Auto-Copy Toggle */}
              <div className="flex items-center justify-between py-3 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Auto-copy to clipboard
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Automatically copy output when generated
                  </div>
                </div>
                <button
                  onClick={handleAutoCopyToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoCopy ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoCopy ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Data Management
            </h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 text-left bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                <div className="font-medium text-slate-900 dark:text-slate-50">
                  View Session History
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Browse all your past writing sessions
                </div>
              </button>
              <button className="w-full px-4 py-3 text-left bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                <div className="font-medium text-slate-900 dark:text-slate-50">
                  Export Learning Data
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Download your patterns and preferences
                </div>
              </button>
              <button className="w-full px-4 py-3 text-left bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                <div className="font-medium text-red-600 dark:text-red-400">
                  Reset Learning Patterns
                </div>
                <div className="text-sm text-red-500 dark:text-red-400">
                  Clear all learned patterns and start fresh
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusItem({ label, status, description }: { label: string; status: boolean; description: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="font-medium text-slate-900 dark:text-slate-50">{label}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{description}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className={`text-sm font-medium ${status ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {status ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
      <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">
        {value}
      </div>
      <div className="text-xs text-slate-600 dark:text-slate-400">
        {label}
      </div>
    </div>
  );
}
