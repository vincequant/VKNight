import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting database migration...');
    
    // 1. 获取所有现有的角色数据（按更新时间排序，每个类型只取最新的）
    const allCharacters = await prisma.$queryRaw`
      SELECT c.* 
      FROM Character c
      INNER JOIN (
        SELECT type, MAX(updatedAt) as maxUpdatedAt
        FROM Character
        GROUP BY type
      ) latest ON c.type = latest.type AND c.updatedAt = latest.maxUpdatedAt
    `;
    
    console.log(`Found ${allCharacters.length} characters to migrate`);
    
    // 2. 为每个角色类型创建或更新记录
    const results = [];
    
    for (const char of allCharacters) {
      try {
        // 删除旧的同类型角色
        await prisma.character.deleteMany({
          where: {
            type: char.type,
            id: { not: char.id }
          }
        });
        
        results.push({
          type: char.type,
          success: true,
          level: char.level,
          eth: (BigInt(char.eth) / BigInt(10) ** BigInt(18)).toString() + ' ETH'
        });
      } catch (error) {
        results.push({
          type: char.type,
          success: false,
          error: error.message
        });
      }
    }
    
    // 3. 清理孤立的数据
    try {
      // 删除所有Purchase记录（不再需要）
      await prisma.$executeRaw`DELETE FROM Purchase WHERE 1=1`;
      
      // 删除所有Achievement记录（不再需要）
      await prisma.$executeRaw`DELETE FROM Achievement WHERE 1=1`;
      
      // 删除所有User记录（不再需要）
      await prisma.$executeRaw`DELETE FROM User WHERE 1=1`;
    } catch (error) {
      console.log('Error cleaning up old tables:', error);
    }
    
    return NextResponse.json({
      success: true,
      message: '数据库迁移完成',
      results: results
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}