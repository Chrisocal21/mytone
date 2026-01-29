import { NextResponse } from 'next/server';
import { getDatabase, getUserProfile } from '@/lib/database';

interface UserResult {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface ProfileResult {
  id: string;
  user_id: string;
  name?: string;
  communication_style: string;
  formality_level: string;
  explanation_preference: string;
  role_context: string;
  signature_style: string;
  preferred_phrases: string;
  avoided_phrases: string;
  created_at: string;
  updated_at: string;
}

interface SessionResult {
  id: string;
  user_id: string;
  mode: string;
  content_type: string;
  original_input: string;
  ai_output: string;
  final_output: string | null;
  processing_time: number;
  created_at: string;
  updated_at: string;
}

interface PatternResult {
  id: string;
  user_id: string;
  pattern_category: string;
  pattern_key: string;
  pattern_value: string;
  confidence_score: number;
  occurrence_count: number;
  mode_context: string;
  content_type_context: string;
  created_at: string;
  last_observed_at: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user_chris';

    const db = getDatabase();
    
    // Get user profile using helper function
    const profileData = await getUserProfile(userId) as ProfileResult | null;
    
    // Get user info
    const userResult = await db.prepare(
      'SELECT * FROM users WHERE id = ?'
    ).bind(userId).first<UserResult>();
    
    // Get session statistics
    const sessions = await db.prepare(
      'SELECT * FROM writing_sessions WHERE user_id = ?'
    ).bind(userId).all();
    
    const sessionResults = sessions.results as SessionResult[];
    const totalSessions = sessionResults.length;
    const sessionsWithFeedback = sessionResults.filter((s) => s.final_output !== null).length;
    
    // Get learning patterns statistics
    const patterns = await db.prepare(
      'SELECT * FROM learning_patterns WHERE user_id = ?'
    ).bind(userId).all();
    
    const patternResults = patterns.results as PatternResult[];
    const totalPatterns = patternResults.length;
    const avgConfidence = patternResults.length > 0 
      ? patternResults.reduce((sum, p) => sum + (p.confidence_score || 0), 0) / patternResults.length
      : 0;
    
    // Get pattern breakdown by category
    const patternsByCategory: { [key: string]: number } = {};
    patternResults.forEach((p) => {
      const category = p.pattern_category || 'unknown';
      patternsByCategory[category] = (patternsByCategory[category] || 0) + 1;
    });
    
    const patternBreakdown = Object.entries(patternsByCategory).map(([category, count]) => ({
      pattern_category: category,
      count,
    }));
    
    // System status checks
    const systemStatus = {
      openai: !!process.env.OPENAI_API_KEY,
      database: true, // If we got here, DB is working
      userProfile: !!profileData,
    };
    
    // Calculate learning progress (0-100%)
    let learningProgress = 0;
    if (totalSessions > 0) {
      const sessionProgress = Math.min((sessionsWithFeedback / 50) * 40, 40); // 40% max from sessions
      const patternProgress = Math.min((totalPatterns / 100) * 60, 60); // 60% max from patterns
      learningProgress = Math.round(sessionProgress + patternProgress);
    }
    
    const stats = {
      systemStatus,
      userProfile: {
        name: userResult?.name || profileData?.name || 'Not set',
        email: userResult?.email || 'Not set',
        communicationStyle: profileData?.communication_style || 'Not set',
      },
      learningProgress: {
        percentage: learningProgress,
        totalSessions,
        sessionsWithFeedback,
        totalPatterns,
        averageConfidence: Math.round(avgConfidence * 100),
        patternsByCategory: patternBreakdown,
      },
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching settings stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings statistics' },
      { status: 500 }
    );
  }
}
