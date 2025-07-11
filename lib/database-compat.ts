// 数据库兼容性层 - 处理新旧schema的兼容
import { prisma } from './database';
import { Character } from '@/types/game';

export async function findCharacterCompat(type: string): Promise<any | null> {
  try {
    // 首先尝试新的查询方式（type是唯一的）
    const character = await prisma.character.findUnique({
      where: { type },
      include: {
        weapon: true,
        armor: true,
        shield: true,
      },
    });
    
    if (character) {
      return character;
    }
  } catch (error) {
    console.log('New schema query failed, trying old schema...');
  }
  
  try {
    // 如果失败，尝试旧的查询方式（查找最新的记录）
    const character = await prisma.character.findFirst({
      where: { type },
      orderBy: { updatedAt: 'desc' },
      include: {
        weapon: true,
        armor: true,
        shield: true,
      },
    });
    
    return character;
  } catch (error) {
    console.error('Both queries failed:', error);
    return null;
  }
}

export async function upsertCharacterCompat(data: any): Promise<any> {
  try {
    // 首先尝试新的upsert方式
    return await prisma.character.upsert({
      where: { type: data.type },
      update: data,
      create: data,
    });
  } catch (error) {
    console.log('New schema upsert failed, trying old schema...');
  }
  
  try {
    // 如果失败，先查找现有记录
    const existing = await prisma.character.findFirst({
      where: { type: data.type },
      orderBy: { updatedAt: 'desc' },
    });
    
    if (existing) {
      // 更新现有记录
      return await prisma.character.update({
        where: { id: existing.id },
        data: data,
      });
    } else {
      // 创建新记录 - 先创建一个默认用户
      let defaultUser = await prisma.user.findUnique({
        where: { deviceId: 'default-system' },
      });
      
      if (!defaultUser) {
        defaultUser = await prisma.user.create({
          data: { deviceId: 'default-system' },
        });
      }
      
      return await prisma.character.create({
        data: {
          ...data,
          userId: defaultUser.id,
        },
      });
    }
  } catch (error) {
    console.error('Both upsert methods failed:', error);
    throw error;
  }
}