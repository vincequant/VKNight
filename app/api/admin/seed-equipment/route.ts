import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { EQUIPMENT_DATA } from '@/data/equipment';

export async function POST(request: NextRequest) {
  try {
    const results = [];
    
    // Seed all equipment data
    for (const equipment of EQUIPMENT_DATA) {
      try {
        const created = await prisma.equipment.upsert({
          where: { id: equipment.id },
          update: {
            name: equipment.name,
            type: equipment.type,  // 添加 type 字段
            tier: equipment.tier,
            price: equipment.price.toString(),
            levelRequirement: equipment.levelRequirement,
            hpBonus: equipment.hpBonus,
            attackBonus: equipment.attackBonus,
            defenseBonus: equipment.defenseBonus,
            icon: equipment.icon,
            description: equipment.description
          },
          create: {
            id: equipment.id,
            name: equipment.name,
            type: equipment.type,  // 添加 type 字段
            tier: equipment.tier,
            price: equipment.price.toString(),
            levelRequirement: equipment.levelRequirement,
            hpBonus: equipment.hpBonus,
            attackBonus: equipment.attackBonus,
            defenseBonus: equipment.defenseBonus,
            icon: equipment.icon,
            description: equipment.description
          }
        });
        
        results.push({
          id: equipment.id,
          name: equipment.name,
          status: 'success'
        });
      } catch (error) {
        results.push({
          id: equipment.id,
          name: equipment.name,
          status: 'error',
          error: error.message
        });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      results,
      totalProcessed: EQUIPMENT_DATA.length,
      totalSuccess: results.filter(r => r.status === 'success').length
    });
  } catch (error) {
    console.error('Seed equipment error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET endpoint to check current equipment in database
export async function GET(request: NextRequest) {
  try {
    const equipment = await prisma.equipment.findMany({
      orderBy: { tier: 'asc' }
    });
    
    return NextResponse.json({ 
      success: true, 
      totalInDatabase: equipment.length,
      equipment: equipment.map(e => ({
        id: e.id,
        name: e.name,
        tier: e.tier
      }))
    });
  } catch (error) {
    console.error('Get equipment error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}