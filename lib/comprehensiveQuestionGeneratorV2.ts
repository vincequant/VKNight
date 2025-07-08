import { Question, Difficulty, QuestionType } from '@/types';
import { QuestionGenerator } from './questionGenerator';
import { PatternGenerator } from './questionGenerators/patternGenerator';
import { ComparisonGenerator } from './questionGenerators/comparisonGenerator';
import { LogicGenerator } from './questionGenerators/logicGenerator';
import { AdvancedIQGenerator } from './questionGenerators/advancedIQGenerator';

// 题型中文标签映射
export const QUESTION_TYPE_LABELS: Record<string, string> = {
  'addition': '加法',
  'subtraction': '减法',
  'multiplication': '乘法',
  'division': '除法',
  'pattern': '找规律',
  'comparison': '比大小',
  'sequence': '数列',
  'logic': '逻辑推理',
  'word-problem': '应用题',
  'speed-math': '速算',
  'matrix-reasoning': '矩阵推理',
  'working-memory': '记忆力',
  'spatial': '空间想象',
  'analogies': '类比推理',
  'sudoku': '数独',
  'probability': '概率'
};

// 关卡配置
interface StageQuestionConfig {
  type: string;
  weight: number;
  config?: any;
  minDifficulty?: Difficulty;
  maxDifficulty?: Difficulty;
  timeLimit?: number; // 秒
}

interface StageConfig {
  questionTypes: StageQuestionConfig[];
  baseTimeLimit?: number; // 基础时间限制
  difficultyOverride?: Difficulty; // 强制难度
}

