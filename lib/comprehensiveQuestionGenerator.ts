import { Question, Difficulty, QuestionType } from '@/types';
import { QuestionGenerator } from './questionGenerator';
import { PatternGenerator } from './questionGenerators/patternGenerator';
import { ComparisonGenerator } from './questionGenerators/comparisonGenerator';
import { LogicGenerator } from './questionGenerators/logicGenerator';

// 关卡配置
interface StageQuestionConfig {
  type: QuestionType;
  weight: number;
  config?: any;
}

interface StageConfig {
  questionTypes: StageQuestionConfig[];
}

// 关卡难度配置
const STAGE_CONFIGS: Record<string, StageConfig> = {
  // 森林区域 - 基础数学启蒙
  'forest-1': {
    questionTypes: [
      { type: 'addition', weight: 40 },
      { type: 'comparison', weight: 30 },
      { type: 'pattern', weight: 30 }
    ]
  },
  'forest-2': {
    questionTypes: [
      { type: 'addition', weight: 25 },
      { type: 'subtraction', weight: 25 },
      { type: 'comparison', weight: 25 },
      { type: 'pattern', weight: 25 }
    ]
  },
  'forest-3': {
    questionTypes: [
      { type: 'addition', weight: 20 },
      { type: 'subtraction', weight: 20 },
      { type: 'sequence', weight: 20 },
      { type: 'comparison', weight: 20 },
      { type: 'logic', weight: 20 }
    ]
  },
  'forest-4': {
    questionTypes: [
      { type: 'addition', weight: 20 },
      { type: 'subtraction', weight: 20 },
      { type: 'word-problem', weight: 30 },
      { type: 'pattern', weight: 30 }
    ]
  },
  'forest-5': {
    questionTypes: [
      { type: 'addition', weight: 15 },
      { type: 'subtraction', weight: 15 },
      { type: 'comparison', weight: 20 },
      { type: 'pattern', weight: 25 },
      { type: 'logic', weight: 25 }
    ]
  },
  
  // 山脉区域 - 运算进阶
  'mountain-1': {
    questionTypes: [
      { type: 'addition', weight: 60, config: { carryOver: true } },
      { type: 'sequence', weight: 20 },
      { type: 'pattern', weight: 20 }
    ]
  },
  'mountain-2': {
    questionTypes: [
      { type: 'subtraction', weight: 60, config: { borrowing: true } },
      { type: 'sequence', weight: 20 },
      { type: 'comparison', weight: 20 }
    ]
  },
  'mountain-3': {
    questionTypes: [
      { type: 'multiplication', weight: 50 },
      { type: 'word-problem', weight: 25 },
      { type: 'pattern', weight: 25 }
    ]
  },
  'mountain-4': {
    questionTypes: [
      { type: 'addition', weight: 20 },
      { type: 'subtraction', weight: 20 },
      { type: 'multiplication', weight: 30 },
      { type: 'logic', weight: 30 }
    ]
  },
  'mountain-5': {
    questionTypes: [
      { type: 'logic', weight: 40 },
      { type: 'pattern', weight: 30 },
      { type: 'comparison', weight: 30 }
    ]
  },
  
  // 火山区域 - 乘除专精
  'volcano-1': {
    questionTypes: [
      { type: 'multiplication', weight: 60 },
      { type: 'word-problem', weight: 40 }
    ]
  },
  'volcano-2': {
    questionTypes: [
      { type: 'multiplication', weight: 30 },
      { type: 'division', weight: 40 },
      { type: 'pattern', weight: 30 }
    ]
  },
  'volcano-3': {
    questionTypes: [
      { type: 'division', weight: 50 },
      { type: 'multiplication', weight: 25 },
      { type: 'logic', weight: 25 }
    ]
  },
  'volcano-4': {
    questionTypes: [
      { type: 'multiplication', weight: 25 },
      { type: 'division', weight: 25 },
      { type: 'word-problem', weight: 25 },
      { type: 'pattern', weight: 25 }
    ]
  },
  'volcano-5': {
    questionTypes: [
      { type: 'multiplication', weight: 20 },
      { type: 'division', weight: 20 },
      { type: 'logic', weight: 30 },
      { type: 'pattern', weight: 30 }
    ]
  },
  
  // 地下城区域 - 综合应用
  'dungeon-1': {
    questionTypes: [
      { type: 'addition', weight: 15 },
      { type: 'subtraction', weight: 15 },
      { type: 'multiplication', weight: 15 },
      { type: 'division', weight: 15 },
      { type: 'word-problem', weight: 20 },
      { type: 'logic', weight: 20 }
    ]
  },
  'dungeon-2': {
    questionTypes: [
      { type: 'multiplication', weight: 20 },
      { type: 'division', weight: 20 },
      { type: 'pattern', weight: 20 },
      { type: 'logic', weight: 20 },
      { type: 'word-problem', weight: 20 }
    ]
  },
  'dungeon-3': {
    questionTypes: [
      { type: 'logic', weight: 35 },
      { type: 'pattern', weight: 35 },
      { type: 'word-problem', weight: 30 }
    ]
  },
  'dungeon-4': {
    questionTypes: [
      { type: 'pattern', weight: 25 },
      { type: 'logic', weight: 25 },
      { type: 'multiplication', weight: 25 },
      { type: 'division', weight: 25 }
    ]
  },
  'dungeon-5': {
    questionTypes: [
      { type: 'logic', weight: 30 },
      { type: 'pattern', weight: 30 },
      { type: 'word-problem', weight: 40 }
    ]
  },
  
  // 魔界区域 - 高级挑战
  'demon-1': {
    questionTypes: [
      { type: 'addition', weight: 20, config: { expert: true } },
      { type: 'subtraction', weight: 20, config: { expert: true } },
      { type: 'multiplication', weight: 30 },
      { type: 'logic', weight: 30 }
    ]
  },
  'demon-2': {
    questionTypes: [
      { type: 'multiplication', weight: 25 },
      { type: 'division', weight: 25 },
      { type: 'pattern', weight: 25 },
      { type: 'logic', weight: 25 }
    ]
  },
  'demon-3': {
    questionTypes: [
      { type: 'logic', weight: 40 },
      { type: 'pattern', weight: 30 },
      { type: 'word-problem', weight: 30 }
    ]
  },
  'demon-4': {
    questionTypes: [
      { type: 'pattern', weight: 35 },
      { type: 'logic', weight: 35 },
      { type: 'multiplication', weight: 15 },
      { type: 'division', weight: 15 }
    ]
  },
  'demon-5': {
    questionTypes: [
      { type: 'logic', weight: 50 },
      { type: 'pattern', weight: 30 },
      { type: 'word-problem', weight: 20 }
    ]
  },
  
  // 最终Boss
  'final-boss': {
    questionTypes: [
      { type: 'logic', weight: 30 },
      { type: 'pattern', weight: 20 },
      { type: 'multiplication', weight: 15 },
      { type: 'division', weight: 15 },
      { type: 'word-problem', weight: 20 }
    ]
  }
};

