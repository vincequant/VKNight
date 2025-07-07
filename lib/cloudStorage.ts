import { Character } from '@/types/game';
import { prisma } from './database';
import { ethToWei } from '@/utils/ethereum';

export function getDeviceId(): string {
  if (typeof window === 'undefined') return '';
  
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

export async function getOrCreateUser() {
  const deviceId = getDeviceId();
  if (!deviceId) return null;
  
  try {
    let user = await prisma.user.findUnique({
      where: { deviceId },
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: { deviceId },
      });
    }
    
    return user;
  } catch (error) {
    console.error('Error getting/creating user:', error);
    return null;
  }
}

export async function saveCharacterToCloud(character: Character) {
  try {
    const user = await getOrCreateUser();
    if (!user) return;
    
    // Get owned equipment from localStorage
    const ownedEquipmentKey = `ownedEquipment_${character.type}`;
    const ownedEquipment = JSON.parse(localStorage.getItem(ownedEquipmentKey) || '[]');
    
    const characterData = {
      userId: user.id,
      type: character.type,
      level: character.level,
      experience: character.experience,
      expToNextLevel: character.expToNextLevel,
      eth: character.eth.toString(),
      baseHp: character.baseHp,
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
    
    await prisma.character.upsert({
      where: {
        userId_type: {
          userId: user.id,
          type: character.type,
        },
      },
      update: characterData,
      create: characterData,
    });
    
    console.log('Character saved to cloud');
  } catch (error) {
    console.error('Error saving to cloud:', error);
  }
}

export async function loadCharacterFromCloud(characterType: string): Promise<Character | null> {
  try {
    const user = await getOrCreateUser();
    if (!user) return null;
    
    const dbCharacter = await prisma.character.findUnique({
      where: {
        userId_type: {
          userId: user.id,
          type: characterType,
        },
      },
      include: {
        weapon: true,
        armor: true,
        shield: true,
      },
    });
    
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
      attack: dbCharacter.baseAttack,
      defense: dbCharacter.baseDefense,
      baseHp: dbCharacter.baseHp,
      baseAttack: dbCharacter.baseAttack,
      baseDefense: dbCharacter.baseDefense,
      stagesCleared: JSON.parse(dbCharacter.stagesCleared || '[]'),
      inventory: JSON.parse(dbCharacter.inventory || '[]'),
      stagesPaidFor: JSON.parse(dbCharacter.stagesPaidFor || '[]'),
    };
    
    // Restore owned equipment to localStorage
    if (dbCharacter.ownedEquipment) {
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
    
    console.log('Character loaded from cloud');
    return character;
  } catch (error) {
    console.error('Error loading from cloud:', error);
    return null;
  }
}