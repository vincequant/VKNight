import { prisma } from '@/lib/prisma';
import { Character } from '@/types/game';
import { ethToWei } from '@/utils/ethereum';

export async function createOrGetCharacter(userId: string, type: 'josh' | 'abby'): Promise<Character> {
  // Check if character exists
  let dbCharacter = await prisma.character.findUnique({
    where: { userId },
    include: {
      weapon: true,
      armor: true,
      shield: true,
    }
  });

  // Create if doesn't exist
  if (!dbCharacter) {
    const baseStats = type === 'josh' 
      ? { hp: 120, attack: 25, defense: 15 }
      : { hp: 100, attack: 20, defense: 10 };

    dbCharacter = await prisma.character.create({
      data: {
        userId,
        type,
        baseHp: baseStats.hp,
        baseAttack: baseStats.attack,
        baseDefense: baseStats.defense,
      },
      include: {
        weapon: true,
        armor: true,
        shield: true,
      }
    });
  }

  // Convert to game Character type
  const character: Character = {
    id: dbCharacter.id,
    type: dbCharacter.type as 'josh' | 'abby',
    level: dbCharacter.level,
    experience: dbCharacter.experience,
    expToNextLevel: dbCharacter.expToNextLevel,
    eth: ethToWei(dbCharacter.gold * 0.001), // Convert gold to ETH (1 gold = 0.001 ETH)
    hp: dbCharacter.baseHp,
    maxHp: dbCharacter.baseHp,
    attack: dbCharacter.baseAttack,
    defense: dbCharacter.baseDefense,
    baseHp: dbCharacter.baseHp,
    baseAttack: dbCharacter.baseAttack,
    baseDefense: dbCharacter.baseDefense,
    weapon: dbCharacter.weapon ? {
      ...dbCharacter.weapon,
      type: dbCharacter.weapon.type as 'weapon' | 'armor' | 'shield',
      price: BigInt(dbCharacter.weapon.price)
    } : undefined,
    armor: dbCharacter.armor ? {
      ...dbCharacter.armor,
      type: dbCharacter.armor.type as 'weapon' | 'armor' | 'shield',
      price: BigInt(dbCharacter.armor.price)
    } : undefined,
    shield: dbCharacter.shield ? {
      ...dbCharacter.shield,
      type: dbCharacter.shield.type as 'weapon' | 'armor' | 'shield',
      price: BigInt(dbCharacter.shield.price)
    } : undefined,
    currentStageId: dbCharacter.currentStageId || undefined,
    stagesCleared: JSON.parse(dbCharacter.stagesCleared),
  };

  return character;
}

export async function updateCharacterProgress(
  characterId: string,
  updates: {
    experience?: number;
    level?: number;
    gold?: number;
    stageCleared?: string;
    enemiesDefeated?: number;
    questionsAnswered?: number;
    correctAnswers?: number;
  }
) {
  const character = await prisma.character.findUnique({
    where: { id: characterId }
  });

  if (!character) throw new Error('Character not found');

  const updateData: Record<string, unknown> = {};

  if (updates.experience !== undefined) {
    updateData.experience = updates.experience;
  }

  if (updates.level !== undefined) {
    updateData.level = updates.level;
    // Update exp requirement for next level
    updateData.expToNextLevel = 100 * updates.level * Math.floor(updates.level / 2 + 1);
  }

  if (updates.gold !== undefined) {
    updateData.gold = updates.gold;
  }

  if (updates.stageCleared) {
    const cleared = JSON.parse(character.stagesCleared);
    if (!cleared.includes(updates.stageCleared)) {
      cleared.push(updates.stageCleared);
      updateData.stagesCleared = JSON.stringify(cleared);
    }
  }

  if (updates.enemiesDefeated !== undefined) {
    updateData.totalEnemiesDefeated = character.totalEnemiesDefeated + updates.enemiesDefeated;
  }

  if (updates.questionsAnswered !== undefined) {
    updateData.totalQuestionsAnswered = character.totalQuestionsAnswered + updates.questionsAnswered;
  }

  if (updates.correctAnswers !== undefined) {
    updateData.totalCorrectAnswers = character.totalCorrectAnswers + updates.correctAnswers;
  }

  return await prisma.character.update({
    where: { id: characterId },
    data: updateData,
    include: {
      weapon: true,
      armor: true,
      shield: true,
    }
  });
}

export async function equipItem(
  characterId: string,
  itemId: string,
  slot: 'weapon' | 'armor' | 'shield'
) {
  const updateData: Record<string, unknown> = {};
  updateData[`${slot}Id`] = itemId;

  return await prisma.character.update({
    where: { id: characterId },
    data: updateData,
    include: {
      weapon: true,
      armor: true,
      shield: true,
    }
  });
}

export async function purchaseEquipment(
  userId: string,
  characterId: string,
  equipment: {
    id: string;
    name: string;
    type: string;
    price: number;
  }
) {
  // Start a transaction
  return await prisma.$transaction(async (tx) => {
    // Deduct gold
    const character = await tx.character.update({
      where: { id: characterId },
      data: {
        gold: {
          decrement: equipment.price
        }
      }
    });

    // Record purchase
    await tx.purchase.create({
      data: {
        userId,
        itemId: equipment.id,
        itemName: equipment.name,
        itemType: equipment.type,
        price: equipment.price,
      }
    });

    return character;
  });
}