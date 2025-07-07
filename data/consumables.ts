import { ethToWei } from '@/utils/ethereum';

export interface Consumable {
  id: string;
  name: string;
  type: 'consumable';
  category: 'potion' | 'elixir' | 'food';
  price: bigint;
  effect: {
    hp?: number;
    mp?: number;
    percentage?: boolean; // true if effect is percentage based
  };
  stackSize: number; // max stack size
  icon: string;
  description: string;
}

export const consumables: Consumable[] = [
  // Basic Potions
  {
    id: 'small-health-potion',
    name: '小型生命药水',
    type: 'consumable',
    category: 'potion',
    price: ethToWei(0.5),
    effect: {
      hp: 50
    },
    stackSize: 99,
    icon: '🧪',
    description: '恢复50点生命值'
  },
  {
    id: 'medium-health-potion',
    name: '中型生命药水',
    type: 'consumable',
    category: 'potion',
    price: ethToWei(2),
    effect: {
      hp: 150
    },
    stackSize: 99,
    icon: '⚗️',
    description: '恢复150点生命值'
  },
  {
    id: 'large-health-potion',
    name: '大型生命药水',
    type: 'consumable',
    category: 'potion',
    price: ethToWei(5),
    effect: {
      hp: 300
    },
    stackSize: 99,
    icon: '🍶',
    description: '恢复300点生命值'
  },
  {
    id: 'super-health-potion',
    name: '超级生命药水',
    type: 'consumable',
    category: 'potion',
    price: ethToWei(15),
    effect: {
      hp: 50,
      percentage: true
    },
    stackSize: 99,
    icon: '💉',
    description: '恢复50%生命值'
  },
  {
    id: 'full-health-potion',
    name: '完全恢复药水',
    type: 'consumable',
    category: 'potion',
    price: ethToWei(50),
    effect: {
      hp: 100,
      percentage: true
    },
    stackSize: 20,
    icon: '💊',
    description: '完全恢复生命值'
  },
  
  // MP Potions
  {
    id: 'small-mana-potion',
    name: '小型魔力药水',
    type: 'consumable',
    category: 'potion',
    price: ethToWei(1),
    effect: {
      mp: 30
    },
    stackSize: 99,
    icon: '🔵',
    description: '恢复30点魔力值'
  },
  {
    id: 'medium-mana-potion',
    name: '中型魔力药水',
    type: 'consumable',
    category: 'potion',
    price: ethToWei(3),
    effect: {
      mp: 80
    },
    stackSize: 99,
    icon: '💧',
    description: '恢复80点魔力值'
  },
  
  // Mixed Potions
  {
    id: 'rejuvenation-potion',
    name: '恢复药剂',
    type: 'consumable',
    category: 'elixir',
    price: ethToWei(8),
    effect: {
      hp: 100,
      mp: 50
    },
    stackSize: 50,
    icon: '🏺',
    description: '恢复100点生命值和50点魔力值'
  },
  {
    id: 'elixir-of-life',
    name: '生命灵药',
    type: 'consumable',
    category: 'elixir',
    price: ethToWei(100),
    effect: {
      hp: 80,
      mp: 80,
      percentage: true
    },
    stackSize: 10,
    icon: '🏆',
    description: '恢复80%生命值和魔力值'
  }
];

export const getConsumableById = (id: string): Consumable | undefined => {
  return consumables.find(item => item.id === id);
};