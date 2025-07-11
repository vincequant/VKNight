import { Character } from '@/types/game';
import { prisma } from './database';
import { findCharacterCompat, upsertCharacterCompat } from './database-compat';

export async function saveCharacterToCloud(character: Character) {
  try {
    // 获取拥有的装备
    const ownedEquipmentKey = `ownedEquipment_${character.type}`;
    const ownedEquipment = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem(ownedEquipmentKey) || '[]')
      : [];
    
    const characterData = {
      type: character.type,
      level: character.level,
      experience: character.experience,
      expToNextLevel: character.expToNextLevel,
      eth: character.eth.toString(),
      baseHp: character.baseHp,
      baseMp: character.baseMp || 50,
      baseAttack: character.baseAttack,
      baseDefense: character.baseDefense,
      weaponId: character.weapon?.id || null,
      armorId: character.armor?.id || null,
      shieldId: character.shield?.id || null,
      stagesCleared: JSON.stringify(character.stagesCleared || []),
      inventory: JSON.stringify(character.inventory || []),
      ownedEquipment: JSON.stringify(ownedEquipment),
      stagesPaidFor: JSON.stringify(character.stagesPaidFor || []),
    };
    
    // 使用兼容层进行upsert
    await upsertCharacterCompat(characterData);
    
    console.log(`Character ${character.type} saved to cloud`);
  } catch (error) {
    console.error('Error saving to cloud:', error);
  }
}

export async function loadCharacterFromCloud(characterType: string): Promise<Character | null> {
  try {
    // 使用兼容层查找角色
    const dbCharacter = await findCharacterCompat(characterType);
    
    if (!dbCharacter) return null;
    
    const character: Character = {
      id: characterType,
      type: characterType as 'josh' | 'abby',
      level: dbCharacter.level,
      experience: dbCharacter.experience,
      expToNextLevel: dbCharacter.expToNextLevel,
      eth: BigInt(dbCharacter.eth),
      hp: dbCharacter.baseHp,
      maxHp: dbCharacter.baseHp,
      mp: dbCharacter.baseMp || 50,
      maxMp: dbCharacter.baseMp || 50,
      attack: dbCharacter.baseAttack,
      defense: dbCharacter.baseDefense,
      baseHp: dbCharacter.baseHp,
      baseMp: dbCharacter.baseMp || 50,
      baseAttack: dbCharacter.baseAttack,
      baseDefense: dbCharacter.baseDefense,
      stagesCleared: JSON.parse(dbCharacter.stagesCleared || '[]'),
      inventory: JSON.parse(dbCharacter.inventory || '[]'),
      stagesPaidFor: JSON.parse(dbCharacter.stagesPaidFor || '[]'),
    };
    
    // 恢复拥有的装备到localStorage
    if (dbCharacter.ownedEquipment && typeof window !== 'undefined') {
      const ownedEquipmentKey = `ownedEquipment_${characterType}`;
      localStorage.setItem(ownedEquipmentKey, dbCharacter.ownedEquipment);
    }
    
    if (dbCharacter.weapon) {
      character.weapon = {
        id: dbCharacter.weapon.id,
        name: dbCharacter.weapon.name,
        type: 'weapon',
        tier: dbCharacter.weapon.tier,
        price: BigInt(dbCharacter.weapon.price),
        hpBonus: dbCharacter.weapon.hpBonus,
        attackBonus: dbCharacter.weapon.attackBonus,
        defenseBonus: dbCharacter.weapon.defenseBonus,
        icon: dbCharacter.weapon.icon,
        description: dbCharacter.weapon.description,
        levelRequirement: dbCharacter.weapon.levelRequirement,
      };
    }
    
    if (dbCharacter.armor) {
      character.armor = {
        id: dbCharacter.armor.id,
        name: dbCharacter.armor.name,
        type: 'armor',
        tier: dbCharacter.armor.tier,
        price: BigInt(dbCharacter.armor.price),
        hpBonus: dbCharacter.armor.hpBonus,
        attackBonus: dbCharacter.armor.attackBonus,
        defenseBonus: dbCharacter.armor.defenseBonus,
        icon: dbCharacter.armor.icon,
        description: dbCharacter.armor.description,
        levelRequirement: dbCharacter.armor.levelRequirement,
      };
    }
    
    if (dbCharacter.shield) {
      character.shield = {
        id: dbCharacter.shield.id,
        name: dbCharacter.shield.name,
        type: 'shield',
        tier: dbCharacter.shield.tier,
        price: BigInt(dbCharacter.shield.price),
        hpBonus: dbCharacter.shield.hpBonus,
        attackBonus: dbCharacter.shield.attackBonus,
        defenseBonus: dbCharacter.shield.defenseBonus,
        icon: dbCharacter.shield.icon,
        description: dbCharacter.shield.description,
        levelRequirement: dbCharacter.shield.levelRequirement,
      };
    }
    
    console.log(`Character ${characterType} loaded from cloud`);
    return character;
  } catch (error) {
    console.error('Error loading from cloud:', error);
    return null;
  }
}

// 创建角色备份
export async function createCharacterBackup(character: Character, backupName: string) {
  try {
    await prisma.characterBackup.create({
      data: {
        characterType: character.type,
        backupName,
        backupData: JSON.stringify(character, (key, value) => {
          if (typeof value === 'bigint') {
            return value.toString();
          }
          return value;
        }),
      },
    });
    
    console.log('Backup created successfully');
  } catch (error) {
    console.error('Error creating backup:', error);
  }
}

// 获取角色备份列表
export async function getCharacterBackups(characterType?: string) {
  try {
    const where = characterType ? { characterType } : {};
    return await prisma.characterBackup.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error getting backups:', error);
    return [];
  }
}

// 恢复角色备份
export async function restoreCharacterBackup(backupId: string): Promise<Character | null> {
  try {
    const backup = await prisma.characterBackup.findUnique({
      where: { id: backupId },
    });
    
    if (!backup) return null;
    
    const character = JSON.parse(backup.backupData);
    character.eth = BigInt(character.eth);
    
    return character;
  } catch (error) {
    console.error('Error restoring backup:', error);
    return null;
  }
}