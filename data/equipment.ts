import { Equipment } from '@/types/game';
import { ethToWei } from '@/utils/ethereum';

export const weapons: Equipment[] = [
  // Tier 1
  {
    id: 'wooden-sword',
    name: '木剑',
    type: 'weapon',
    tier: 1,
    price: ethToWei(2),
    levelRequirement: 1,
    hpBonus: 0,
    attackBonus: 5,
    defenseBonus: 0,
    icon: '🗡️',
    description: '一把简单的木制训练剑'
  },
  {
    id: 'training-bow',
    name: '训练弓',
    type: 'weapon',
    tier: 1,
    price: ethToWei(2),
    levelRequirement: 1,
    hpBonus: 0,
    attackBonus: 4,
    defenseBonus: 1,
    icon: '🏹',
    description: '适合初学者的轻便弓箭'
  },
  
  // Tier 2
  {
    id: 'iron-sword',
    name: '铁剑',
    type: 'weapon',
    tier: 2,
    price: ethToWei(10),
    levelRequirement: 5,
    hpBonus: 10,
    attackBonus: 12,
    defenseBonus: 2,
    icon: '⚔️',
    description: '坚固的铁制长剑'
  },
  {
    id: 'hunters-bow',
    name: '猎人之弓',
    type: 'weapon',
    tier: 2,
    price: ethToWei(10),
    levelRequirement: 5,
    hpBonus: 5,
    attackBonus: 10,
    defenseBonus: 3,
    icon: '🏹',
    description: '经验丰富的猎人使用的弓'
  },
  
  // Tier 3
  {
    id: 'silver-sword',
    name: '银剑',
    type: 'weapon',
    tier: 3,
    price: ethToWei(50),
    levelRequirement: 10,
    hpBonus: 20,
    attackBonus: 20,
    defenseBonus: 5,
    icon: '⚔️',
    description: '闪耀着银光的精制武器'
  },
  {
    id: 'elven-bow',
    name: '精灵之弓',
    type: 'weapon',
    tier: 3,
    price: ethToWei(50),
    levelRequirement: 10,
    hpBonus: 15,
    attackBonus: 18,
    defenseBonus: 7,
    icon: '🏹',
    description: '精灵工匠打造的优雅长弓'
  },
  
  // Tier 4
  {
    id: 'golden-sword',
    name: '黄金剑',
    type: 'weapon',
    tier: 4,
    price: ethToWei(200),
    levelRequirement: 15,
    hpBonus: 35,
    attackBonus: 30,
    defenseBonus: 10,
    icon: '⚔️',
    description: '传说中的黄金武器'
  },
  
  // Tier 5
  {
    id: 'legendary-sword',
    name: '传说之剑',
    type: 'weapon',
    tier: 5,
    price: ethToWei(1000),
    levelRequirement: 20,
    hpBonus: 50,
    attackBonus: 45,
    defenseBonus: 15,
    icon: '⚔️',
    description: '蕴含着神秘力量的传说武器'
  },
  
  // Tier 6 - 史诗级
  {
    id: 'excalibur',
    name: '断钢圣剑',
    type: 'weapon',
    tier: 6,
    price: ethToWei(5000),
    levelRequirement: 25,
    hpBonus: 100,
    attackBonus: 80,
    defenseBonus: 30,
    icon: '🗿',
    description: '传说中的王者之剑，无坚不摧'
  },
  
  // Tier 7 - 神话级
  {
    id: 'god-slayer',
    name: '弑神之刃',
    type: 'weapon',
    tier: 7,
    price: ethToWei(20000),
    levelRequirement: 30,
    hpBonus: 200,
    attackBonus: 150,
    defenseBonus: 50,
    icon: '⚡',
    description: '能够斩杀神明的终极武器'
  }
];

