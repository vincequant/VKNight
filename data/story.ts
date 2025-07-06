export interface StorySegment {
  id: string;
  character: 'josh' | 'abby' | 'both';
  trigger: 'game-start' | 'first-victory' | 'level-up' | 'boss-defeat' | 'area-unlock' | 'equipment-purchase';
  title: string;
  dialogue: string[];
  rewards?: {
    gold?: number;
    exp?: number;
    item?: string;
  };
}

export const GAME_STORY = {
  prologue: {
    title: "数学王国的危机",
    intro: [
      "在遥远的数学王国，邪恶的混沌巫师打破了数字的秩序...",
      "怪物们失去了理智，开始到处破坏！",
      "只有掌握数学之力的勇士才能拯救这个世界！"
    ]
  },
  
  characters: {
    josh: {
      title: "数学骑士Josh",
      description: "勇敢的男孩，擅长各种数学运算",
      motto: "用智慧之剑斩破黑暗！",
      specialPower: "可以解锁高级运算（乘除法）"
    },
    abby: {
      title: "魔法射手Abby", 
      description: "聪明的女孩，专注于基础运算的精准掌握",
      motto: "每一箭都蕴含着数学的力量！",
      specialPower: "基础运算获得额外金币奖励"
    }
  },
  
  areas: {
    forest: {
      name: "迷雾森林",
      story: "森林中的史莱姆被混沌污染，只有正确的计算才能净化它们！",
      boss: "史莱姆王会不断分裂，快速计算才能阻止它！"
    },
    cave: {
      name: "水晶洞穴",
      story: "蝙蝠们在黑暗中迷失了方向，用数学之光指引它们！",
      boss: "巨型蝙蝠会召唤小蝙蝠群，需要连续答对题目才能击败它！"
    },
    ruins: {
      name: "古代遗迹",
      story: "远古的石像被唤醒了，解开数学谜题让它们重新沉睡！",
      boss: "石像守卫会逐渐加速攻击，考验你的计算速度！"
    },
    volcano: {
      name: "熔岩火山",
      story: "火龙在愤怒地咆哮，只有冷静的计算才能平息它的怒火！",
      boss: "火龙会喷出数字火球，需要快速判断和计算！"
    },
    castle: {
      name: "混沌城堡",
      story: "终于来到混沌巫师的老巢，最终决战即将开始！",
      boss: "混沌巫师会使用各种数学魔法，综合运用所有知识才能获胜！"
    }
  }
};

export const STORY_SEGMENTS: StorySegment[] = [
  {
    id: "game-start-josh",
    character: "josh",
    trigger: "game-start",
    title: "骑士的誓言",
    dialogue: [
      "Josh: 我要用数学的力量守护王国！",
      "国王: 年轻的骑士，这把智慧之剑就交给你了。",
      "Josh: 我会证明自己的！混沌巫师，等着瞧吧！"
    ],
    rewards: { gold: 50 }
  },
  
  {
    id: "game-start-abby",
    character: "abby",
    trigger: "game-start",
    title: "射手的决心",
    dialogue: [
      "Abby: 每一次计算都要像射箭一样精准！",
      "精灵长老: 这把魔法弓会回应你的数学之力。",
      "Abby: 我不会让任何一道题逃过我的箭！"
    ],
    rewards: { gold: 50 }
  },
  
  {
    id: "first-victory",
    character: "both",
    trigger: "first-victory",
    title: "初战告捷",
    dialogue: [
      "太棒了！你击败了第一个敌人！",
      "看来数学的力量正在你体内觉醒...",
      "继续加油，更强大的敌人在前方等着你！"
    ],
    rewards: { exp: 20 }
  },
  
  {
    id: "level-up-5",
    character: "both",
    trigger: "level-up",
    title: "力量觉醒",
    dialogue: [
      "你感到一股暖流涌遍全身...",
      "等级提升了！你变得更强大了！",
      "商店里有新的装备在等着你哦！"
    ],
    rewards: { gold: 100 }
  }
];

