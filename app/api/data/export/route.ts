import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user_chris';

    const db = getDatabase();

    // Fetch all user data
    const [sessions, patterns, profile] = await Promise.all([
      db.prepare('SELECT * FROM writing_sessions WHERE user_id = ?').bind(userId).all(),
      db.prepare('SELECT * FROM learning_patterns WHERE user_id = ? ORDER BY confidence_score DESC').bind(userId).all(),
      db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').bind(userId).first(),
    ]);

    // Build export data
    const exportData = {
      exportDate: new Date().toISOString(),
      userId,
      profile: profile || null,
      statistics: {
        totalSessions: sessions.results.length,
        sessionsWithFeedback: sessions.results.filter((s: any) => s.final_output).length,
        totalPatterns: patterns.results.length,
        averageConfidence: patterns.results.length > 0
          ? patterns.results.reduce((sum: number, p: any) => sum + p.confidence_score, 0) / patterns.results.length
          : 0,
      },
      learningPatterns: patterns.results.map((p: any) => ({
        category: p.pattern_category,
        key: p.pattern_key,
        value: p.pattern_value,
        confidence: Math.round(p.confidence_score * 100),
        occurrences: p.occurrence_count,
        lastObserved: p.last_observed_at,
        context: `${p.mode_context}/${p.content_type_context}`,
      })),
      sessions: sessions.results.map((s: any) => ({
        id: s.id,
        mode: s.mode,
        contentType: s.content_type,
        originalInput: s.original_input,
        aiOutput: s.ai_output,
        finalOutput: s.final_output,
        processingTime: s.processing_time,
        createdAt: s.created_at,
      })),
    };

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="mytone-export-${userId}-${Date.now()}.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
