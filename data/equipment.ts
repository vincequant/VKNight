import { Equipment } from '@/types/game';
import { ethToWei } from '@/utils/ethereum';

export const weapons: Equipment[] = [
  // Tier 1 - 新手装备 (几十ETH)
  {
    id: 'wooden-sword',
    name: '木剑',
    type: 'weapon',
    tier: 1,
    price: ethToWei(20),
    levelRequirement: 1,
    hpBonus: 0,
    attackBonus: 5,
    defenseBonus: 0,
    icon: '🗡️',
    description: '一把简单的木制训练剑'
  },
  {
    id: 'training-staff',
    name: '训练法杖',
    type: 'weapon',
    tier: 1,
    price: ethToWei(25),
    levelRequirement: 1,
    hpBonus: 5,
    attackBonus: 4,
    defenseBonus: 0,
    icon: '🪄',
    description: '初学者使用的魔法杖'
  },
  
  // Tier 2 - 基础装备 (一百多ETH)
  {
    id: 'iron-sword',
    name: '铁剑',
    type: 'weapon',
    tier: 2,
    price: ethToWei(120),
    levelRequirement: 5,
    hpBonus: 10,
    attackBonus: 12,
    defenseBonus: 2,
    icon: '⚔️',
    description: '坚固的铁制长剑'
  },
  {
    id: 'battle-axe',
    name: '战斧',
    type: 'weapon',
    tier: 2,
    price: ethToWei(150),
    levelRequirement: 5,
    hpBonus: 5,
    attackBonus: 15,
    defenseBonus: 0,
    icon: '🪓',
    description: '沉重的双手战斧'
  },
  
  // Tier 3 - 进阶装备 (几百ETH)
  {
    id: 'silver-sword',
    name: '银剑',
    type: 'weapon',
    tier: 3,
    price: ethToWei(500),
    levelRequirement: 10,
    hpBonus: 20,
    attackBonus: 20,
    defenseBonus: 5,
    icon: '⚔️',
    description: '闪耀着银光的精制武器'
  },
  {
    id: 'crystal-wand',
    name: '水晶魔杖',
    type: 'weapon',
    tier: 3,
    price: ethToWei(600),
    levelRequirement: 10,
    hpBonus: 25,
    attackBonus: 18,
    defenseBonus: 3,
    icon: '🔮',
    description: '蕴含魔力的水晶法杖'
  },
  
  // Tier 4 - 高级装备 (一千多ETH)
  {
    id: 'flame-blade',
    name: '烈焰之剑',
    type: 'weapon',
    tier: 4,
    price: ethToWei(1500),
    levelRequirement: 15,
    hpBonus: 35,
    attackBonus: 30,
    defenseBonus: 10,
    icon: '🔥',
    description: '燃烧着永恒之火的神剑'
  },
  {
    id: 'thunder-hammer',
    name: '雷霆战锤',
    type: 'weapon',
    tier: 4,
    price: ethToWei(1800),
    levelRequirement: 15,
    hpBonus: 40,
    attackBonus: 28,
    defenseBonus: 8,
    icon: '⚡',
    description: '蕴含雷电之力的战锤'
  },
  
  // Tier 5 - 传说装备 (几千ETH)
  {
    id: 'legendary-sword',
    name: '传说之剑',
    type: 'weapon',
    tier: 5,
    price: ethToWei(5000),
    levelRequirement: 20,
    hpBonus: 50,
    attackBonus: 45,
    defenseBonus: 15,
    icon: '⚔️',
    description: '蕴含着神秘力量的传说武器'
  },
  {
    id: 'dragon-slayer',
    name: '屠龙者',
    type: 'weapon',
    tier: 5,
    price: ethToWei(8000),
    levelRequirement: 25,
    hpBonus: 80,
    attackBonus: 60,
    defenseBonus: 20,
    icon: '🗡️',
    description: '专为屠龙而生的神兵利器'
  }
];

export const armors: Equipment[] = [
  // Tier 1 - 新手装备 (几十ETH)
  {
    id: 'leather-armor',
    name: '皮甲',
    type: 'armor',
    tier: 1,
    price: ethToWei(30),
    levelRequirement: 1,
    hpBonus: 20,
    attackBonus: 0,
    defenseBonus: 5,
    icon: '🦺',
    description: '轻便的皮制护甲'
  },
  {
    id: 'cloth-robe',
    name: '布袍',
    type: 'armor',
    tier: 1,
    price: ethToWei(25),
    levelRequirement: 1,
    hpBonus: 15,
    attackBonus: 2,
    defenseBonus: 3,
    icon: '👘',
    description: '法师学徒的布袍'
  },
  
  // Tier 2 - 基础装备 (一百多ETH)
  {
    id: 'chainmail',
    name: '锁子甲',
    type: 'armor',
    tier: 2,
    price: ethToWei(180),
    levelRequirement: 5,
    hpBonus: 40,
    attackBonus: 0,
    defenseBonus: 12,
    icon: '🦺',
    description: '由金属环编织而成的护甲'
  },
  {
    id: 'magic-robe',
    name: '魔法袍',
    type: 'armor',
    tier: 2,
    price: ethToWei(200),
    levelRequirement: 5,
    hpBonus: 35,
    attackBonus: 5,
    defenseBonus: 8,
    icon: '🥻',
    description: '附魔的法师长袍'
  },
  
  // Tier 3 - 进阶装备 (几百ETH)
  {
    id: 'plate-armor',
    name: '板甲',
    type: 'armor',
    tier: 3,
    price: ethToWei(700),
    levelRequirement: 10,
    hpBonus: 70,
    attackBonus: -5,
    defenseBonus: 25,
    icon: '🛡️',
    description: '厚重但防御力极强的全身甲'
  },
  {
    id: 'enchanted-armor',
    name: '附魔战甲',
    type: 'armor',
    tier: 3,
    price: ethToWei(800),
    levelRequirement: 10,
    hpBonus: 60,
    attackBonus: 5,
    defenseBonus: 20,
    icon: '✨',
    description: '闪烁着魔法光芒的战甲'
  },
  
  // Tier 4 - 高级装备 (一千多ETH)
  {
    id: 'mithril-armor',
    name: '秘银甲',
    type: 'armor',
    tier: 4,
    price: ethToWei(2000),
    levelRequirement: 15,
    hpBonus: 100,
    attackBonus: 5,
    defenseBonus: 35,
    icon: '💎',
    description: '轻如羽毛却坚不可摧的秘银护甲'
  },
  
  // Tier 5 - 传说装备 (几千ETH)
  {
    id: 'dragon-scale-armor',
    name: '龙鳞甲',
    type: 'armor',
    tier: 5,
    price: ethToWei(6000),
    levelRequirement: 20,
    hpBonus: 150,
    attackBonus: 10,
    defenseBonus: 50,
    icon: '🐉',
    description: '由真龙之鳞制成的传说护甲'
  },
  {
    id: 'celestial-armor',
    name: '天界战甲',
    type: 'armor',
    tier: 5,
    price: ethToWei(10000),
    levelRequirement: 25,
    hpBonus: 200,
    attackBonus: 20,
    defenseBonus: 80,
    icon: '🌟',
    description: '来自天界的神圣护甲'
  }
];

