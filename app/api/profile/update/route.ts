import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function PUT(request: Request) {
  try {
    const { userId, profile } = await request.json();

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile data is required' },
        { status: 400 }
      );
    }

    const actualUserId = userId || 'user_chris';
    const db = getDatabase();

    // Check if profile exists
    const existing = await db.prepare(
      'SELECT id FROM user_profiles WHERE user_id = ?'
    ).bind(actualUserId).first<any>();

    if (existing) {
      // Update existing profile
      await db.prepare(`
        UPDATE user_profiles 
        SET communication_style = ?,
            formality_level = ?,
            role_context = ?,
            signature_style = ?,
            preferred_phrases = ?,
            avoided_phrases = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).bind(
        profile.communicationStyle || '',
        profile.formalityLevel || '',
        profile.roleContext || '',
        profile.signatureStyle || '',
        profile.preferredPhrases || '',
        profile.avoidedPhrases || '',
        actualUserId
      ).run();
    } else {
      // Create new profile
      const profileId = `profile_${Date.now()}`;
      await db.prepare(`
        INSERT INTO user_profiles (
          id, user_id, communication_style, formality_level,
          role_context, signature_style, preferred_phrases,
          avoided_phrases, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        profileId,
        actualUserId,
        profile.communicationStyle || '',
        profile.formalityLevel || '',
        profile.roleContext || '',
        profile.signatureStyle || '',
        profile.preferredPhrases || '',
        profile.avoidedPhrases || ''
      ).run();
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