export const armors: Equipment[] = [
  // Tier 1
  {
    id: 'leather-armor',
    name: '皮甲',
    type: 'armor',
    tier: 1,
    price: ethToWei(3),
    levelRequirement: 1,
    hpBonus: 20,
    attackBonus: 0,
    defenseBonus: 5,
    icon: '🎽',
    description: '轻便的皮制护甲'
  },
  
  // Tier 2
  {
    id: 'chainmail',
    name: '锁子甲',
    type: 'armor',
    tier: 2,
    price: ethToWei(15),
    levelRequirement: 5,
    hpBonus: 40,
    attackBonus: 0,
    defenseBonus: 12,
    icon: '🦺',
    description: '由金属环编织而成的护甲'
  },
  
  // Tier 3
  {
    id: 'plate-armor',
    name: '板甲',
    type: 'armor',
    tier: 3,
    price: ethToWei(80),
    levelRequirement: 10,
    hpBonus: 70,
    attackBonus: -5,
    defenseBonus: 25,
    icon: '🎖️',
    description: '厚重但防御力极强的全身甲'
  },
  
  // Tier 4
  {
    id: 'mithril-armor',
    name: '秘银甲',
    type: 'armor',
    tier: 4,
    price: ethToWei(300),
    levelRequirement: 15,
    hpBonus: 100,
    attackBonus: 5,
    defenseBonus: 35,
    icon: '💎',
    description: '轻如羽毛却坚不可摧的秘银护甲'
  },
  
  // Tier 5
  {
    id: 'dragon-scale-armor',
    name: '龙鳞甲',
    type: 'armor',
    tier: 5,
    price: ethToWei(2000),
    levelRequirement: 20,
    hpBonus: 150,
    attackBonus: 10,
    defenseBonus: 50,
    icon: '🐉',
    description: '由真龙之鳞制成的传说护甲'
  },
  
  // Tier 6 - 史诗级
  {
    id: 'celestial-armor',
    name: '天界战甲',
    type: 'armor',
    tier: 6,
    price: ethToWei(8000),
    levelRequirement: 25,
    hpBonus: 300,
    attackBonus: 20,
    defenseBonus: 100,
    icon: '🌟',
    description: '来自天界的神圣护甲'
  },
  
  // Tier 7 - 神话级
  {
    id: 'void-armor',
    name: '虚空战衣',
    type: 'armor',
    tier: 7,
    price: ethToWei(30000),
    levelRequirement: 30,
    hpBonus: 500,
    attackBonus: 50,
    defenseBonus: 200,
    icon: '🌌',
    description: '能够吸收一切伤害的终极护甲'
  }
];

export const shields: Equipment[] = [
  // Tier 1
  {
    id: 'wooden-shield',
    name: '木盾',
    type: 'shield',
    tier: 1,
    price: ethToWei(2.5),
    levelRequirement: 1,
    hpBonus: 15,
    attackBonus: 0,
    defenseBonus: 8,
    icon: '🛡️',
    description: '简单但实用的木制圆盾'
  },
  
  // Tier 2
  {
    id: 'iron-shield',
    name: '铁盾',
    type: 'shield',
    tier: 2,
    price: ethToWei(12),
    levelRequirement: 5,
    hpBonus: 30,
    attackBonus: 0,
    defenseBonus: 15,
    icon: '🛡️',
    description: '坚固的铁制盾牌'
  },
  
  // Tier 3
  {
    id: 'tower-shield',
    name: '塔盾',
    type: 'shield',
    tier: 3,
    price: ethToWei(70),
    levelRequirement: 10,
    hpBonus: 50,
    attackBonus: -3,
    defenseBonus: 30,
    icon: '🛡️',
    description: '巨大的塔型防御盾'
  },
  
  // Tier 4
  {
    id: 'aegis-shield',
    name: '圣盾',
    type: 'shield',
    tier: 4,
    price: ethToWei(250),
    levelRequirement: 15,
    hpBonus: 80,
    attackBonus: 5,
    defenseBonus: 40,
    icon: '🛡️',
    description: '散发着神圣光芒的守护之盾'
  },
  
  // Tier 5
  {
    id: 'divine-bulwark',
    name: '神之壁垒',
    type: 'shield',
    tier: 5,
    price: ethToWei(1500),
    levelRequirement: 20,
    hpBonus: 120,
    attackBonus: 10,
    defenseBonus: 60,
    icon: '🛡️',
    description: '传说中能抵御一切攻击的神盾'
  },
  
  // Tier 6 - 史诗级
  {
    id: 'eternal-shield',
    name: '永恒之盾',
    type: 'shield',
    tier: 6,
    price: ethToWei(6000),
    levelRequirement: 25,
    hpBonus: 250,
    attackBonus: 20,
    defenseBonus: 120,
    icon: '🔰',
    description: '不朽不破的永恒之盾'
  },
  
  // Tier 7 - 神话级
  {
    id: 'cosmos-shield',
    name: '宇宙堡垒',
    type: 'shield',
    tier: 7,
    price: ethToWei(25000),
    levelRequirement: 30,
    hpBonus: 400,
    attackBonus: 40,
    defenseBonus: 250,
    icon: '🌍',
    description: '包含宇宙力量的终极防御'
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