import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { ensureCharacterBackupTable } from '@/lib/ensureDatabaseCompat';

export async function GET(request: NextRequest) {
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
    
    const save = await prisma.characterBackup.findUnique({
      where: { id: saveId },
    });
    
    if (!save) {
      return NextResponse.json(
        { success: false, error: '存档不存在' },
        { status: 404 }
      );
    }
    
    // 解析存档数据
    const character = JSON.parse(save.backupData);
    
    // 确保必要的字段都存在
    const formattedCharacter = {
      ...character,
      // 确保字符串格式的BigInt值
      eth: character.eth?.toString() || '0',
      weapon: character.weapon ? {
        ...character.weapon,
        price: character.weapon.price?.toString() || '0',
      } : undefined,
      armor: character.armor ? {
        ...character.armor,
        price: character.armor.price?.toString() || '0',
      } : undefined,
      shield: character.shield ? {
        ...character.shield,
        price: character.shield.price?.toString() || '0',
      } : undefined,
    };
    
    return NextResponse.json({
      success: true,
      character: formattedCharacter,
      saveName: save.backupName,
      savedAt: save.createdAt,
    });
  } catch (error) {
    console.error('Load save error:', error);
    return NextResponse.json(
      { success: false, error: '读取存档失败' },
      { status: 500 }
    );
  }
}