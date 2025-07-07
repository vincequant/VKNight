import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { getOrCreateUser } from '@/lib/cloudStorage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const characterType = searchParams.get('type');
    
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      );
    }
    
    const backups = await prisma.characterBackup.findMany({
      where: {
        userId: user.id,
        ...(characterType ? { characterType } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        characterType: true,
        backupName: true,
        createdAt: true,
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      backups 
    });
  } catch (error) {
    console.error('List backups error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list backups' },
      { status: 500 }
    );
  }
}