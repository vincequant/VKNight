import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { ensureCharacterBackupTable } from '@/lib/ensureDatabase';

export async function DELETE(request: NextRequest) {
  try {
    // 确保表存在
    await ensureCharacterBackupTable();
    
    const { searchParams } = new URL(request.url);
    const saveId = searchParams.get('id');
    
    if (!saveId) {
      return NextResponse.json(
        { success: false, error: '缺少存档ID' },
        { status: 400 }
      );
    }
    
    await prisma.characterBackup.delete({
      where: { id: saveId },
    });
    
    return NextResponse.json({
      success: true,
      message: '存档已删除',
    });
  } catch (error) {
    console.error('Delete save error:', error);
    return NextResponse.json(
      { success: false, error: '删除存档失败' },
      { status: 500 }
    );
  }
}