export class ComprehensiveQuestionGenerator {
  // 根据关卡和难度生成题目
  static generateQuestion(stageId: string, characterType: 'josh' | 'abby', baseDifficulty: Difficulty): Question {
    const config = STAGE_CONFIGS[stageId];
    if (!config) {
      // 如果没有配置，使用默认的四则运算
      return this.generateDefaultQuestion(baseDifficulty);
    }
    
    // 选择题目类型（根据权重）
    const questionType = this.selectQuestionType(config.questionTypes);
    
    // 根据角色调整难度
    let actualDifficulty = baseDifficulty;
    if (characterType === 'abby' && baseDifficulty !== 'EASY') {
      const difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
      const currentIndex = difficulties.indexOf(baseDifficulty);
      actualDifficulty = difficulties[Math.max(0, currentIndex - 1)];
    }
    
    // 根据关卡进一步调整难度
    actualDifficulty = this.adjustDifficultyByStage(stageId, actualDifficulty);
    
    // 生成题目
    return this.generateQuestionByType(questionType.type, actualDifficulty, questionType.config);
  }
  
  // 根据权重选择题目类型
  private static selectQuestionType(types: StageQuestionConfig[]): StageQuestionConfig {
    const totalWeight = types.reduce((sum, t) => sum + t.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const type of types) {
      random -= type.weight;
      if (random <= 0) {
        return type;
      }
    }
    
    return types[0]; // 默认返回第一个
  }
  
  // 根据关卡调整难度
  private static adjustDifficultyByStage(stageId: string, difficulty: Difficulty): Difficulty {
    const stageNumber = parseInt(stageId.split('-')[1] || '1');
    const area = stageId.split('-')[0];
    
    // 根据区域和关卡号调整
    if (area === 'forest' && stageNumber <= 2) {
      return 'EASY';
    } else if (area === 'forest') {
      return difficulty === 'EXPERT' ? 'MEDIUM' : difficulty;
    } else if (area === 'mountain' && stageNumber <= 2) {
      return difficulty === 'EXPERT' ? 'HARD' : difficulty;
    } else if (area === 'demon' || stageId === 'final-boss') {
      return difficulty === 'EASY' ? 'MEDIUM' : difficulty;
    }
    
    return difficulty;
  }
  
