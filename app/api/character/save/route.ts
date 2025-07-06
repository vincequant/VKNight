import { NextRequest, NextResponse } from 'next/server';
import { saveCharacterToCloud } from '@/lib/cloudStorage';
import { Character } from '@/types/game';

export async function POST(request: NextRequest) {
  try {
    const character: Character = await request.json();
    await saveCharacterToCloud(character);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error saving character:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save character' },
      { status: 500 }
    );
  }
}