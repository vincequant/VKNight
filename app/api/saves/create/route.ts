import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import { ensureCharacterBackupTable } from '@/lib/ensureDatabaseCompat';

export async function POST(request: NextRequest) {
  try {
    console.log('开始创建存档...');
    
    // 获取 Prisma 客户端实例
    const prisma = getPrismaClient();
    
    // 确保表存在
    await ensureCharacterBackupTable();
    console.log('表检查完成');
    
    const body = await request.json();
    console.log('接收到的请求数据:', JSON.stringify(body, null, 2));
    
    const { name, character } = body;
    
    if (!name || !character) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }
    
    console.log('准备创建存档，角色类型:', character.type);
    console.log('Prisma可用的模型:', Object.keys(prisma));
    
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
    
    console.log('存档创建成功:', save.id);
    
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
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // 返回更详细的错误信息
    return NextResponse.json(
      { 
        success: false, 
        error: '创建存档失败',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}