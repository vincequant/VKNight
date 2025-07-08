import { Stage, Enemy } from '@/types/game';
import { ethToWei } from '@/utils/ethereum';
import { ComprehensiveQuestionGeneratorV2V2 } from '@/lib/comprehensiveQuestionGeneratorV2';

export const stages: Stage[] = [
  // 森林区域 - 基础数学
  {
    id: 'forest-1',
    name: '迷雾森林',
    area: '森林',
    difficulty: 1,
    levelRequirement: 1,
    enemies: [
      { id: 'slime-1', name: '绿色史莱姆', hp: 90, maxHp: 90, attack: 5, defense: 0, sprite: '🟢', ethDrop: ethToWei(0.1), expDrop: 10 },
      { id: 'slime-2', name: '蓝色史莱姆', hp: 120, maxHp: 120, attack: 6, defense: 1, sprite: '🔵', ethDrop: ethToWei(0.15), expDrop: 12 },
      { id: 'goblin-1', name: '小哥布林', hp: 150, maxHp: 150, attack: 8, defense: 2, sprite: '👺', ethDrop: ethToWei(0.2), expDrop: 15 }
    ],
    ethReward: ethToWei(1),
    expReward: 50,
    entranceFee: ethToWei(0),
    description: '基础加减法训练',
    questionTypes: ComprehensiveQuestionGeneratorV2.getStageQuestionLabels('forest-1'),
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
      { id: 'wolf-1', name: '灰狼', hp: 180, maxHp: 180, attack: 10, defense: 3, sprite: '🐺', ethDrop: ethToWei(0.3), expDrop: 20 },
      { id: 'goblin-2', name: '哥布林战士', hp: 200, maxHp: 200, attack: 12, defense: 4, sprite: '👹', ethDrop: ethToWei(0.4), expDrop: 25 },
      { id: 'tree-spirit', name: '树精', hp: 250, maxHp: 250, attack: 15, defense: 5, sprite: '🌳', ethDrop: ethToWei(0.5), expDrop: 30 }
    ],
    ethReward: ethToWei(3),
    expReward: 80,
    entranceFee: ethToWei(5),
    description: '数字规律与简单逻辑',
    questionTypes: ComprehensiveQuestionGeneratorV2.getStageQuestionLabels('forest-2'),
    icon: '🌳',
    order: 2,
    locked: true
  },
  {
    id: 'forest-3',
    name: '精灵圣地',
    area: '森林',
    difficulty: 3,
    levelRequirement: 5,
    enemies: [
      { id: 'elf-archer', name: '精灵弓箭手', hp: 300, maxHp: 300, attack: 18, defense: 8, sprite: '🏹', ethDrop: ethToWei(0.8), expDrop: 40 },
      { id: 'unicorn', name: '独角兽', hp: 350, maxHp: 350, attack: 20, defense: 10, sprite: '🦄', ethDrop: ethToWei(1), expDrop: 50 },
      { id: 'forest-guardian', name: '森林守护者', hp: 400, maxHp: 400, attack: 25, defense: 12, sprite: '🦌', ethDrop: ethToWei(1.5), expDrop: 60 }
    ],
    ethReward: ethToWei(5),
    expReward: 120,
    entranceFee: ethToWei(10),
    description: '应用题与综合运算',
    questionTypes: ComprehensiveQuestionGeneratorV2.getStageQuestionLabels('forest-3'),
    icon: '🧚',
    order: 3,
    locked: true
  },
  
  // 山脉区域 - 进阶运算
  {
    id: 'mountain-1',
    name: '山脚营地',
    area: '山脉',
    difficulty: 3,
    levelRequirement: 7,
    enemies: [
      { id: 'rock-golem', name: '岩石傀儡', hp: 450, maxHp: 450, attack: 30, defense: 15, sprite: '🗿', ethDrop: ethToWei(2), expDrop: 70 },
      { id: 'eagle', name: '山鹰', hp: 400, maxHp: 400, attack: 35, defense: 10, sprite: '🦅', ethDrop: ethToWei(2.5), expDrop: 80 },
      { id: 'mountain-wolf', name: '山地巨狼', hp: 500, maxHp: 500, attack: 32, defense: 18, sprite: '🐺', ethDrop: ethToWei(3), expDrop: 90 }
    ],
    ethReward: ethToWei(10),
    expReward: 200,
    entranceFee: ethToWei(20),
    description: '进位加法与借位减法',
    questionTypes: ComprehensiveQuestionGeneratorV2.getStageQuestionLabels('mountain-1'),
    icon: '⛰️',
    order: 4,
    locked: true
  },
  {
    id: 'mountain-2',
    name: '冰封峡谷',
    area: '山脉',
    difficulty: 4,
    levelRequirement: 9,
    enemies: [
      { id: 'ice-elemental', name: '冰元素', hp: 550, maxHp: 550, attack: 40, defense: 20, sprite: '❄️', ethDrop: ethToWei(4), expDrop: 100 },
      { id: 'yeti', name: '雪人', hp: 650, maxHp: 650, attack: 45, defense: 25, sprite: '☃️', ethDrop: ethToWei(5), expDrop: 120 },
      { id: 'frost-wolf', name: '霜狼', hp: 600, maxHp: 600, attack: 42, defense: 22, sprite: '🐺', ethDrop: ethToWei(6), expDrop: 140 }
    ],
    ethReward: ethToWei(20),
    expReward: 300,
    entranceFee: ethToWei(50),
    description: '乘法入门与图形规律',
    questionTypes: ComprehensiveQuestionGeneratorV2.getStageQuestionLabels('mountain-2'),
    icon: '🏔️',
    order: 5,
    locked: true
  },
  {
    id: 'mountain-3',
    name: '云顶之巅',
    area: '山脉',
    difficulty: 5,
    levelRequirement: 11,
    enemies: [
      { id: 'storm-eagle', name: '风暴之鹰', hp: 700, maxHp: 700, attack: 50, defense: 25, sprite: '🦅', ethDrop: ethToWei(8), expDrop: 160 },
      { id: 'mountain-dragon', name: '山脉幼龙', hp: 800, maxHp: 800, attack: 55, defense: 30, sprite: '🐉', ethDrop: ethToWei(10), expDrop: 180 },
      { id: 'titan', name: '山岭巨人', hp: 900, maxHp: 900, attack: 60, defense: 35, sprite: '👹', ethDrop: ethToWei(12), expDrop: 200 }
    ],
    ethReward: ethToWei(30),
    expReward: 400,
    entranceFee: ethToWei(100),
    description: '混合运算与复杂模式',
    questionTypes: ComprehensiveQuestionGeneratorV2.getStageQuestionLabels('mountain-3'),
    icon: '🏔️',
    order: 6,
    locked: true
  },
  
  // 火山区域 - 乘除专精
  {
    id: 'volcano-1',
    name: '熔岩洞穴',
    area: '火山',
    difficulty: 5,
    levelRequirement: 13,
    enemies: [
      { id: 'lava-slime', name: '熔岩史莱姆', hp: 750, maxHp: 750, attack: 65, defense: 30, sprite: '🔴', ethDrop: ethToWei(15), expDrop: 220 },
      { id: 'fire-imp', name: '火焰小鬼', hp: 800, maxHp: 800, attack: 70, defense: 25, sprite: '👺', ethDrop: ethToWei(18), expDrop: 240 },
      { id: 'magma-golem', name: '岩浆巨人', hp: 1000, maxHp: 1000, attack: 75, defense: 40, sprite: '🗿', ethDrop: ethToWei(20), expDrop: 280 }
    ],
    ethReward: ethToWei(50),
    expReward: 500,
    entranceFee: ethToWei(200),
    description: '乘法进阶与除法入门',
    questionTypes: ComprehensiveQuestionGeneratorV2.getStageQuestionLabels('volcano-1'),
    icon: '🌋',
    order: 7,
    locked: true
  },
  {
    id: 'volcano-2',
    name: '龙之巢穴',
    area: '火山',
    difficulty: 6,
    levelRequirement: 15,
    enemies: [
      { id: 'drake', name: '火龙兽', hp: 1100, maxHp: 1100, attack: 80, defense: 40, sprite: '🦎', ethDrop: ethToWei(25), expDrop: 300 },
      { id: 'phoenix', name: '火凤凰', hp: 1000, maxHp: 1000, attack: 85, defense: 35, sprite: '🦅', ethDrop: ethToWei(30), expDrop: 320 },
      { id: 'lava-wyrm', name: '熔岩巨虫', hp: 1200, maxHp: 1200, attack: 82, defense: 45, sprite: '🐛', ethDrop: ethToWei(35), expDrop: 350 }
    ],
    ethReward: ethToWei(80),
    expReward: 700,
    entranceFee: ethToWei(400),
    description: '分数初步与比例关系',
    questionTypes: ComprehensiveQuestionGeneratorV2.getStageQuestionLabels('volcano-2'),
    icon: '🐲',
    order: 8,
    locked: true
  },
  {
    id: 'volcano-3',
    name: '炎魔祭坛',
    area: '火山',
    difficulty: 7,
    levelRequirement: 17,
    enemies: [
      { id: 'fire-demon', name: '炎魔', hp: 1400, maxHp: 1400, attack: 90, defense: 50, sprite: '👹', ethDrop: ethToWei(40), expDrop: 400 },
      { id: 'inferno-dragon', name: '炼狱之龙', hp: 1600, maxHp: 1600, attack: 95, defense: 55, sprite: '🐲', ethDrop: ethToWei(50), expDrop: 450 },
      { id: 'volcano-lord', name: '火山领主', hp: 1800, maxHp: 1800, attack: 100, defense: 60, sprite: '🔥', ethDrop: ethToWei(60), expDrop: 500 }
    ],
    ethReward: ethToWei(120),
    expReward: 900,
    entranceFee: ethToWei(800),
    description: '高级乘除与应用题',
    questionTypes: ComprehensiveQuestionGeneratorV2.getStageQuestionLabels('volcano-3'),
    icon: '🔥',
    order: 9,
    locked: true
  },
  
  // 地下城区域 - 综合应用
  {
    id: 'dungeon-1',
    name: '遗忘地牢',
    area: '地下城',
    difficulty: 7,
    levelRequirement: 19,
    enemies: [
      { id: 'skeleton-warrior', name: '骷髅战士', hp: 1500, maxHp: 1500, attack: 105, defense: 55, sprite: '💀', ethDrop: ethToWei(70), expDrop: 550 },
      { id: 'ghost', name: '幽灵', hp: 1300, maxHp: 1300, attack: 110, defense: 45, sprite: '👻', ethDrop: ethToWei(80), expDrop: 580 },
      { id: 'mummy', name: '木乃伊', hp: 1700, maxHp: 1700, attack: 108, defense: 65, sprite: '🧟', ethDrop: ethToWei(90), expDrop: 600 }
    ],
    ethReward: ethToWei(150),
    expReward: 1000,
    entranceFee: ethToWei(1000),
    description: '生活数学与金钱时间',
    questionTypes: ComprehensiveQuestionGeneratorV2.getStageQuestionLabels('dungeon-1'),
    icon: '🏰',
    order: 10,
    locked: true
  },
  {
    id: 'dungeon-2',
    name: '暗黑迷宫',
    area: '地下城',
    difficulty: 8,
    levelRequirement: 21,
    enemies: [
      { id: 'minotaur', name: '牛头怪', hp: 1900, maxHp: 1900, attack: 115, defense: 70, sprite: '🐂', ethDrop: ethToWei(100), expDrop: 700 },
      { id: 'medusa', name: '美杜莎', hp: 1700, maxHp: 1700, attack: 120, defense: 60, sprite: '🐍', ethDrop: ethToWei(110), expDrop: 750 },
      { id: 'cerberus', name: '地狱犬', hp: 2100, maxHp: 2100, attack: 118, defense: 75, sprite: '🐕', ethDrop: ethToWei(120), expDrop: 800 }
    ],
    ethReward: ethToWei(200),
    expReward: 1200,
    entranceFee: ethToWei(1500),
    description: '逻辑谜题与策略思维',
    questionTypes: ComprehensiveQuestionGeneratorV2.getStageQuestionLabels('dungeon-2'),
    icon: '🗝️',
    order: 11,
    locked: true
  },
  {
    id: 'dungeon-3',
    name: '死亡深渊',
    area: '地下城',
    difficulty: 9,
    levelRequirement: 23,
    enemies: [
      { id: 'lich', name: '巫妖', hp: 2200, maxHp: 2200, attack: 125, defense: 80, sprite: '🧙‍♂️', ethDrop: ethToWei(140), expDrop: 900 },
      { id: 'death-knight', name: '死亡骑士', hp: 2400, maxHp: 2400, attack: 130, defense: 85, sprite: '⚔️', ethDrop: ethToWei(160), expDrop: 950 },
      { id: 'necromancer', name: '死灵法师', hp: 2000, maxHp: 2000, attack: 135, defense: 70, sprite: '💀', ethDrop: ethToWei(180), expDrop: 1000 }
    ],
    ethReward: ethToWei(300),
    expReward: 1500,
    entranceFee: ethToWei(2000),
    description: '函数思维与组合排列',
    questionTypes: ComprehensiveQuestionGeneratorV2.getStageQuestionLabels('dungeon-3'),
    icon: '☠️',
    order: 12,
    locked: true
  },
  
  // 魔界区域 - 高级挑战
  {
    id: 'demon-1',
    name: '炼狱之门',
    area: '魔界',
    difficulty: 9,
    levelRequirement: 25,
    enemies: [
      { id: 'imp-lord', name: '小恶魔领主', hp: 2300, maxHp: 2300, attack: 140, defense: 85, sprite: '👺', ethDrop: ethToWei(200), expDrop: 1100 },
      { id: 'succubus', name: '魅魔', hp: 2100, maxHp: 2100, attack: 145, defense: 75, sprite: '😈', ethDrop: ethToWei(220), expDrop: 1150 },
      { id: 'hellhound', name: '地狱猎犬', hp: 2500, maxHp: 2500, attack: 142, defense: 90, sprite: '🐺', ethDrop: ethToWei(240), expDrop: 1200 }
    ],
    ethReward: ethToWei(400),
    expReward: 1800,
    entranceFee: ethToWei(3000),
    description: '代数思维与方程初步',
    questionTypes: ComprehensiveQuestionGeneratorV2.getStageQuestionLabels('demon-1'),
    icon: '🔥',
    order: 13,
    locked: true
  },
  {
    id: 'demon-2',
    name: '堕落圣殿',
    area: '魔界',
    difficulty: 10,
    levelRequirement: 27,
    enemies: [
      { id: 'fallen-angel', name: '堕落天使', hp: 2700, maxHp: 2700, attack: 150, defense: 95, sprite: '👼', ethDrop: ethToWei(280), expDrop: 1300 },
      { id: 'demon-general', name: '恶魔将军', hp: 2900, maxHp: 2900, attack: 155, defense: 100, sprite: '👹', ethDrop: ethToWei(320), expDrop: 1400 },
      { id: 'shadow-lord', name: '暗影领主', hp: 3100, maxHp: 3100, attack: 152, defense: 105, sprite: '🌑', ethDrop: ethToWei(360), expDrop: 1500 }
    ],
    ethReward: ethToWei(600),
    expReward: 2200,
    entranceFee: ethToWei(5000),
    description: '高级模式与抽象思维',
    questionTypes: ComprehensiveQuestionGeneratorV2.getStageQuestionLabels('demon-2'),
    icon: '⛪',
    order: 14,
    locked: true
  },
  {
    id: 'demon-3',
    name: '魔王殿堂',
    area: '魔界',
    difficulty: 10,
    levelRequirement: 30,
    enemies: [
      { id: 'demon-lord', name: '魔王', hp: 5000, maxHp: 5000, attack: 200, defense: 150, sprite: '👿', ethDrop: ethToWei(1000), expDrop: 3000 }
    ],
    ethReward: ethToWei(1000),
    expReward: 5000,
    entranceFee: ethToWei(10000),
    description: '终极挑战综合测试',
    questionTypes: ComprehensiveQuestionGeneratorV2.getStageQuestionLabels('demon-3'),
    icon: '👿',
    order: 15,
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