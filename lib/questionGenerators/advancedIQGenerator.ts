import { Question, Difficulty } from '@/types';

interface IQQuestionConfig {
  timeLimit?: number; // 秒
  visualPattern?: boolean;
  spatialReasoning?: boolean;
}

export class AdvancedIQGenerator {
  
  // 图形矩阵推理（类似瑞文智力测验）
  static generateMatrixReasoning(difficulty: Difficulty, config?: IQQuestionConfig): Question {
    const patterns = {
      EASY: [
        {
          question: '观察下面的图形规律，?处应该填什么？\n⭐ ⭐⭐ ⭐⭐⭐\n🔵 🔵🔵 ?',
          answer: '🔵🔵🔵',
          options: ['🔵', '🔵🔵', '🔵🔵🔵', '🔵🔵🔵🔵'],
          timeLimit: 30
        },
        {
          question: '找出规律：△ □ △ □ △ ?',
          answer: '□',
          options: ['△', '□', '○', '☆'],
          timeLimit: 20
        }
      ],
      MEDIUM: [
        {
          question: '矩阵中?应该是什么？\n🟥🟦 | 🟦🟥\n🟦🟥 | ?',
          answer: '🟥🟦',
          options: ['🟥🟥', '🟦🟦', '🟥🟦', '🟦🟥'],
          timeLimit: 25
        },
        {
          question: '找出规律完成序列：\n1⭐ 2🔵 3⭐ 4🔵 5⭐ 6?',
          answer: '🔵',
          options: ['⭐', '🔵', '🔺', '🟦'],
          timeLimit: 20
        }
      ],
      HARD: [
        {
          question: '观察矩阵规律：\n⬆️➡️ | ➡️⬇️\n⬅️⬆️ | ?',
          answer: '⬇️⬅️',
          options: ['⬆️⬅️', '⬇️➡️', '⬇️⬅️', '➡️⬆️'],
          timeLimit: 20
        },
        {
          question: '完成图形序列：\n🔺 🔻🔺 🔺🔻🔺 🔻🔺🔻🔺 ?',
          answer: '🔺🔻🔺🔻🔺',
          options: ['🔺🔻🔺🔻', '🔺🔻🔺🔻🔺', '🔻🔺🔻🔺🔻', '🔺🔺🔻🔻🔺'],
          timeLimit: 15
        }
      ],
      EXPERT: [
        {
          question: '矩阵推理：\n1→2 | 3→6\n4→8 | 5→?',
          answer: '10',
          options: ['9', '10', '11', '12'],
          timeLimit: 15
        },
        {
          question: '完成复杂图形序列：\n○△ △□ □○ ○△ △□ ?',
          answer: '□○',
          options: ['○△', '△□', '□○', '○□'],
          timeLimit: 10
        }
      ]
    };

    const difficultyQuestions = patterns[difficulty] || patterns.EASY;
    const selected = difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)];
    
    return {
      id: Math.random().toString(36).substring(2, 15),
      type: 'pattern',
      difficulty,
      question: selected.question,
      answer: selected.answer,
      options: selected.options.sort(() => Math.random() - 0.5),
      category: 'iq-matrix',
      timeLimit: config?.timeLimit || selected.timeLimit
    };
  }

  // 数字工作记忆题（倒背数字）
  static generateWorkingMemory(difficulty: Difficulty): Question {
    const lengths = {
      EASY: 3,
      MEDIUM: 4,
      HARD: 5,
      EXPERT: 6
    };
    
    const length = lengths[difficulty];
    const digits = Array.from({ length }, () => Math.floor(Math.random() * 10));
    const digitString = digits.join(' ');
    const reversed = digits.reverse().join('');
    
    // 生成干扰选项
    const options = [reversed];
    while (options.length < 4) {
      const wrongDigits = [...digits];
      // 随机交换两个位置
      const i = Math.floor(Math.random() * wrongDigits.length);
      const j = Math.floor(Math.random() * wrongDigits.length);
      [wrongDigits[i], wrongDigits[j]] = [wrongDigits[j], wrongDigits[i]];
      const wrong = wrongDigits.join('');
      if (!options.includes(wrong)) {
        options.push(wrong);
      }
    }
    
    return {
      id: Math.random().toString(36).substring(2, 15),
      type: 'logic',
      difficulty,
      question: `记住这些数字并倒着输入：${digitString}\n（看5秒后选择）`,
      answer: reversed,
      options: options.sort(() => Math.random() - 0.5),
      category: 'working-memory',
      timeLimit: 5 + length * 2 // 记忆时间 + 回答时间
    };
  }

  // 空间旋转题
  static generateSpatialRotation(difficulty: Difficulty): Question {
    const shapes = {
      EASY: [
        {
          question: '如果把 L 顺时针旋转90度，会变成什么形状？',
          answer: '⌐',
          options: ['⌐', 'L', '⅃', '⌙'],
          timeLimit: 30
        },
        {
          question: '把 ← 旋转180度后是？',
          answer: '→',
          options: ['←', '→', '↑', '↓'],
          timeLimit: 20
        }
      ],
      MEDIUM: [
        {
          question: '把图形 ⌞ 逆时针旋转90度后是？',
          answer: '⌟',
          options: ['⌞', '⌟', '⌜', '⌝'],
          timeLimit: 25
        },
        {
          question: '如果 F 水平翻转后是什么？',
          answer: 'Ⅎ',
          options: ['F', 'Ⅎ', 'E', '⌐'],
          timeLimit: 20
        }
      ],
      HARD: [
        {
          question: '把 ◣ 先顺时针旋转90度，再水平翻转，结果是？',
          answer: '◤',
          options: ['◢', '◣', '◤', '◥'],
          timeLimit: 20
        }
      ],
      EXPERT: [
        {
          question: '3D视角：从上往下看一个立方体，如果正面是A，右面是B，从下往上看正面是？',
          answer: 'A（上下颠倒）',
          options: ['A（正常）', 'A（上下颠倒）', 'B（正常）', 'B（上下颠倒）'],
          timeLimit: 15
        }
      ]
    };

    const difficultyQuestions = shapes[difficulty] || shapes.EASY;
    const selected = difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)];
    
    return {
      id: Math.random().toString(36).substring(2, 15),
      type: 'pattern',
      difficulty,
      question: selected.question,
      answer: selected.answer,
      options: selected.options,
      category: 'spatial-rotation',
      timeLimit: selected.timeLimit
    };
  }

  // 类比推理题
  static generateAnalogies(difficulty: Difficulty): Question {
    const analogies = {
      EASY: [
        {
          question: '大象 对于 大 相当于 老鼠 对于 ?',
          answer: '小',
          options: ['大', '小', '中', '巨'],
          timeLimit: 30
        },
        {
          question: '白天 对于 太阳 相当于 夜晚 对于 ?',
          answer: '月亮',
          options: ['太阳', '月亮', '星星', '云朵'],
          timeLimit: 25
        }
      ],
      MEDIUM: [
        {
          question: '医生 对于 医院 相当于 老师 对于 ?',
          answer: '学校',
          options: ['医院', '学校', '办公室', '教室'],
          timeLimit: 20
        },
        {
          question: '3 对于 9 相当于 4 对于 ?',
          answer: '16',
          options: ['12', '16', '20', '24'],
          timeLimit: 20
        }
      ],
      HARD: [
        {
          question: '鱼 对于 鳞片 相当于 鸟 对于 ?',
          answer: '羽毛',
          options: ['翅膀', '羽毛', '爪子', '喙'],
          timeLimit: 15
        },
        {
          question: '首字母：A 对于 Z 相当于 1 对于 ?',
          answer: '26',
          options: ['9', '10', '25', '26'],
          timeLimit: 15
        }
      ],
      EXPERT: [
        {
          question: '指数：2³ 对于 8 相当于 3² 对于 ?',
          answer: '9',
          options: ['6', '9', '12', '27'],
          timeLimit: 10
        },
        {
          question: '音乐：C 对于 E 相当于 F 对于 ?（提示：大三度）',
          answer: 'A',
          options: ['G', 'A', 'B', 'C'],
          timeLimit: 10
        }
      ]
    };

    const difficultyQuestions = analogies[difficulty] || analogies.EASY;
    const selected = difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)];
    
    return {
      id: Math.random().toString(36).substring(2, 15),
      type: 'logic',
      difficulty,
      question: selected.question,
      answer: selected.answer,
      options: selected.options.sort(() => Math.random() - 0.5),
      category: 'analogies',
      timeLimit: selected.timeLimit
    };
  }

  // 数独简化版
  static generateMiniSudoku(difficulty: Difficulty): Question {
    const grids = {
      EASY: [
        {
          question: '填入缺失的数字（每行每列1-3不重复）：\n1 2 ?\n2 ? 1\n? 1 2',
          answer: '3',
          options: ['1', '2', '3', '4'],
          hint: '第一行第三列',
          timeLimit: 45
        }
      ],
      MEDIUM: [
        {
          question: '4x4数独，?处应该填什么？\n1 2 3 4\n3 4 ? 2\n2 1 4 3\n4 3 2 1',
          answer: '1',
          options: ['1', '2', '3', '4'],
          hint: '第二行第三列',
          timeLimit: 40
        }
      ],
      HARD: [
        {
          question: '找出?处的数字（每行列及2x2方格内1-4不重复）：\n1 ? | 3 4\n3 4 | 1 2\n---------\n2 3 | 4 1\n4 1 | 2 3',
          answer: '2',
          options: ['1', '2', '3', '4'],
          hint: '第一行第二列',
          timeLimit: 30
        }
      ],
      EXPERT: [
        {
          question: '完成数独（多个?）：\n? 2 | 3 ?\n3 ? | ? 2\n---------\n2 ? | ? 3\n? 3 | 2 ?',
          answer: '第一行：1,4',
          options: ['1,4', '4,1', '2,3', '3,2'],
          hint: '第一行两个?的值',
          timeLimit: 25
        }
      ]
    };

    const difficultyQuestions = grids[difficulty] || grids.EASY;
    const selected = difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)];
    
    return {
      id: Math.random().toString(36).substring(2, 15),
      type: 'logic',
      difficulty,
      question: `${selected.question}\n提示：${selected.hint}`,
      answer: selected.answer,
      options: selected.options,
      category: 'sudoku',
      timeLimit: selected.timeLimit
    };
  }

  // 概率与统计基础
  static generateProbability(difficulty: Difficulty): Question {
    const problems = {
      EASY: [
        {
          question: '袋子里有3个红球和2个蓝球，随机拿一个，拿到红球的可能性更大还是蓝球？',
          answer: '红球',
          options: ['红球', '蓝球', '一样大', '无法确定'],
          timeLimit: 30
        }
      ],
      MEDIUM: [
        {
          question: '掷一个骰子，得到偶数的概率是多少？',
          answer: '1/2',
          options: ['1/3', '1/2', '2/3', '1/6'],
          timeLimit: 25
        }
      ],
      HARD: [
        {
          question: '同时掷两个硬币，两个都是正面的概率是？',
          answer: '1/4',
          options: ['1/2', '1/3', '1/4', '1/8'],
          timeLimit: 20
        }
      ],
      EXPERT: [
        {
          question: '从52张扑克牌中抽一张，抽到红桃A的概率是？',
          answer: '1/52',
          options: ['1/13', '1/26', '1/52', '1/4'],
          timeLimit: 15
        }
      ]
    };

    const difficultyQuestions = problems[difficulty] || problems.EASY;
    const selected = difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)];
    
    return {
      id: Math.random().toString(36).substring(2, 15),
      type: 'logic',
      difficulty,
      question: selected.question,
      answer: selected.answer,
      options: selected.options.sort(() => Math.random() - 0.5),
      category: 'probability',
      timeLimit: selected.timeLimit
    };
  }

  // 时间限制的速算题
  static generateSpeedMath(difficulty: Difficulty): Question {
    const ranges = {
      EASY: { min: 1, max: 20, operations: 2, timeLimit: 10 },
      MEDIUM: { min: 10, max: 50, operations: 3, timeLimit: 8 },
      HARD: { min: 20, max: 100, operations: 4, timeLimit: 6 },
      EXPERT: { min: 50, max: 200, operations: 5, timeLimit: 5 }
    };

    const config = ranges[difficulty];
    let expression = '';
    let result = Math.floor(Math.random() * (config.max - config.min)) + config.min;
    
    // 构建表达式
    for (let i = 0; i < config.operations - 1; i++) {
      const num = Math.floor(Math.random() * 20) + 1;
      const op = Math.random() > 0.5 ? '+' : '-';
      
      if (op === '+') {
        expression += (expression ? ' + ' : '') + num;
        result += num;
      } else {
        expression += (expression ? ' - ' : '') + num;
        result -= num;
      }
    }
    
    expression = result + (expression ? ' ' + expression : '');
    
    // 生成选项
    const options = [result];
    while (options.length < 4) {
      const variation = result + Math.floor(Math.random() * 10) - 5;
      if (!options.includes(variation) && variation > 0) {
        options.push(variation);
      }
    }
    
    return {
      id: Math.random().toString(36).substring(2, 15),
      type: 'addition',
      difficulty,
      question: `快速计算：${expression} = ?`,
      answer: result,
      options: options.sort(() => Math.random() - 0.5),
      category: 'speed-math',
      timeLimit: config.timeLimit
    };
  }
}