// 重新设计的关卡配置，确保难度递进
const STAGE_CONFIGS: Record<string, StageConfig> = {
  // 第一关 - 双位数加法、单位数加减法
  'forest-1': {
    questionTypes: [
      // 双位数加法 (10-99的加法)
      { type: 'addition', weight: 35, config: { minNum: 10, maxNum: 99 } },
      // 单位数+双位数加法 (1-9 + 10-99)
      { type: 'addition', weight: 25, config: { singlePlusDouble: true } },
      // 单位数减法 (1-9的减法)
      { type: 'subtraction', weight: 40, config: { maxNum: 9 } }
    ],
    difficultyOverride: 'EASY',
    baseTimeLimit: 60
  },
  // 第二关 - 双位数减法、复杂加法、简单乘法、逻辑题
  'forest-2': {
    questionTypes: [
      // 双位数减法
      { type: 'subtraction', weight: 30, config: { minNum: 10, maxNum: 99 } },
      // 更复杂的双位数加法 (包括进位)
      { type: 'addition', weight: 25, config: { minNum: 20, maxNum: 99, carryOver: true } },
      // 简单乘法 (1-5的乘法)
      { type: 'multiplication', weight: 25, config: { maxNum: 5 } },
      // 逻辑推理题
      { type: 'logic', weight: 20, minDifficulty: 'EASY', maxDifficulty: 'EASY' }
    ],
    difficultyOverride: 'EASY',
    baseTimeLimit: 50
  },
  'forest-3': {
    questionTypes: [
      { type: 'addition', weight: 25, config: { maxNum: 50 } },
      { type: 'subtraction', weight: 25, config: { maxNum: 50 } },
      { type: 'sequence', weight: 25 },
      { type: 'analogies', weight: 25, minDifficulty: 'EASY' }
    ],
    baseTimeLimit: 45
  },
  
  // 山脉区域 - 进阶运算（进位、借位、简单乘法）
  'mountain-1': {
    questionTypes: [
      { type: 'addition', weight: 30, config: { minNum: 20, maxNum: 100, carryOver: true } },
      { type: 'subtraction', weight: 30, config: { minNum: 20, maxNum: 100, borrowing: true } },
      { type: 'multiplication', weight: 20, config: { maxNum: 10 } }, // 10以内乘法
      { type: 'speed-math', weight: 20, minDifficulty: 'EASY' }
    ],
    baseTimeLimit: 40
  },
  'mountain-2': {
    questionTypes: [
      { type: 'multiplication', weight: 35, config: { minNum: 10, maxNum: 20 } },
      { type: 'pattern', weight: 25, minDifficulty: 'MEDIUM' },
      { type: 'matrix-reasoning', weight: 20, minDifficulty: 'EASY', maxDifficulty: 'MEDIUM' },
      { type: 'word-problem', weight: 20, minDifficulty: 'EASY' }
    ],
    baseTimeLimit: 35
  },
  'mountain-3': {
    questionTypes: [
      { type: 'multiplication', weight: 30, config: { minNum: 10, maxNum: 50 } },
      { type: 'word-problem', weight: 30, minDifficulty: 'MEDIUM' },
      { type: 'spatial', weight: 20, minDifficulty: 'MEDIUM' },
      { type: 'speed-math', weight: 20, minDifficulty: 'MEDIUM' }
    ],
    baseTimeLimit: 30
  },
  
  // 火山区域 - 高级运算（除法、分数、复杂应用）
  'volcano-1': {
    questionTypes: [
      { type: 'multiplication', weight: 25, config: { minNum: 20, maxNum: 100 } },
      { type: 'division', weight: 35, minDifficulty: 'MEDIUM' },
      { type: 'word-problem', weight: 20, minDifficulty: 'MEDIUM' },
      { type: 'working-memory', weight: 20, minDifficulty: 'MEDIUM' }
    ],
    baseTimeLimit: 25
  },
  'volcano-2': {
    questionTypes: [
      { type: 'division', weight: 35, minDifficulty: 'HARD' },
      { type: 'matrix-reasoning', weight: 25, minDifficulty: 'MEDIUM', maxDifficulty: 'HARD' },
      { type: 'analogies', weight: 20, minDifficulty: 'MEDIUM' },
      { type: 'speed-math', weight: 20, minDifficulty: 'HARD' }
    ],
    baseTimeLimit: 20
  },
  'volcano-3': {
    questionTypes: [
      { type: 'multiplication', weight: 20, config: { minNum: 50, maxNum: 200 } },
      { type: 'division', weight: 20, minDifficulty: 'HARD' },
      { type: 'word-problem', weight: 30, minDifficulty: 'HARD' },
      { type: 'sudoku', weight: 30, minDifficulty: 'MEDIUM' }
    ],
    baseTimeLimit: 20
  },
  
  // 地下城区域 - 综合应用与高级逻辑
  'dungeon-1': {
    questionTypes: [
      { type: 'word-problem', weight: 30, minDifficulty: 'HARD' },
      { type: 'working-memory', weight: 25, minDifficulty: 'HARD' },
      { type: 'spatial', weight: 25, minDifficulty: 'HARD' },
      { type: 'probability', weight: 20, minDifficulty: 'MEDIUM' }
    ],
    baseTimeLimit: 15
  },
  'dungeon-2': {
    questionTypes: [
      { type: 'matrix-reasoning', weight: 30, minDifficulty: 'HARD', maxDifficulty: 'EXPERT' },
      { type: 'sudoku', weight: 30, minDifficulty: 'HARD' },
      { type: 'analogies', weight: 20, minDifficulty: 'HARD' },
      { type: 'speed-math', weight: 20, minDifficulty: 'EXPERT' }
    ],
    baseTimeLimit: 12
  },
  'dungeon-3': {
    questionTypes: [
      { type: 'working-memory', weight: 25, minDifficulty: 'EXPERT' },
      { type: 'spatial', weight: 25, minDifficulty: 'EXPERT' },
      { type: 'sudoku', weight: 25, minDifficulty: 'EXPERT' },
      { type: 'probability', weight: 25, minDifficulty: 'HARD' }
    ],
    baseTimeLimit: 10
  },
  
  // 魔界区域 - 极限挑战
  'demon-1': {
    questionTypes: [
      { type: 'matrix-reasoning', weight: 30, minDifficulty: 'EXPERT' },
      { type: 'working-memory', weight: 30, minDifficulty: 'EXPERT' },
      { type: 'speed-math', weight: 20, minDifficulty: 'EXPERT' },
      { type: 'analogies', weight: 20, minDifficulty: 'EXPERT' }
    ],
    baseTimeLimit: 8
  },
  'demon-2': {
    questionTypes: [
      { type: 'spatial', weight: 30, minDifficulty: 'EXPERT' },
      { type: 'sudoku', weight: 30, minDifficulty: 'EXPERT' },
      { type: 'probability', weight: 20, minDifficulty: 'EXPERT' },
      { type: 'word-problem', weight: 20, minDifficulty: 'EXPERT' }
    ],
    baseTimeLimit: 6
  },
  'demon-3': {
    questionTypes: [
      { type: 'matrix-reasoning', weight: 25, minDifficulty: 'EXPERT' },
      { type: 'working-memory', weight: 25, minDifficulty: 'EXPERT' },
      { type: 'spatial', weight: 25, minDifficulty: 'EXPERT' },
      { type: 'speed-math', weight: 25, minDifficulty: 'EXPERT' }
    ],
    baseTimeLimit: 5,
    difficultyOverride: 'EXPERT'
  }
};

