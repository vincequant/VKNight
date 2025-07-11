import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // 获取所有用户
    const users = await prisma.user.findMany({
      include: {
        characters: {
          include: {
            weapon: true,
            armor: true,
            shield: true,
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    // 获取所有角色
    const allCharacters = await prisma.character.findMany({
      include: {
        weapon: true,
        armor: true,
        shield: true,
        user: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      totalCharacters: allCharacters.length,
      users: users.map(user => ({
        id: user.id,
        deviceId: user.deviceId,
        charactersCount: user.characters.length,
        characters: user.characters.map(char => ({
          id: char.id,
          type: char.type,
          level: char.level,
          eth: (BigInt(char.eth) / BigInt(10) ** BigInt(18)).toString() + ' ETH',
          updatedAt: char.updatedAt,
        }))
      })),
      allCharacters: allCharacters.map(char => ({
        id: char.id,
        type: char.type,
        level: char.level,
        eth: (BigInt(char.eth) / BigInt(10) ** BigInt(18)).toString() + ' ETH',
        userId: char.userId,
        userDeviceId: char.user.deviceId,
        updatedAt: char.updatedAt,
      }))
    });
  } catch (error) {
    console.error('Check data error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}