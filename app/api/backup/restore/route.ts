import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { getOrCreateUser } from '@/lib/cloudStorage';

export async function POST(request: NextRequest) {
  try {
    const { backupId } = await request.json();
    
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      );
    }
    
    const backup = await prisma.characterBackup.findFirst({
      where: {
        id: backupId,
        userId: user.id,
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