export class ComprehensiveQuestionGeneratorV2 {
  // 获取关卡的中文题型标签
  static getStageQuestionLabels(stageId: string): string[] {
    const config = STAGE_CONFIGS[stageId];
    if (!config) {
      return ['混合运算'];
    }
    
    const types = config.questionTypes.map(qt => qt.type);
    const uniqueTypes = [...new Set(types)];
    return uniqueTypes.map(type => QUESTION_TYPE_LABELS[type] || type);
  }
  
  // 根据关卡和难度生成题目
  static generateQuestion(stageId: string, characterType: 'josh' | 'abby' | 'vince' | string, baseDifficulty: Difficulty): Question {
    const config = STAGE_CONFIGS[stageId];
    if (!config) {
      return this.generateDefaultQuestion(baseDifficulty);
    }
    
    // 选择题目类型
    const questionConfig = this.selectQuestionType(config.questionTypes);
    
    // 确定实际难度
    let actualDifficulty = config.difficultyOverride || baseDifficulty;
    
    // 角色难度调整
    if (characterType === 'vince') {
      // Vince 在高级关卡也会遇到中等难度
      const area = stageId.split('-')[0];
      if (area === 'forest' || area === 'mountain') {
        actualDifficulty = 'EASY';
      } else if (area === 'volcano') {
        actualDifficulty = 'MEDIUM';
      } else {
        actualDifficulty = 'HARD';
      }
    } else if (characterType === 'abby') {
      // Abby 难度稍低
      const difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
      const currentIndex = difficulties.indexOf(actualDifficulty);
      actualDifficulty = difficulties[Math.max(0, currentIndex - 1)];
    }
    
    // 应用配置的难度限制
    if (questionConfig.minDifficulty) {
      const difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
      const minIndex = difficulties.indexOf(questionConfig.minDifficulty);
      const currentIndex = difficulties.indexOf(actualDifficulty);
      if (currentIndex < minIndex) {
        actualDifficulty = questionConfig.minDifficulty;
      }
    }
    
    if (questionConfig.maxDifficulty) {
      const difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
      const maxIndex = difficulties.indexOf(questionConfig.maxDifficulty);
      const currentIndex = difficulties.indexOf(actualDifficulty);
      if (currentIndex > maxIndex) {
        actualDifficulty = questionConfig.maxDifficulty;
      }
    }
    
    // 生成题目
    let question = this.generateQuestionByType(questionConfig.type, actualDifficulty, questionConfig.config);
    
    // 应用时间限制
    if (config.baseTimeLimit && !question.timeLimit) {
      question.timeLimit = config.baseTimeLimit;
    }
    if (questionConfig.timeLimit) {
      question.timeLimit = questionConfig.timeLimit;
    }
    
    return question;
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
    
    return types[0];
  }
  
  // 根据类型生成题目
  private static generateQuestionByType(type: string, difficulty: Difficulty, config?: any): Question {
    switch (type) {
      // 基础运算
      case 'addition':
        return QuestionGenerator.generateAddition(difficulty, config);
      case 'subtraction':
        return QuestionGenerator.generateSubtraction(difficulty, config);
      case 'multiplication':
        return QuestionGenerator.generateMultiplication(difficulty, config);
      case 'division':
        return QuestionGenerator.generateDivision(difficulty, config);
      
      // 模式识别
      case 'pattern':
        return Math.random() > 0.5 
          ? PatternGenerator.generateNumberPattern(difficulty)
          : PatternGenerator.generateShapePattern(difficulty);
      case 'sequence':
        return PatternGenerator.generateNumberPattern(difficulty);
      
      // 比较与逻辑
      case 'comparison':
        return ComparisonGenerator.generateComparison(difficulty, config);
      case 'logic':
        return LogicGenerator.generateLogicPuzzle(difficulty);
      
      // 高级题型
      case 'matrix-reasoning':
        return AdvancedIQGenerator.generateMatrixReasoning(difficulty);
      case 'working-memory':
        return AdvancedIQGenerator.generateWorkingMemory(difficulty);
      case 'spatial':
        return AdvancedIQGenerator.generateSpatialRotation(difficulty);
      case 'analogies':
        return AdvancedIQGenerator.generateAnalogies(difficulty);
      case 'sudoku':
        return AdvancedIQGenerator.generateMiniSudoku(difficulty);
      case 'probability':
        return AdvancedIQGenerator.generateProbability(difficulty);
      case 'speed-math':
        return AdvancedIQGenerator.generateSpeedMath(difficulty);
      
      // 应用题
      case 'word-problem':
        return this.generateAdvancedWordProblem(difficulty);
        
      default:
        return this.generateDefaultQuestion(difficulty);
    }
  }
  
