import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { characterType, backupName, characterData } = await request.json();
    
    // Create backup
    const backup = await prisma.characterBackup.create({
      data: {
        characterType,
        backupName: backupName || `备份 - ${new Date().toLocaleString('zh-CN')}`,
        backupData: JSON.stringify(characterData),
      },
    });
    
    // Keep only the most recent 10 backups per character
    const allBackups = await prisma.characterBackup.findMany({
      where: {
        characterType,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    if (allBackups.length > 10) {
      const toDelete = allBackups.slice(10);
      await prisma.characterBackup.deleteMany({
        where: {
          id: {
            in: toDelete.map(b => b.id),
          },
        },
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      backup: {
        id: backup.id,
        backupName: backup.backupName,
        createdAt: backup.createdAt,
      }
    });
  } catch (error) {
    console.error('Backup creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}