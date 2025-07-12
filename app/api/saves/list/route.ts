import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import { ensureCharacterBackupTable } from '@/lib/ensureDatabaseCompat';

export async function GET(request: NextRequest) {
  try {
    // 获取 Prisma 客户端实例
    const prisma = getPrismaClient();
    
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
      
      console.log('存档ID:', save.id, '类型:', typeof save.id);
      return {
        id: save.id,
        name: save.backupName,
        character: characterData,
        createdAt: save.createdAt.toISOString(),
      };
    });
    
    return NextResponse.json({
      success: true,
      saves: formattedSaves,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('List saves error:', error);
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    
    return NextResponse.json(
      { 
        success: false, 
        error: '获取存档列表失败',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}