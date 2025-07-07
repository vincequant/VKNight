import { ethToWei } from '@/utils/ethereum';

export interface Consumable {
  id: string;
  name: string;
  type: 'consumable';
  category: 'potion' | 'elixir' | 'food';
  price: bigint;
  effect: {
    hp?: number;
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
  }
];

export const getConsumableById = (id: string): Consumable | undefined => {
  return consumables.find(item => item.id === id);
};