  // 根据类型生成题目
  private static generateQuestionByType(type: QuestionType, difficulty: Difficulty, config?: any): Question {
    switch (type) {
      case 'addition':
        return QuestionGenerator.generateAddition(difficulty);
      case 'subtraction':
        return QuestionGenerator.generateSubtraction(difficulty);
      case 'multiplication':
        return QuestionGenerator.generateMultiplication(difficulty);
      case 'division':
        return QuestionGenerator.generateDivision(difficulty);
      case 'pattern':
        return Math.random() > 0.5 
          ? PatternGenerator.generateNumberPattern(difficulty)
          : PatternGenerator.generateShapePattern(difficulty);
      case 'comparison':
        return Math.random() > 0.5
          ? ComparisonGenerator.generateComparison(difficulty)
          : ComparisonGenerator.generateSorting(difficulty);
      case 'logic':
        return LogicGenerator.generateLogicPuzzle(difficulty);
      case 'sequence':
        return PatternGenerator.generateNumberPattern(difficulty);
      case 'word-problem':
        return this.generateSimpleWordProblem(difficulty);
      default:
        return this.generateDefaultQuestion(difficulty);
    }
  }
  
  // 生成简单应用题
  private static generateSimpleWordProblem(difficulty: Difficulty): Question {
    const scenarios = {
      EASY: [
        {
          template: '小明有{a}个苹果，妈妈又给了他{b}个，现在一共有多少个？',
          operation: 'addition',
          range: [1, 10]
        },
        {
          template: '商店里有{a}个玩具，卖出了{b}个，还剩多少个？',
          operation: 'subtraction',
          range: [5, 15]
        }
      ],
      MEDIUM: [
        {
          template: '一盒巧克力有{a}个，买了{b}盒，一共有多少个巧克力？',
          operation: 'multiplication',
          range: [2, 10]
        },
        {
          template: '小红有{a}元钱，买了一本{b}元的书，还剩多少钱？',
          operation: 'subtraction',
          range: [20, 50]
        }
      ],
      HARD: [
        {
          template: '学校有{a}个学生，平均分成{b}组，每组有多少人？',
          operation: 'division',
          range: [50, 200]
        },
        {
          template: '一辆公交车上有{a}人，到站下车{b}人，又上车{c}人，现在车上有多少人？',
          operation: 'mixed',
          range: [10, 50]
        }
      ],
      EXPERT: [
        {
          template: '商店进货{a}件商品，每件进价{b}元，卖出价格是进价的1.5倍，全部卖出能赚多少钱？',
          operation: 'complex',
          range: [10, 100]
        }
      ]
    };
    
    const difficultyScenarios = scenarios[difficulty] || scenarios.EASY;
    const scenario = difficultyScenarios[Math.floor(Math.random() * difficultyScenarios.length)];
    
    const a = Math.floor(Math.random() * (scenario.range[1] - scenario.range[0])) + scenario.range[0];
    const b = Math.floor(Math.random() * (scenario.range[1] - scenario.range[0])) + scenario.range[0];
    
    let question = scenario.template.replace('{a}', a.toString()).replace('{b}', b.toString());
    let answer: number;
    
    switch (scenario.operation) {
      case 'addition':
        answer = a + b;
        break;
      case 'subtraction':
        answer = Math.max(a, b) - Math.min(a, b);
        question = scenario.template.replace('{a}', Math.max(a, b).toString()).replace('{b}', Math.min(a, b).toString());
        break;
      case 'multiplication':
        answer = a * b;
        break;
      case 'division':
        // 确保能整除
        answer = b;
        const total = answer * a;
        question = scenario.template.replace('{a}', total.toString()).replace('{b}', a.toString());
        break;
      case 'mixed':
        const c = Math.floor(Math.random() * 20) + 5;
        question = question.replace('{c}', c.toString());
        answer = a - b + c;
        break;
      case 'complex':
        answer = Math.floor(a * b * 0.5);
        break;
      default:
        answer = a + b;
    }
    
    // 生成选项
    const options = [answer];
    while (options.length < 4) {
      const variation = Math.floor(Math.random() * 3);
      let option: number;
      
      if (variation === 0) {
        option = answer + Math.floor(Math.random() * 10) + 1;
      } else if (variation === 1) {
        option = Math.max(1, answer - Math.floor(Math.random() * 10) - 1);
      } else {
        option = Math.floor(answer * (0.5 + Math.random()));
      }
      
      if (!options.includes(option) && option > 0) {
        options.push(option);
      }
    }
    
    return {
      id: Math.random().toString(36).substring(2, 15),
      type: 'word-problem',
      difficulty,
      question,
      answer,
      options: options.sort(() => Math.random() - 0.5),
      category: 'application'
    };
  }
  
  // 默认题目生成
  private static generateDefaultQuestion(difficulty: Difficulty): Question {
    const types: QuestionType[] = ['addition', 'subtraction', 'multiplication', 'division'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    switch (type) {
      case 'addition':
        return QuestionGenerator.generateAddition(difficulty);
      case 'subtraction':
        return QuestionGenerator.generateSubtraction(difficulty);
      case 'multiplication':
        return QuestionGenerator.generateMultiplication(difficulty);
      case 'division':
        return QuestionGenerator.generateDivision(difficulty);
      default:
        return QuestionGenerator.generateAddition(difficulty);
    }
  }
}