  // 生成高级应用题
  private static generateAdvancedWordProblem(difficulty: Difficulty): Question {
    const scenarios = {
      EASY: [
        {
          template: '小明有{a}个苹果，妈妈又给了他{b}个，现在一共有多少个？',
          operation: 'addition',
          range: [1, 20]
        },
        {
          template: '商店里有{a}个玩具，卖出了{b}个，还剩多少个？',
          operation: 'subtraction',
          range: [10, 30]
        }
      ],
      MEDIUM: [
        {
          template: '一辆公交车上有{a}人，第一站下车{b}人，上车{c}人，第二站下车{d}人，现在车上有多少人？',
          operation: 'complex',
          range: [20, 50]
        },
        {
          template: '学校买了{a}箱牛奶，每箱有{b}瓶，平均分给{c}个班，每班能分到多少瓶？',
          operation: 'mixed',
          range: [5, 20]
        }
      ],
      HARD: [
        {
          template: '一个水池有两个进水管和一个出水管。第一个进水管每小时进水{a}升，第二个每小时进水{b}升，出水管每小时排水{c}升。三管齐开，{d}小时后水池有多少水？',
          operation: 'complex',
          range: [10, 50]
        },
        {
          template: '商店进货{a}件商品，每件进价{b}元，标价是进价的1.5倍，打8折出售，全部卖出能赚多少钱？',
          operation: 'percentage',
          range: [10, 100]
        }
      ],
      EXPERT: [
        {
          template: '甲乙两地相距{a}公里，一辆汽车从甲地开往乙地，速度是{b}公里/小时，同时一辆摩托车从乙地开往甲地，速度是{c}公里/小时，它们多久后相遇？',
          operation: 'meeting',
          range: [100, 500]
        },
        {
          template: '一项工程，甲队单独做需要{a}天，乙队单独做需要{b}天，两队合作需要多少天完成？',
          operation: 'work',
          range: [10, 30]
        }
      ]
    };
    
    const difficultyScenarios = scenarios[difficulty] || scenarios.EASY;
    const scenario = difficultyScenarios[Math.floor(Math.random() * difficultyScenarios.length)];
    
    let question = scenario.template;
    let answer: number;
    const values: Record<string, number> = {};
    
    // 生成随机值
    ['a', 'b', 'c', 'd'].forEach(key => {
      if (scenario.template.includes(`{${key}}`)) {
        values[key] = Math.floor(Math.random() * (scenario.range[1] - scenario.range[0])) + scenario.range[0];
        question = question.replace(`{${key}}`, values[key].toString());
      }
    });
    
    // 计算答案
    switch (scenario.operation) {
      case 'addition':
        answer = values.a + values.b;
        break;
      case 'subtraction':
        answer = values.a - values.b;
        break;
      case 'complex':
        if (difficulty === 'MEDIUM') {
          answer = values.a - values.b + values.c - values.d;
        } else {
          answer = (values.a + values.b - values.c) * values.d;
        }
        break;
      case 'mixed':
        answer = Math.floor((values.a * values.b) / values.c);
        break;
      case 'percentage':
        const sellPrice = values.b * 1.5 * 0.8;
        answer = Math.floor((sellPrice - values.b) * values.a);
        break;
      case 'meeting':
        answer = Math.round(values.a / (values.b + values.c) * 10) / 10;
        break;
      case 'work':
        answer = Math.round((values.a * values.b) / (values.a + values.b) * 10) / 10;
        break;
      default:
        answer = values.a + values.b;
    }
    
    // 生成选项
    const options = [answer];
    while (options.length < 4) {
      let option: number;
      if (scenario.operation === 'meeting' || scenario.operation === 'work') {
        option = Math.round((answer + (Math.random() - 0.5) * answer * 0.5) * 10) / 10;
      } else {
        option = Math.floor(answer + (Math.random() - 0.5) * answer * 0.4);
      }
      
      if (!options.includes(option) && option > 0) {
        options.push(option);
      }
    }
    
    const timeLimit = difficulty === 'EASY' ? 60 : difficulty === 'MEDIUM' ? 45 : difficulty === 'HARD' ? 30 : 20;
    
    return {
      id: Math.random().toString(36).substring(2, 15),
      type: 'word-problem',
      difficulty,
      question,
      answer,
      options: options.sort(() => Math.random() - 0.5),
      category: 'application',
      timeLimit
    };
  }
  
  // 默认题目生成
  private static generateDefaultQuestion(difficulty: Difficulty): Question {
    const types = ['addition', 'subtraction', 'multiplication', 'division'];
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