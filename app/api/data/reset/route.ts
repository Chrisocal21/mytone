import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { userId, confirmText } = await request.json();

    // Require confirmation
    if (confirmText !== 'RESET') {
      return NextResponse.json(
        { error: 'Confirmation text must be "RESET"' },
        { status: 400 }
      );
    }

    const actualUserId = userId || 'user_chris';
    const db = getDatabase();

    // Delete all learning patterns for this user
    await db.prepare(
      'DELETE FROM learning_patterns WHERE user_id = ?'
    ).bind(actualUserId).run();

    // Optional: Also reset final outputs in sessions
    await db.prepare(
      'UPDATE writing_sessions SET final_output = NULL WHERE user_id = ?'
    ).bind(actualUserId).run();

    return NextResponse.json({
      success: true,
      message: 'All learning patterns have been reset',
    });
  } catch (error) {
    console.error('Error resetting patterns:', error);
    return NextResponse.json(
      { error: 'Failed to reset patterns' },
      { status: 500 }
    );
  }
}
