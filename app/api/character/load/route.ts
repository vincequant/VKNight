import { NextRequest, NextResponse } from 'next/server';
import { loadCharacterFromCloud } from '@/lib/cloudStorage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const characterType = searchParams.get('type');
    
    if (!characterType) {
      return NextResponse.json(
        { success: false, error: 'Character type required' },
        { status: 400 }
      );
    }
    
    // 直接从云端加载角色，不需要设备ID
    const character = await loadCharacterFromCloud(characterType);
    
    return NextResponse.json({
      success: true,
      character: character ? {
        ...character,
        eth: character.eth.toString(),
        weapon: character.weapon ? {
          ...character.weapon,
          price: character.weapon.price.toString(),
        } : undefined,
        armor: character.armor ? {
          ...character.armor,
          price: character.armor.price.toString(),
        } : undefined,
        shield: character.shield ? {
          ...character.shield,
          price: character.shield.price.toString(),
        } : undefined,
      } : null,
    });
  } catch (error) {
    console.error('API error loading character:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load character' },
      { status: 500 }
    );
  }
}