'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name?: string;
  email?: string;
  communication_style?: string;
  formality_level?: string;
  role_context?: string;
  signature_style?: string;
  preferred_phrases?: string;
  avoided_phrases?: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    communication_style: '',
    formality_level: 'balanced',
    role_context: '',
    signature_style: '',
    preferred_phrases: '',
    avoided_phrases: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/settings/stats?userId=user_chris');
      if (response.ok) {
        const data = await response.json();
        if (data.userProfile) {
          setProfile(prev => ({
            ...prev,
            name: data.userProfile.name || '',
            email: data.userProfile.email || '',
            communication_style: data.userProfile.communicationStyle || '',
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user_chris',
          communicationStyle: profile.communication_style,
          formalityLevel: profile.formality_level,
          roleContext: profile.role_context,
          signatureStyle: profile.signature_style,
          preferredPhrases: profile.preferred_phrases,
          avoidedPhrases: profile.avoided_phrases,
        }),
      });

      if (response.ok) {
        router.push('/settings');
      } else {
        alert('Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/settings"
            className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            ← Back to Settings
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Edit Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Update your communication preferences to help mytone learn your style
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="space-y-6">
            {/* Communication Style */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Communication Style
              </label>
              <input
                type="text"
                value={profile.communication_style || ''}
                onChange={(e) => handleChange('communication_style', e.target.value)}
                placeholder="e.g., Direct, Friendly, Professional"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Describe how you typically communicate in writing
              </p>
            </div>

            {/* Formality Level */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Formality Level
              </label>
              <select
                value={profile.formality_level || 'balanced'}
                onChange={(e) => handleChange('formality_level', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="very_formal">Very Formal</option>
                <option value="formal">Formal</option>
                <option value="balanced">Balanced</option>
                <option value="casual">Casual</option>
                <option value="very_casual">Very Casual</option>
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your preferred level of formality in communication
              </p>
            </div>

            {/* Role Context */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Role Context
              </label>
              <input
                type="text"
                value={profile.role_context || ''}
                onChange={(e) => handleChange('role_context', e.target.value)}
                placeholder="e.g., Engineering Manager, Sales Representative"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your professional role or context for communication
              </p>
            </div>

            {/* Signature Style */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Signature Style
              </label>
              <input
                type="text"
                value={profile.signature_style || ''}
                onChange={(e) => handleChange('signature_style', e.target.value)}
                placeholder="e.g., Best regards, Cheers, Thanks"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your preferred closing signature
              </p>
            </div>

            {/* Preferred Phrases */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Preferred Phrases
              </label>
              <textarea
                value={profile.preferred_phrases || ''}
                onChange={(e) => handleChange('preferred_phrases', e.target.value)}
                placeholder="Enter phrases or expressions you like to use, separated by commas"
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Phrases you want to include in your writing (comma-separated)
              </p>
            </div>

            {/* Avoided Phrases */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Avoided Phrases
              </label>
              <textarea
                value={profile.avoided_phrases || ''}
                onChange={(e) => handleChange('avoided_phrases', e.target.value)}
                placeholder="Enter phrases or expressions you want to avoid, separated by commas"
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Phrases you want to exclude from your writing (comma-separated)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3">
            <Link
              href="/settings"
              className="flex-1 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-center font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
