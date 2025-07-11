import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const results = [];
    
    // 1. 首先创建默认用户（如果需要）
    try {
      // 检查是否存在User表
      let userId = null;
      try {
        // 尝试查找默认用户
        const existingUser = await prisma.$queryRaw`
          SELECT id FROM User WHERE deviceId = 'default-system' LIMIT 1
        `;
        
        if (existingUser && existingUser[0]) {
          userId = existingUser[0].id;
          results.push({
            type: 'user',
            success: true,
            message: `找到现有用户: ${userId}`
          });
        } else {
          // 创建新用户
          const newUserId = 'user-' + Date.now();
          await prisma.$executeRaw`
            INSERT INTO User (id, deviceId, createdAt, updatedAt)
            VALUES (${newUserId}, 'default-system', datetime('now'), datetime('now'))
          `;
          userId = newUserId;
          results.push({
            type: 'user',
            success: true,
            message: `创建新用户: ${userId}`
          });
        }
      } catch (userError) {
        // User表可能不存在，这没关系
        results.push({
          type: 'user',
          success: false,
          message: 'User表不存在或无法访问',
          error: userError.message
        });
      }
      
      // 2. 删除现有的Josh和Abby（使用多种方法尝试）
      try {
        // 方法1：直接删除
        await prisma.$executeRaw`DELETE FROM Character WHERE type IN ('josh', 'abby')`;
        results.push({
          type: 'cleanup',
          success: true,
          message: '成功删除现有角色'
        });
      } catch (e) {
        // 方法2：逐个删除
        try {
          await prisma.$executeRaw`DELETE FROM Character WHERE type = 'josh'`;
          await prisma.$executeRaw`DELETE FROM Character WHERE type = 'abby'`;
          results.push({
            type: 'cleanup',
            success: true,
            message: '成功删除现有角色（逐个）'
          });
        } catch (e2) {
          results.push({
            type: 'cleanup',
            success: false,
            message: '无法删除现有角色',
            error: e2.message
          });
        }
      }
      
      // 3. 创建Josh
      try {
        const joshId = 'josh-' + Date.now();
        
        if (userId) {
          // 有userId的情况
          await prisma.$executeRaw`
            INSERT INTO Character (
              id, userId, type, level, experience, expToNextLevel, eth,
              baseHp, baseMp, baseAttack, baseDefense,
              inventory, stagesCleared, stagesPaidFor, ownedEquipment,
              totalEnemiesDefeated, totalQuestionsAnswered, totalCorrectAnswers,
              weaponId, armorId, shieldId, currentStageId,
              createdAt, updatedAt
            ) VALUES (
              ${joshId},
              ${userId},
              'josh',
              5,
              450,
              600,
              '35200000000000000000',
              100,
              50,
              20,
              10,
              '[]',
              '["stage-1-1","stage-1-2","stage-1-3","stage-2-1"]',
              '[]',
              '["wooden-sword","iron-sword","silver-sword","leather-armor","chainmail","plate-armor","wooden-shield","iron-shield"]',
              0,
              0,
              0,
              null,
              null,
              null,
              null,
              datetime('now'),
              datetime('now')
            )
          `;
        } else {
          // 没有userId的情况（新schema）
          await prisma.$executeRaw`
            INSERT INTO Character (
              id, type, level, experience, expToNextLevel, eth,
              baseHp, baseMp, baseAttack, baseDefense,
              inventory, stagesCleared, stagesPaidFor, ownedEquipment,
              totalEnemiesDefeated, totalQuestionsAnswered, totalCorrectAnswers,
              weaponId, armorId, shieldId, currentStageId,
              createdAt, updatedAt
            ) VALUES (
              ${joshId},
              'josh',
              5,
              450,
              600,
              '35200000000000000000',
              100,
              50,
              20,
              10,
              '[]',
              '["stage-1-1","stage-1-2","stage-1-3","stage-2-1"]',
              '[]',
              '["wooden-sword","iron-sword","silver-sword","leather-armor","chainmail","plate-armor","wooden-shield","iron-shield"]',
              0,
              0,
              0,
              null,
              null,
              null,
              null,
              datetime('now'),
              datetime('now')
            )
          `;
        }
        
        results.push({
          type: 'josh',
          success: true,
          message: 'Josh创建成功 - 等级5, 35.2 ETH'
        });
      } catch (error) {
        results.push({
          type: 'josh',
          success: false,
          message: 'Josh创建失败',
          error: error.message
        });
      }
      
      // 4. 创建Abby
      try {
        const abbyId = 'abby-' + Date.now();
        
        if (userId) {
          // 有userId的情况
          await prisma.$executeRaw`
            INSERT INTO Character (
              id, userId, type, level, experience, expToNextLevel, eth,
              baseHp, baseMp, baseAttack, baseDefense,
              inventory, stagesCleared, stagesPaidFor, ownedEquipment,
              totalEnemiesDefeated, totalQuestionsAnswered, totalCorrectAnswers,
              weaponId, armorId, shieldId, currentStageId,
              createdAt, updatedAt
            ) VALUES (
              ${abbyId},
              ${userId},
              'abby',
              4,
              320,
              500,
              '3800000000000000000',
              100,
              50,
              20,
              10,
              '[]',
              '["stage-1-1","stage-1-2","stage-1-3"]',
              '[]',
              '["wooden-sword","training-staff","leather-armor","cloth-robe","wooden-shield"]',
              0,
              0,
              0,
              null,
              null,
              null,
              null,
              datetime('now'),
              datetime('now')
            )
          `;
        } else {
          // 没有userId的情况（新schema）
          await prisma.$executeRaw`
            INSERT INTO Character (
              id, type, level, experience, expToNextLevel, eth,
              baseHp, baseMp, baseAttack, baseDefense,
              inventory, stagesCleared, stagesPaidFor, ownedEquipment,
              totalEnemiesDefeated, totalQuestionsAnswered, totalCorrectAnswers,
              weaponId, armorId, shieldId, currentStageId,
              createdAt, updatedAt
            ) VALUES (
              ${abbyId},
              'abby',
              4,
              320,
              500,
              '3800000000000000000',
              100,
              50,
              20,
              10,
              '[]',
              '["stage-1-1","stage-1-2","stage-1-3"]',
              '[]',
              '["wooden-sword","training-staff","leather-armor","cloth-robe","wooden-shield"]',
              0,
              0,
              0,
              null,
              null,
              null,
              null,
              datetime('now'),
              datetime('now')
            )
          `;
        }
        
        results.push({
          type: 'abby',
          success: true,
          message: 'Abby创建成功 - 等级4, 3.8 ETH'
        });
      } catch (error) {
        results.push({
          type: 'abby',
          success: false,
          message: 'Abby创建失败',
          error: error.message
        });
      }
      
      // 5. 验证结果
      try {
        const characters = await prisma.$queryRaw`
          SELECT type, level, 
            CAST(CAST(eth AS REAL) / 1000000000000000000 AS TEXT) as eth_display
          FROM Character 
          WHERE type IN ('josh', 'abby')
        `;
        
        results.push({
          type: 'verification',
          success: true,
          message: `数据库验证：找到 ${characters.length} 个角色`,
          data: characters
        });
      } catch (error) {
        results.push({
          type: 'verification',
          success: false,
          message: '无法验证数据',
          error: error.message
        });
      }
      
    } catch (error) {
      results.push({
        type: 'general',
        success: false,
        message: '总体错误',
        error: error.message
      });
    }
    
    return NextResponse.json({
      success: results.filter(r => r.type === 'josh' || r.type === 'abby').some(r => r.success),
      message: '终极修复执行完成',
      results: results
    });
  } catch (error) {
    console.error('Ultimate fix error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}