import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { backupId } = await request.json();
    
    const backup = await prisma.characterBackup.findFirst({
      where: {
        id: backupId,
      },
    });
    
    if (!backup) {
      return NextResponse.json(
        { success: false, error: 'Backup not found' },
        { status: 404 }
      );
    }
    
    const characterData = JSON.parse(backup.backupData);
    
    return NextResponse.json({ 
      success: true, 
      characterData,
      backupInfo: {
        name: backup.backupName,
        createdAt: backup.createdAt,
      }
    });
  } catch (error) {
    console.error('Restore backup error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to restore backup' },
      { status: 500 }
    );
  }
}