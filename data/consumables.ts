import { Consumable } from '@/types/game';
import { ethToWei } from '@/utils/ethereum';

export const consumables: Consumable[] = [
  // 红药水系列
  {
    id: 'potion-hp-small',
    name: '小型生命药水',
    type: 'potion',
    effect: 'heal',
    value: 30,
    price: ethToWei(0.5),
    icon: '🧪',
    description: '恢复 30 点生命值'
  },
  {
    id: 'potion-hp-medium',
    name: '中型生命药水',
    type: 'potion',
    effect: 'heal',
    value: 60,
    price: ethToWei(1),
    icon: '🧪',
    description: '恢复 60 点生命值'
  },
  {
    id: 'potion-hp-large',
    name: '大型生命药水',
    type: 'potion',
    effect: 'heal',
    value: 120,
    price: ethToWei(2),
    icon: '🧪',
    description: '恢复 120 点生命值'
  },
  {
    id: 'potion-hp-max',
    name: '完全恢复药水',
    type: 'potion',
    effect: 'heal',
    value: 999999, // 完全恢复
    price: ethToWei(5),
    icon: '💝',
    description: '完全恢复生命值'
  },
  
  // 蓝药水系列
  {
    id: 'potion-mp-small',
    name: '小型魔法药水',
    type: 'potion',
    effect: 'mana',
    value: 20,
    price: ethToWei(0.3),
    icon: '💧',
    description: '恢复 20 点魔法值'
  },
  {
    id: 'potion-mp-medium',
    name: '中型魔法药水',
    type: 'potion',
    effect: 'mana',
    value: 40,
    price: ethToWei(0.6),
    icon: '💧',
    description: '恢复 40 点魔法值'
  },
  {
    id: 'potion-mp-large',
    name: '大型魔法药水',
    type: 'potion',
    effect: 'mana',
    value: 80,
    price: ethToWei(1.2),
    icon: '💧',
    description: '恢复 80 点魔法值'
  },
  {
    id: 'potion-mp-max',
    name: '魔力源泉',
    type: 'potion',
    effect: 'mana',
    value: 999999, // 完全恢复
    price: ethToWei(3),
    icon: '🌊',
    description: '完全恢复魔法值'
  }
];

// 根据ID获取消耗品
export const getConsumableById = (id: string): Consumable | undefined => {
  return consumables.find(item => item.id === id);
};

// 获取生命药水
export const getHealthPotions = (): Consumable[] => {
  return consumables.filter(item => item.effect === 'heal');
};

// 获取魔法药水
export const getManaPotions = (): Consumable[] => {
  return consumables.filter(item => item.effect === 'mana');
};