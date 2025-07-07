export interface Character {
  id: string;
  type: 'josh' | 'abby';
  level: number;
  experience: number;
  expToNextLevel: number;
  eth: bigint;
  
  // Calculated stats (base + equipment)
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  
  // Base stats
  baseHp: number;
  baseMp: number;
  baseAttack: number;
  baseDefense: number;
  
  // Equipment
  weapon?: Equipment;
  armor?: Equipment;
  shield?: Equipment;
  
  // Progress
  currentStageId?: string;
  stagesCleared: string[];
  stagesPaidFor: string[]; // 已支付入场费的关卡
  
  // Inventory
  inventory: InventoryItem[];
}

export interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'shield';
  tier: number; // 1-5
  price: bigint;
  levelRequirement: number;
  
  // Stat bonuses
  hpBonus: number;
  attackBonus: number;
  defenseBonus: number;
  
  // Visual
  icon: string;
  description: string;
}

export interface InventoryItem {
  id: string;
  quantity: number;
}

export interface Stage {
  id: string;
  name: string;
  area: string;
  difficulty: number;
  levelRequirement: number;
  enemies: Enemy[];
  ethReward: bigint;  // in wei
  expReward: number;
  entranceFee: bigint;  // ETH required to enter stage
  description: string;
  icon: string;
  order: number;
  locked: boolean;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  sprite: string;
  ethDrop: bigint;  // in wei
  expDrop: number;
}

export interface BattleState {
  mode: 'question' | 'attack' | 'enemy-turn' | 'victory' | 'defeat';
  currentEnemy?: Enemy;
  currentEnemyIndex: number;
  enemiesDefeated: number;
}

export interface GameProgress {
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  totalEnemiesDefeated: number;
  currentStreak: number;
  bestStreak: number;
}

export const calculateCharacterStats = (character: Character): Character => {
  const weaponBonus = character.weapon || { hpBonus: 0, attackBonus: 0, defenseBonus: 0 };
  const armorBonus = character.armor || { hpBonus: 0, attackBonus: 0, defenseBonus: 0 };
  const shieldBonus = character.shield || { hpBonus: 0, attackBonus: 0, defenseBonus: 0 };
  
  const levelBonus = (character.level - 1) * 5;
  
  const maxHp = character.baseHp + weaponBonus.hpBonus + armorBonus.hpBonus + shieldBonus.hpBonus + levelBonus;
  const maxMp = character.baseMp + Math.floor(levelBonus / 2);
  
  return {
    ...character,
    maxHp,
    hp: character.hp !== undefined ? character.hp : maxHp,
    maxMp,
    mp: character.mp !== undefined ? character.mp : maxMp,
    attack: character.baseAttack + weaponBonus.attackBonus + armorBonus.attackBonus + shieldBonus.attackBonus + Math.floor(levelBonus / 2),
    defense: character.baseDefense + weaponBonus.defenseBonus + armorBonus.defenseBonus + shieldBonus.defenseBonus + Math.floor(levelBonus / 3),
  };
};

export const calculateExpForLevel = (level: number): number => {
  return 100 * level * Math.floor(level / 2 + 1);
};