// 成就系统 - 让孩子有收集欲望
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: {
    type: 'streak' | 'total-correct' | 'enemies-defeated' | 'gold-earned' | 'level-reached';
    value: number;
  };
  reward: {
    title?: string;
    gold?: number;
    exp?: number;
  };
  secret?: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-blood",
    name: "初出茅庐",
    description: "击败你的第一个敌人",
    icon: "⚔️",
    condition: { type: "enemies-defeated", value: 1 },
    reward: { gold: 50, title: "新手冒险者" }
  },
  {
    id: "streak-5",
    name: "连续正确",
    description: "连续答对5道题",
    icon: "🔥",
    condition: { type: "streak", value: 5 },
    reward: { gold: 100, exp: 50 }
  },
  {
    id: "streak-10",
    name: "计算大师",
    description: "连续答对10道题",
    icon: "⚡",
    condition: { type: "streak", value: 10 },
    reward: { gold: 200, exp: 100, title: "计算大师" }
  },
  {
    id: "gold-collector-100",
    name: "小富翁",
    description: "累计获得100金币",
    icon: "💰",
    condition: { type: "gold-earned", value: 100 },
    reward: { exp: 50 }
  },
  {
    id: "level-10",
    name: "数学勇士",
    description: "达到10级",
    icon: "🏆",
    condition: { type: "level-reached", value: 10 },
    reward: { gold: 500, title: "数学勇士" }
  },
  {
    id: "secret-perfect-run",
    name: "完美通关",
    description: "一次战斗中不受任何伤害",
    icon: "✨",
    condition: { type: "streak", value: 999 }, // 特殊条件
    reward: { gold: 300, title: "无伤大师" },
    secret: true
  }
];

// 每日任务 - 让孩子每天都想玩
export interface DailyQuest {
  id: string;
  name: string;
  description: string;
  requirement: {
    type: 'play-games' | 'correct-answers' | 'defeat-enemies' | 'earn-gold';
    value: number;
  };
  reward: {
    gold: number;
    exp: number;
  };
  refreshTime: number; // 24小时
}

export const DAILY_QUESTS: DailyQuest[] = [
  {
    id: "daily-play",
    name: "每日练习",
    description: "今天玩3场游戏",
    requirement: { type: "play-games", value: 3 },
    reward: { gold: 50, exp: 30 },
    refreshTime: 24 * 60 * 60 * 1000
  },
  {
    id: "daily-correct",
    name: "准确射手",
    description: "答对20道题",
    requirement: { type: "correct-answers", value: 20 },
    reward: { gold: 100, exp: 50 },
    refreshTime: 24 * 60 * 60 * 1000
  },
  {
    id: "daily-enemies",
    name: "怪物猎人",
    description: "击败10个敌人",
    requirement: { type: "defeat-enemies", value: 10 },
    reward: { gold: 150, exp: 75 },
    refreshTime: 24 * 60 * 60 * 1000
  }
];

// 连续登录奖励
export const LOGIN_REWARDS = [
  { day: 1, gold: 50, exp: 20 },
  { day: 2, gold: 75, exp: 30 },
  { day: 3, gold: 100, exp: 40 },
  { day: 4, gold: 125, exp: 50 },
  { day: 5, gold: 150, exp: 60 },
  { day: 6, gold: 175, exp: 70 },
  { day: 7, gold: 300, exp: 150, special: "获得特殊称号：坚持不懈！" }
];

// 隐藏彩蛋 - 增加探索乐趣
export const EASTER_EGGS = [
  {
    id: "math-genius",
    trigger: "连续答对20道乘法题",
    reward: "解锁隐藏角色皮肤：数学天才"
  },
  {
    id: "speed-demon",
    trigger: "3秒内答对一道题",
    reward: "获得称号：闪电计算"
  },
  {
    id: "perfectionist",
    trigger: "一天内准确率达到100%",
    reward: "获得特殊装备：完美主义者之冠"
  }
];