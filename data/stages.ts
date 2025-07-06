import { Stage, Enemy } from '@/types/game';
import { ethToWei } from '@/utils/ethereum';

export const stages: Stage[] = [
  // 森林区域
  {
    id: 'forest-1',
    name: '迷雾森林入口',
    area: '森林',
    difficulty: 1,
    levelRequirement: 1,
    enemies: [
      { id: 'slime-1', name: '绿色史莱姆', hp: 30, maxHp: 30, attack: 5, defense: 0, sprite: '🟢', ethDrop: ethToWei(0.1), expDrop: 10 },
      { id: 'slime-2', name: '蓝色史莱姆', hp: 40, maxHp: 40, attack: 6, defense: 1, sprite: '🔵', ethDrop: ethToWei(0.15), expDrop: 12 },
      { id: 'goblin-1', name: '小哥布林', hp: 50, maxHp: 50, attack: 8, defense: 2, sprite: '👺', ethDrop: ethToWei(0.2), expDrop: 15 }
    ],
    ethReward: ethToWei(1),
    expReward: 50,
    description: '森林的入口，适合新手冒险者',
    icon: '🌲',
    order: 1,
    locked: false
  },
  {
    id: 'forest-2',
    name: '古树小径',
    area: '森林',
    difficulty: 2,
    levelRequirement: 3,
    enemies: [
      { id: 'wolf-1', name: '灰狼', hp: 70, maxHp: 70, attack: 12, defense: 3, sprite: '🐺', ethDrop: ethToWei(0.3), expDrop: 20 },
      { id: 'goblin-2', name: '哥布林战士', hp: 80, maxHp: 80, attack: 15, defense: 5, sprite: '👹', ethDrop: ethToWei(0.4), expDrop: 25 },
      { id: 'tree-spirit', name: '树精', hp: 100, maxHp: 100, attack: 18, defense: 8, sprite: '🌳', ethDrop: ethToWei(0.5), expDrop: 30 }
    ],
    ethReward: ethToWei(3),
    expReward: 80,
    description: '古老的森林深处，危机四伏',
    icon: '🌳',
    order: 2,
    locked: true
  },
  {
    id: 'forest-3',
    name: '暗影树林',
    area: '森林',
    difficulty: 3,
    levelRequirement: 5,
    enemies: [
      { id: 'shadow-wolf', name: '暗影狼', hp: 120, maxHp: 120, attack: 20, defense: 10, sprite: '🐺', ethDrop: ethToWei(0.8), expDrop: 35 },
      { id: 'dark-fairy', name: '黑暗妖精', hp: 100, maxHp: 100, attack: 25, defense: 5, sprite: '🧚‍♀️', ethDrop: ethToWei(1), expDrop: 40 },
      { id: 'forest-guardian', name: '森林守护者', hp: 180, maxHp: 180, attack: 30, defense: 15, sprite: '🦌', ethDrop: ethToWei(1.5), expDrop: 70 }
    ],
    ethReward: ethToWei(5),
    expReward: 150,
    description: '被黑暗笼罩的神秘森林',
    icon: '🌑',
    order: 3,
    locked: true
  },
  
  // 山脉区域
  {
    id: 'mountain-1',
    name: '山脚小路',
    area: '山脉',
    difficulty: 4,
    levelRequirement: 8,
    enemies: [
      { id: 'rock-golem', name: '岩石傀儡', hp: 150, maxHp: 150, attack: 25, defense: 20, sprite: '🗿', ethDrop: ethToWei(2), expDrop: 45 },
      { id: 'eagle', name: '山鹰', hp: 120, maxHp: 120, attack: 35, defense: 10, sprite: '🦅', ethDrop: ethToWei(2.5), expDrop: 50 },
      { id: 'mountain-troll', name: '山地巨魔', hp: 200, maxHp: 200, attack: 40, defense: 25, sprite: '👹', ethDrop: ethToWei(3), expDrop: 90 }
    ],
    ethReward: ethToWei(10),
    expReward: 250,
    description: '通往山顶的第一步',
    icon: '⛰️',
    order: 4,
    locked: true
  },
  {
    id: 'mountain-2',
    name: '冰封峡谷',
    area: '山脉',
    difficulty: 5,
    levelRequirement: 10,
    enemies: [
      { id: 'ice-elemental', name: '冰元素', hp: 180, maxHp: 180, attack: 45, defense: 30, sprite: '❄️', ethDrop: ethToWei(4), expDrop: 70 },
      { id: 'yeti', name: '雪人', hp: 250, maxHp: 250, attack: 50, defense: 35, sprite: '☃️', ethDrop: ethToWei(5), expDrop: 100 },
      { id: 'frost-dragon', name: '冰霜幼龙', hp: 300, maxHp: 300, attack: 60, defense: 40, sprite: '🐉', ethDrop: ethToWei(8), expDrop: 180 }
    ],
    ethReward: ethToWei(20),
    expReward: 400,
    description: '被永恒冰雪覆盖的险峻峡谷',
    icon: '🏔️',
    order: 5,
    locked: true
  },
  
  // 火山区域
  {
    id: 'volcano-1',
    name: '熔岩洞穴',
    area: '火山',
    difficulty: 6,
    levelRequirement: 13,
    enemies: [
      { id: 'lava-slime', name: '熔岩史莱姆', hp: 200, maxHp: 200, attack: 55, defense: 25, sprite: '🔴', ethDrop: ethToWei(10), expDrop: 90 },
      { id: 'fire-imp', name: '火焰小鬼', hp: 180, maxHp: 180, attack: 65, defense: 20, sprite: '👺', ethDrop: ethToWei(12), expDrop: 95 },
      { id: 'magma-golem', name: '岩浆巨人', hp: 350, maxHp: 350, attack: 70, defense: 50, sprite: '🗿', ethDrop: ethToWei(15), expDrop: 220 }
    ],
    ethReward: ethToWei(50),
    expReward: 600,
    description: '炽热的地下熔岩世界',
    icon: '🌋',
    order: 6,
    locked: true
  },
  {
    id: 'volcano-2',
    name: '龙之巢穴',
    area: '火山',
    difficulty: 8,
    levelRequirement: 15,
    enemies: [
      { id: 'drake', name: '火龙兽', hp: 300, maxHp: 300, attack: 80, defense: 40, sprite: '🦎', ethDrop: ethToWei(20), expDrop: 130 },
      { id: 'phoenix', name: '火凤凰', hp: 280, maxHp: 280, attack: 90, defense: 30, sprite: '🦅', ethDrop: ethToWei(25), expDrop: 160 },
      { id: 'fire-dragon', name: '炎龙', hp: 500, maxHp: 500, attack: 100, defense: 60, sprite: '🐲', ethDrop: ethToWei(30), expDrop: 450 }
    ],
    ethReward: ethToWei(100),
    expReward: 900,
    description: '传说中巨龙栖息的终极挑战',
    icon: '🐲',
    order: 7,
    locked: true
  },
  
  // 地下城区域
  {
    id: 'dungeon-1',
    name: '遗忘地牢',
    area: '地下城',
    difficulty: 9,
    levelRequirement: 18,
    enemies: [
      { id: 'skeleton-warrior', name: '骷髅战士', hp: 250, maxHp: 250, attack: 85, defense: 45, sprite: '💀', ethDrop: ethToWei(40), expDrop: 110 },
      { id: 'lich', name: '巫妖', hp: 350, maxHp: 350, attack: 100, defense: 35, sprite: '🧙‍♂️', ethDrop: ethToWei(50), expDrop: 180 },
      { id: 'death-knight', name: '死亡骑士', hp: 450, maxHp: 450, attack: 110, defense: 70, sprite: '⚔️', ethDrop: ethToWei(80), expDrop: 320 }
    ],
    ethReward: ethToWei(200),
    expReward: 1200,
    description: '充满亡灵的恐怖地下城',
    icon: '🏰',
    order: 8,
    locked: true
  },
  
  // 最终区域
  {
    id: 'final-boss',
    name: '魔王城堡',
    area: '魔界',
    difficulty: 10,
    levelRequirement: 20,
    enemies: [
      { id: 'demon-guard', name: '恶魔守卫', hp: 400, maxHp: 400, attack: 120, defense: 80, sprite: '👹', ethDrop: ethToWei(100), expDrop: 280 },
      { id: 'shadow-dragon', name: '暗影巨龙', hp: 600, maxHp: 600, attack: 140, defense: 90, sprite: '🐉', ethDrop: ethToWei(150), expDrop: 450 },
      { id: 'demon-lord', name: '魔王', hp: 1000, maxHp: 1000, attack: 180, defense: 100, sprite: '👿', ethDrop: ethToWei(500), expDrop: 1800 }
    ],
    ethReward: ethToWei(1000),
    expReward: 4000,
    description: '最终决战！挑战强大的魔王',
    icon: '👿',
    order: 9,
    locked: true
  }
];

export const getStageById = (id: string): Stage | undefined => {
  return stages.find(stage => stage.id === id);
};

export const getUnlockedStages = (level: number, clearedStageIds: string[]): Stage[] => {
  return stages.map(stage => ({
    ...stage,
    locked: stage.levelRequirement > level && !clearedStageIds.includes(stage.id)
  }));
};

export const getStagesByArea = (area: string): Stage[] => {
  return stages.filter(stage => stage.area === area);
};