import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { findCharacterCompat } from '@/lib/database-compat';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { characterType, ethAmount } = body;
    
    if (!characterType || !ethAmount) {
      return NextResponse.json({ 
        success: false, 
        error: '需要指定角色类型和ETH数量' 
      }, { status: 400 });
    }
    
    // 使用兼容层查找角色
    const character = await findCharacterCompat(characterType);
    
    if (!character) {
      return NextResponse.json({ 
        success: false, 
        error: `未找到角色: ${characterType}` 
      }, { status: 404 });
    }
    
    // 计算新的ETH余额
    const currentEth = BigInt(character.eth);
    const addAmount = BigInt(ethAmount) * BigInt(10) ** BigInt(18); // 转换为Wei
    const newEth = currentEth + addAmount;
    
    // 更新角色ETH
    const updated = await prisma.character.update({
      where: {
        id: character.id,
      },
      data: {
        eth: newEth.toString(),
      },
    });
    
    return NextResponse.json({
      success: true,
      message: `成功为${characterType}添加${ethAmount} ETH`,
      character: {
        type: updated.type,
        level: updated.level,
        previousEth: (currentEth / BigInt(10) ** BigInt(18)).toString(),
        newEth: (newEth / BigInt(10) ** BigInt(18)).toString(),
      },
    });
  } catch (error) {
    console.error('Add ETH error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}