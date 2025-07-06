import { Character, Equipment } from '@/types/game';
import { ethToWei } from '@/utils/ethereum';

// 将旧的gold字段迁移到eth字段
interface LegacyCharacter {
  id: string;
  type: 'josh' | 'abby';
  level: number;
  experience: number;
  expToNextLevel: number;
  gold?: number;
  eth?: bigint | number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  stagesCleared: string[];
  weapon?: Equipment;
  armor?: Equipment;
  shield?: Equipment;
}

export function migrateCharacterData(character: LegacyCharacter): Character {
  // 如果已经有eth字段，确保它是bigint类型
  if (character.eth !== undefined) {
    return {
      ...character,
      eth: typeof character.eth === 'bigint' ? character.eth : ethToWei(character.eth),
      weapon: character.weapon,
      armor: character.armor,
      shield: character.shield
    } as Character;
  }
  
  // 将gold转换为eth (1 gold = 0.001 ETH)
  const migratedChar: Character = {
    ...character,
    eth: ethToWei((character.gold || 0) * 0.001),
    weapon: character.weapon,
    armor: character.armor,
    shield: character.shield
  } as Character;
  
  // 删除旧的gold字段（如果需要的话）
  // delete migratedChar.gold;
  
  return migratedChar;
}