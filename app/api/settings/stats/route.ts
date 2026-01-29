import { NextResponse } from 'next/server';
import { getDatabase, getUserProfile } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user_chris';

    const db = getDatabase();
    
    // Get user profile using helper function
    const profileData = await getUserProfile(userId);
    
    // Get user info
    const userResult = await db.prepare(
      'SELECT * FROM users WHERE id = ?'
    ).bind(userId).first<any>();
    
    // Get session statistics
    const sessions = await db.prepare(
      'SELECT * FROM writing_sessions WHERE user_id = ?'
    ).bind(userId).all();
    
    const totalSessions = sessions.results.length;
    const sessionsWithFeedback = sessions.results.filter((s: any) => s.final_output !== null).length;
    
    // Get learning patterns statistics (will be 0 for now since we haven't implemented pattern extraction)
    const patterns = await db.prepare(
      'SELECT * FROM learning_patterns WHERE user_id = ?'
    ).bind(userId).all();
    
    const totalPatterns = patterns.results.length;
    const avgConfidence = patterns.results.length > 0 
      ? patterns.results.reduce((sum: number, p: any) => sum + (p.confidence_score || 0), 0) / patterns.results.length
      : 0;
    
    // Get pattern breakdown by category
    const patternsByCategory: { [key: string]: number } = {};
    patterns.results.forEach((p: any) => {
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
