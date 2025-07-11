import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { ensureCharacterBackupTable } from '@/lib/ensureDatabaseCompat';

export async function POST(request: NextRequest) {
  try {
    // 确保表存在
    await ensureCharacterBackupTable();
    
    const { name, character } = await request.json();
    
    if (!name || !character) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }
    
    // 创建存档
    const save = await prisma.characterBackup.create({
      data: {
        characterType: character.type,
        backupName: name,
        backupData: JSON.stringify(character, (key, value) => {
          if (typeof value === 'bigint') {
            return value.toString();
          }
          return value;
        }),
      },
    });
    
    // 限制每个角色最多保留20个存档
    const allSaves = await prisma.characterBackup.findMany({
      where: { characterType: character.type },
      orderBy: { createdAt: 'desc' },
    });
    
    if (allSaves.length > 20) {
      const toDelete = allSaves.slice(20);
      await prisma.characterBackup.deleteMany({
        where: {
          id: { in: toDelete.map(s => s.id) },
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      save: {
        id: save.id,
        name: save.backupName,
        createdAt: save.createdAt,
      },
    });
  } catch (error) {
    console.error('Save creation error:', error);
    return NextResponse.json(
      { success: false, error: '创建存档失败' },
      { status: 500 }
    );
  }
}