export const shields: Equipment[] = [
  // Tier 1 - 新手装备 (几十ETH)
  {
    id: 'wooden-shield',
    name: '木盾',
    type: 'shield',
    tier: 1,
    price: ethToWei(15),
    levelRequirement: 1,
    hpBonus: 15,
    attackBonus: 0,
    defenseBonus: 8,
    icon: '🛡️',
    description: '简单但实用的木制圆盾'
  },
  {
    id: 'buckler',
    name: '小圆盾',
    type: 'shield',
    tier: 1,
    price: ethToWei(20),
    levelRequirement: 1,
    hpBonus: 10,
    attackBonus: 2,
    defenseBonus: 6,
    icon: '🔵',
    description: '灵活轻便的小型盾牌'
  },
  
  // Tier 2 - 基础装备 (一百多ETH)
  {
    id: 'iron-shield',
    name: '铁盾',
    type: 'shield',
    tier: 2,
    price: ethToWei(100),
    levelRequirement: 5,
    hpBonus: 30,
    attackBonus: 0,
    defenseBonus: 15,
    icon: '🛡️',
    description: '坚固的铁制盾牌'
  },
  {
    id: 'knight-shield',
    name: '骑士盾',
    type: 'shield',
    tier: 2,
    price: ethToWei(130),
    levelRequirement: 5,
    hpBonus: 35,
    attackBonus: -2,
    defenseBonus: 18,
    icon: '⚔️',
    description: '标准的骑士盾牌'
  },
  
  // Tier 3 - 进阶装备 (几百ETH)
  {
    id: 'tower-shield',
    name: '塔盾',
    type: 'shield',
    tier: 3,
    price: ethToWei(400),
    levelRequirement: 10,
    hpBonus: 50,
    attackBonus: -3,
    defenseBonus: 30,
    icon: '🏛️',
    description: '巨大的塔型防御盾'
  },
  {
    id: 'magic-barrier',
    name: '魔法屏障',
    type: 'shield',
    tier: 3,
    price: ethToWei(450),
    levelRequirement: 10,
    hpBonus: 45,
    attackBonus: 5,
    defenseBonus: 25,
    icon: '💫',
    description: '魔法凝聚的能量护盾'
  },
  
  // Tier 4 - 高级装备 (一千多ETH)
  {
    id: 'aegis-shield',
    name: '圣盾',
    type: 'shield',
    tier: 4,
    price: ethToWei(1200),
    levelRequirement: 15,
    hpBonus: 80,
    attackBonus: 5,
    defenseBonus: 40,
    icon: '✨',
    description: '散发着神圣光芒的守护之盾'
  },
  
  // Tier 5 - 传说装备 (几千ETH)
  {
    id: 'divine-bulwark',
    name: '神之壁垒',
    type: 'shield',
    tier: 5,
    price: ethToWei(4000),
    levelRequirement: 20,
    hpBonus: 120,
    attackBonus: 10,
    defenseBonus: 60,
    icon: '🌟',
    description: '传说中能抵御一切攻击的神盾'
  },
  {
    id: 'eternal-shield',
    name: '永恒之盾',
    type: 'shield',
    tier: 5,
    price: ethToWei(7000),
    levelRequirement: 25,
    hpBonus: 180,
    attackBonus: 15,
    defenseBonus: 100,
    icon: '♾️',
    description: '不朽不破的永恒之盾'
  }
];

export const getAllEquipment = (): Equipment[] => {
  return [...weapons, ...armors, ...shields];
};

export const EQUIPMENT_DATA = getAllEquipment();

export const getEquipmentByType = (type: 'weapon' | 'armor' | 'shield'): Equipment[] => {
  switch (type) {
    case 'weapon':
      return weapons;
    case 'armor':
      return armors;
    case 'shield':
      return shields;
    default:
      return [];
  }
};

export const getAffordableEquipment = (eth: bigint, level: number): Equipment[] => {
  return getAllEquipment().filter(item => 
    item.price <= eth && item.levelRequirement <= level
  );
};