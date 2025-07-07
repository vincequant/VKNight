import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { getOrCreateUser } from '@/lib/cloudStorage';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const backupId = searchParams.get('id');
    
    if (!backupId) {
      return NextResponse.json(
        { success: false, error: 'Backup ID required' },
        { status: 400 }
      );
    }
    
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      );
    }
    
    const result = await prisma.characterBackup.deleteMany({
      where: {
        id: backupId,
        userId: user.id,
      },
    });
    
    if (result.count === 0) {
      return NextResponse.json(
        { success: false, error: 'Backup not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Backup deleted successfully'
    });
  } catch (error) {
    console.error('Delete backup error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete backup' },
      { status: 500 }
    );
  }
}