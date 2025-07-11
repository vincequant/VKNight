import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { ensureCharacterBackupTable } from '@/lib/ensureDatabaseCompat';

export async function GET(request: NextRequest) {
  try {
    // 确保表存在
    await ensureCharacterBackupTable();
    
    const { searchParams } = new URL(request.url);
    const characterType = searchParams.get('type');
    
    const where = characterType ? { characterType } : {};
    
    const saves = await prisma.characterBackup.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20, // 最多返回20个存档
    });
    
    // 格式化存档数据
    const formattedSaves = saves.map(save => {
      let characterData = { type: save.characterType, level: 1, eth: '0' };
      try {
        const parsed = JSON.parse(save.backupData);
        characterData = {
          type: parsed.type || save.characterType,
          level: parsed.level || 1,
          eth: parsed.eth || '0',
        };
      } catch (e) {
        console.error('Error parsing save data:', e);
      }
      
      return {
        id: save.id,
        name: save.backupName,
        character: characterData,
        createdAt: save.createdAt,
      };
    });
    
    return NextResponse.json({
      success: true,
      saves: formattedSaves,
    });
  } catch (error) {
    console.error('List saves error:', error);
    return NextResponse.json(
      { success: false, error: '获取存档列表失败' },
      { status: 500 }
    );
  }
}