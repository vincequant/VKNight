import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { EQUIPMENT_DATA } from '@/data/equipment';

export async function POST(request: NextRequest) {
  try {
    const { characterType, action } = await request.json();
    
    if (!characterType || !['josh', 'abby'].includes(characterType)) {
      return NextResponse.json({ success: false, error: 'Invalid character type' }, { status: 400 });
    }
    
    // Get all users (for now, we'll fix for all users)
    const characters = await prisma.character.findMany({
      where: { type: characterType },
      include: {
        weapon: true,
        armor: true,
        shield: true,
      }
    });
    
    const results = [];
    
    for (const character of characters) {
      let updated = false;
      const updateData: any = {};
      
      // Parse owned equipment
      const ownedEquipment = JSON.parse(character.ownedEquipment || '[]');
      
      if (action === 'auto-equip' && ownedEquipment.length > 0) {
        // Auto-equip best items if nothing is equipped
        if (!character.weaponId) {
          const ownedWeapons = EQUIPMENT_DATA.filter(item => 
            item.type === 'weapon' && 
            ownedEquipment.includes(item.id) && 
            item.levelRequirement <= character.level
          ).sort((a, b) => b.tier - a.tier);
          
          if (ownedWeapons.length > 0) {
            updateData.weaponId = ownedWeapons[0].id;
            updated = true;
          }
        }
        
        if (!character.armorId) {
          const ownedArmor = EQUIPMENT_DATA.filter(item => 
            item.type === 'armor' && 
            ownedEquipment.includes(item.id) && 
            item.levelRequirement <= character.level
          ).sort((a, b) => b.tier - a.tier);
          
          if (ownedArmor.length > 0) {
            updateData.armorId = ownedArmor[0].id;
            updated = true;
          }
        }
        
        if (!character.shieldId) {
          const ownedShields = EQUIPMENT_DATA.filter(item => 
            item.type === 'shield' && 
            ownedEquipment.includes(item.id) && 
            item.levelRequirement <= character.level
          ).sort((a, b) => b.tier - a.tier);
          
          if (ownedShields.length > 0) {
            updateData.shieldId = ownedShields[0].id;
            updated = true;
          }
        }
      } else if (action === 'add-basic') {
        // Add basic equipment to owned list
        const basicEquipment = ['wooden-sword', 'leather-armor', 'wooden-shield'];
        const newOwned = [...new Set([...ownedEquipment, ...basicEquipment])];
        updateData.ownedEquipment = JSON.stringify(newOwned);
        updated = true;
      }
      
      if (updated) {
        await prisma.character.update({
          where: { id: character.id },
          data: updateData
        });
        
        results.push({
          userId: character.userId,
          characterType: character.type,
          updated: true,
          changes: updateData
        });
      } else {
        results.push({
          userId: character.userId,
          characterType: character.type,
          updated: false,
          message: 'No changes needed'
        });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      results,
      totalProcessed: characters.length,
      totalUpdated: results.filter(r => r.updated).length
    });
  } catch (error) {
    console.error('Fix equipment error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET endpoint to check current equipment status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const characterType = searchParams.get('type');
    
    if (!characterType || !['josh', 'abby'].includes(characterType)) {
      return NextResponse.json({ success: false, error: 'Invalid character type' }, { status: 400 });
    }
    
    const characters = await prisma.character.findMany({
      where: { type: characterType },
      include: {
        weapon: true,
        armor: true,
        shield: true,
      }
    });
    
    const status = characters.map(char => ({
      userId: char.userId,
      level: char.level,
      weapon: char.weapon?.name || 'None',
      armor: char.armor?.name || 'None', 
      shield: char.shield?.name || 'None',
      ownedEquipment: JSON.parse(char.ownedEquipment || '[]')
    }));
    
    return NextResponse.json({ success: true, characters: status });
  } catch (error) {
    console.error('Get equipment status error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}